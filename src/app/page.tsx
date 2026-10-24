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
        <style>{`
          @keyframes tu-float-a { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-12px) rotate(-4deg); } }
          @keyframes tu-float-b { 0%,100% { transform: translateY(0) rotate(3deg); } 50% { transform: translateY(10px) rotate(3deg); } }
          @keyframes tu-float-c { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes tu-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes tu-type { from { width: 0; } to { width: 100%; } }
          .tu-float-a { animation: tu-float-a 6s ease-in-out infinite; }
          .tu-float-b { animation: tu-float-b 7s ease-in-out infinite; }
          .tu-float-c { animation: tu-float-c 5s ease-in-out infinite; }
          .tu-marquee { animation: tu-marquee 40s linear infinite; }
          @media (prefers-reduced-motion: reduce) {
            .tu-float-a, .tu-float-b, .tu-float-c, .tu-marquee { animation: none; }
          }
        `}</style>

        {/* latar: titik-titik + cahaya */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />
        <div className="pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-brand-500/35 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-accent-500/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-20">
          {/* Teks */}
          <div className="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-brand-100">
              <Sparkles className="h-3.5 w-3.5 text-accent-300" /> Asisten AI untuk UMKM Indonesia
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Punya tim pemasaran, admin, dan kasir{" "}
              <span className="relative whitespace-nowrap text-accent-300">
                dalam satu HP.
                <svg viewBox="0 0 300 12" className="absolute -bottom-2 left-0 h-3 w-full text-accent-400/70" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 9 C 80 2, 200 2, 298 7" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-100/90 sm:text-lg">
              TemanUsaha membuatkan caption promosi, membalas chat pelanggan, dan mencatat untung-rugi usaha Anda.
              Cukup ketik dalam Bahasa Indonesia sehari-hari.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/daftar" variant="accent" className="px-6 py-3.5 text-base">
                Mulai gratis sekarang <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <a
                href="#fitur"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/10"
              >
                Lihat cara kerjanya
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-100/80">
              {["Gratis untuk mulai", "Bisa dari HP", "Tanpa kartu kredit"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CircleCheck className="h-4 w-4 text-accent-300" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Ilustrasi produk */}
          <div className="fade-up relative mx-auto h-[555px] w-full max-w-[540px] sm:h-[600px]" style={{ animationDelay: "120ms" }} aria-hidden>
            {/* Kartu postingan (kiri atas) */}
            <div className="tu-float-a absolute -left-3 top-[215px] z-20 hidden w-44 rounded-2xl bg-white p-2.5 text-ink shadow-2xl shadow-black/40 sm:block">
              <div className="relative grid h-24 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-accent-300 via-accent-400 to-accent-600">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/25" />
                <div className="absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-brand-600/30" />
                <span className="relative text-5xl drop-shadow">🍪</span>
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-accent-600">PROMO</span>
              </div>
              <p className="mt-2 text-[11px] font-semibold leading-snug">Renyahnya bikin nagih! Beli 3 gratis 1 🎉</p>
              <p className="mt-0.5 text-[10px] text-brand-600">#kuliner #camilan</p>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-muted">
                <Sparkles className="h-3 w-3 text-accent-500" /> Dibuat oleh AI
              </div>
            </div>

            {/* HP */}
            <div className="absolute left-1/2 top-0 z-10 w-[270px] -translate-x-1/2 rounded-[2.6rem] border border-white/10 bg-ink p-2.5 shadow-2xl shadow-black/50">
              <div className="relative overflow-hidden rounded-[2.1rem] bg-canvas text-ink">
                <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
                {/* status bar */}
                <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[10px] font-semibold">
                  <span>09.41</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-3 rounded-sm bg-ink" /> 100%
                  </span>
                </div>
                {/* isi layar */}
                <div className="space-y-3 px-3.5 pb-5 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted">Selamat pagi,</p>
                      <p className="text-sm font-extrabold">Keripik Bu Siti 👋</p>
                    </div>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">S</span>
                  </div>

                  {/* kartu laba + grafik */}
                  <div className="rounded-2xl bg-brand-950 p-3 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] text-brand-100/80">Laba bulan ini</p>
                        <p className="text-lg font-extrabold">Rp1.640.000</p>
                      </div>
                      <span className="rounded-full bg-accent-400 px-2 py-0.5 text-[9px] font-bold text-brand-950">Okt</span>
                    </div>
                    <svg viewBox="0 0 220 60" className="mt-2 h-14 w-full">
                      <defs>
                        <linearGradient id="tu-g" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#fcbf4b" stopOpacity="0.55" />
                          <stop offset="100%" stopColor="#fcbf4b" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 50 L30 44 L60 47 L90 34 L120 38 L150 24 L180 27 L220 10 L220 60 L0 60 Z" fill="url(#tu-g)" />
                      <path d="M0 50 L30 44 L60 47 L90 34 L120 38 L150 24 L180 27 L220 10" fill="none" stroke="#fcbf4b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                      <circle cx="220" cy="10" r="3.5" fill="#fff" />
                    </svg>
                    <div className="mt-1 flex justify-between text-[8px] text-brand-100/60">
                      <span>Mg 1</span><span>Mg 2</span><span>Mg 3</span><span>Mg 4</span>
                    </div>
                  </div>

                  {/* menu */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { i: Megaphone, l: "Konten", c: "bg-accent-50 text-accent-600" },
                      { i: MessageCircle, l: "Balas", c: "bg-brand-50 text-brand-600" },
                      { i: Wallet, l: "Uang", c: "bg-sky-50 text-sky-600" },
                      { i: Lightbulb, l: "Coach", c: "bg-violet-50 text-violet-600" },
                    ].map((m) => (
                      <div key={m.l} className="flex flex-col items-center gap-1">
                        <span className={cn("grid h-10 w-10 place-items-center rounded-xl", m.c)}>
                          <m.i className="h-4 w-4" />
                        </span>
                        <span className="text-[9px] font-semibold">{m.l}</span>
                      </div>
                    ))}
                  </div>

                  {/* hasil AI */}
                  <div className="rounded-2xl border border-line bg-white p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-700">
                      <Sparkles className="h-3 w-3" /> Ide konten hari ini
                    </div>
                    <p className="mt-1.5 text-[11px] leading-snug">
                      Video 15 detik: proses menggoreng keripik di pagi hari. Teks: <b>“Fresh setiap pagi, tanpa pengawet.”</b>
                    </p>
                    <div className="mt-2 flex gap-1.5">
                      <span className="rounded-md bg-brand-600 px-2 py-1 text-[9px] font-semibold text-white">Salin</span>
                      <span className="rounded-md bg-canvas px-2 py-1 text-[9px] font-semibold text-muted">Ide lain</span>
                    </div>
                  </div>

                  {/* transaksi */}
                  <div className="space-y-1.5 rounded-2xl bg-white p-3">
                    {[
                      { n: "20 bungkus pedas", v: "+Rp300.000", c: "text-brand-700" },
                      { n: "Bahan baku singkong", v: "−Rp120.000", c: "text-red-600" },
                    ].map((t) => (
                      <div key={t.n} className="flex items-center justify-between text-[10px]">
                        <span className="text-muted">{t.n}</span>
                        <span className={cn("font-bold", t.c)}>{t.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat WhatsApp (kanan bawah) */}
            <div className="tu-float-b absolute -right-3 bottom-2 z-20 hidden w-56 rounded-2xl bg-white p-3 sm:block text-ink shadow-2xl shadow-black/40">
              <div className="mb-2 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#25D366] text-white">
                  <MessageCircle className="h-3.5 w-3.5" />
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] font-bold">Pelanggan</p>
                  <p className="text-[9px] text-muted">via WhatsApp</p>
                </div>
              </div>
              <div className="w-fit max-w-[90%] rounded-xl rounded-tl-sm bg-canvas px-2.5 py-1.5 text-[11px]">Kak, bisa kurang kalau ambil 5? 🙏</div>
              <div className="ml-auto mt-1.5 w-fit max-w-[92%] rounded-xl rounded-tr-sm bg-[#dcf8c6] px-2.5 py-1.5 text-[11px] leading-snug">
                Boleh banget, Kak! Ambil 5 dapat <b>bonus 1 rasa baru</b> ya 😊
              </div>
              <div className="mt-2 flex items-center gap-1 text-[9px] font-semibold text-brand-700">
                <Bot className="h-3 w-3" /> Balasan disiapkan AI dalam 3 detik
              </div>
            </div>

            {/* Chip melayang */}
            <div className="tu-float-c absolute -right-3 top-6 z-20 hidden items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-ink shadow-2xl shadow-black/40 sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent-400 text-brand-950">
                <TrendingUp className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                Untung-rugi
                <span className="block text-[11px] font-normal text-muted">terlihat setiap hari</span>
              </span>
            </div>
          </div>
        </div>

        {/* Jenis usaha berjalan */}
        <div className="relative border-t border-white/10 bg-black/15 py-5">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-brand-100/60">Cocok untuk semua jenis usaha</p>
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="tu-marquee flex w-max gap-3">
              {[...Array(2)].flatMap((_, k) =>
                [
                  ["🍜", "Kuliner"],
                  ["☕", "Kedai kopi"],
                  ["👗", "Fashion"],
                  ["🛍️", "Reseller"],
                  ["🧺", "Kerajinan"],
                  ["💄", "Kecantikan"],
                  ["🔧", "Jasa servis"],
                  ["📚", "Kursus"],
                  ["🌾", "Pertanian"],
                  ["🐐", "Peternakan"],
                  ["🏪", "Toko kelontong"],
                  ["🧁", "Kue rumahan"],
                ].map(([e, l]) => (
                  <span
                    key={`${k}-${l}`}
                    className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90"
                  >
                    <span className="text-lg">{e}</span> {l}
                  </span>
                ))
              )}
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
