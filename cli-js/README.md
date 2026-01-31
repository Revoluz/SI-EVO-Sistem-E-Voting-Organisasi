# SI-EVO: Sistem E-Voting Organisasi CLI

Aplikasi voting berbasis CLI (Command Line Interface) yang dikembangkan dengan Node.js. Sistem ini memungkinkan organisasi untuk menjalankan proses voting secara elektronik dan transparan dengan antarmuka yang user-friendly.

## Fitur Utama

### 👨‍💼 Admin Menu
- **Kelola Kandidat**: Tambah, lihat, dan hapus kandidat
- **Kelola Voter**: Tambah, lihat, dan hapus voters
- **Lihat Statistik**: Melihat hasil voting real-time
- **Reset Voting**: Mereset seluruh data voting (dengan konfirmasi)

### 🗳️ Voter Menu
- **Voting**: Melakukan voting dengan autentikasi
- **Lihat Daftar Kandidat**: Melihat semua kandidat beserta deskripsinya

## Instalasi

### Prasyarat
- Node.js v12 atau lebih tinggi
- npm atau yarn

### Setup

1. Clone repository atau download project
```bash
cd SI-EVO-Sistem-E-Voting-Organisasi-CLI
```

2. Install dependencies
```bash
npm install
```

## Cara Menggunakan

### Menjalankan Aplikasi
```bash
npm start
# atau
node index.js
```

### Menu Utama
Saat aplikasi berjalan, Anda akan melihat menu utama dengan pilihan:
1. **Admin** - Akses menu administrasi
2. **Voter** - Akses menu voting
3. **Keluar** - Keluar dari aplikasi

### Akses Admin
Menu admin memberikan kontrol penuh terhadap:
- Menambah kandidat dengan nama dan deskripsi
- Menambah voter dengan ID dan nama
- Melihat statistik voting real-time
- Mereset voting jika diperlukan

### Akses Voter
Voter dapat:
1. Login menggunakan ID dan Nama
2. Memilih kandidat dari daftar yang tersedia
3. Konfirmasi pilihan sebelum final
4. Melihat daftar semua kandidat

## Data Struktur

Data disimpan dalam format JSON di folder `src/data/`:

### candidates.json
```json
[
  {
    "id": 1,
    "name": "Nama Kandidat",
    "description": "Deskripsi/Platform",
    "votes": 0
  }
]
```

### voters.json
```json
[
  {
    "id": 1,
    "name": "Nama Voter",
    "voterId": "ID Unik",
    "voted": false
  }
]
```

### votes.json
```json
[
  {
    "timestamp": "ISO timestamp",
    "voterId": "ID Voter",
    "voterName": "Nama Voter",
    "candidateId": 1,
    "candidateName": "Nama Kandidat"
  }
]
```

## Struktur Project

```
SI-EVO-Sistem-E-Voting-Organisasi-CLI/
├── index.js                    # Entry point aplikasi
├── package.json               # Konfigurasi npm
├── package-lock.json          # Lock file dependencies
├── README.md                  # Dokumentasi
└── src/
    ├── data/                  # Folder data JSON
    │   ├── candidates.json
    │   ├── voters.json
    │   ├── votes.json
    │   └── voting_data.json
    ├── menu/                  # Menu modules
    │   ├── mainMenu.js       # Menu utama
    │   ├── adminMenu.js      # Menu admin
    │   └── voterMenu.js      # Menu voter
    └── utils/                 # Utility functions
        ├── input.js          # Input handling
        └── fileHandler.js    # File operations
```

## Dependencies

- **prompt-sync** v4.2.0 - Untuk menangani input keyboard di CLI

## Cara Kerja

### Flow Voting
1. Voter login dengan ID dan Nama
2. Sistem verifikasi data voter di database
3. Jika voter belum voting, ditampilkan daftar kandidat
4. Voter memilih kandidat dan confirm
5. Vote dicatat dan voter ditandai sudah voting

### Security Notes
- Sistem ini adalah voting berbasis honor (honor system)
- Setiap voter hanya bisa voting sekali
- Data disimpan dalam file JSON (tidak encrypted)
- Untuk production, gunakan database yang lebih aman

## Contoh Penggunaan

### Tambah Kandidat (Admin)
```
Menu Admin > Kelola Kandidat > Tambah Kandidat
Nama: Joko Widodo
Deskripsi: Visi memajukan organisasi
```

### Voting (Voter)
```
Menu Voter > Voting
ID/NIM: 001
Nama: Budi Santoso
[Pilih kandidat]
[Konfirmasi pilihan]
```

## Developer

Dikembangkan untuk SI-EVO (Sistem E-Voting Organisasi) CLI

## License

ISC
