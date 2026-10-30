# pelari-kalcer 🏃‍♂️☕

Package npm sederhana untuk menghitung *pace* lari, memprediksi waktu tempuh lari, dan memberikan rekomendasi strategi lari (*Pace Management*) secara dinamis. Cocok untuk pelari fomo.

## 🚀 Instalasi

Instal package ini ke dalam proyek Anda:

```bash
npm install pelari-kalcer
```

## 🛠️ Cara Penggunaan di Dalam Kode

Pastikan Anda mengimpor fungsi-fungsi dari paket ini di proyek Anda:

```javascript
const { hitungPace, prediksiWaktu, paceManagement } = require('pelari-kalcer');
```

* **`hitungPace(waktuMenit, jarakKm)`**: Menghitung *pace* dalam format MM:SS /km.
* **`prediksiWaktu(paceStr, jarakKm)`**: Memprediksi total waktu (jam, menit, detik) berdasarkan target *pace* dan jarak.
* **`paceManagement(jarakStr, paceStr)`**: Mengeluarkan objek strategi lari dari fase pemanasan hingga finish.

---

## 💻 Pengujian Dinamis lewat Terminal (CLI)

Anda dapat menguji prediksi waktu dan strategi *pace* secara dinamis tanpa mengubah kodingan setiap kali ingin mencoba nilai baru. Skrip pengujian otomatis membaca input dari argumen terminal (menggunakan `process.argv`).

Gunakan format perintah berikut di terminal:

```bash
node test.js <jarak> <target-pace>
```

### ✨ Fitur Input Pintar
* **Nilai Default (Bawaan):** Jika Anda tidak memasukkan argumen apa pun, skrip akan otomatis menggunakan jarak **`10k`** dan pace **`06:00`**.
* **Otomatis Konversi Meter:** Jika Anda memasukkan satuan meter (diakhiri huruf `m` tanpa `k`, contoh: `400m`), sistem akan otomatis membaginya dengan 1000 agar menjadi kilometer sebelum dihitung oleh fungsi prediksi.

### 📝 Contoh Penggunaan CLI

**1. Menggunakan Nilai Default (10k, Pace 06:00)**
```bash
node test.js
```

**2. Menguji Jarak Pendek (Otomatis konversi 400m ke 0.4km)**
```bash
node test.js 400m 03:30
```

**3. Menguji Jarak Kustom (misal 7km)**
```bash
node test.js 7km 05:30
```

## 📝 Lisensi
MIT


## Anda Bisa CopyPaste Code Ini
```
const { hitungPace, prediksiWaktu, paceManagement } = require('pelari-kalcer');

// Mengambil argumen dari terminal
// process.argv[2] adalah argumen pertama setelah "node test.js"
// process.argv[3] adalah argumen kedua
const jarakInput = process.argv[2] || "10k"; // Jika tidak diisi, defaultnya "10k"
const paceInput = process.argv[3] || "06:00"; // Jika tidak diisi, defaultnya "06:00"

console.log("=== UJI COBA DINAMIS PELARI-KALCER ===\n");
console.log(`Menganalisis Lari -> Jarak: ${jarakInput} | Target Pace: ${paceInput}\n`);

console.log("--- 1. Prediksi Total Waktu ---");
// Untuk prediksi waktu, kita ambil angka jaraknya saja jika user menginput "7km"
// Kita bersihkan huruf agar tersisa angkanya saja
let jarakAngka = parseFloat(jarakInput);

// Deteksi jika input menggunakan huruf 'm' (meter) tapi bukan 'km'
if (jarakInput.toLowerCase().endsWith('m') && !jarakInput.toLowerCase().endsWith('km')) {
  jarakAngka = jarakAngka / 1000; // Konversi meter menjadi kilometer
}

if (!isNaN(jarakAngka)) {
  console.log(`Estimasi Finish: ${prediksiWaktu(paceInput, jarakAngka)}\n`);
}

console.log("--- 2. Strategi Pace Management ---");
const strategi = paceManagement(jarakInput, paceInput);
console.dir(strategi, { depth: null });```