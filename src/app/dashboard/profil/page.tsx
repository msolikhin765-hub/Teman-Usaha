"use client";

import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useState, type FormEvent } from "react";

import { useAccount } from "@/components/AuthProvider";
import { Alert, Button, Card, ChipGroup, Field, Input, PageHeader, Select, Textarea } from "@/components/ui";
import { db } from "@/lib/firebase";
import { useBusinessProfile } from "@/lib/hooks";
import type { BusinessProfile, GayaBahasa } from "@/lib/types";

const JENIS = [
  "Makanan & minuman",
  "Fashion & aksesori",
  "Toko online / reseller",
  "Kerajinan & produk lokal",
  "Kecantikan & perawatan",
  "Jasa (servis, laundry, dll.)",
  "Pendidikan & kursus",
  "Pertanian & peternakan",
  "Toko kelontong / sembako",
  "Lainnya",
];

export default function ProfilPage() {
  const { user } = useAccount();
  const { profile, setProfile, loaded } = useBusinessProfile();
  const [namaPemilik, setNamaPemilik] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"" | "ok" | "error">("");

  const set = <K extends keyof BusinessProfile>(k: K, v: BusinessProfile[K]) => setProfile((p) => ({ ...p, [k]: v }));

  async function simpan(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setStatus("");
    try {
      await setDoc(doc(db(), "businesses", user.uid), { ...profile, updatedAt: serverTimestamp() });
      if (namaPemilik.trim() && namaPemilik.trim() !== user.displayName) {
        await updateProfile(user, { displayName: namaPemilik.trim() });
        await updateDoc(doc(db(), "users", user.uid), { nama: namaPemilik.trim() });
      }
      setStatus("ok");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) return <div className="h-64 animate-pulse rounded-2xl bg-white" />;

  return (
    <div>
      <PageHeader
        title="Profil Usaha"
        desc="Informasi ini dipakai AI agar konten, balasan, dan saran sesuai dengan usaha Anda. Semakin lengkap, semakin tepat hasilnya."
      />

      <form onSubmit={simpan} className="space-y-5">
        <Card className="space-y-5">
          <h2 className="font-bold">Data dasar</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama pemilik">
              <Input value={namaPemilik} onChange={(e) => setNamaPemilik(e.target.value)} placeholder="Nama Anda" />
            </Field>
            <Field label="Nama usaha *">
              <Input required value={profile.namaUsaha} onChange={(e) => set("namaUsaha", e.target.value)} placeholder="Contoh: Keripik Bu Siti" maxLength={80} />
            </Field>
            <Field label="Jenis usaha *">
              <Select required value={profile.jenisUsaha} onChange={(e) => set("jenisUsaha", e.target.value)}>
                <option value="">Pilih jenis usaha</option>
                {JENIS.map((j) => (
                  <option key={j}>{j}</option>
                ))}
              </Select>
            </Field>
            <Field label="Lokasi">
              <Input value={profile.lokasi} onChange={(e) => set("lokasi", e.target.value)} placeholder="Contoh: Bandar Lampung" maxLength={80} />
            </Field>
          </div>
        </Card>

        <Card className="space-y-5">
          <h2 className="font-bold">Produk dan pelanggan</h2>
          <Field label="Produk atau jasa utama *" hint="Sebutkan produk andalan, varian, dan kisaran harga jika ada.">
            <Textarea
              required
              value={profile.produk}
              onChange={(e) => set("produk", e.target.value)}
              placeholder="Contoh: Keripik singkong pedas, balado, dan original. Rp15.000 per bungkus 200 gram."
              maxLength={600}
            />
          </Field>
          <Field label="Keunggulan usaha" hint="Apa yang membuat pelanggan memilih Anda?">
            <Textarea
              rows={3}
              value={profile.keunggulan}
              onChange={(e) => set("keunggulan", e.target.value)}
              placeholder="Contoh: Tanpa pengawet, digoreng setiap pagi, resep keluarga sejak 2010."
              maxLength={400}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Target pelanggan">
              <Input value={profile.targetPelanggan} onChange={(e) => set("targetPelanggan", e.target.value)} placeholder="Contoh: Ibu rumah tangga, mahasiswa" maxLength={150} />
            </Field>
            <Field label="Tempat berjualan">
              <Input value={profile.kanalJualan} onChange={(e) => set("kanalJualan", e.target.value)} placeholder="Contoh: WhatsApp, Instagram, Shopee" maxLength={150} />
            </Field>
            <Field label="Jam operasional">
              <Input value={profile.jamOperasional} onChange={(e) => set("jamOperasional", e.target.value)} placeholder="Contoh: Setiap hari 08.00–20.00" maxLength={100} />
            </Field>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <h2 className="font-bold">Gaya bahasa ke pelanggan</h2>
            <p className="text-sm text-muted">Dipakai untuk caption dan balasan chat.</p>
          </div>
          <ChipGroup<GayaBahasa>
            value={profile.gayaBahasa}
            onChange={(v) => set("gayaBahasa", v)}
            options={[
              { value: "santai", label: "Santai & akrab" },
              { value: "sopan", label: "Sopan & ramah" },
              { value: "profesional", label: "Profesional" },
            ]}
          />
        </Card>

        {status === "ok" && <Alert tone="success">Profil usaha tersimpan. Hasil AI berikutnya akan memakai data ini.</Alert>}
        {status === "error" && <Alert>Gagal menyimpan. Periksa koneksi internet lalu coba lagi.</Alert>}

        <div className="flex justify-end">
          <Button type="submit" loading={saving} className="px-6">Simpan profil</Button>
        </div>
      </form>
    </div>
  );
}
