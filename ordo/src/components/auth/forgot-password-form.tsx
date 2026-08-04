"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/auth/supabase";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase || !email.includes("@")) { setError("Email manzilini to‘g‘ri kiriting."); return; }
    setLoading(true); setError("");
    const { error: requestError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (requestError) { setError("Email yuborilmadi. Keyinroq qayta urinib ko‘ring."); return; }
    setSent(true);
  }
  if (sent) return <div className="rounded-[var(--radius-lg)] border border-success/30 bg-success-subtle p-5 text-center"><Mail className="mx-auto size-7 text-success" /><h2 className="mt-3 font-semibold text-text-primary">Email yuborildi</h2><p className="mt-2 text-sm leading-relaxed text-text-secondary">Parolni yangilash havolasi email manzilingizga yuborildi. Inbox va Spam papkasini tekshiring.</p></div>;
  return <form onSubmit={submit} className="space-y-4"><div><label className="mb-1.5 block text-sm font-medium text-text-primary" htmlFor="reset-email">Email</label><Input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} leftIcon={<Mail />} animated placeholder="you@example.com" /></div>{error && <p className="text-sm text-danger" role="alert">{error}</p>}<Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>Parolni tiklash havolasini yuborish</Button></form>;
}
