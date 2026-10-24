export type PlanId = "gratis" | "basic" | "pro" | "business";

export type Plan = {
  id: PlanId;
  name: string;
  price: number; // rupiah per bulan
  aiQuota: number; // jumlah permintaan AI per bulan
  tagline: string;
  features: string[];
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "gratis",
    name: "Gratis",
    price: 0,
    aiQuota: 20,
    tagline: "Untuk mencoba",
    features: [
      "20 permintaan AI per bulan",
      "AI Konten & AI Balas Pelanggan",
      "Catatan keuangan dasar",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: 49000,
    aiQuota: 150,
    tagline: "Untuk promosi rutin",
    features: [
      "150 permintaan AI per bulan",
      "Semua fitur Gratis",
      "Kalender konten & skrip video",
      "Riwayat hasil AI",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 99000,
    aiQuota: 500,
    tagline: "Paling banyak dipilih",
    highlight: true,
    features: [
      "500 permintaan AI per bulan",
      "Semua fitur Basic",
      "AI Coach berbasis data usaha",
      "Laporan keuangan bulanan",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 199000,
    aiQuota: 2000,
    tagline: "Untuk usaha yang berkembang",
    features: [
      "2.000 permintaan AI per bulan",
      "Semua fitur Pro",
      "Prioritas dukungan via WhatsApp",
      "Pendampingan bulanan",
    ],
  },
];

export function getPlan(id: string | undefined | null): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

/** Periode kuota dalam format YYYY-MM (zona waktu WIB). */
export function currentPeriod(date = new Date()): string {
  const wib = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return wib.toISOString().slice(0, 7);
}
