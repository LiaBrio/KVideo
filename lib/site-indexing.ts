/**
 * Indexing policy for the public AdSense site.
 *
 * The live deployment is meant to earn traffic on public pages. Index those
 * only when the site is not behind the server password gate and this build is
 * not a non-production Vercel deploy (previews stay out of the index).
 *
 * Device-local passwords are per browser and are not a site-wide gate.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tv.chainseek.top'
).replace(/\/$/, '');

export function isPubliclyIndexable(): boolean {
  if (process.env.ACCESS_PASSWORD) return false;
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== 'production') return false;
  return true;
}
