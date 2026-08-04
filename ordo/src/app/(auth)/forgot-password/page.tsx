import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return <div><h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">Parolni tiklash</h1><p className="mt-2 text-sm leading-relaxed text-text-secondary">Email manzilingizni kiriting. Sizga parolni yangilash uchun xavfsiz havola yuboramiz.</p><div className="mt-8"><ForgotPasswordForm /></div><p className="mt-8 text-center text-sm text-text-secondary"><Link href="/login" className="font-medium text-primary hover:underline">Kirish sahifasiga qaytish</Link></p></div>;
}
