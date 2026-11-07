// Single source of truth for site / client project configuration.
// Edit THIS file when changing domain.
// Environment domain used during build.
export const SITE_URL = 'https://webscale.pl/preview/nova/';
// Why: a "Deploy to Vercel" clone has no PUBLIC_SITE_URL, so without this fallback
// it would build with the /preview/nova/ asset prefix and break on the root domain.
const vercelSiteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/`
  : '';
export const BUILD_SITE_URL = process.env.PUBLIC_SITE_URL || vercelSiteUrl || SITE_URL;
export const ACTIVE_TEMPLATE = 'nova';

// Nova currently ships English and Polish routes. SITE_LOCALE selects the
// default locale for shared pages; the homepage language switcher remains active.
export const SITE_LOCALE = 'en';

// BUILD_SCOPE — what goes into build (dist/) and what stays dev-only.
// Dev has everything (for prototyping), build is clean per project scope.
// Example one-page: pages: ['/', '/pl'] keeps only homepage
// (EN + PL) + 404, removes other subpages (blog, contact, services...).
export const BUILD_SCOPE = {
  // Allowlist of paths to keep in build. Empty [] = all.
  // Prefix works: '/pl' keeps '/pl/', '/pl/cookies/' etc.
  // 404 is always kept regardless of this list.
  pages: ['/', '/pl', '/cookies', '/polityka-prywatnosci'],
  // Denylist — always removed from dist/ (dev-only, prototypes, demo).
  // Entry matches by first path segment. Dev and QA stay out of production build.
  forceRemove: ['starwind-demo', 'layout-test', 'roofing', 'dev', 'qa'],
  // Whether to clean unused media (images, videos, fonts) from dist/.
  images: true,
};

// The HTML export builds with HTML_EXPORT=1 to keep the output readable and to switch off the view-transition router.
export const IS_HTML_EXPORT = process.env.HTML_EXPORT === '1';

export const HTML_EXPORT = {
  slug: 'nova',
  title: 'Nova',
  description: 'Free Astro template for service companies, bilingual EN and PL.',
  // All photo variants are now AI-generated and documented in ASSETS-LICENSES.md.
  restrictedImages: [],
};
