import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-text-primary">
      <header className="border-b border-border">
        <div className="container-ordo flex h-14 items-center">
          <Logo href="/" size="sm" />
        </div>
      </header>
      <main className="container-ordo flex flex-1 flex-col items-start justify-center py-20">
        <p className="font-[family-name:var(--font-mono)] text-sm text-primary">
          404
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
          This page is off the schedule
        </h1>
        <p className="mt-3 max-w-md text-text-secondary">
          The link may be broken, or the page moved. Your day board is still
          where you left it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="cta" size="lg" asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/app">Open Today</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
