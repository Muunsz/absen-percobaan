// Small script to simulate the frontend "Naikkan Semua" promotion and call the server promote endpoint.
// Usage: node scripts/run-promote-test.js

const BASE = process.env.BASE_URL || 'http://localhost:3001'

function tingkatBerikutnya(t) {
  if (t === 'X') return 'XI'
  if (t === 'XI') return 'XII'
  return null
}

function gantiTingkatDiNama(name, tingkatBaru) {
  return name.replace(/^(XII|XI|X)\b/i, tingkatBaru)
}

async function main() {
  console.log('Base URL:', BASE)
  const fetch = global.fetch || (await import('node-fetch')).default

  console.log('Fetching classes and students...')
  const [kc, ks] = await Promise.all([
    fetch(`${BASE}/api/tahun-ajaran/kelas`).then(r => r.json()),
    fetch(`${BASE}/api/tahun-ajaran/siswa`).then(r => r.json()),
  ])

  const classes = Array.isArray(kc) ? kc.slice() : []
  const siswa = Array.isArray(ks) ? ks.slice() : []

  const classByKey = (c) => `${c.jurusan_id}::${c.kelas_tingkat}::${c.name_kelas}`

  // Map existing classes by jurusan/tingkat/name and also by jurusan/tingkat simple
  const mapByName = new Map(classes.map(c => [classByKey(c), c]))
  const listByJurTingkat = new Map()
  classes.forEach(c => {
    const key = `${c.jurusan_id}::${c.kelas_tingkat}`
    if (!listByJurTingkat.has(key)) listByJurTingkat.set(key, [])
    listByJurTingkat.get(key).push(c)
  })

  // We'll build newClasses (including newly created local classes) and updatedStudents
  const newClasses = classes.slice()
  const updatedStudents = []

  // For each class, compute promotion targets
  for (const k of classes) {
    const next = tingkatBerikutnya(k.kelas_tingkat)
    if (!next) {
      // for XII - skip moving students (they graduate) in this script
      continue
    }

    // students eligible
    const siswaAktif = siswa.filter(s => s.kelas_id === k.id && s.status === 'Aktif' && !s.is_lulus)
    if (siswaAktif.length === 0) continue

    // try to find exact matching target name
    const namaBaru = gantiTingkatDiNama(k.name_kelas, next)
    let target = newClasses.find(c => c.jurusan_id === k.jurusan_id && c.kelas_tingkat === next && c.name_kelas === namaBaru)

    if (!target) {
      // fallback: find any class with same jurusan and tingkat
      target = newClasses.find(c => c.jurusan_id === k.jurusan_id && c.kelas_tingkat === next)
    }

    if (!target) {
      // create local class id
      const newId = Date.now() + Math.floor(Math.random()*1000)
      const jurCode = (k.name_kelas || '').split(/\s+/).slice(1).join(' ') || `J${k.jurusan_id}`
      const created = {
        id: newId,
        name_kelas: namaBaru,
        jurusan_id: k.jurusan_id,
        kelas_tingkat: next,
        wali_kelas_id: k.wali_kelas_id,
        deskripsi: `Auto-created ${namaBaru}`,
        angkatan: (k.angkatan || new Date().getFullYear()) + 1,
        is_arsip: false,
        kapasitas_siswa: k.kapasitas_siswa || siswaAktif.length,
      }
      newClasses.push(created)
      target = created
    }

    // assign all eligible students to the target
    for (const s of siswaAktif) {
      updatedStudents.push({ nis: s.nis, target_kelas_id: target.id })
    }
  }

  console.log('Classes before:', classes.length, 'Students before:', siswa.length)
  // preview counts per class before
  const beforeCounts = {}
  classes.forEach(c => { beforeCounts[c.id] = siswa.filter(s=>s.kelas_id===c.id).length })

  console.log('Preparing payload: classes:', newClasses.length, 'students to update:', updatedStudents.length)

  const payload = { classes: newClasses, students: updatedStudents }

  console.log('Calling promote endpoint...')
  const res = await fetch(`${BASE}/api/tahun-ajaran/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const body = await res.json()
  console.log('Promote response:', res.status, body)

  console.log('Fetching classes and students after promotion...')
  const [kc2, ks2] = await Promise.all([
    fetch(`${BASE}/api/tahun-ajaran/kelas`).then(r => r.json()),
    fetch(`${BASE}/api/tahun-ajaran/siswa`).then(r => r.json()),
  ])
  const classesAfter = Array.isArray(kc2) ? kc2 : []
  const siswaAfter = Array.isArray(ks2) ? ks2 : []

  console.log('Classes after:', classesAfter.length, 'Students after:', siswaAfter.length)

  // compute movement count
  let moved = 0
  const beforeMap = new Map()
  siswa.forEach(s => beforeMap.set(s.nis, s.kelas_id))
  siswaAfter.forEach(s => {
    const before = beforeMap.get(s.nis)
    if (before !== s.kelas_id) moved++
  })

  console.log('Total students moved:', moved)

  // output some sample classes capacities (note: DB may not store kapasitas_siswa)
  console.log('Sample classes after (first 10):')
  console.log(classesAfter.slice(0,10))

  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
