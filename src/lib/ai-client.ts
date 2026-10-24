"use client";

import { auth } from "./firebase";
import type { AiRequest, AiResponse } from "./types";

/** Memanggil endpoint AI dengan token login pengguna. */
export async function callAI(req: AiRequest): Promise<AiResponse> {
  const user = auth().currentUser;
  if (!user) return { ok: false, error: "Silakan masuk terlebih dahulu.", code: "AUTH" };

  try {
    const token = await user.getIdToken();
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(req),
    });
    return (await res.json()) as AiResponse;
  } catch {
    return { ok: false, error: "Koneksi terputus. Periksa internet Anda lalu coba lagi.", code: "NETWORK" };
  }
}
