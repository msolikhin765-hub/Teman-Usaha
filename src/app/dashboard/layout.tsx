"use client";

import {
  CreditCard,
  LayoutDashboard,
  Lightbulb,
  LoaderCircle,
  LogOut,
  Megaphone,
  Menu,
  MessageCircle,
  Store,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { useAccount } from "@/components/AuthProvider";
import { Logo, cn } from "@/components/ui";

const NAV = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/dashboard/konten", label: "AI Konten", icon: Megaphone },
  { href: "/dashboard/pelanggan", label: "AI Balas Pelanggan", icon: MessageCircle },
  { href: "/dashboard/keuangan", label: "Keuangan", icon: Wallet },
  { href: "/dashboard/coach", label: "AI Coach", icon: Lightbulb },
  { href: "/dashboard/profil", label: "Profil Usaha", icon: Store },
  { href: "/dashboard/paket", label: "Paket & Kuota", icon: CreditCard },
];

function QuotaMeter() {
  const { plan, used } = useAccount();
  const pct = Math.min(100, Math.round((used / plan.aiQuota) * 100));
  return (
    <Link href="/dashboard/paket" className="block rounded-xl border border-line bg-canvas p-3.5 hover:border-brand-200">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ink">Paket {plan.name}</span>
        <span className="text-muted">
          {used}/{plan.aiQuota.toLocaleString("id-ID")}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div className={cn("h-full rounded-full", pct >= 90 ? "bg-accent-500" : "bg-brand-500")} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-[11px] text-muted">Permintaan AI bulan ini</p>
    </Link>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAccount();
  const router = useRouter();

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Link href="/dashboard" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((n) => {
          const active = n.href === "/dashboard" ? pathname === n.href : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-brand-600 text-white shadow-sm" : "text-muted hover:bg-brand-50 hover:text-ink"
              )}
            >
              <n.icon className="h-4.5 w-4.5 shrink-0" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3 p-3">
        <QuotaMeter />
        <div className="flex items-center gap-3 rounded-xl px-2 py-1">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {(user?.displayName || user?.email || "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.displayName || "Pemilik usaha"}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
          <button
            onClick={async () => {
              await logout();
              router.replace("/");
            }}
            className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
            title="Keluar"
            aria-label="Keluar"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/masuk");
  }, [loading, user, router]);

  useEffect(() => setOpen(false), [pathname]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <LoaderCircle className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:pl-64">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-white lg:block">
        <Sidebar />
      </aside>

      {/* Bar atas mobile */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
        <Logo />
        <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-brand-50" aria-label="Buka menu">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded-lg p-2 hover:bg-brand-50" aria-label="Tutup menu">
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">{children}</main>
    </div>
  );
}
