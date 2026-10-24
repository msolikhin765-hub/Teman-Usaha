export type GayaBahasa = "santai" | "sopan" | "profesional";

export type BusinessProfile = {
  namaUsaha: string;
  jenisUsaha: string;
  produk: string;
  keunggulan: string;
  targetPelanggan: string;
  lokasi: string;
  kanalJualan: string;
  jamOperasional: string;
  gayaBahasa: GayaBahasa;
};

export const EMPTY_PROFILE: BusinessProfile = {
  namaUsaha: "",
  jenisUsaha: "",
  produk: "",
  keunggulan: "",
  targetPelanggan: "",
  lokasi: "",
  kanalJualan: "",
  jamOperasional: "",
  gayaBahasa: "santai",
};

export type KontenJenis = "caption" | "ide" | "kalender" | "skrip_video" | "broadcast";

export type BalasSituasi = "pertanyaan" | "harga" | "komplain" | "nego" | "followup";

export type AiRequest =
  | {
      task: "konten";
      jenis: KontenJenis;
      topik: string;
      platform: string;
      tujuan: string;
    }
  | {
      task: "balas";
      situasi: BalasSituasi;
      pesan: string;
      catatan: string;
    }
  | {
      task: "coach";
      pertanyaan: string;
    };

export type AiResponse =
  | { ok: true; text: string; usage: { used: number; quota: number } }
  | { ok: false; error: string; code?: string };

export type Transaksi = {
  id: string;
  tipe: "masuk" | "keluar";
  jumlah: number;
  kategori: string;
  catatan: string;
  tanggal: string; // YYYY-MM-DD
};
