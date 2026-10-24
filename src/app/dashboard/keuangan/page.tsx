"use client";

import { addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Download, Plus, Trash, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { useAccount } from "@/components/AuthProvider";
import { Alert, Button, Card, Field, Input, PageHeader, Select, cn } from "@/components/ui";
import { db } from "@/lib/firebase";
import { formatTanggal, rupiah, todayISO } from "@/lib/format";
import { ringkas, useTransaksi } from "@/lib/hooks";
import type { Transaksi } from "@/lib/types";

const KATEGORI = {
  masuk: ["Penjualan", "Pesanan khusus", "Jasa", "Modal masuk", "Lainnya"],
  keluar: ["Bahan baku", "Kemasan", "Gaji", "Sewa tempat", "Listrik & air", "Transportasi", "Promosi/iklan", "Peralatan", "Lainnya"],
};

/** Daftar 12 bulan terakhir dalam format YYYY-MM. */
function daftarBulan(): { value: string; label: string }[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { value, label: d.toLocaleDateString("id-ID", { month: "long", year: "numeric" }) };
  });
}

function unduhCSV(items: Transaksi[], bulan: string) {
  const header = "Tanggal,Tipe,Kategori,Catatan,Jumlah";
  const rows = items.map((t) =>
    [t.tanggal, t.tipe === "masuk" ? "Pemasukan" : "Pengeluaran", t.kategori, `"${(t.catatan || "").replace(/"/g, '""')}"`, t.jumlah].join(",")
  );
  const blob = new Blob(["﻿" + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `keuangan-${bulan}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function KeuanganPage() {
  const { user } = useAccount();
  const bulanList = useMemo(daftarBulan, []);
  const [bulan, setBulan] = useState(bulanList[0].value);
  const { items, loaded } = useTransaksi(`${bulan}-01`, `${bulan}-31`);
  const s = ringkas(items);

  const [tipe, setTipe] = useState<"masuk" | "keluar">("masuk");
  const [jumlah, setJumlah] = useState("");
  const [kategori, setKategori] = useState(KATEGORI.masuk[0]);
  const [catatan, setCatatan] = useState("");
  const [tanggal, setTanggal] = useState(todayISO());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const perKategori = useMemo(() => {
    const m: Record<string, number> = {};
    items.filter((t) => t.tipe === "keluar").forEach((t) => (m[t.kategori] = (m[t.kategori] || 0) + t.jumlah));
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [items]);

  function gantiTipe(t: "masuk" | "keluar") {
    setTipe(t);
    setKategori(KATEGORI[t][0]);
  }

  async function simpan(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    const angka = Number(jumlah.replace(/\D/g, ""));
    if (!angka || angka <= 0) {
      setError("Masukkan jumlah yang benar.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db(), "users", user.uid, "transaksi"), {
        tipe,
        jumlah: angka,
        kategori,
        catatan: catatan.trim().slice(0, 120),
        tanggal,
        createdAt: serverTimestamp(),
      });
      setJumlah("");
      setCatatan("");
      if (!tanggal.startsWith(bulan)) setBulan(tanggal.slice(0, 7));
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan transaksi. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function hapus(id: string) {
    if (!user || !confirm("Hapus transaksi ini?")) return;
    await deleteDoc(doc(db(), "users", user.uid, "transaksi", id));
  }

  const maxKategori = perKategori[0]?.[1] ?? 0;

  return (
    <div>
      <PageHeader title="Keuangan" desc="Catat pemasukan dan pengeluaran agar laba usaha terlihat jelas.">
        <div className="flex gap-2">
          <Select value={bulan} onChange={(e) => setBulan(e.target.value)} className="w-auto">
            {bulanList.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </Select>
          <Button variant="secondary" onClick={() => unduhCSV(items, bulan)} disabled={!items.length} title="Unduh CSV">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Unduh</span>
          </Button>
        </div>
      </PageHeader>

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
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          {/* Form */}
          <Card>
            <h2 className="mb-4 font-bold">Catat transaksi</h2>
            <form onSubmit={simpan} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-canvas p-1">
                {(["masuk", "keluar"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => gantiTipe(t)}
                    className={cn(
                      "rounded-lg py-2 text-sm font-semibold transition",
                      tipe === t ? (t === "masuk" ? "bg-brand-600 text-white shadow-sm" : "bg-red-600 text-white shadow-sm") : "text-muted"
                    )}
                  >
                    {t === "masuk" ? "Pemasukan" : "Pengeluaran"}
                  </button>
                ))}
              </div>
              <Field label="Jumlah (Rp)">
                <Input
                  inputMode="numeric"
                  required
                  value={jumlah ? Number(jumlah.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                  onChange={(e) => setJumlah(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  placeholder="0"
                  className="text-lg font-bold"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Kategori">
                  <Select value={kategori} onChange={(e) => setKategori(e.target.value)}>
                    {KATEGORI[tipe].map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Tanggal">
                  <Input type="date" required value={tanggal} max={todayISO()} onChange={(e) => setTanggal(e.target.value)} />
                </Field>
              </div>
              <Field label="Catatan">
                <Input value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Contoh: 20 bungkus keripik pedas" maxLength={120} />
              </Field>
              {error && <Alert>{error}</Alert>}
              <Button type="submit" loading={saving} className="w-full">
                <Plus className="h-4 w-4" /> Simpan transaksi
              </Button>
            </form>
          </Card>

          {/* Pengeluaran per kategori */}
          <Card>
            <h2 className="mb-4 font-bold">Pengeluaran per kategori</h2>
            {perKategori.length === 0 ? (
              <p className="text-sm text-muted">Belum ada pengeluaran di bulan ini.</p>
            ) : (
              <ul className="space-y-3">
                {perKategori.map(([k, v]) => (
                  <li key={k}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{k}</span>
                      <span className="font-semibold">{rupiah(v)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-canvas">
                      <div className="h-full rounded-full bg-red-400" style={{ width: `${(v / maxKategori) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Daftar transaksi */}
        <Card className="h-fit">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold">Daftar transaksi</h2>
            <span className="text-sm text-muted">{items.length} transaksi</span>
          </div>
          {!loaded ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-canvas" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">Belum ada transaksi di bulan ini.</p>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((t) => (
                <li key={t.id} className="group flex items-center gap-3 py-3">
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                      t.tipe === "masuk" ? "bg-brand-50 text-brand-600" : "bg-red-50 text-red-600"
                    )}
                  >
                    {t.tipe === "masuk" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.catatan || t.kategori}</p>
                    <p className="text-xs text-muted">{t.kategori} · {formatTanggal(t.tanggal)}</p>
                  </div>
                  <span className={cn("shrink-0 text-sm font-bold", t.tipe === "masuk" ? "text-brand-700" : "text-red-600")}>
                    {t.tipe === "masuk" ? "+" : "−"}{rupiah(t.jumlah)}
                  </span>
                  <button
                    onClick={() => hapus(t.id)}
                    className="rounded-lg p-1.5 text-muted opacity-60 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                    aria-label="Hapus transaksi"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
