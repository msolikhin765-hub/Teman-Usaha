import Anthropic from "@anthropic-ai/sdk";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse, type NextRequest } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { currentPeriod, getPlan, type PlanId } from "@/lib/plans";
import { systemPrompt, userPrompt } from "@/lib/prompts";
import type { AiRequest, AiResponse, BusinessProfile } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";

function fail(status: number, error: string, code?: string) {
  return NextResponse.json<AiResponse>({ ok: false, error, code }, { status });
}

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Memvalidasi dan merapikan isi permintaan dari browser. */
function parseRequest(body: unknown): AiRequest | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (b.task === "konten") {
    const jenis = ["caption", "ide", "kalender", "skrip_video", "broadcast"].includes(b.jenis as string)
      ? (b.jenis as Extract<AiRequest, { task: "konten" }>["jenis"])
      : "caption";
    return { task: "konten", jenis, topik: clip(b.topik, 500), platform: clip(b.platform, 50), tujuan: clip(b.tujuan, 200) };
  }
  if (b.task === "balas") {
    const pesan = clip(b.pesan, 2000);
    if (!pesan) return null;
    const situasi = ["pertanyaan", "harga", "komplain", "nego", "followup"].includes(b.situasi as string)
      ? (b.situasi as Extract<AiRequest, { task: "balas" }>["situasi"])
      : "pertanyaan";
    return { task: "balas", situasi, pesan, catatan: clip(b.catatan, 500) };
  }
  if (b.task === "coach") {
    return { task: "coach", pertanyaan: clip(b.pertanyaan, 1000) };
  }
  return null;
}

/** Fitur tertentu hanya untuk paket berbayar. */
function requiredPlan(req: AiRequest): PlanId | null {
  if (req.task === "coach") return "pro";
  if (req.task === "konten" && (req.jenis === "kalender" || req.jenis === "skrip_video")) return "basic";
  return null;
}

const PLAN_RANK: Record<PlanId, number> = { gratis: 0, basic: 1, pro: 2, business: 3 };

async function financeSummary(uid: string): Promise<string> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const snap = await adminDb()
    .collection("users")
    .doc(uid)
    .collection("transaksi")
    .where("tanggal", ">=", since)
    .get();

  if (snap.empty) return "";

  let masuk = 0;
  let keluar = 0;
  const kategori: Record<string, number> = {};
  snap.forEach((d) => {
    const t = d.data();
    const jumlah = Number(t.jumlah) || 0;
    if (t.tipe === "masuk") masuk += jumlah;
    else {
      keluar += jumlah;
      const k = String(t.kategori || "Lainnya");
      kategori[k] = (kategori[k] || 0) + jumlah;
    }
  });
  const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");
  const topKeluar = Object.entries(kategori)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k, v]) => `${k} (${rp(v)})`)
    .join(", ");

  return [
    `- Jumlah transaksi tercatat: ${snap.size}`,
    `- Total pemasukan: ${rp(masuk)}`,
    `- Total pengeluaran: ${rp(keluar)}`,
    `- Laba sederhana: ${rp(masuk - keluar)}`,
    topKeluar ? `- Pengeluaran terbesar: ${topKeluar}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: NextRequest) {
  // 1. Pastikan pengguna sudah masuk
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return fail(401, "Silakan masuk terlebih dahulu.", "AUTH");

  let uid: string;
  try {
    uid = (await adminAuth().verifyIdToken(token)).uid;
  } catch {
    return fail(401, "Sesi Anda sudah berakhir. Silakan masuk kembali.", "AUTH");
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return fail(500, "Layanan AI belum dikonfigurasi oleh admin (ANTHROPIC_API_KEY kosong).", "CONFIG");
  }

  // 2. Validasi permintaan
  let req: AiRequest | null = null;
  try {
    req = parseRequest(await request.json());
  } catch {
    req = null;
  }
  if (!req) return fail(400, "Permintaan tidak lengkap. Periksa kembali isian Anda.", "INPUT");

  const db = adminDb();
  const userRef = db.collection("users").doc(uid);
  const period = currentPeriod();

  // 3. Cek paket & kuota, lalu catat pemakaian (dalam satu transaksi)
  let used = 0;
  let quota = 0;
  try {
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      const data = snap.data() ?? {};
      const plan = getPlan(data.plan);

      const need = requiredPlan(req!);
      if (need && PLAN_RANK[plan.id] < PLAN_RANK[need]) {
        return { error: "PLAN" as const, need };
      }

      const count = data.usage?.period === period ? Number(data.usage?.count) || 0 : 0;
      if (count >= plan.aiQuota) return { error: "QUOTA" as const, quota: plan.aiQuota };

      tx.set(userRef, { usage: { period, count: count + 1 } }, { merge: true });
      return { used: count + 1, quota: plan.aiQuota };
    });

    if ("error" in result) {
      if (result.error === "PLAN") {
        return fail(403, `Fitur ini tersedia mulai paket ${getPlan(result.need).name}.`, "PLAN");
      }
      return fail(429, `Kuota AI bulan ini (${result.quota} permintaan) sudah habis. Upgrade paket untuk melanjutkan.`, "QUOTA");
    }
    used = result.used;
    quota = result.quota;
  } catch (e) {
    console.error("Gagal memeriksa kuota", e);
    return fail(500, "Terjadi gangguan saat memeriksa kuota. Coba lagi.", "SERVER");
  }

  const refund = () =>
    userRef.set({ usage: { period, count: FieldValue.increment(-1) } }, { merge: true }).catch(() => {});

  // 4. Siapkan konteks dan panggil AI
  try {
    const profileSnap = await db.collection("businesses").doc(uid).get();
    const profile = (profileSnap.data() as BusinessProfile | undefined) ?? null;
    const extra = req.task === "coach" ? await financeSummary(uid) : undefined;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: systemPrompt(profile),
      messages: [{ role: "user", content: userPrompt(req, extra) }],
    });

    const text = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    if (!text) {
      await refund();
      return fail(502, "AI tidak memberikan jawaban. Coba ulangi dengan kalimat lain.", "EMPTY");
    }

    // 5. Simpan riwayat hasil
    await userRef.collection("riwayat").add({
      task: req.task,
      jenis: req.task === "konten" ? req.jenis : req.task === "balas" ? req.situasi : "coach",
      input: req.task === "konten" ? req.topik : req.task === "balas" ? req.pesan : req.pertanyaan,
      output: text,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json<AiResponse>({ ok: true, text, usage: { used, quota } });
  } catch (e) {
    console.error("Gagal memanggil AI", e);
    await refund();
    return fail(502, "Layanan AI sedang sibuk. Kuota Anda tidak terpakai, silakan coba lagi.", "AI");
  }
}
