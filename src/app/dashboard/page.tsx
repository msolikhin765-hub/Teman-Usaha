"use client";

import { ArrowRight, Lightbulb, Megaphone, MessageCircle, Store, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";

import { useAccount } from "@/components/AuthProvider";
import { ButtonLink, Card, cn } from "@/components/ui";
import { formatTanggal, rupiah, todayISO } from "@/lib/format";
import { ringkas, useBusinessProfile, useTransaksi } from "@/lib/hooks";

const ACTIONS = [
  { href: "/dashboard/konten", icon: Megaphone, title: "Buat konten promosi", desc: "Caption, ide, kalender, skrip video" },
  { href: "/dashboard/pelanggan", icon: MessageCircle, title: "Balas chat pelanggan", desc: "3 pilihan balasan siap kirim" },
  { href: "/dashboard/keuangan", icon: Wallet, title: "Catat transaksi", desc: "Pemasukan dan pengeluaran" },
  { href: "/dashboard/coach", icon: Lightbulb, title: "Minta saran usaha", desc: "Langkah prioritas minggu ini" },
];

function sapaan() {
  const jam = new Date().getHours();
  if (jam < 11) return "Selamat pagi";
  if (jam < 15) return "Selamat siang";
  if (jam < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function DashboardHome() {
  const { user, plan, used } = useAccount();
  const { profile, loaded, complete } = useBusinessProfile();
  const awalBulan = todayISO().slice(0, 8) + "01";
  const { items } = useTransaksi(awalBulan);
  const s = ringkas(items);
  const namaBulan = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">{sapaan()},</p>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {profile.namaUsaha || user?.displayName || "Pemilik usaha"} 👋
        </h1>
      </div>

      {loaded && !complete && (
        <Card className="fade-up flex flex-col gap-4 border-accent-300 bg-accent-50 sm:flex-row sm:items-center">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-400 text-brand-950">
            <Store className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="font-bold">Lengkapi profil usaha Anda dulu</h2>
            <p className="text-sm text-muted">Cukup 2 menit. Setelah itu, semua hasil AI disesuaikan dengan produk dan pelanggan Anda.</p>
          </div>
          <ButtonLink href="/dashboard/profil">Isi profil <ArrowRight className="h-4 w-4" /></ButtonLink>
        </Card>
      )}

      {/* Statistik */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Pemasukan", value: s.masuk, icon: TrendingUp, tone: "text-brand-700 bg-brand-50" },
          { label: "Pengeluaran", value: s.keluar, icon: TrendingDown, tone: "text-red-600 bg-red-50" },
          { label: "Laba sederhana", value: s.laba, icon: Wallet, tone: "text-accent-600 bg-accent-50" },
        ].map((x) => (
          <Card key={x.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{x.label}</span>
              <span className={cn("grid h-8 w-8 place-items-center rounded-lg", x.tone)}>
                <x.icon className="h-4 w-4" />
              </span>
            </div>
            <p className={cn("mt-2 text-2xl font-extrabold tracking-tight", x.value < 0 && "text-red-600")}>{rupiah(x.value)}</p>
            <p className="mt-1 text-xs text-muted">{namaBulan}</p>
          </Card>
        ))}
      </div>

      {/* Aksi cepat */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">Mau dibantu apa hari ini?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-brand-300 hover:shadow-md hover:shadow-brand-900/5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <a.icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-semibold">{a.title}</p>
                <p className="text-sm text-muted">{a.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Transaksi terbaru */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Transaksi terbaru</h2>
            <Link href="/dashboard/keuangan" className="text-sm font-semibold text-brand-600 hover:underline">Lihat semua</Link>
          </div>
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">Belum ada transaksi bulan ini.</p>
          ) : (
            <ul className="divide-y divide-line">
              {items.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.catatan || t.kategori}</p>
                    <p className="text-xs text-muted">{t.kategori} · {formatTanggal(t.tanggal)}</p>
                  </div>
                  <span className={cn("shrink-0 text-sm font-bold", t.tipe === "masuk" ? "text-brand-700" : "text-red-600")}>
                    {t.tipe === "masuk" ? "+" : "−"}{rupiah(t.jumlah)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Kuota */}
        <Card className="bg-brand-950 text-white">
          <p className="text-sm text-brand-100/80">Paket aktif</p>
          <p className="mt-1 text-2xl font-extrabold">{plan.name}</p>
          <div className="mt-5 flex items-end justify-between text-sm">
            <span className="text-brand-100/80">Permintaan AI bulan ini</span>
            <span className="font-bold">{used} / {plan.aiQuota.toLocaleString("id-ID")}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-accent-400" style={{ width: `${Math.min(100, (used / plan.aiQuota) * 100)}%` }} />
          </div>
          {plan.id !== "business" && (
            <ButtonLink href="/dashboard/paket" variant="accent" className="mt-6 w-full">Upgrade paket</ButtonLink>
          )}
        </Card>
      </div>
    </div>
  );
}
