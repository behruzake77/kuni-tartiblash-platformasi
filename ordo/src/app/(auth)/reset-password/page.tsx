import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return <div><h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">Yangi parol o‘rnating</h1><p className="mt-2 text-sm leading-relaxed text-text-secondary">Xavfsiz va eslab qolish oson bo‘lgan yangi parol yarating.</p><div className="mt-8"><ResetPasswordForm /></div></div>;
}
