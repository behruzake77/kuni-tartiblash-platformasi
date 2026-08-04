import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Ordo Logo — wordmark + orbital mark
 * SVG also shipped at /brand/logo.svg and /brand/logo-mark.svg
 */

type LogoProps = {
  className?: string;
  href?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { mark: 20, text: "text-base", gap: "gap-2" },
  md: { mark: 28, text: "text-xl", gap: "gap-2.5" },
  lg: { mark: 36, text: "text-2xl", gap: "gap-3" },
};

export function Logo({
  className,
  href = "/",
  showWordmark = true,
  size = "md",
}: LogoProps) {
  const s = sizes[size];

  const content = (
    <span
      className={cn(
        "inline-flex items-center font-[family-name:var(--font-display)] font-semibold tracking-tight text-text-primary",
        s.gap,
        s.text,
        className
      )}
    >
      <LogoMark size={s.mark} />
      {showWordmark && <span className="leading-none">Ordo</span>}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex shrink-0 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        aria-label="Ordo home"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export function LogoMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/brand/ordo-checkmark-mark.svg"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      alt=""
      aria-hidden="true"
      priority
    />
  );
}
