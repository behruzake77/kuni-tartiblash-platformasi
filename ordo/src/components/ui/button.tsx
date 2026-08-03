import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ordo Button
 * ----------------------------------------------------------------------------
 * Base: shadcn/ui + Radix Slot
 *   https://ui.shadcn.com/docs/components/button
 *
 * Extra motion variants adapted from Uiverse.io (galaxy archive):
 *   https://uiverse.io/  ·  https://github.com/uiverse-io/galaxy
 *   - cta     ← satyamchaudharydev (arrow)
 *   - shine   ← Itskrish01 (slide fill)
 *   - lift    ← Codecite (gradient pill)
 * Restyled with Ordo design tokens — not raw paste.
 * ----------------------------------------------------------------------------
 */

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium font-[family-name:var(--font-sans)] tracking-[var(--tracking-wide)]",
    "outline-none select-none",
    "transition-[color,background-color,border-color,box-shadow,transform,filter,opacity]",
    "duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.98] active:duration-[var(--duration-instant)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "rounded-[var(--radius-sm)] bg-primary text-white shadow-sm",
          "hover:bg-primary-hover hover:shadow-md",
          "active:bg-primary-active",
        ].join(" "),
        primary: [
          "rounded-[var(--radius-sm)] bg-primary text-white shadow-sm",
          "hover:bg-primary-hover hover:shadow-md",
          "active:bg-primary-active",
        ].join(" "),
        gradient: [
          "rounded-[var(--radius-sm)] bg-gradient-brand text-white shadow-sm",
          "hover:brightness-110 hover:shadow-md hover:shadow-glow",
          "active:brightness-95",
        ].join(" "),
        /** Uiverse arrow CTA */
        cta: "btn-uiverse-cta btn-uiverse-cta-gradient active:scale-[0.98]",
        /** Uiverse slide-fill */
        shine: "btn-uiverse-shine active:scale-[0.98]",
        /** Uiverse gradient lift pill */
        lift: "btn-uiverse-lift active:scale-100",
        destructive: [
          "rounded-[var(--radius-sm)] bg-danger text-white shadow-sm",
          "hover:brightness-110 focus-visible:ring-danger/40 active:brightness-95",
        ].join(" "),
        outline: [
          "rounded-[var(--radius-sm)] border border-border bg-transparent text-text-primary shadow-xs",
          "hover:bg-surface-2 hover:border-border-strong",
        ].join(" "),
        secondary: [
          "rounded-[var(--radius-sm)] border border-border bg-surface-elevated text-text-primary shadow-sm",
          "hover:bg-surface-3 hover:border-border-strong",
        ].join(" "),
        ghost: [
          "rounded-[var(--radius-sm)] bg-transparent text-text-secondary",
          "hover:bg-surface-2 hover:text-text-primary active:scale-100",
        ].join(" "),
        link: [
          "rounded-[var(--radius-sm)] bg-transparent text-primary underline-offset-4",
          "hover:underline active:scale-100 h-auto px-0 py-0",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-8 gap-1.5 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-[15px] has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    const isCta = variant === "cta";
    const isShine = variant === "shine";

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size }), className)}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-slot="button"
        data-variant={variant ?? "default"}
        data-size={size ?? "default"}
        {...props}
      >
        {isShine && (
          <>
            <span className="uv-shine-corner uv-shine-corner-tr" aria-hidden />
            <span className="uv-shine-corner uv-shine-corner-bl" aria-hidden />
            <span className="uv-shine-sweep" aria-hidden />
          </>
        )}

        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}

        {isShine ? (
          <span className="uv-shine-label">{children}</span>
        ) : (
          children
        )}

        {isCta && !loading && (
          <span className="uv-arrow-wrap" aria-hidden="true">
            <span className="uv-arrow" />
          </span>
        )}

        {!loading && !isCta && rightIcon}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
