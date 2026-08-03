"use client";

import Link from "next/link";
import { ArrowRight, Cloud, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

/**
 * Button gallery — shadcn base + Uiverse-adapted variants
 */
export default function UiGalleryPage() {
  return (
    <div className="min-h-dvh bg-bg text-text-primary">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo href="/" size="sm" />
          <Link
            href="/app"
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Open app →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          Component gallery
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Buttons
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
          Base structure from{" "}
          <a
            className="text-primary hover:underline"
            href="https://ui.shadcn.com/docs/components/button"
            target="_blank"
            rel="noreferrer"
          >
            shadcn/ui
          </a>
          . Motion variants adapted from{" "}
          <a
            className="text-primary hover:underline"
            href="https://uiverse.io/"
            target="_blank"
            rel="noreferrer"
          >
            Uiverse.io
          </a>{" "}
          (galaxy archive), restyled with Ordo tokens. Credits in{" "}
          <code className="text-text-tertiary">components/ui/SOURCES.md</code>.
        </p>

        <section className="mt-12 space-y-8">
          <div>
            <h2 className="mb-4 text-sm font-semibold text-text-primary">
              Core (shadcn pattern)
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default">Default</Button>
              <Button variant="primary">Primary</Button>
              <Button variant="gradient">Gradient</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          <div>
            <h2 className="mb-1 text-sm font-semibold text-text-primary">
              Uiverse-adapted
            </h2>
            <p className="mb-4 text-xs text-text-tertiary">
              Hover each button to see the original effect (tokenized).
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-2">
                <Button variant="cta" size="lg">
                  Get started
                </Button>
                <p className="text-[11px] text-text-tertiary">
                  cta · satyamchaudharydev
                </p>
              </div>
              <div className="space-y-2">
                <Button variant="shine" size="lg" leftIcon={<Cloud className="size-4" />}>
                  Sync now
                </Button>
                <p className="text-[11px] text-text-tertiary">shine · Itskrish01</p>
              </div>
              <div className="space-y-2">
                <Button variant="lift" size="lg">
                  Go Pro
                </Button>
                <p className="text-[11px] text-text-tertiary">lift · Codecite</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-text-primary">Sizes</h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">XS</Button>
              <Button size="sm">SM</Button>
              <Button size="default">Default</Button>
              <Button size="md">MD</Button>
              <Button size="lg">LG</Button>
              <Button size="icon" aria-label="icon">
                <Sparkles className="size-4" />
              </Button>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-text-primary">
              States
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button leftIcon={<Sparkles className="size-4" />}>With icon</Button>
              <Button
                variant="cta"
                size="lg"
                rightIcon={<ArrowRight className="size-4" />}
              >
                {/* cta already draws arrow; rightIcon ignored when cta */}
                Continue
              </Button>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-text-primary">
              asChild + Link
            </h2>
            <Button variant="cta" size="lg" asChild>
              <Link href="/signup">Start free</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
