"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { currentPeriod, getPlan, type Plan } from "@/lib/plans";

type Account = {
  user: User | null;
  loading: boolean;
  plan: Plan;
  used: number;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Account | null>(null);

/** Membuat dokumen pengguna saat pertama kali masuk (paket Gratis). */
async function ensureUserDoc(user: User) {
  const ref = doc(db(), "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      nama: user.displayName ?? "",
      email: user.email ?? "",
      plan: "gratis",
      createdAt: serverTimestamp(),
    });
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [planId, setPlanId] = useState<string>("gratis");
  const [used, setUsed] = useState(0);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let stopDoc: (() => void) | undefined;

    const stopAuth = onAuthStateChanged(auth(), async (u) => {
      stopDoc?.();
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }
      try {
        await ensureUserDoc(u);
      } catch (e) {
        console.error("Gagal menyiapkan akun", e);
      }
      stopDoc = onSnapshot(doc(db(), "users", u.uid), (snap) => {
        const d = snap.data();
        setPlanId(d?.plan ?? "gratis");
        setUsed(d?.usage?.period === currentPeriod() ? Number(d?.usage?.count) || 0 : 0);
      });
      setLoading(false);
    });

    return () => {
      stopAuth();
      stopDoc?.();
    };
  }, []);

  const value: Account = {
    user,
    loading,
    plan: getPlan(planId),
    used,
    logout: () => signOut(auth()),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAccount(): Account {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAccount harus dipakai di dalam AuthProvider");
  return ctx;
}
