/** Public allowlist is only for client navigation/UI. Server API routes must
 * repeat this check against ORDO_ADMIN_EMAILS before returning sensitive data. */
export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  // Fallback keeps the project owner able to reach the panel while Render env is being configured.
  const raw = process.env.NEXT_PUBLIC_ORDO_ADMIN_EMAILS || "behruzismatullayev05@gmail.com";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.trim().toLowerCase());
}
