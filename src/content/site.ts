// Single source for business details used by the page, the SEO tags,
// structured data, sitemap and robots.txt (see scripts/prerender.mjs).
export const site = {
  // Change this when moving to a custom domain (no trailing slash)
  url: "https://db-it.vercel.app",
  name: "Daniele Buatti",
  businessName: "Daniele Buatti — IT Support for Creative Professionals",
  title: "IT Support for Creative Professionals in Melbourne | Daniele Buatti",
  description:
    "Melbourne IT support for performers, directors, producers and arts companies. Apple setup, security audits, data recovery and on-site help from a Musical Director who speaks your language.",
  email: "Daniele.buatti@gmail.com",
  // Shown on the site and in structured data only when filled in, e.g. "+61 4xx xxx xxx"
  phone: "",
  locality: "Melbourne",
  region: "VIC",
  country: "AU",
  areaServed: "Melbourne inner suburbs and Bayside (on-site); Australia-wide (remote)",
} as const;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
