"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-text-primary">
      <p className="font-[family-name:var(--font-mono)] text-sm text-danger">
        Something broke
      </p>
      <h1 className="mt-3 text-center font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
        We hit an unexpected error
      </h1>
      <p className="mt-3 max-w-md text-center text-sm text-text-secondary">
        Your local data is usually fine — try again. If it keeps happening,
        export a backup from Settings.
      </p>
      {error.digest && (
        <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-text-tertiary">
          {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="primary" size="lg" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="secondary" size="lg" asChild>
          <Link href="/app">Back to Today</Link>
        </Button>
      </div>
    </div>
  );
}
