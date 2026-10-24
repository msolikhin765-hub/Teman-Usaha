"use client";

import { Check, Copy, LoaderCircle } from "lucide-react";
import Link from "next/link";
import {
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/cn";

export { cn };

/* ---------- Logo ---------- */
export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-extrabold tracking-tight", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6 9.5V19h12V9.5" />
          <path d="M10 19v-4.5h4V19" />
          <circle cx="18.5" cy="5.5" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className={cn("text-lg", light ? "text-white" : "text-ink")}>
        Teman<span className={light ? "text-accent-300" : "text-brand-600"}>Usaha</span>
      </span>
    </span>
  );
}

/* ---------- Button ---------- */
type Variant = "primary" | "secondary" | "ghost" | "accent";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  accent: "bg-accent-400 text-brand-950 hover:bg-accent-300 shadow-sm",
  secondary: "bg-white text-ink border border-line hover:bg-brand-50 hover:border-brand-200",
  ghost: "text-muted hover:text-ink hover:bg-brand-50",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

export function Button({
  variant = "primary",
  loading,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  return (
    <button className={cn(BASE, VARIANTS[variant], className)} disabled={loading || props.disabled} {...props}>
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(BASE, VARIANTS[variant], className)}>
      {children}
    </Link>
  );
}

/* ---------- Card ---------- */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border border-line bg-white p-5 sm:p-6", className)}>{children}</div>;
}

/* ---------- Form fields ---------- */
const INPUT =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(INPUT, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={cn(INPUT, "resize-y", props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(INPUT, "pr-8", props.className)} />;
}

/* ---------- Pilihan berbentuk chip ---------- */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; badge?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
            value === o.value
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-line bg-white text-ink hover:border-brand-300"
          )}
        >
          {o.label}
          {o.badge && (
            <span
              className={cn(
                "rounded-full px-1.5 py-px text-[10px] font-bold uppercase",
                value === o.value ? "bg-white/20 text-white" : "bg-accent-100 text-accent-600"
              )}
            >
              {o.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ---------- Alert ---------- */
export function Alert({ tone = "error", children }: { tone?: "error" | "info" | "success"; children: ReactNode }) {
  const tones = {
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-brand-200 bg-brand-50 text-brand-800",
    success: "border-brand-200 bg-brand-50 text-brand-800",
  };
  return <div className={cn("rounded-xl border px-4 py-3 text-sm", tones[tone])}>{children}</div>;
}

/* ---------- Tombol salin ---------- */
export function CopyButton({ text, label = "Salin" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      variant="secondary"
      className="px-3 py-1.5 text-xs"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          /* clipboard tidak tersedia */
        }
      }}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Tersalin" : label}
    </Button>
  );
}

/* ---------- Kotak hasil AI ---------- */
export function AiResult({ text, loading }: { text: string; loading: boolean }) {
  if (loading) {
    return (
      <Card className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
          <LoaderCircle className="h-4 w-4 animate-spin" /> AI sedang menyiapkan jawaban…
        </div>
        {[92, 80, 86, 60].map((w, i) => (
          <div key={i} className="h-3 animate-pulse rounded bg-brand-50" style={{ width: `${w}%` }} />
        ))}
      </Card>
    );
  }
  if (!text) return null;
  return (
    <Card className="fade-up">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3">
        <span className="text-sm font-bold text-ink">Hasil dari AI</span>
        <CopyButton text={text} label="Salin semua" />
      </div>
      <div className="ai-output text-ink">{text}</div>
      <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
        Periksa kembali harga, promo, dan informasi penting sebelum dikirim ke pelanggan.
      </p>
    </Card>
  );
}

/* ---------- Judul halaman ---------- */
export function PageHeader({ title, desc, children }: { title: string; desc?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-sm text-muted">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

/* ---------- Panel hasil (kosong / memuat / hasil) ---------- */
export function ResultPanel({
  text,
  loading,
  icon,
  hint,
}: {
  text: string;
  loading: boolean;
  icon: ReactNode;
  hint: string;
}) {
  if (text || loading) return <AiResult text={text} loading={loading} />;
  return (
    <Card className="grid min-h-64 place-items-center border-dashed text-center">
      <div className="max-w-xs">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">{icon}</span>
        <p className="mt-3 font-semibold">Hasil akan muncul di sini</p>
        <p className="mt-1 text-sm text-muted">{hint}</p>
      </div>
    </Card>
  );
}
