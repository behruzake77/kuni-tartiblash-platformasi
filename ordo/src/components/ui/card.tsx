import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Ordo Card — Design Bible §4.9
 * Dark: surface-2 + 1px border, no shadow
 * Light: white + border + shadow-sm
 * Hover: border strengthens, subtle lift
 */

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    interactive?: boolean;
  }
>(({ className, interactive = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-2",
      "dark:bg-[linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.018))] dark:backdrop-blur-sm",
      "dark:shadow-[0_10px_32px_rgba(0,0,0,.18)] shadow-sm",
      "transition-[border-color,box-shadow,background-color,transform] duration-[var(--duration-base)] ease-[var(--ease-soft)]",
      interactive && [
        "cursor-pointer will-change-transform",
        "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg",
        "dark:hover:bg-[linear-gradient(145deg,rgba(124,92,255,.11),rgba(255,255,255,.035))]",
      ],
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-6 pb-0", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-[family-name:var(--font-display)] text-lg font-semibold tracking-[var(--tracking-slight)] text-text-primary",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-text-secondary leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3 p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
