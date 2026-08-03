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
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="ordo-mark-grad"
          x1="4"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3B82F6" />
          <stop offset="0.55" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      {/* Outer orbital ring */}
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="13"
        stroke="url(#ordo-mark-grad)"
        strokeWidth="1.5"
        opacity="0.45"
      />
      {/* Inner core O */}
      <circle
        cx="16"
        cy="16"
        r="7.5"
        stroke="url(#ordo-mark-grad)"
        strokeWidth="2.25"
      />
      {/* Orbital accent node */}
      <circle cx="26.5" cy="11" r="2.25" fill="url(#ordo-mark-grad)" />
    </svg>
  );
}
