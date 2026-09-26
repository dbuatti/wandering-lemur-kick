// Post-build step: render the home page to static HTML and write the SEO files.
//
//   dist/index.html  prerendered home page + canonical, Open Graph and JSON-LD
//   dist/app.html    empty shell (noindex) that vercel.json serves for every other route
//   dist/sitemap.xml, dist/robots.txt
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const serverDir = path.join(root, "dist-server");

const { render, site, tiers, faqs } = await import(
  pathToFileURL(path.join(serverDir, "entry-server.js")).href
);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// JSON inside <script> must not be able to close the tag
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

const pageUrl = `${site.url}/`;
const ogImage = `${site.url}/og-image.png`;

const business = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${pageUrl}#business`,
  name: site.businessName,
  description: site.description,
  url: pageUrl,
  image: ogImage,
  email: site.email,
  ...(site.phone ? { telephone: site.phone } : {}),
  priceRange: `$${Math.min(...tiers.map((t) => t.rate))}–$${Math.max(...tiers.map((t) => t.rate))} per hour`,
  currenciesAccepted: "AUD",
  address: {
    "@type": "PostalAddress",
    addressLocality: site.locality,
    addressRegion: site.region,
    addressCountry: site.country,
  },
  areaServed: [
    { "@type": "City", name: "Melbourne" },
    { "@type": "Country", name: "Australia" },
  ],
  founder: { "@type": "Person", name: site.name, jobTitle: "Musical Director and IT Specialist" },
  knowsAbout: [
    "Apple device setup and support",
    "Cybersecurity and privacy audits",
    "Data recovery",
    "Cloud storage organisation",
    "IT support for the performing arts",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "IT support service tiers",
    itemListElement: tiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      description: `${tier.subtitle} ${tier.features.join(", ")}.`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: tier.rate,
        priceCurrency: "AUD",
        unitText: "hour",
      },
    })),
  },
};

const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const headTags = [
  `<link rel="canonical" href="${pageUrl}" />`,
  `<meta property="og:url" content="${pageUrl}" />`,
  `<meta property="og:image" content="${ogImage}" />`,
  `<meta property="og:image:width" content="1200" />`,
  `<meta property="og:image:height" content="630" />`,
  `<meta property="og:image:alt" content="${escapeHtml(site.businessName)}" />`,
  `<meta name="twitter:image" content="${ogImage}" />`,
  `<script type="application/ld+json">${jsonLd(business)}</script>`,
  `<script type="application/ld+json">${jsonLd(faqPage)}</script>`,
].join("\n    ");

const withMeta = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(site.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escapeHtml(site.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escapeHtml(site.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escapeHtml(site.description)}$2`);

if (!template.includes("<!--app-head-->") || !template.includes('<div id="root"></div>')) {
  throw new Error("dist/index.html is missing the <!--app-head--> or empty #root placeholder");
}

// Everything except "/" is the portal, public invoices or 404s: keep them out of search
const shell = withMeta(template).replace("<!--app-head-->", '<meta name="robots" content="noindex" />');
fs.writeFileSync(path.join(dist, "app.html"), shell);

const appHtml = render("/");
const home = withMeta(template)
  .replace("<!--app-head-->", headTags)
  .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
fs.writeFileSync(path.join(dist, "index.html"), home);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`,
);
fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`,
);

fs.rmSync(serverDir, { recursive: true, force: true });
console.log(`Prerendered / (${(appHtml.length / 1024).toFixed(0)} KB of HTML) and wrote app.html, sitemap.xml, robots.txt`);
