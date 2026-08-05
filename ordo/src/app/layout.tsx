import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/providers/theme-provider";
import { UserProvider } from "@/providers/user-provider";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ordo — Take control of your day",
    template: "%s · Ordo",
  },
  description:
    "Ordo is the calm command layer for your day — plan priorities, run focus blocks, track habits, and close the day with clarity.",
  applicationName: "Ordo",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ordo",
  },
  keywords: [
    "day planner",
    "focus timer",
    "habits",
    "daily review",
    "productivity",
    "time blocking",
  ],
  authors: [{ name: "Ordo" }],
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ordo",
    title: "Ordo — Take control of your day",
    description: "Plan, focus, and close every day with intention.",
    url: siteUrl,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ordo — Take control of every day" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "Ordo — Take control of your day",
    description: "Plan, focus, and close every day with intention.",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F1A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={GeistSans.variable}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-bg text-text-primary antialiased">
        <ThemeProvider>
          <UserProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-[var(--radius-sm)] focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
            >
              Skip to main content
            </a>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
