"use client";

import { collection, limit, onSnapshot, orderBy, query, where, type Timestamp } from "firebase/firestore";
import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAccount } from "@/components/AuthProvider";
import { Card, CopyButton } from "@/components/ui";
import { db } from "@/lib/firebase";

type Item = { id: string; input: string; output: string; jenis: string; createdAt?: Timestamp };

/** Riwayat hasil AI terakhir untuk satu fitur (paket Basic ke atas). */
export function Riwayat({ task, labels }: { task: "konten" | "balas" | "coach"; labels?: Record<string, string> }) {
  const { user, plan } = useAccount();
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const allowed = plan.id !== "gratis";

  useEffect(() => {
    if (!user || !allowed) return;
    const q = query(
      collection(db(), "users", user.uid, "riwayat"),
      where("task", "==", task),
      orderBy("createdAt", "desc"),
      limit(8)
    );
    return onSnapshot(q, (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Item, "id">) }))), () => {});
  }, [user, task, allowed]);

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted" />
        <h2 className="font-bold">Riwayat</h2>
      </div>
      {!allowed ? (
        <p className="text-sm text-muted">
          Simpan dan buka kembali hasil AI sebelumnya dengan paket Basic ke atas.{" "}
          <Link href="/dashboard/paket" className="font-semibold text-brand-600 hover:underline">Lihat paket</Link>
        </p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted">Hasil AI Anda akan tersimpan di sini.</p>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((it) => (
            <li key={it.id} className="py-2">
              <button onClick={() => setOpen(open === it.id ? null : it.id)} className="flex w-full items-center gap-2 text-left">
                <ChevronRight className={`h-4 w-4 shrink-0 text-muted transition ${open === it.id ? "rotate-90" : ""}`} />
                <span className="min-w-0 flex-1 truncate text-sm">{it.input || "(tanpa keterangan)"}</span>
                <span className="shrink-0 rounded-full bg-canvas px-2 py-0.5 text-[11px] text-muted">{labels?.[it.jenis] ?? it.jenis}</span>
              </button>
              {open === it.id && (
                <div className="mt-2 rounded-xl bg-canvas p-3">
                  <div className="mb-2 flex justify-end">
                    <CopyButton text={it.output} />
                  </div>
                  <div className="ai-output max-h-80 overflow-auto text-sm">{it.output}</div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
