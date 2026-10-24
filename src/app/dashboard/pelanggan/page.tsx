"use client";

import { MessageCircle, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Riwayat } from "@/components/Riwayat";
import { Button, Card, ChipGroup, Field, Input, PageHeader, ResultPanel, Textarea } from "@/components/ui";
import { AiError, useAi } from "@/components/useAi";
import type { BalasSituasi } from "@/lib/types";

const SITUASI: { value: BalasSituasi; label: string; contoh: string }[] = [
  { value: "pertanyaan", label: "Pertanyaan", contoh: "Kak, ini bisa dikirim ke luar kota nggak?" },
  { value: "harga", label: "Tanya harga", contoh: "Berapa harganya kak? Ada yang ukuran kecil?" },
  { value: "nego", label: "Tawar-menawar", contoh: "Bisa kurang nggak kak kalau ambil 5?" },
  { value: "komplain", label: "Komplain", contoh: "Kak, pesanan saya sudah 3 hari belum sampai, gimana ini?" },
  { value: "followup", label: "Follow-up", contoh: "(Pelanggan kemarin tanya harga paket hampers tapi belum balas lagi)" },
];

const LABELS = Object.fromEntries(SITUASI.map((s) => [s.value, s.label]));

export default function PelangganPage() {
  const [situasi, setSituasi] = useState<BalasSituasi>("pertanyaan");
  const [pesan, setPesan] = useState("");
  const [catatan, setCatatan] = useState("");
  const { text, loading, error, run } = useAi();

  const contoh = SITUASI.find((s) => s.value === situasi)?.contoh ?? "";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!pesan.trim()) return;
    run({ task: "balas", situasi, pesan, catatan });
  }

  return (
    <div>
      <PageHeader
        title="AI Balas Pelanggan"
        desc="Tempel pesan dari pelanggan, lalu dapatkan 3 pilihan balasan yang ramah dan menjual."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <Card>
          <form onSubmit={submit} className="space-y-5">
            <Field label="Situasinya">
              <ChipGroup value={situasi} onChange={setSituasi} options={SITUASI} />
            </Field>

            <Field label={situasi === "followup" ? "Ceritakan percakapan sebelumnya *" : "Pesan dari pelanggan *"}>
              <Textarea
                required
                rows={5}
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder={contoh}
                maxLength={2000}
              />
            </Field>

            <Field label="Info tambahan untuk AI" hint="Opsional. Contoh: harga, stok, ongkir, atau batas diskon yang boleh diberikan.">
              <Input
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: Diskon maksimal 10%, ongkir ke luar kota mulai Rp20.000"
                maxLength={500}
              />
            </Field>

            <AiError error={error} />

            <Button type="submit" loading={loading} className="w-full py-3" disabled={!pesan.trim()}>
              <Send className="h-4 w-4" /> {loading ? "Menyiapkan balasan…" : "Buat balasan"}
            </Button>
          </form>
        </Card>

        <ResultPanel text={text} loading={loading} icon={<MessageCircle className="h-5 w-5" />} hint="Tempel pesan pelanggan, lalu klik “Buat balasan”." />
      </div>

      <div className="mt-6">
        <Riwayat task="balas" labels={LABELS} />
      </div>
    </div>
  );
}
