"use client";

import { Lightbulb, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";

import { useAccount } from "@/components/AuthProvider";
import { Riwayat } from "@/components/Riwayat";
import { Button, ButtonLink, Card, Field, PageHeader, ResultPanel, Textarea } from "@/components/ui";
import { AiError, useAi } from "@/components/useAi";

const SARAN = [
  "Apa yang sebaiknya saya lakukan minggu ini untuk menaikkan penjualan?",
  "Bagaimana cara mendapatkan pelanggan baru tanpa biaya iklan besar?",
  "Pengeluaran mana yang sebaiknya saya kurangi?",
  "Bagaimana cara membuat pelanggan lama membeli lagi?",
];

export default function CoachPage() {
  const { plan } = useAccount();
  const [pertanyaan, setPertanyaan] = useState("");
  const { text, loading, error, run } = useAi();
  const locked = plan.id === "gratis" || plan.id === "basic";

  function submit(e: FormEvent) {
    e.preventDefault();
    run({ task: "coach", pertanyaan });
  }

  return (
    <div>
      <PageHeader
        title="AI Coach Usaha"
        desc="Saran langkah prioritas berdasarkan profil usaha dan catatan keuangan 30 hari terakhir."
      />

      {locked ? (
        <Card className="mx-auto max-w-xl text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-accent-100 text-accent-600">
            <Lock className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-lg font-bold">AI Coach tersedia di paket Pro</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            AI Coach membaca data penjualan dan pengeluaran Anda, lalu memberi 3 langkah prioritas setiap minggu, seperti punya mentor bisnis pribadi.
          </p>
          <ButtonLink href="/dashboard/paket" variant="accent" className="mt-6">Upgrade ke Pro</ButtonLink>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <Card>
            <form onSubmit={submit} className="space-y-5">
              <Field label="Apa yang ingin Anda tanyakan?" hint="Boleh dikosongkan untuk mendapat saran umum minggu ini.">
                <Textarea rows={4} value={pertanyaan} onChange={(e) => setPertanyaan(e.target.value)} placeholder={SARAN[0]} maxLength={1000} />
              </Field>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Contoh pertanyaan</p>
                <div className="flex flex-col gap-2">
                  {SARAN.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setPertanyaan(s)}
                      className="rounded-xl border border-line px-3 py-2 text-left text-sm hover:border-brand-300 hover:bg-brand-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <AiError error={error} />

              <Button type="submit" loading={loading} className="w-full py-3">
                <Lightbulb className="h-4 w-4" /> {loading ? "Menganalisis usaha…" : "Minta saran"}
              </Button>
              <p className="text-xs text-muted">Tips: catat transaksi secara rutin di menu Keuangan agar saran AI semakin tepat.</p>
            </form>
          </Card>

          <ResultPanel text={text} loading={loading} icon={<Lightbulb className="h-5 w-5" />} hint="Tulis pertanyaan atau pilih contoh, lalu klik “Minta saran”." />
        </div>
      )}

      {!locked && (
        <div className="mt-6">
          <Riwayat task="coach" labels={{ coach: "Coach" }} />
        </div>
      )}
    </div>
  );
}
