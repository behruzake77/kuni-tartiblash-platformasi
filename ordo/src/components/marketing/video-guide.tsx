import { CalendarPlus, CheckCircle2, Clock3, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  { icon: CalendarPlus, number: "01", title: "Vazifa qo‘shing", body: "“Vazifa qo‘shish” tugmasini bosing, nima qilishingizni yozing va qaysi kun hamda vaqt uchun ekanini belgilang.", example: "Masalan: 10:00 — Mijozga taklif yuborish", tone: "primary" },
  { icon: Clock3, number: "02", title: "Vaqtingizni rejalang", body: "Kalendar orqali bugun, ertaga yoki boshqa kunni tanlang. Muhim ishni prioritet qilib qo‘ying.", example: "Kalendar → kunni tanlang → + vazifa", tone: "secondary" },
  { icon: CheckCircle2, number: "03", title: "Bajarganingizni belgilang", body: "Ishni tugatgach belgilang. Ordo kunlik progress, fokus va natijalarni o‘zi hisoblaydi.", example: "✓ Bajarildi → Kun yakuni", tone: "accent" },
];

export function VideoGuide() {
  return (
    <section id="video-guide" className="scroll-mt-24 py-14 md:py-20">
      <div className="container-ordo">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <Badge variant="primary" className="mb-4"><PlayCircle className="size-3" /> Qisqa qo‘llanma</Badge>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Ordo’dan 3 qadamda foydalaning</h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">Yangi foydalanuvchi uchun aniq yo‘l: rejalang, vaqtni belgilang va bajarilgan ishni kuzating.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, number, title, body, example, tone }) => <article key={number} className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface-1 p-5 shadow-sm sm:p-6"><span className={`absolute right-5 top-4 font-[family-name:var(--font-mono)] text-5xl font-bold opacity-10 ${tone === "primary" ? "text-primary" : tone === "secondary" ? "text-secondary" : "text-accent"}`}>{number}</span><span className={`grid size-11 place-items-center rounded-2xl ${tone === "primary" ? "bg-primary-subtle text-primary" : tone === "secondary" ? "bg-secondary/15 text-secondary" : "bg-accent/15 text-accent"}`}><Icon className="size-5" /></span><h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-semibold text-text-primary">{title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{body}</p><div className="mt-5 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-3 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-text-tertiary">{example}</div></article>)}
        </div>
      </div>
    </section>
  );
}
