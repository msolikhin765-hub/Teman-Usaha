"use client";

import Link from "next/link";
import { useState } from "react";

import { Alert } from "@/components/ui";
import { callAI } from "@/lib/ai-client";
import type { AiRequest } from "@/lib/types";

export function useAi() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  async function run(req: AiRequest) {
    setLoading(true);
    setError(null);
    setText("");
    const res = await callAI(req);
    if (res.ok) setText(res.text);
    else setError({ message: res.error, code: res.code });
    setLoading(false);
  }

  return { text, loading, error, run };
}

export function AiError({ error }: { error: { message: string; code?: string } | null }) {
  if (!error) return null;
  const upgrade = error.code === "QUOTA" || error.code === "PLAN";
  return (
    <Alert>
      {error.message}{" "}
      {upgrade && (
        <Link href="/dashboard/paket" className="font-semibold underline">
          Lihat paket
        </Link>
      )}
    </Alert>
  );
}
