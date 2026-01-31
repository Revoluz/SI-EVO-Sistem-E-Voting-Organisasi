# 🗳️ QUICK START GUIDE - SI-EVO Voting System

## Setup Cepat

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Jalankan Aplikasi
```bash
npm start
```

## Menu Struktur

```
┌─ MAIN MENU
│  ├─ 1. ADMIN
│  │  ├─ 1. Kelola Kandidat
│  │  │  ├─ Tambah Kandidat
│  │  │  ├─ Lihat Semua Kandidat
│  │  │  └─ Hapus Kandidat
│  │  ├─ 2. Kelola Voter
│  │  │  ├─ Tambah Voter
│  │  │  ├─ Lihat Semua Voter
│  │  │  └─ Hapus Voter
│  │  ├─ 3. Lihat Statistik
│  │  │  └─ Tampilkan hasil voting
│  │  └─ 4. Reset Voting
│  │     └─ Reset semua data voting
│  │
│  ├─ 2. VOTER
│  │  ├─ 1. Voting
│  │  │  └─ Login & Pilih Kandidat
│  │  └─ 2. Lihat Daftar Kandidat
│  │
│  └─ 3. Keluar
```

## Contoh Penggunaan

### 📌 Scenario: Setup Voting Pertama Kali

#### Step 1: Setup Kandidat (sebagai Admin)
```
Pilih: 1 (Admin)
Pilih: 1 (Kelola Kandidat)
Pilih: 1 (Tambah Kandidat)
Nama: Rina Kusuma
Deskripsi: Fokus pada peningkatan infrastruktur
```

#### Step 2: Setup Voter (sebagai Admin)
```
Pilih: 1 (Admin)
Pilih: 2 (Kelola Voter)
Pilih: 1 (Tambah Voter)
Nama: Budi Santoso
ID/NIM: 001
```

#### Step 3: Melakukan Voting (sebagai Voter)
```
Pilih: 2 (Voter)
Pilih: 1 (Voting)
ID/NIM: 001
Nama: Budi Santoso
Pilih Kandidat: 1
Konfirmasi: y
```

#### Step 4: Lihat Hasil (sebagai Admin)
```
Pilih: 1 (Admin)
Pilih: 3 (Lihat Statistik)
```

## Data yang Tersedia

### Kandidat Awal
- sdafsa
- saf

### Voter Awal
- Budi Santoso (ID: 001)
- Siti Nurhaliza (ID: 002)
- Ahmad Rahman (ID: 003)

## Shortcut & Tips

✅ **Gunakan keyboard** untuk semua input  
✅ **Konfirmasi dengan 'y'** atau 'Y'  
✅ **Tekan Enter** untuk melanjutkan  
✅ **Nomor kandidat sesuai urutan** di tampilan  

## Troubleshooting

❓ **Error "Module not found"?**
→ Jalankan `npm install`

❓ **Input tidak berfungsi?**
→ Pastikan terminal Anda active, coba tekan Enter

❓ **Data tidak tersimpan?**
→ Cek folder `src/data/` dan pastikan ada permission write

## File Penting

| File | Fungsi |
|------|--------|
| `index.js` | Entry point aplikasi |
| `src/menu/mainMenu.js` | Menu utama |
| `src/menu/adminMenu.js` | Menu admin |
| `src/menu/voterMenu.js` | Menu voter |
| `src/utils/input.js` | Input handling |
| `src/utils/fileHandler.js` | File operations |
| `src/data/candidates.json` | Data kandidat |
| `src/data/voters.json` | Data voter |
| `src/data/votes.json` | Log voting |

## Next Steps

- ✅ Sistem sudah siap digunakan
- 📝 Tambah kandidat sesuai kebutuhan
- 👥 Register voters yang berhak voting
- 🗳️ Jalankan voting process
- 📊 Lihat hasil real-time

---

**Enjoy your voting! 🎉**
