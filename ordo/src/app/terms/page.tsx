import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { getContactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Ordo day-control application.",
};

export default function TermsPage() {
  const contact = getContactEmail();
  return (
    <div className="min-h-dvh bg-bg text-text-primary">
      <header className="border-b border-border">
        <div className="container-ordo flex h-14 items-center justify-between">
          <Logo href="/" size="sm" />
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Home
          </Link>
        </div>
      </header>
      <main className="container-ordo max-w-3xl py-12 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          Legal
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
          Terms of Use
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Last updated: August 3, 2026
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-text-secondary">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              1. Acceptance
            </h2>
            <p className="mt-3">
              By accessing or using Ordo, you agree to these Terms. If you do not agree,
              do not use the application.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              2. The product
            </h2>
            <p className="mt-3">
              Ordo is a day-control tool (priorities, schedule, focus, habits, reviews).
              Features may change. Demo authentication is for evaluation and stores
              credentials only on your device unless you enable sync.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              3. Your responsibilities
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>You are responsible for data you enter and for exports you download</li>
              <li>You must not abuse shared sync workspaces or attempt unauthorized access</li>
              <li>You must comply with applicable laws in your country</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              4. No professional advice
            </h2>
            <p className="mt-3">
              Ordo is productivity software, not medical, legal, or financial advice.
              Insights and AI-style drafts are assistive only.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              5. Availability &amp; disclaimer
            </h2>
            <p className="mt-3">
              The software is provided <strong className="text-text-primary">“as is”</strong>{" "}
              without warranties of any kind, to the maximum extent permitted by law. We do
              not guarantee uninterrupted availability or that local storage will never be
              cleared by your browser.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              6. Limitation of liability
            </h2>
            <p className="mt-3">
              To the fullest extent permitted by law, Ordo and its contributors are not
              liable for indirect, incidental, or consequential damages, or loss of data
              arising from use of the app.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              7. Self-hosted deployments
            </h2>
            <p className="mt-3">
              If you run Ordo on your own infrastructure, you are the data controller for
              that instance and must provide your own privacy notice to your users.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              8. Changes
            </h2>
            <p className="mt-3">
              We may update these Terms. Continued use after changes constitutes acceptance
              of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              9. Contact
            </h2>
            <p className="mt-3">
              Questions:{" "}
              <a
                className="font-medium text-primary hover:underline"
                href={`mailto:${contact}`}
              >
                {contact}
              </a>
            </p>
          </section>

          <p className="border-t border-border pt-8 text-sm text-text-tertiary">
            See also{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
