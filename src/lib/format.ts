export function rupiah(n: number): string {
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

export function todayISO(): string {
  const wib = new Date(Date.now() + 7 * 60 * 60 * 1000);
  return wib.toISOString().slice(0, 10);
}

export function formatTanggal(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/** Nomor WhatsApp admin untuk upgrade paket (format 62xxxx). */
export const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "";

export function waLink(text: string): string {
  const base = ADMIN_WA ? `https://wa.me/${ADMIN_WA}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}
