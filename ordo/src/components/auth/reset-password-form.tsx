"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/auth/supabase";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) { setError("Parol kamida 8 belgidan iborat bo‘lishi kerak."); return; }
    if (password !== confirm) { setError("Parollar bir xil emas."); return; }
    if (!supabase) { setError("Auth sozlanmagan."); return; }
    setLoading(true); setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) { setError("Parol yangilanmadi. Havolani qayta so‘rang."); return; }
    router.replace("/app");
  }
  return <form onSubmit={submit} className="space-y-4"><div><label className="mb-1.5 block text-sm font-medium text-text-primary" htmlFor="new-password">Yangi parol</label><Input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} leftIcon={<Lock />} animated autoComplete="new-password" /></div><div><label className="mb-1.5 block text-sm font-medium text-text-primary" htmlFor="confirm-password">Parolni takrorlang</label><Input id="confirm-password" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} leftIcon={<Lock />} animated autoComplete="new-password" /></div>{error && <p className="text-sm text-danger" role="alert">{error}</p>}<Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>Yangi parolni saqlash</Button></form>;
}
