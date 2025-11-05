import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Expected body shape:
 * {
 *   classes: [{ id, name_kelas, jurusan_id, wali_kelas_id, kelas_tingkat, is_arsip }],
 *   students: [{ nis, target_kelas_id }]
 * }
 */
export async function POST(req: Request) {
  try {
    const simHeader = req.headers.get('x-mode-simulasi')
    const isSim = simHeader === 'true'
    const body = await req.json()
    const { classes = [], students = [] } = body

    // Basic validation
    if (!Array.isArray(classes) || !Array.isArray(students))
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

    console.debug('Promote payload classes count:', classes.length)
    // dump a concise view for debugging
    classes.forEach((c: any, idx: number) => {
      console.debug(`class[${idx}] -> id:${String(c.id)} name_kelas:${String(c.name_kelas ?? c.kelas ?? '')} jurusan_id:${String(c.jurusan_id)} wali_kelas_id:${String(c.wali_kelas_id)} kelas_tingkat:${String(c.kelas_tingkat)}`)
    })

    // Map local (client-only) class IDs to DB-created IDs. We create these classes first
    // outside a long transaction to keep transaction lifetime short and avoid P2028 errors.
    const localToDb: Record<number, number> = {}
    for (const k of classes) {
      const idNum = Number(k.id)
      // client-local/temp classes are represented as non-positive IDs (<= 0)
      if (idNum <= 0) {
        try {
          // Validate jurusan exists before trying to create kelas
          const jurId = Number(k.jurusan_id)
          const jur = !Number.isNaN(jurId) ? await prisma.jurusan.findUnique({ where: { id: jurId } }) : null
          if (!jur) {
            console.warn(`Skipping create for local class id=${idNum} because jurusan_id=${String(k.jurusan_id)} not found`)
            continue
          }
          if (isSim) {
            // In simulation mode, preserve the client's temp id so the client can map locally
            localToDb[idNum] = idNum
            console.debug(`Simulate create kelas (preserve temp id): tempId=${idNum} kelas='${String(k.name_kelas)}' jurusan_id=${jurId}`)
          } else {
            const created = await prisma.kelas.create({
              data: {
                kelas: String(k.name_kelas),
                id_jurusan: jurId,
                id_waliKelas: Number(k.wali_kelas_id) || 0,
              },
            })
            console.debug(`Created kelas during promote: id=${created.id} kelas='${created.kelas}' jurusan_id=${jurId}`)
            localToDb[idNum] = created.id
          }
        } catch (createErr) {
          console.error('Failed creating class during promotion:', createErr)
          // continue - we'll surface failures during transaction below
        }
      }
    }

    // Update classes (DB ids) in parallel - keep this small and outside a long transaction
    await Promise.all(
      classes
        .map((k) => ({ k, id: Number(k.id) }))
    .filter(({ id }) => id > 0)
        .map(async ({ k, id }) => {
          try {
            if (!isSim) {
              await prisma.kelas.update({
                where: { id },
                data: {
                  kelas: k.name_kelas ? String(k.name_kelas) : undefined,
                  id_jurusan: k.jurusan_id != null ? Number(k.jurusan_id) : undefined,
                  id_waliKelas: k.wali_kelas_id != null ? Number(k.wali_kelas_id) : undefined,
                  // is_arsip intentionally left for now unless provided
                },
              })
            } else {
              // simulation: no-op update
            }
          } catch (e) {
            console.warn(`Failed to update kelas ${id}:`, (e as Error).message || e)
          }
        }),
    )

    // Prepare student updates (map local ids to DB ids)
    const studentUpdates = students.map((s: any) => {
      let target = s.target_kelas_id
      const parsed = Number(target)
      if (!Number.isNaN(parsed) && localToDb[parsed]) target = localToDb[parsed]
      return { nis: String(s.nis), target: Number(target) }
    })
      // For promotion: perform per-class bulk moves.
      // Helper: detect tingkat from class name and replace with next tingkat
      const detectTingkat = (name: string) => {
        const m = String(name).match(/^\s*(XII|XI|X)\b/i)
        if (!m) return null
        const t = m[1].toUpperCase()
        if (t === 'X') return 'X'
        if (t === 'XI') return 'XI'
        return 'XII'
      }
      const gantiTingkatDiNama = (name: string, tingkatBaru: 'X' | 'XI' | 'XII') => String(name).replace(/^(XII|XI|X)/i, tingkatBaru)

  const moveSummary: Array<{ from: number; to: number; moved: number; movedNIS?: string[] }> = []

      for (const k of classes) {
  const sourceId = Number(k.id)
        if (Number.isNaN(sourceId)) continue
  // skip local-only classes (created by client as temp ids) as sources
  if (sourceId <= 0) continue

        const tingkat = k.kelas_tingkat || detectTingkat(k.name_kelas || k.kelas || '')
        if (!tingkat) continue
        const next = tingkat === 'X' ? 'XI' : tingkat === 'XI' ? 'XII' : null
        if (!next) continue

        const namaTarget = gantiTingkatDiNama(k.name_kelas || k.kelas || '', next as 'XI' | 'XII')

        // find existing target class (by name and jurusan). If not found, create or simulate it.
        let target = await prisma.kelas.findFirst({ where: { kelas: namaTarget, id_jurusan: Number(k.jurusan_id) || undefined } })
        if (!target) {
          if (isSim) {
            // simulate creation: prefer preserving any mapping for source->target if present
            const tempId = localToDb[sourceId] || -(Object.keys(localToDb).length + 1)
            localToDb[sourceId] = localToDb[sourceId] || tempId
            target = {
              id: tempId,
              kelas: namaTarget,
              id_jurusan: Number(k.jurusan_id) || 0,
              id_waliKelas: Number(k.wali_kelas_id) || 0,
            } as any
            console.debug(`Simulated target kelas ${namaTarget} as id=${tempId}`)
          } else {
            try {
              target = await prisma.kelas.create({ data: { kelas: namaTarget, id_jurusan: Number(k.jurusan_id) || 0, id_waliKelas: Number(k.wali_kelas_id) || 0 } })
            } catch (e) {
              console.warn(`Failed to create target kelas ${namaTarget}:`, (e as Error).message || e)
              continue
            }
          }
        }

        // Move active students from source to target in bulk
          try {
            const studentsToMove = await prisma.siswa.findMany({ where: { id_class: sourceId, status: 'Aktif' }, select: { NIS: true } })
            if (studentsToMove.length === 0) {
              const targetIdEmpty = (target as any)?.id ?? -1
              moveSummary.push({ from: sourceId, to: targetIdEmpty, moved: 0, movedNIS: [] })
              continue
            }
            const movedNIS = studentsToMove.map((ss) => String(ss.NIS))
            const targetId = (target as any).id
            if (isSim) {
              // simulate move: do not update DB, just report counts and which NIS would move
              moveSummary.push({ from: sourceId, to: targetId, moved: studentsToMove.length, movedNIS })
            } else {
              const upd = await prisma.siswa.updateMany({ where: { id_class: sourceId, status: 'Aktif' }, data: { id_class: targetId } })
              moveSummary.push({ from: sourceId, to: targetId, moved: upd.count, movedNIS })
            }
          } catch (e) {
            console.warn(`Failed to move students from ${sourceId} to ${target?.id}:`, (e as Error).message || e)
            moveSummary.push({ from: sourceId, to: target?.id || -1, moved: 0 })
          }
      }

      // compute occupancy for affected classes
      const affected = new Set<number>()
      moveSummary.forEach((s) => { affected.add(s.to); affected.add(s.from) })
      const occupancy: Record<number, number> = {}
      await Promise.all(Array.from(affected).map(async (cid) => {
        try {
          if (isSim) {
            // simulate occupancy by counting current students plus moved-in counts
            // count current students in DB for that cid
            const current = await prisma.siswa.count({ where: { id_class: cid } }).catch(() => 0)
            // compute moved in (sum of moveSummary.to === cid)
            const movedIn = moveSummary.filter(ms => ms.to === cid).reduce((a,b) => a + (b.moved||0), 0)
            const movedOut = moveSummary.filter(ms => ms.from === cid).reduce((a,b) => a + (b.moved||0), 0)
            occupancy[cid] = Math.max(0, current + movedIn - movedOut)
          } else {
            occupancy[cid] = await prisma.siswa.count({ where: { id_class: cid } })
          }
        } catch (e) {
          occupancy[cid] = -1
        }
      }))

      // If simulation mode, also return synthesized class records for created local classes
      const synthesizedClasses: any[] = []
      if (isSim) {
        // fetch existing classes to include
        const existing = await prisma.kelas.findMany()
        const existingMap = new Map(existing.map((c:any) => [c.id, { id: c.id, name_kelas: c.kelas, jurusan_id: c.id_jurusan, wali_kelas_id: c.id_waliKelas, kapasitas_siswa: (c as any).kapasitas_siswa || 30 }]))
        // add existing
        for (const [id, val] of existingMap) synthesizedClasses.push(val)
        // add simulated created classes from localToDb (negative ids)
        for (const orig of classes) {
          const origId = Number(orig.id)
          if (origId <= 0 && localToDb[origId] != null) {
            const newId = localToDb[origId]
            synthesizedClasses.push({ id: newId, name_kelas: orig.name_kelas, jurusan_id: Number(orig.jurusan_id) || 0, wali_kelas_id: Number(orig.wali_kelas_id) || 0, kapasitas_siswa: orig.kapasitas_siswa || 30 })
          }
        }
      }

      const resultPayload: any = { localToDb, moveSummary, occupancy }
      if (isSim) resultPayload.simulatedClasses = synthesizedClasses

      return NextResponse.json({ ok: true, result: resultPayload })

    // Recompute kapasitas_siswa for affected target classes (all classes we touched)
    const affectedClassIds = new Set<number>()
    classes.forEach((k: any) => {
      const idNum = Number(k.id)
      if (idNum <= 0 && localToDb[idNum]) affectedClassIds.add(localToDb[idNum])
      else if (!Number.isNaN(idNum)) affectedClassIds.add(idNum)
    })

    // (Removed earlier occupancy block - moveSummary/occupancy returned below)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: (err as Error).message || 'Promotion failed' }, { status: 500 })
  }
}
