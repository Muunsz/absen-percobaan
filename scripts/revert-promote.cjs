const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({ log: ['error', 'warn'] })
async function main() {
  console.log('Fetching classes and students...')
  const classes = await prisma.kelas.findMany()
  const siswa = await prisma.siswa.findMany()

  // determine class level from the class name (kelas field) because Prisma schema
  // doesn't store a separate 'kelas_tingkat' column.
  const detectTingkat = (name) => {
    const m = String(name).match(/^\s*(XII|XI|X)\b/i)
    if (!m) return null
    const t = m[1].toUpperCase()
    if (t === 'X') return 'X'
    if (t === 'XI') return 'XI'
    return 'XII'
  }

  const kelasByJurX = new Map()
  classes.forEach(k => {
    const tingkat = detectTingkat(k.kelas)
    if (tingkat === 'X') {
      const arr = kelasByJurX.get(k.id_jurusan) || []
      arr.push(k)
      kelasByJurX.set(k.id_jurusan, arr)
    }
  })

  const anyX = classes.find(k => detectTingkat(k.kelas) === 'X')
  if (!anyX) {
    console.error('No X classes found in DB; aborting')
    process.exit(1)
  }

  console.log(`Found ${classes.length} classes, ${siswa.length} siswa. Any X: ${anyX.id}`)

  let moved = 0
  for (const s of siswa) {
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
