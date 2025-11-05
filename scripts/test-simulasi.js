const BASE = process.env.BASE_URL || 'http://localhost:3000'

async function jsonOrText(res) {
  try { return await res.json() } catch (e) { return await res.text() }
}

async function run() {
  console.log('Using base URL', BASE)
  // pick a kelas id that exists
  const kelasRes = await fetch(`${BASE}/api/tahun-ajaran/kelas`)
  const kelasList = await kelasRes.json()
  if (!Array.isArray(kelasList) || kelasList.length === 0) {
    console.error('No kelas available to test')
    process.exit(2)
  }
  const kelasId = kelasList[0].id
  console.log('Testing on kelas id', kelasId)

  // list siswa for that kelas
  const siswaListRes = await fetch(`${BASE}/api/tahun-ajaran/siswa?kelasId=${kelasId}`)
  const siswaList = await siswaListRes.json()
  const initialSiswaCount = Array.isArray(siswaList) ? siswaList.length : 0
  console.log('initial siswa count', initialSiswaCount)

  // attempt to DELETE a siswa with simulation header
  const nisToDelete = siswaList[0]?.nis || 'nonexistent'
  const delRes = await fetch(`${BASE}/api/tahun-ajaran/siswa?nis=${nisToDelete}`, { method: 'DELETE', headers: { 'x-mode-simulasi': 'true' } })
  const delBody = await jsonOrText(delRes)
  console.log('DELETE status', delRes.status, 'body', delBody)
  if (delRes.status !== 400) {
    console.error('Expected 400 for simulated delete')
    process.exit(3)
  }

  // attempt to create a kelas with simulation header
  const createKelasRes = await fetch(`${BASE}/api/tahun-ajaran/kelas`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-mode-simulasi': 'true' }, body: JSON.stringify({ name_kelas: 'X SIM TEST', jurusan_id: kelasList[0].jurusan_id || 1, wali_kelas_id: 1 }) })
  const createKelasBody = await jsonOrText(createKelasRes)
  console.log('POST kelas status', createKelasRes.status, 'body', createKelasBody)
  if (createKelasRes.status !== 400) {
    console.error('Expected 400 for simulated create')
    process.exit(4)
  }

  // attempt to update kelas with simulation header
  const putKelasRes = await fetch(`${BASE}/api/tahun-ajaran/kelas`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-mode-simulasi': 'true' }, body: JSON.stringify({ id: kelasId, name_kelas: 'MODIFIED SIM' }) })
  const putKelasBody = await jsonOrText(putKelasRes)
  console.log('PUT kelas status', putKelasRes.status, 'body', putKelasBody)
  if (putKelasRes.status !== 400) {
    console.error('Expected 400 for simulated put')
    process.exit(5)
  }

  // verify siswa count unchanged
  const siswaAfterRes = await fetch(`${BASE}/api/tahun-ajaran/siswa?kelasId=${kelasId}`)
  const siswaAfter = await siswaAfterRes.json()
  const afterCount = Array.isArray(siswaAfter) ? siswaAfter.length : 0
  console.log('after siswa count', afterCount)
  if (afterCount !== initialSiswaCount) {
    console.error('Siswa count changed during simulated operations')
    process.exit(6)
  }

  console.log('\nAll simulated-protection tests passed ✅')
}

run().catch((e) => { console.error(e); process.exit(99) })
