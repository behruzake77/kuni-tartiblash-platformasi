import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Ordo Input — Design Bible §4.9
 * surface-3 inset · 8px radius · focus ring primary 15%
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, leftIcon, rightIcon, ...props }, ref) => {
    const hasLeft = Boolean(leftIcon);
    const hasRight = Boolean(rightIcon);

    if (!hasLeft && !hasRight) {
      return (
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-[var(--radius-sm)] border bg-surface-3 px-3 py-2.5",
            "font-[family-name:var(--font-sans)] text-sm text-text-primary",
            "placeholder:text-text-placeholder",
            "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15",
            "disabled:cursor-not-allowed disabled:opacity-40",
            error
              ? "border-danger focus-visible:border-danger focus-visible:ring-danger/15"
              : "border-border",
            className
          )}
          ref={ref}
          aria-invalid={error || undefined}
          {...props}
        />
      );
    }

    return (
      <div className={cn("relative flex w-full items-center", className)}>
        {hasLeft && (
          <span
            className="pointer-events-none absolute left-3 text-text-tertiary [&_svg]:size-4"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-[var(--radius-sm)] border bg-surface-3 py-2.5",
            "font-[family-name:var(--font-sans)] text-sm text-text-primary",
            "placeholder:text-text-placeholder",
            "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15",
            "disabled:cursor-not-allowed disabled:opacity-40",
            hasLeft ? "pl-10" : "pl-3",
            hasRight ? "pr-10" : "pr-3",
            error
              ? "border-danger focus-visible:border-danger focus-visible:ring-danger/15"
              : "border-border"
          )}
          ref={ref}
          aria-invalid={error || undefined}
          {...props}
        />
        {hasRight && (
          <span
            className="pointer-events-none absolute right-3 text-text-tertiary [&_svg]:size-4"
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
