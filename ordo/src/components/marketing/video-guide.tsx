import Image from "next/image";
import { Badge } from "@/components/ui/badge";

/** Lightweight animated product walkthrough (GIF avoids a heavy autoplay video dependency). */
export function VideoGuide() {
  return (
    <section id="video-guide" className="scroll-mt-24 py-14 md:py-20">
      <div className="container-ordo">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <Badge variant="primary" className="mb-4">1 daqiqalik tanishuv</Badge>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Ordo’dan qanday foydalaniladi?</h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">Kunni rejalang, fokusda ishlang va natijani yakunlang.</p>
        </div>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[var(--radius-xl)] border border-border-strong bg-[#080B18] shadow-xl">
          <Image src="/demo/ordo-how-it-works.gif" alt="Ordo: kunni rejalash, fokusda ishlash va kunni yakunlash" width={1200} height={675} unoptimized className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
