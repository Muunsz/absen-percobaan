// revert-promote.js
// Revert promotion: move all students back to X (grade 10) classes.
// Strategy: for each student, find a class with kelas_tingkat 'X' in the same jurusan and set id_class to that id.
// If no class in same jurusan exists, fallback to any 'X' class.

import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Fetching classes and students...')
  const classes = await prisma.kelas.findMany()
  const siswa = await prisma.siswa.findMany()

  const kelasByJurX = new Map()
  classes.forEach(k => {
    if (k.kelas_tingkat === 'X') {
      const arr = kelasByJurX.get(k.id_jurusan) || []
      arr.push(k)
      kelasByJurX.set(k.id_jurusan, arr)
    }
  })

  const anyX = classes.find(k => k.kelas_tingkat === 'X')
  if (!anyX) {
    console.error('No X classes found in DB; aborting')
    process.exit(1)
  }

  console.log(`Found ${classes.length} classes, ${siswa.length} siswa. Any X: ${anyX.id}`)

  let moved = 0
  for (const s of siswa) {
    // determine target class id
    // If student's original jurusan can be derived from current class, prefer that; otherwise fallback to anyX
    let targetId = anyX.id
    try {
      const curKelas = classes.find(k => k.id === s.id_class)
      if (curKelas) {
        const list = kelasByJurX.get(curKelas.id_jurusan) || []
        if (list.length > 0) targetId = list[0].id
      }
    } catch (e) {
      // fallback
    }

    if (s.id_class !== targetId) {
      await prisma.siswa.update({ where: { NIS: s.NIS }, data: { id_class: targetId } })
      moved++
    }
  }

  console.log(`Moved ${moved} siswa back to X classes.`)
}

main().catch(e => { console.error(e); process.exit(1) })
