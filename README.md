# 🏫 Sistem Informasi Absensi Terpadu Katapang

<p align="center">
  <img style="margin-right: 8px;" src="https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript" alt="TypeScript Badge">
  <img style="margin-right: 8px;" src="https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js Badge">
  <img style="margin-right: 8px;" src="https://img.shields.io/badge/React-blue?style=flat-square&logo=react&logoColor=white" alt="React Badge">
  <img style="margin-right: 8px;" src="https://img.shields.io/badge/Node.js-green?style=flat-square&logo=node.js&logoColor=white" alt="Node.js Badge">
  <img style="margin-right: 8px;" src="https://img.shields.io/badge/PostCSS-gray?style=flat-square&logo=postcss&logoColor=white" alt="PostCSS Badge">
</p>

📝 **Sistem Informasi Absensi Terpadu Katapang** adalah aplikasi berbasis web yang dirancang untuk mempermudah pengelolaan absensi dan agenda kegiatan di lingkungan sekolah Katapang.  
Dengan berbagai **peran pengguna (role)** seperti **Admin, Guru, Staff, Sekretaris, dan Piket**, aplikasi ini bertujuan untuk meningkatkan efisiensi, akurasi data, serta mempermudah koordinasi antar pihak sekolah.  

> 💡 *TAFA DULU DEK!* 😉

---

## 📚 Daftar Isi

1. [Tentang Proyek](#tentang-proyek)  
2. [Struktur Peran dan Fitur](#struktur-peran-dan-fitur)  
   - [Admin](#1-admin)
   - [Guru](#2-guru)
   - [Staff](#3-staff)
   - [Piket](#4-piket)
   - [Sekretaris](#5-sekretaris)
3. [Diagram Struktur Role & Akses](#diagram-struktur-role--akses)
4. [Fitur Utama](#fitur-utama)
5. [Tech Stack](#tech-stack)
6. [Instalasi & Menjalankan](#instalasi--menjalankan)
7. [Cara Berkontribusi](#cara-berkontribusi)
8. [Lisensi](#lisensi)

---

## 🏫 Tentang Proyek

Sistem ini berfokus pada **otomatisasi dan digitalisasi absensi serta agenda akademik**.  
Setiap peran memiliki **akses dan tanggung jawab berbeda**, memastikan keamanan dan efisiensi dalam manajemen data siswa, guru, dan kegiatan sekolah.

---

## ⚙️ Struktur Peran dan Fitur

### 1. **Admin**
**Fokus:** Pengelolaan penuh sistem.  
**Fitur Utama:**
- 🔐 Login & Dashboard Admin: Statistik absensi, ringkasan agenda, log aktivitas.  
- 👥 Manajemen Akun (CRUD): Admin, Guru, Staff, Sekretaris, Piket.  
- 🏫 CRUD Jurusan & Kelas.  
- 📚 CRUD Mata Pelajaran.  
- 📅 Kelola Absensi & Kalender Akademik.  
- 🗓️ Membuat/Mengedit/Menghapus Agenda Kelas.  
- 🧾 Melihat Log Aktivitas Semua Role.  
- 📤 Export & Import Data (Excel/CSV/PDF).  
- ⚙️ Konfigurasi Sistem (tahun ajaran, jam masuk, toleransi keterlambatan, dll).  

---

### 2. **Guru**
**Fokus:** Mengisi dan memantau absensi serta agenda kelas.  
**Fitur Utama:**
- 🔐 Dashboard Guru: Ringkasan absensi & agenda kelas yang diajar.  
- 🗓️ Absensi Agenda(readonly).  
- 📘 Isi Agenda umum.   
- 🚫 Akses Terbatas: Tidak dapat CRUD akun, jurusan, pelajaran.

---

### 3. **TU**
**Fokus:** Mendukung operasional absensi dan agenda.  
**Fitur Utama:**
- 🔐 Dashboard Staff.  
- 🗓️ Input Absensi Manual (rekap offline, siswa lupa absen).  
- 📘 Lihat Agenda umum.  
- 📅 Lihat Kalender Sekolah.  
- 🚫 Tidak memiliki akses CRUD akun, jurusan, pelajaran.

---

### 4. **Piket**
**Fokus:** Monitoring hasil kerja staff & guru.  
**Fitur Utama:**
- 🔐 Dashboard Piket.  
- 👀 Lihat Absensi & Agenda (Read Only).  
- 📅 Kalender Akademik.  
- 📊 Rekap Data Absensi.  
- 🚫 Hanya View (tidak bisa edit atau CRUD).

---

### 5. **Sekretaris**
**Fokus:** Membantu mengisi absensi & agenda kelas.  
**Fitur Utama:**
- 🔐 Dashboard Sekretaris.  
- 🗓️ Input Absensi Kelas Sendiri.  
- 📘 Isi & Lihat Agenda Kelas.  
- 📅 Lihat Kalender Akademik.  
- 🚫 Tidak dapat mengubah akun, jurusan, pelajaran, atau ekspor data.

---

<p align="center">
  <img style="margin-right: 8px;" src="https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript" alt="TypeScript Badge">
  <img style="margin-right: 8px;" src="https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js Badge">
  <img style="margin-right: 8px;" src="https://img.shields.io/badge/React-blue?style=flat-square&logo=react&logoColor=white" alt="React Badge">
  <img style="margin-right: 8px;" src="https://img.shields.io/badge/Node.js-green?style=flat-square&logo=node.js&logoColor=white" alt="Node.js Badge">
  <img style="margin-right: 8px;" src="https://img.shields.io/badge/PostCSS-gray?style=flat-square&logo=postcss&logoColor=white" alt="PostCSS Badge">
</p>

📝 Aplikasi ini dirancang untuk mempermudah pengelolaan absensi dan agenda kegiatan di lingkungan sekolah Katapang. Dengan berbagai fitur dan peran pengguna yang berbeda, aplikasi ini bertujuan untuk meningkatkan efisiensi dan akurasi data, serta mempermudah koordinasi antara guru, staf, dan administrator. TAFA DULU DEK! 😉

**Fitur Utama ✨**

*   🔑 **Manajemen Pengguna Berbasis Peran:** Sistem otorisasi yang ketat dengan peran berbeda (Admin, Guru, Staf, Sekretaris, Piket) untuk memastikan keamanan dan akses yang sesuai.
*   🗓️ **Agenda Kelas Terintegrasi:** Memudahkan guru dan staf dalam membuat dan mengelola agenda kelas, serta memberikan visibilitas kepada pihak terkait.
*   📊 **Rekapitulasi Data yang Komprehensif:** Fitur rekap data yang memungkinkan pengguna untuk menganalisis data absensi dan agenda secara efektif.
*   ⚙️ **Konfigurasi Sistem yang Fleksibel:** Admin dapat mengatur berbagai konfigurasi sistem, seperti tahun ajaran, jam masuk, dan toleransi keterlambatan, sesuai dengan kebutuhan sekolah.
*   📤 **Ekspor dan Impor Data:** Memungkinkan ekspor data ke format Excel/CSV/PDF, serta impor data siswa/guru untuk mempermudah pengelolaan data massal.

**Tech Stack 🛠️**

*   🟦 TypeScript
*   ⚛️ Next.js
*   ⚛️ React
*   🟢 Node.js
*   💨 PostCSS
*   💾 Kemungkinan menggunakan database seperti PostgreSQL atau MySQL (berdasarkan fitur ekspor/impor data dan kebutuhan penyimpanan data yang terstruktur).
*   🔑 Kemungkinan menggunakan library otentikasi seperti NextAuth.js untuk manajemen sesi pengguna.

**Instalasi & Menjalankan 🚀**

1.  Clone repositori:
    ```bash
    git clone https://github.com/Muunsz/absensi-katapang
    ```

2.  Masuk ke direktori:
    ```bash
    cd absensi-katapang
    ```

3.  Install dependensi:
    ```bash
    npm install
    ```

4.  Jalankan proyek:
    ```bash
    npm run dev
    ```

**Cara Berkontribusi 🤝**

1.  Fork repositori ini.
2.  Buat branch untuk fitur baru Anda (`git checkout -b feature/FiturBaru`).
3.  Commit perubahan Anda (`git commit -m 'Menambahkan FiturBaru'`).
4.  Push ke branch Anda (`git push origin feature/FiturBaru`).
5.  Buat Pull Request.

.env file : https://drive.google.com/file/d/1hsDHDAW4HrsLMblgZJsbFah5u5lPPX7k/view?usp=sharing

## 🧭 Diagram Struktur Role & Akses

Berikut diagram alur akses tiap role di sistem:  

```mermaid
graph TD
    A[Admin] -->|CRUD| B[Akun Pengguna]
    A -->|Manage| C[Jurusan & Kelas]
    A -->|Manage| D[Mata Pelajaran]
    A -->|Full Access| E[Absensi & Kalender]
    A -->|Manage| F[Agenda Kelas]
    A -->|View| G[Log Aktivitas]
    A -->|Export/Import| H[Data Sekolah]

    B1[Guru] -->|Input| E
    B1 -->|Create/Edit| F
    B1 -->|View| G

    B2[Staff] -->|Assist Input| E
    B2 -->|Assist Input| F
    B2 -->|View| I[Kalender Sekolah]

    B3[Sekretaris] -->|Input| E
    B3 -->|Input/View| F
    B3 -->|View| I

    B4[Piket] -->|View Only| E
    B4 -->|View Only| F
    B4 -->|View Only| H
    B4 -->|View| I
