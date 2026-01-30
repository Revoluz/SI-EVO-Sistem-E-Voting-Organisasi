# BST Voter Cache Implementation - SI-EVO

## Overview
Implementasi sederhana Binary Search Tree untuk caching voter data dengan maximum 25 user terakhir yang login.

## Cara Kerja

### 1. **Login Flow dengan Cache**
```
User login (email + password)
    ↓
Cache Service (voterCacheService.js)
    ↓
Cek di BST Cache → Jika ada, gunakan data cached
                → Jika tidak ada, query ke Database
    ↓
Jika ditemukan di DB → Tambah ke Cache (BST)
    ↓
Update Session & Login
```

### 2. **Cache Management**
- **Max Size**: 25 voter
- **Eviction Policy**: FIFO (First In, First Out)
- **Storage**: Array untuk tracking order + BST untuk fast lookup
- **Indexed by**: ID voter

### 3. **Struktur Data**
- **BST (Binary Search Tree)**: Menyimpan data voter dengan sorting berdasarkan ID
- **Cache List (Array)**: Tracking urutan voter untuk FIFO eviction

## File-File yang Dibuat/Dimodifikasi

### Baru Dibuat:
1. **`services/voterCacheService.js`** (173 lines)
   - Singleton instance voter cache
   - Method: `findByEmail()`, `findById()`, `getStats()`
   - Manage BST insertion, deletion, traversal

### Dimodifikasi:
1. **`controllers/authController.js`**
   - Import `voterCache` service
   - Gunakan `voterCache.findByEmail()` di `loginProcess()`

2. **`server.js`**
   - Import `voterCache` service
   - Log cache stats saat server startup

3. **`routes/publicRoutes.js`**
   - Tambah endpoint `/cache-stats` untuk debugging

## Testing

### Test Cache Implementation

1. **Start Server**
```bash
npm run dev
```

2. **Lihat Cache Stats**
```
GET http://localhost:3000/cache-stats
```
Response:
```json
{
  "message": "Voter Cache Statistics",
  "stats": {
    "cacheSize": 3,
    "maxSize": 25,
    "bstSize": 3,
    "voters": [
      {"id": 1, "email": "ahmad@example.com"},
      {"id": 2, "email": "bella@example.com"}
    ]
  }
}
```

3. **Test Login** (dengan multiple voter)
   - Login sebagai `ahmad@example.com` (password: voter123)
   - Lihat console output untuk cache logs
   - Login sebagai voter lain
   - Cek `/cache-stats` untuk melihat cache bertambah

### Expected Output di Console
```
SI-EVO Server running on http://localhost:3000
[Cache] Voter Cache Service initialized (max 25 users)
[Cache] Stats: { cacheSize: 0, maxSize: 25, bstSize: 0, voters: [] }

[Cache] Searching voter by email: ahmad@example.com
[Cache] Not in cache, querying database...
[Cache] ✓ Added to cache: ahmad@example.com (cache size: 1/25)
✓ Voter logged in: ahmad@example.com
```

## Performa

| Operation | Time Complexity | Notes |
|-----------|-----------------|-------|
| Cache Hit (BST Search) | O(log n) avg, O(n) worst | n = cached voters (max 25) |
| Cache Miss (DB Query) | O(1) | Indexed database query |
| Insert to Cache | O(log n) + O(1) | BST insert + Array append |
| Cache Eviction | O(1) | Remove first from array |

## Keuntungan

✅ **Fast Lookup**: User yang sudah pernah login tidak perlu query DB lagi  
✅ **Memory Efficient**: Hanya simpan 25 voter terbaru  
✅ **Simple**: Implementasi straightforward tanpa kompleksitas tinggi  
✅ **Production Ready**: Bisa langsung integrate ke sistem existing  

## Future Enhancement

1. **Persistent Cache**: Simpan cache ke Redis/Memcached
2. **TTL (Time To Live)**: Auto-evict data yang lama
3. **Warm Cache**: Load 25 voter paling aktif saat startup
4. **Admin Cache Clear**: Endpoint untuk manual clear cache

---
**Created**: January 15, 2026  
**Implementasi**: Simplified BST voter caching untuk SI-EVO system
