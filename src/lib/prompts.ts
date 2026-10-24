import "server-only";

import type { AiRequest, BusinessProfile } from "./types";

const GAYA: Record<string, string> = {
  santai: "santai, akrab, dan hangat seperti ngobrol dengan tetangga; boleh memakai emoji secukupnya",
  sopan: "sopan dan ramah, memakai sapaan Kak/Bapak/Ibu, emoji sangat sedikit",
  profesional: "profesional, jelas, dan meyakinkan, tanpa emoji berlebihan",
};

export function profileBlock(p: BusinessProfile | null): string {
  if (!p || !p.namaUsaha) {
    return "Profil usaha belum diisi. Buat jawaban yang umum tetapi tetap praktis, dan sarankan pengguna melengkapi profil usaha agar hasilnya lebih tepat.";
  }
  const rows: [string, string][] = [
    ["Nama usaha", p.namaUsaha],
    ["Jenis usaha", p.jenisUsaha],
    ["Produk/jasa", p.produk],
    ["Keunggulan", p.keunggulan],
    ["Target pelanggan", p.targetPelanggan],
    ["Lokasi", p.lokasi],
    ["Tempat berjualan", p.kanalJualan],
    ["Jam operasional", p.jamOperasional],
  ];
  return rows
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `- ${k}: ${v.trim()}`)
    .join("\n");
}

export function systemPrompt(p: BusinessProfile | null): string {
  const gaya = GAYA[p?.gayaBahasa ?? "santai"] ?? GAYA.santai;
  return `Anda adalah TemanUsaha, asisten bisnis untuk pelaku UMKM di Indonesia.

Prinsip kerja:
- Selalu menjawab dalam Bahasa Indonesia yang mudah dipahami pemilik usaha kecil.
- Gaya bahasa untuk teks yang akan dibaca pelanggan: ${gaya}.
- Berikan hasil yang langsung bisa dipakai (siap salin), bukan teori panjang.
- Jangan mengarang fakta tentang usaha (harga, promo, alamat, testimoni) yang tidak ada di profil atau permintaan. Jika perlu, tulis penanda seperti [harga] agar pengguna mengisinya sendiri.
- Jangan membuat klaim kesehatan, klaim halal, atau janji keuntungan yang tidak bisa dibuktikan.
- Format jawaban dengan judul pendek dan daftar bila membantu. Jangan memakai tabel.

Profil usaha pengguna:
${profileBlock(p)}`;
}

const KONTEN_INSTRUKSI: Record<string, string> = {
  caption:
    "Buat 3 pilihan caption yang berbeda pendekatannya (misalnya: bercerita, langsung menawarkan, dan mengajak interaksi). Setiap caption punya kalimat pembuka yang menarik perhatian, isi singkat, ajakan bertindak yang jelas, dan 5–8 hashtag relevan.",
  ide:
    "Berikan 10 ide konten yang bervariasi (edukasi, di balik layar, testimoni, promo, hiburan). Untuk setiap ide tulis: judul ide, format yang cocok (foto, carousel, video pendek, status), dan satu kalimat contoh pembuka.",
  kalender:
    "Susun kalender konten 7 hari (Senin sampai Minggu). Untuk setiap hari tulis: tema, format, ide singkat, dan jam posting yang disarankan. Seimbangkan antara konten promosi dan konten yang membangun kepercayaan.",
  skrip_video:
    "Tulis 2 skrip video pendek berdurasi 15–30 detik untuk Reels/TikTok/Shorts. Setiap skrip berisi: hook 3 detik pertama, adegan per detik (apa yang direkam dan teks di layar), narasi atau suara, dan ajakan bertindak di akhir.",
  broadcast:
    "Tulis 2 versi pesan broadcast WhatsApp: versi singkat (maksimal 4 kalimat) dan versi lengkap. Buka dengan sapaan personal, tonjolkan manfaat, sertakan ajakan bertindak yang jelas, dan hindari kesan spam.",
};

const BALAS_INSTRUKSI: Record<string, string> = {
  pertanyaan: "Pelanggan mengajukan pertanyaan umum tentang produk atau layanan.",
  harga: "Pelanggan menanyakan harga. Jawab dengan menonjolkan nilai dan manfaat, lalu arahkan ke pembelian.",
  komplain:
    "Pelanggan menyampaikan keluhan. Akui perasaannya, minta maaf dengan tulus tanpa menyalahkan, tawarkan solusi konkret, dan jaga hubungan baik.",
  nego: "Pelanggan menawar harga. Tanggapi dengan ramah, pertahankan nilai produk, dan tawarkan alternatif (bonus, paket, atau ukuran lain) bila memungkinkan tanpa merugikan usaha.",
  followup:
    "Calon pembeli sudah bertanya tetapi belum membeli. Tulis pesan tindak lanjut yang sopan, tidak memaksa, dan memberi alasan kuat untuk membeli sekarang.",
};

export function userPrompt(req: AiRequest, extra?: string): string {
  switch (req.task) {
    case "konten":
      return `Tugas: ${KONTEN_INSTRUKSI[req.jenis] ?? KONTEN_INSTRUKSI.caption}

Platform: ${req.platform || "Instagram"}
Topik atau produk yang dipromosikan: ${req.topik || "produk unggulan usaha"}
Tujuan konten: ${req.tujuan || "meningkatkan penjualan"}`;

    case "balas":
      return `Situasi: ${BALAS_INSTRUKSI[req.situasi] ?? BALAS_INSTRUKSI.pertanyaan}

Pesan dari pelanggan:
"""
${req.pesan}
"""
${req.catatan ? `\nInformasi tambahan dari pemilik usaha: ${req.catatan}\n` : ""}
Tulis 3 pilihan balasan chat (pendek, sedang, dan paling ramah) yang siap disalin ke WhatsApp. Setelah itu berikan 1 tips singkat cara menangani situasi ini.`;

    case "coach":
      return `Data usaha 30 hari terakhir:
${extra || "Belum ada catatan keuangan."}

Pertanyaan pemilik usaha: ${req.pertanyaan || "Apa yang sebaiknya saya lakukan minggu ini untuk menaikkan penjualan?"}

Berperanlah sebagai mentor bisnis yang jujur dan praktis. Berikan:
1. Ringkasan kondisi usaha dalam 2–3 kalimat berdasarkan data di atas (sebutkan angka bila ada).
2. 3 langkah prioritas untuk 7 hari ke depan, masing-masing dengan alasan dan cara melakukannya.
3. 1 hal yang sebaiknya dihentikan atau dikurangi.
Jika datanya sedikit, katakan terus terang dan sarankan apa yang perlu dicatat.`;
  }
}
