"use client";

import { CircleCheck, MessageCircle } from "lucide-react";

import { useAccount } from "@/components/AuthProvider";
import { Card, PageHeader, cn } from "@/components/ui";
import { rupiah, waLink } from "@/lib/format";
import { PLANS } from "@/lib/plans";

export default function PaketPage() {
  const { user, plan, used } = useAccount();
  const pct = Math.min(100, (used / plan.aiQuota) * 100);
  const sisa = Math.max(0, plan.aiQuota - used);

  return (
    <div>
      <PageHeader title="Paket & Kuota" desc="Kuota AI diperbarui otomatis setiap tanggal 1." />

      <Card className="mb-8 grid gap-6 sm:grid-cols-[1fr_1.5fr] sm:items-center">
        <div>
          <p className="text-sm text-muted">Paket aktif</p>
          <p className="text-3xl font-extrabold tracking-tight">{plan.name}</p>
          <p className="text-sm text-muted">{plan.price ? `${rupiah(plan.price)}/bulan` : "Gratis selamanya"}</p>
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Permintaan AI bulan ini</span>
            <span className="font-bold">
              {used} / {plan.aiQuota.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-canvas">
            <div className={cn("h-full rounded-full", pct >= 90 ? "bg-accent-500" : "bg-brand-500")} style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted">Sisa {sisa.toLocaleString("id-ID")} permintaan.</p>
        </div>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => {
          const aktif = p.id === plan.id;
          const pesan = `Halo admin TemanUsaha, saya ingin upgrade ke paket ${p.name} (${rupiah(p.price)}/bulan).\nEmail akun: ${user?.email ?? "-"}`;
          return (
            <div
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-5",
                aktif ? "border-brand-600 ring-4 ring-brand-100" : p.highlight ? "border-accent-300" : "border-line"
              )}
            >
              {p.highlight && !aktif && (
                <span className="absolute -top-3 left-5 rounded-full bg-accent-400 px-2.5 py-0.5 text-[11px] font-bold text-brand-950">Paling populer</span>
              )}
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-xs text-muted">{p.tagline}</p>
              <p className="mt-3 text-2xl font-extrabold">
                {p.price ? rupiah(p.price) : "Rp0"}
                <span className="text-sm font-normal text-muted">/bulan</span>
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> {f}
                  </li>
                ))}
              </ul>
              {aktif ? (
                <span className="mt-5 rounded-xl bg-brand-50 py-2.5 text-center text-sm font-semibold text-brand-700">Paket Anda saat ini</span>
              ) : p.price === 0 ? (
                <span className="mt-5 py-2.5 text-center text-sm text-muted">—</span>
              ) : (
                <a
                  href={waLink(pesan)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  <MessageCircle className="h-4 w-4" /> Pilih {p.name}
                </a>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Pembayaran dikonfirmasi melalui WhatsApp admin. Paket aktif setelah pembayaran diverifikasi, biasanya kurang dari 1×24 jam.
      </p>
    </div>
  );
}
