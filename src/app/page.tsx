import {
  ArrowRight,
  Bot,
  CircleCheck,
  Clock,
  Lightbulb,
  Megaphone,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { ButtonLink, Logo } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PLANS } from "@/lib/plans";
import { rupiah } from "@/lib/format";

const FEATURES = [
  {
    icon: Megaphone,
    title: "AI Konten Promosi",
    desc: "Caption, ide konten, kalender 7 hari, skrip video pendek, dan pesan broadcast WhatsApp dalam hitungan detik.",
  },
  {
    icon: MessageCircle,
    title: "AI Balas Pelanggan",
    desc: "Tempel chat pelanggan, dapatkan 3 pilihan balasan untuk pertanyaan, tawar-menawar, komplain, hingga follow-up.",
  },
  {
    icon: Wallet,
    title: "Catatan Keuangan",
    desc: "Catat pemasukan dan pengeluaran dari HP. Laba bulan ini langsung terlihat tanpa rumus rumit.",
  },
  {
    icon: Lightbulb,
    title: "AI Coach Usaha",
    desc: "Saran langkah prioritas mingguan berdasarkan profil dan data keuangan usaha Anda sendiri.",
  },
];

const PROBLEMS = [
  { icon: Clock, text: "Habis waktu memikirkan konten setiap hari" },
  { icon: Users, text: "Kewalahan membalas chat pelanggan" },
  { icon: Wallet, text: "Tidak tahu untung atau rugi bulan ini" },
  { icon: TrendingUp, text: "Bingung langkah apa agar usaha berkembang" },
];

const FAQ = [
  {
    q: "Apakah saya perlu paham teknologi?",
    a: "Tidak. Cukup isi profil usaha sekali, lalu pilih apa yang ingin dibuat. Semua menu memakai Bahasa Indonesia sehari-hari dan nyaman dipakai dari HP.",
  },
  {
    q: "Apakah cocok untuk semua jenis usaha?",
    a: "Ya. Warung makan, toko online, reseller, jasa, kerajinan, hingga usaha pertanian. AI menyesuaikan jawaban dengan profil usaha yang Anda isi.",
  },
  {
    q: "Apakah data usaha saya aman?",
    a: "Data disimpan di Google Firebase dan hanya bisa diakses oleh akun Anda sendiri. Kami tidak menjual data pengguna.",
  },
  {
    q: "Bagaimana cara upgrade paket?",
    a: "Pilih paket di menu Paket, lalu konfirmasi pembayaran melalui WhatsApp admin. Paket aktif setelah pembayaran diverifikasi.",
  },
  {
    q: "Apakah hasil AI selalu benar?",
    a: "AI membantu membuat draf dengan cepat, tetapi tetap periksa harga, promo, dan informasi penting sebelum dikirim ke pelanggan.",
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="TemanUsaha">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
            <a href="#fitur" className="hover:text-ink">Fitur</a>
            <a href="#cara" className="hover:text-ink">Cara kerja</a>
            <a href="#harga" className="hover:text-ink">Harga</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <ButtonLink href="/masuk" variant="ghost" className="hidden sm:inline-flex">Masuk</ButtonLink>
            <ButtonLink href="/daftar">Coba gratis</ButtonLink>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-500/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-brand-100">
              <Sparkles className="h-3.5 w-3.5 text-accent-300" /> Asisten AI untuk UMKM Indonesia
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Urus promosi, pelanggan, dan keuangan usaha{" "}
              <span className="text-accent-300">dalam satu tempat.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100/90 sm:text-lg">
              TemanUsaha membantu pemilik usaha membuat konten, membalas chat pelanggan, mencatat keuangan,
              dan mendapat saran bisnis. Hemat waktu, fokus melayani pelanggan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/daftar" variant="accent" className="px-6 py-3 text-base">
                Mulai gratis <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <a
                href="#fitur"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
              >
                Lihat fitur
              </a>
            </div>
            <p className="mt-4 text-sm text-brand-100/70">Tanpa kartu kredit. 20 permintaan AI gratis setiap bulan.</p>
          </div>

          {/* Pratinjau produk */}
          <div className="fade-up relative" style={{ animationDelay: "120ms" }}>
            <div className="rounded-2xl border border-white/10 bg-white p-4 text-ink shadow-2xl shadow-black/30 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-bold">AI Balas Pelanggan</span>
                </div>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">Tawar-menawar</span>
              </div>
              <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-canvas px-3.5 py-2.5 text-sm">
                Kak, keripiknya bisa kurang nggak kalau ambil 5 bungkus?
              </div>
              <div className="mt-3 flex items-start gap-2">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                  <Bot className="h-3.5 w-3.5" />
                </span>
                <div className="rounded-2xl rounded-tl-sm border border-brand-100 bg-brand-50 px-3.5 py-2.5 text-sm leading-relaxed">
                  Wah, terima kasih sudah mau borong, Kak! Untuk 5 bungkus, harganya memang sudah harga terbaik.
                  Tapi kami kasih <b>bonus 1 bungkus rasa baru</b> supaya Kakak bisa coba. Mau langsung kami siapkan? 😊
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
                {[
                  { k: "Pemasukan", v: "Rp4,2 jt", c: "text-brand-700" },
                  { k: "Pengeluaran", v: "Rp2,6 jt", c: "text-ink" },
                  { k: "Laba", v: "Rp1,6 jt", c: "text-accent-600" },
                ].map((s) => (
                  <div key={s.k} className="rounded-xl bg-canvas px-3 py-2">
                    <div className="text-[11px] text-muted">{s.k}</div>
                    <div className={cn("text-sm font-bold", s.c)}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden rounded-xl border border-line bg-white px-4 py-3 text-ink shadow-xl sm:block">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Megaphone className="h-4 w-4 text-accent-500" /> 3 caption siap posting
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MASALAH */}
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="mb-5 text-center text-sm font-semibold text-muted">Masalah yang sering dialami pemilik usaha</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMS.map((p) => (
              <div key={p.text} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium">
                <p.icon className="h-5 w-5 shrink-0 text-accent-500" />
                {p.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Fitur</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Empat asisten, satu aplikasi</h2>
          <p className="mt-3 text-muted">
            Setiap fitur memakai profil usaha Anda, sehingga hasilnya terasa seperti ditulis oleh orang yang paham usaha Anda.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="group rounded-2xl border border-line bg-white p-6 transition hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-line">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cara" className="scroll-mt-20 bg-brand-50/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Cara kerja</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Siap dipakai dalam 3 langkah</h2>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { t: "Daftar gratis", d: "Buat akun dengan email atau akun Google. Tidak perlu kartu kredit." },
              { t: "Isi profil usaha", d: "Ceritakan produk, keunggulan, dan pelanggan Anda. Cukup sekali." },
              { t: "Minta bantuan AI", d: "Pilih kebutuhan: konten, balas chat, atau saran usaha. Salin dan pakai." },
            ].map((s, i) => (
              <li key={s.t} className="relative rounded-2xl bg-white p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-sm font-extrabold text-white">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* HARGA */}
      <section id="harga" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Harga</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Mulai gratis, upgrade saat butuh</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Harga per bulan. Bisa berhenti kapan saja.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6",
                p.highlight ? "border-brand-600 bg-brand-950 text-white shadow-xl shadow-brand-900/20" : "border-line bg-white"
              )}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-accent-400 px-3 py-0.5 text-xs font-bold text-brand-950">
                  Paling populer
                </span>
              )}
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className={cn("text-sm", p.highlight ? "text-brand-100/80" : "text-muted")}>{p.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{p.price === 0 ? "Rp0" : rupiah(p.price)}</span>
                <span className={cn("text-sm", p.highlight ? "text-brand-100/70" : "text-muted")}>/bulan</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CircleCheck className={cn("mt-0.5 h-4 w-4 shrink-0", p.highlight ? "text-accent-300" : "text-brand-500")} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/daftar" variant={p.highlight ? "accent" : "secondary"} className="mt-6 w-full">
                {p.price === 0 ? "Daftar gratis" : `Pilih ${p.name}`}
              </ButtonLink>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">Pertanyaan yang sering diajukan</h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-xl border border-line bg-white px-5 py-4 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="text-xl leading-none text-brand-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-12 text-center text-white sm:px-12">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">Biar AI yang bantu, Anda fokus jualan.</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-brand-50/90">Daftar hari ini dan buat konten promosi pertama Anda dalam 2 menit.</p>
          <ButtonLink href="/daftar" variant="accent" className="relative mt-8 px-6 py-3 text-base">
            Coba TemanUsaha gratis <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
          <Logo />
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-brand-500" /> Data usaha Anda hanya bisa diakses oleh akun Anda.
          </p>
          <p>© {new Date().getFullYear()} TemanUsaha</p>
        </div>
      </footer>
    </div>
  );
}
