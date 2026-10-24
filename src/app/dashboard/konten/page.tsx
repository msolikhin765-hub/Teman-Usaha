"use client";

import { Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";

import { useAccount } from "@/components/AuthProvider";
import { Riwayat } from "@/components/Riwayat";
import { Button, Card, ResultPanel, ChipGroup, Field, PageHeader, Select, Textarea } from "@/components/ui";
import { AiError, useAi } from "@/components/useAi";
import type { KontenJenis } from "@/lib/types";

const JENIS: { value: KontenJenis; label: string; paid?: boolean }[] = [
  { value: "caption", label: "Caption" },
  { value: "ide", label: "10 Ide konten" },
  { value: "broadcast", label: "Broadcast WA" },
  { value: "kalender", label: "Kalender 7 hari", paid: true },
  { value: "skrip_video", label: "Skrip video pendek", paid: true },
];

const LABELS = Object.fromEntries(JENIS.map((j) => [j.value, j.label]));

const TUJUAN = ["Menaikkan penjualan", "Mengenalkan produk baru", "Promo atau diskon", "Membangun kepercayaan", "Mengajak interaksi"];

export default function KontenPage() {
  const { plan } = useAccount();
  const [jenis, setJenis] = useState<KontenJenis>("caption");
  const [platform, setPlatform] = useState("Instagram");
  const [topik, setTopik] = useState("");
  const [tujuan, setTujuan] = useState(TUJUAN[0]);
  const { text, loading, error, run } = useAi();

  const showPlatform = jenis !== "broadcast";

  function submit(e: FormEvent) {
    e.preventDefault();
    run({ task: "konten", jenis, platform: jenis === "broadcast" ? "WhatsApp" : platform, topik, tujuan });
  }

  return (
    <div>
      <PageHeader title="AI Konten" desc="Buat materi promosi yang sesuai dengan usaha Anda dalam hitungan detik." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <Card>
            <form onSubmit={submit} className="space-y-5">
              <Field label="Mau buat apa?">
                <ChipGroup
                  value={jenis}
                  onChange={setJenis}
                  options={JENIS.map((j) => ({
                    value: j.value,
                    label: j.label,
                    badge: j.paid && plan.id === "gratis" ? "Basic" : undefined,
                  }))}
                />
              </Field>

              {showPlatform && (
                <Field label="Untuk platform">
                  <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    {["Instagram", "TikTok", "Facebook", "Status WhatsApp", "YouTube Shorts", "Shopee / Tokopedia"].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </Select>
                </Field>
              )}

              <Field label="Produk atau topik" hint="Boleh dikosongkan. AI akan memakai produk dari profil usaha.">
                <Textarea
                  rows={3}
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                  placeholder="Contoh: Keripik rasa baru jagung bakar, promo beli 3 gratis 1 sampai akhir bulan"
                  maxLength={500}
                />
              </Field>

              <Field label="Tujuan">
                <Select value={tujuan} onChange={(e) => setTujuan(e.target.value)}>
                  {TUJUAN.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>

              <AiError error={error} />

              <Button type="submit" loading={loading} className="w-full py-3">
                <Sparkles className="h-4 w-4" /> {loading ? "Sedang membuat…" : "Buat dengan AI"}
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <ResultPanel text={text} loading={loading} icon={<Sparkles className="h-5 w-5" />} hint="Pilih jenis konten, lalu klik “Buat dengan AI”." />
        </div>
      </div>

      <div className="mt-6">
        <Riwayat task="konten" labels={LABELS} />
      </div>
    </div>
  );
}
