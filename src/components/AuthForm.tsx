"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { useAccount } from "@/components/AuthProvider";
import { Alert, Button, Field, Input, Logo } from "@/components/ui";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

function pesanError(code: string): string {
  const map: Record<string, string> = {
    "auth/invalid-credential": "Email atau kata sandi salah.",
    "auth/wrong-password": "Email atau kata sandi salah.",
    "auth/user-not-found": "Akun dengan email ini belum terdaftar.",
    "auth/email-already-in-use": "Email ini sudah terdaftar. Silakan masuk.",
    "auth/weak-password": "Kata sandi minimal 6 karakter.",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/too-many-requests": "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.",
    "auth/popup-closed-by-user": "Jendela login Google ditutup sebelum selesai.",
    "auth/network-request-failed": "Koneksi internet bermasalah. Coba lagi.",
  };
  return map[code] ?? "Terjadi kesalahan. Silakan coba lagi.";
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.7-2.8z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: "masuk" | "daftar" }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAccount();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const daftar = mode === "daftar";

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [user, authLoading, router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (daftar) {
        const cred = await createUserWithEmailAndPassword(auth(), email.trim(), password);
        if (nama.trim()) await updateProfile(cred.user, { displayName: nama.trim() });
      } else {
        await signInWithEmailAndPassword(auth(), email.trim(), password);
      }
      router.replace("/dashboard");
    } catch (err) {
      setError(pesanError((err as { code?: string }).code ?? ""));
      setLoading(false);
    }
  }

  async function google() {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth(), new GoogleAuthProvider());
      router.replace("/dashboard");
    } catch (err) {
      setError(pesanError((err as { code?: string }).code ?? ""));
      setLoading(false);
    }
  }

  async function lupaSandi() {
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError("Isi email Anda terlebih dahulu, lalu klik Lupa kata sandi.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth(), email.trim());
      setInfo("Tautan untuk mengatur ulang kata sandi sudah dikirim ke email Anda.");
    } catch (err) {
      setError(pesanError((err as { code?: string }).code ?? ""));
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel kiri */}
      <div className="relative hidden overflow-hidden bg-brand-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />
        <Link href="/" className="relative">
          <Logo light />
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight">
            Konten, pelanggan, dan keuangan usaha, <span className="text-accent-300">dibantu AI.</span>
          </h2>
          <ul className="mt-8 space-y-4 text-brand-100/90">
            {[
              "3 pilihan caption siap posting dalam hitungan detik",
              "Balasan chat pelanggan yang ramah dan menjual",
              "Laba usaha bulan ini terlihat jelas",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-300" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-brand-100/60">Dibuat untuk UMKM Indonesia.</p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center bg-white px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-block lg:hidden">
            <Logo />
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight">{daftar ? "Buat akun gratis" : "Selamat datang kembali"}</h1>
          <p className="mt-1 text-sm text-muted">
            {daftar ? "Mulai dengan 20 permintaan AI gratis setiap bulan." : "Masuk untuk melanjutkan ke dashboard usaha Anda."}
          </p>

          {!isFirebaseConfigured && (
            <div className="mt-6">
              <Alert>Firebase belum dikonfigurasi. Isi file .env.local sesuai panduan README.</Alert>
            </div>
          )}

          <Button variant="secondary" className="mt-6 w-full" onClick={google} disabled={loading || !isFirebaseConfigured}>
            <GoogleIcon /> {daftar ? "Daftar dengan Google" : "Masuk dengan Google"}
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-line" /> atau dengan email <span className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {daftar && (
              <Field label="Nama Anda">
                <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Siti Aminah" autoComplete="name" />
              </Field>
            )}
            <Field label="Email">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" autoComplete="email" />
            </Field>
            <Field label="Kata sandi" hint={daftar ? "Minimal 6 karakter." : undefined}>
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={daftar ? "new-password" : "current-password"}
              />
            </Field>

            {!daftar && (
              <button type="button" onClick={lupaSandi} className="text-sm font-medium text-brand-600 hover:underline">
                Lupa kata sandi?
              </button>
            )}

            {error && <Alert>{error}</Alert>}
            {info && <Alert tone="success">{info}</Alert>}

            <Button type="submit" className="w-full py-3" loading={loading} disabled={!isFirebaseConfigured}>
              {daftar ? "Daftar sekarang" : "Masuk"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {daftar ? "Sudah punya akun? " : "Belum punya akun? "}
            <Link href={daftar ? "/masuk" : "/daftar"} className="font-semibold text-brand-600 hover:underline">
              {daftar ? "Masuk" : "Daftar gratis"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
