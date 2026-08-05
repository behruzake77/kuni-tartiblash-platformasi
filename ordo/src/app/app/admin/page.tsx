"use client";

import { Bot, CheckCircle2, LockKeyhole, Settings2, ShieldCheck, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isAdminEmail } from "@/lib/admin";
import { useUser } from "@/providers/user-provider";

export default function AdminPage() {
  const { user } = useUser();
  const allowed = isAdminEmail(user?.email);

  if (!allowed) {
    return (
      <AppShell title="Admin">
        <Card className="mx-auto mt-12 max-w-lg text-center">
          <CardContent className="flex flex-col items-center px-6 py-12">
            <span className="grid size-14 place-items-center rounded-2xl bg-danger-subtle text-danger"><LockKeyhole className="size-6" /></span>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-xl font-bold text-text-primary">Kirish cheklangan</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">Bu sahifa faqat loyiha administratori uchun ochiq.</p>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const aiReady = Boolean(process.env.NEXT_PUBLIC_ORDO_AI_ENABLED);
  return (
    <AppShell title="Admin panel">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm text-text-tertiary">Boshqaruv markazi</p><h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">Admin panel</h2></div>
        <Badge variant="success"><ShieldCheck className="size-3" /> Administrator</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border-primary/25 bg-gradient-brand-subtle"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bot className="size-4 text-primary" /> AI Assistant</CardTitle><CardDescription>OpenAI server ulanishi</CardDescription></CardHeader><CardContent><Badge variant={aiReady ? "success" : "outline"}>{aiReady ? "Yoqilgan" : "Token kutilmoqda"}</Badge><p className="mt-3 text-xs leading-relaxed text-text-secondary">Token Render environment’da xavfsiz saqlanadi. U browser yoki userlarga ko‘rinmaydi.</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="size-4 text-secondary" /> Foydalanuvchilar</CardTitle><CardDescription>SaaS statistikasi</CardDescription></CardHeader><CardContent><p className="text-2xl font-bold text-text-primary">—</p><p className="mt-1 text-xs text-text-tertiary">Analytics modulidan keyin ko‘rinadi.</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Settings2 className="size-4 text-accent" /> Tizim</CardTitle><CardDescription>Sync va konfiguratsiya</CardDescription></CardHeader><CardContent><div className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="size-4" /> Supabase Sync tayyor</div><p className="mt-3 text-xs text-text-tertiary">Day history va calendar moduli keyingi bosqichda ulanadi.</p></CardContent></Card>
      </div>
    </AppShell>
  );
}
