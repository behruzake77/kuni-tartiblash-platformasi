import { cn } from "@/lib/utils";

/**
 * Ordo Skeleton — Design Bible §4.9
 * Content-aware shimmer matching element shape
 */

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
