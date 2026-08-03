/** Public site configuration helpers */

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function getContactEmail() {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    process.env.CONTACT_EMAIL ||
    "hello@ordo.app"
  );
}

export function getAppVersion() {
  return process.env.NEXT_PUBLIC_APP_VERSION || "0.9.2";
}
