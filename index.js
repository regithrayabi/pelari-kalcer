/**
 * Menghitung pace lari (menit per kilometer)
 * @param {number} waktuMenit - Total waktu berlari dalam satuan menit
 * @param {number} jarakKm - Total jarak berlari dalam satuan kilometer
 * @returns {string} Pace dalam format "MM:SS /km"
 */
function hitungPace(waktuMenit, jarakKm) {
  if (!waktuMenit || !jarakKm || jarakKm <= 0) {
    return "Jarak atau waktu tidak valid, ndak boleh kosong atau nol!";
  }

  const totalDetikPerKm = Math.round((waktuMenit * 60) / jarakKm);
  const menitPace = Math.floor(totalDetikPerKm / 60);
  const detikPace = totalDetikPerKm % 60;

  // Format agar detik selalu 2 digit (misal: 05, bukan 5)
  const formatDetik = detikPace < 10 ? `0${detikPace}` : detikPace;

  return `${menitPace}:${formatDetik} /km`;
}

/**
 * Memprediksi total waktu lari berdasarkan target pace dan jarak
 * @param {string} paceStr - Target pace dalam format "MM:SS" (contoh: "05:30")
 * @param {number} jarakKm - Jarak yang ingin ditempuh dalam kilometer
 * @returns {string} Estimasi total waktu dalam format jam, menit, dan detik
 */
function prediksiWaktu(paceStr, jarakKm) {
  const bagian = paceStr.split(':');
  if (bagian.length !== 2) return "Format pace harus MM:SS (contoh: '05:30')";

  const menit = parseInt(bagian[0], 10);
  const detik = parseInt(bagian[1], 10);
  
  const totalDetikPerKm = (menit * 60) + detik;
  const totalDetik = totalDetikPerKm * jarakKm;

  const jamHasil = Math.floor(totalDetik / 3600);
  const sisaDetik = totalDetik % 3600;
  const menitHasil = Math.floor(sisaDetik / 60);
  const detikHasil = Math.round(sisaDetik % 60);

  if (jamHasil > 0) {
    return `${jamHasil} jam ${menitHasil} menit ${detikHasil} detik`;
  }
  return `${menitHasil} menit ${detikHasil} detik`;
}

/**
 * Memberikan strategi pembagian pace dinamis dari 100m, Half Marathon, hingga Ultra Marathon
 * @param {number|string} jarak - Jarak lari (contoh: 0.1, 5, 21.1, "100m", "21k", 42.2)
 * @param {string} targetPace - Pace target dalam format "MM:SS" (contoh: "05:30")
 * @returns {Object} Strategi pacing, pembagian zona, dan catatan nutrisi/hidrasi
 */
function paceManagement(jarak, targetPace) {
  // 1. Standarisasi Input Jarak ke Kilometer
  let jarakKm = 0;
  if (typeof jarak === 'string') {
    const cleanInput = jarak.toLowerCase().trim();
    if (cleanInput.endsWith('m') && !cleanInput.endsWith('km')) {
      jarakKm = parseFloat(cleanInput) / 1000; // Misal: "100m" -> 0.1 km
    } else {
      jarakKm = parseFloat(cleanInput); // Misal: "21km" -> 21 km
    }
  } else {
    jarakKm = Number(jarak);
  }

  if (isNaN(jarakKm) || jarakKm <= 0 || !targetPace) {
    return { error: "Input jarak atau target pace tidak valid!" };
  }

  // 2. Parse Target Pace ke Detik
  const [menit, detik] = targetPace.split(':').map(Number);
  const totalDetikTarget = (menit * 60) + detik;

  const formatPace = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s} /km`;
  };

  // 3. Logika Adaptif Berdasarkan Kategori Jarak
  let kategori = "";
  let strategi = [];
  let saranNutrisi = "";

  if (jarakKm < 1) {
    kategori = "Sprint / Track Distance";
    strategi = [
      {
        fase: "All-Out Sprint",
        rentang: `0 - ${jarakKm * 1000} meter`,
        rekomendasiPace: formatPace(totalDetikTarget),
        catatan: "Pertahankan bentuk lari & frekuensi langkah maksimal tanpa menahan napas"
      }
    ];
    saranNutrisi = "Tidak memerlukan nutrisi saat lari. Pastikan pemanasan dinamis mencukupi.";

  } else if (jarakKm <= 10) {
    kategori = "Short / Medium Distance";
    strategi = [
      {
        fase: "Warmup & Settlement",
        rentang: `0 - ${(jarakKm * 0.2).toFixed(1)} km`,
        rekomendasiPace: formatPace(totalDetikTarget + 10),
        catatan: "Kendalikan emosi, mulai sedikit lebih lambat dari target pace"
      },
      {
        fase: "Cruising Speed",
        rentang: `${(jarakKm * 0.2).toFixed(1)} - ${(jarakKm * 0.8).toFixed(1)} km`,
        rekomendasiPace: formatPace(totalDetikTarget),
        catatan: "Jaga ritme langkah dan kadensi teratur"
      },
      {
        fase: "Finish Push",
        rentang: `${(jarakKm * 0.8).toFixed(1)} - ${jarakKm} km`,
        rekomendasiPace: formatPace(totalDetikTarget - 10),
        catatan: "Kerahkan sisa tenaga menuju garis finish"
      }
    ];
    saranNutrisi = "Hidrasi air putih cukup sebelum & sesudah lari.";

  } else if (jarakKm <= 21.1) {
    kategori = "Half Marathon";
    strategi = [
      {
        fase: "Controlled Start",
        rentang: `0 - ${(jarakKm * 0.25).toFixed(1)} km (KM 1-5)`,
        rekomendasiPace: formatPace(totalDetikTarget + 10),
        catatan: "Lari santai, hemat tenaga, jangan terbawa emosi kerumunan pelari lain"
      },
      {
        fase: "Cruising Rhythm",
        rentang: `${(jarakKm * 0.25).toFixed(1)} - ${(jarakKm * 0.75).toFixed(1)} km (KM 6-15)`,
        rekomendasiPace: formatPace(totalDetikTarget),
        catatan: "Masuk ke target pace, pertahankan irama napas dan kadensi teratur"
      },
      {
        fase: "Strong Finish / Push Zone",
        rentang: `${(jarakKm * 0.75).toFixed(1)} - ${jarakKm} km (KM 16-21)`,
        rekomendasiPace: formatPace(totalDetikTarget - 5),
        catatan: "Saatnya menaikkan kecepatan bertahap jika stamina masih terasa segar"
      }
    ];
    saranNutrisi = "Minum 1-2 Energy Gel (misal pada KM 7 & KM 14) serta minum air/elektrolit di water station.";

  } else if (jarakKm <= 42.2) {
    kategori = "Full Marathon";
    strategi = [
      {
        fase: "Conserve Energy",
        rentang: `0 - ${(jarakKm * 0.25).toFixed(1)} km`,
        rekomendasiPace: formatPace(totalDetikTarget + 15),
        catatan: "Sangat krusial untuk tidak terkecoh lari terlalu cepat di awal"
      },
      {
        fase: "Target Rhythm",
        rentang: `${(jarakKm * 0.25).toFixed(1)} - ${(jarakKm * 0.75).toFixed(1)} km`,
        rekomendasiPace: formatPace(totalDetikTarget),
        catatan: "Fokus pada efisiensi gerakan dan ritme napas"
      },
      {
        fase: "Negative Split / Strong Finish",
        rentang: `${(jarakKm * 0.75).toFixed(1)} - ${jarakKm} km`,
        rekomendasiPace: formatPace(totalDetikTarget - 5),
        catatan: "Bertahan dari kelelahan mental, tingkatkan kecepatan perlahan"
      }
    ];
    saranNutrisi = "Konsumsi Energy Gel setiap 45-60 menit dan minumlah elektrolit di setiap water station.";

  } else {
    kategori = "Ultra Marathon";
    strategi = [
      {
        fase: "Ultra Conservation Pace",
        rentang: `0 - ${(jarakKm * 0.5).toFixed(1)} km`,
        rekomendasiPace: formatPace(totalDetikTarget + 30),
        catatan: "Gunakan teknik Run-Walk jika melewati tanjakan, utamakan efisiensi detak jantung"
      },
      {
        fase: "Mental & Steady Survival",
        rentang: `${(jarakKm * 0.5).toFixed(1)} - ${jarakKm} km`,
        rekomendasiPace: formatPace(totalDetikTarget + 15),
        catatan: "Kelola kelelahan fisik dan emosional, jaga asupan kalori secara berkala"
      }
    ];
    saranNutrisi = "Wajib konsumsi makanan padat (pisang/bar), asupan garam/elektrolit, serta cairan secara konsisten.";
  }

  return {
    jarakTotal: `${jarakKm} km`,
    kategori,
    strategi,
    saranNutrisi
  };
}

// Mengekspor fungsi agar dapat digunakan di luar berkas
module.exports = {
  hitungPace,
  prediksiWaktu,
  paceManagement
};