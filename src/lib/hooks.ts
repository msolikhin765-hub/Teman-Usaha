"use client";

import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import { useAccount } from "@/components/AuthProvider";
import { db } from "./firebase";
import { EMPTY_PROFILE, type BusinessProfile, type Transaksi } from "./types";

/** Profil usaha milik pengguna yang sedang masuk. */
export function useBusinessProfile() {
  const { user } = useAccount();
  const [profile, setProfile] = useState<BusinessProfile>(EMPTY_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db(), "businesses", user.uid))
      .then((snap) => {
        if (snap.exists()) setProfile({ ...EMPTY_PROFILE, ...(snap.data() as Partial<BusinessProfile>) });
      })
      .finally(() => setLoaded(true));
  }, [user]);

  const complete = Boolean(profile.namaUsaha && profile.jenisUsaha && profile.produk);
  return { profile, setProfile, loaded, complete };
}

/** Transaksi dalam rentang tanggal (YYYY-MM-DD), diperbarui otomatis. */
export function useTransaksi(sejak: string, sampai = "9999-12-31") {
  const { user } = useAccount();
  const [items, setItems] = useState<Transaksi[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db(), "users", user.uid, "transaksi"),
      where("tanggal", ">=", sejak),
      where("tanggal", "<=", sampai),
      orderBy("tanggal", "desc")
    );
    return onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Transaksi, "id">) })));
        setLoaded(true);
      },
      () => setLoaded(true)
    );
  }, [user, sejak, sampai]);

  return { items, loaded };
}

export function ringkas(items: Transaksi[]) {
  let masuk = 0;
  let keluar = 0;
  for (const t of items) {
    if (t.tipe === "masuk") masuk += t.jumlah;
    else keluar += t.jumlah;
  }
  return { masuk, keluar, laba: masuk - keluar };
}
