import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Ordo Badge — Design Bible §4.4 special styles
 * 11px uppercase, tracking +0.08em, weight 600
 */

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 whitespace-nowrap",
    "font-[family-name:var(--font-sans)] font-semibold uppercase tracking-[var(--tracking-widest)]",
    "text-[11px] leading-none",
    "rounded-[var(--radius-xs)] px-2 py-1",
    "border border-transparent",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-surface-3 text-text-secondary border-border",
        primary: "bg-primary-subtle text-primary",
        secondary: "bg-[color-mix(in_srgb,var(--color-secondary)_15%,transparent)] text-secondary",
        accent: "bg-[color-mix(in_srgb,var(--color-accent)_15%,transparent)] text-accent",
        success: "bg-success-subtle text-success",
        warning: "bg-warning-subtle text-warning",
        danger: "bg-danger-subtle text-danger",
        gradient:
          "bg-gradient-brand text-white border-0 shadow-sm",
        outline: "bg-transparent text-text-secondary border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
