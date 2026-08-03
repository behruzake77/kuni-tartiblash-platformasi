import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { getContactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ordo handles your data — local-first by default.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Last updated: August 3, 2026 · Effective for Ordo web app
        </p>

        <div className="prose-ordo mt-10 space-y-8 text-[15px] leading-relaxed text-text-secondary">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              1. Summary
            </h2>
            <p className="mt-3">
              Ordo is built <strong className="text-text-primary">local-first</strong>.
              Your day board, habits, focus sessions, and settings are stored primarily
              in your browser (<code className="text-text-tertiary">localStorage</code>
              ). We design the product so you can use it without creating a cloud account.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              2. Data we store on your device
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Tasks, priorities, schedule blocks, habits, focus logs, day reviews</li>
              <li>Preferences (language, theme, reminders, workspace key)</li>
              <li>Optional local profile (display name, email) for demo auth</li>
              <li>Activity history and in-app notification inbox</li>
              <li>Weekly snapshots for insights charts</li>
            </ul>
            <p className="mt-3">
              This data does not leave your device unless you export it, enable sync, or
              use a configured remote endpoint.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              3. Optional sync
            </h2>
            <p className="mt-3">
              If you set a <strong className="text-text-primary">workspace key</strong>{" "}
              and use built-in server sync, your payload may be stored on the server that
              hosts Ordo (under <code className="text-text-tertiary">.data/sync/</code>
              ). If you configure an external{" "}
              <code className="text-text-tertiary">NEXT_PUBLIC_ORDO_SYNC_URL</code>, data
              is sent to that endpoint under your control.
            </p>
            <p className="mt-3">
              Sync is opt-in. Without a workspace key or remote URL, Ordo stays on-device.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              4. Notifications
            </h2>
            <p className="mt-3">
              Browser notifications for schedule reminders require your explicit permission.
              You can revoke permission anytime in browser settings. Ordo may also show
              in-app toasts that never leave the device.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              5. Analytics &amp; cookies
            </h2>
            <p className="mt-3">
              The default open-source / self-hosted Ordo build does not embed third-party
              advertising trackers. Hosting providers (e.g. Vercel) may collect standard
              server logs (IP, user agent) as part of delivering the site.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              6. Your controls
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Export JSON / Markdown / ICS from Settings</li>
              <li>Reset today or wipe all local Ordo data</li>
              <li>Clear site data in your browser to fully remove local state</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              7. Children
            </h2>
            <p className="mt-3">
              Ordo is not directed at children under 13. Do not use the product if you are
              not permitted to agree to these terms in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-primary">
              8. Contact
            </h2>
            <p className="mt-3">
              Privacy questions:{" "}
              <a
                className="font-medium text-primary hover:underline"
                href={`mailto:${contact}`}
              >
                {contact}
              </a>
              . Self-hosted operators should set{" "}
              <code className="text-text-tertiary">NEXT_PUBLIC_CONTACT_EMAIL</code>{" "}
              for their own instance.
            </p>
          </section>

          <p className="border-t border-border pt-8 text-sm text-text-tertiary">
            See also{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Use
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
