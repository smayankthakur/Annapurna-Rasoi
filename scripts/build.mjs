import fs from "node:fs/promises";
import path from "node:path";
import nunjucks from "nunjucks";
import prettier from "prettier";

const root = process.cwd();
const templatesDir = path.join(root, "src", "templates");
const dataPath = path.join(root, "src", "data", "site.json");
const site = JSON.parse(await fs.readFile(dataPath, "utf8"));

nunjucks.configure(templatesDir, {
  autoescape: true,
  noCache: true,
  trimBlocks: true,
  lstripBlocks: true,
});

const prettierOptions = (await prettier.resolveConfig(path.join(root, "index.html"))) ?? {};

const heroCriticalCss =
  ".hero{padding:4rem 0 3rem;background:linear-gradient(180deg,#f5efe6 0%,#f9f4ec 100%)}.hero .button-row{display:flex;gap:.75rem;flex-wrap:wrap}.hero h1{margin:0}";

const canonicalPages = [];

function fullUrl(pathname) {
  return `${site.domain}${pathname}`;
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: fullUrl(item.path),
    })),
  };
}

function baseLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${site.domain}/#localbusiness`,
        name: site.brand,
        url: site.domain,
        image: `${site.domain}/assets/images/annapurna-rasoi-og.webp`,
        telephone: site.phoneDisplay,
        priceRange: "\u20b9\u20b9",
        servesCuisine: "Vegetarian",
        serviceType: "Food Delivery",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Street No. 2, R Z F-210, Nihal Vihar, Nikhil Vihar, Nangloi",
          addressLocality: "New Delhi",
          addressRegion: "Delhi",
          postalCode: "110041",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: site.geo.lat,
          longitude: site.geo.lng,
        },
        areaServed: site.areaServed,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "11:00",
            closes: "22:00",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "327",
        },
        sameAs: [site.orderUrl],
      },
    ],
  };
}

async function formatHtml(content) {
  return prettier.format(content, { ...prettierOptions, parser: "html" });
}

async function writePage(filePath, template, context) {
  const rendered = nunjucks.render(template, context);
  const output = await formatHtml(rendered);
  const absPath = path.join(root, filePath);
  await fs.mkdir(path.dirname(absPath), { recursive: true });
  await fs.writeFile(absPath, output, "utf8");
}

function layoutContext({ page, content, schemas = [] }) {
  return {
    site,
    page,
    schemas,
    content,
  };
}

function addCanonical(pathname) {
  canonicalPages.push(pathname);
}

const homePage = {
  path: "/",
  title: "Best Home-Style Veg Food in Paschim Vihar | Annapurna Rasoi",
  description:
    "Order pure veg home-style meals in Paschim Vihar. Annapurna Rasoi serves Rajma Chawal, Chole Rice, Aloo Paratha, and Poori Aloo with fast delivery.",
  canonical: fullUrl("/"),
  ogImage: `${site.domain}/assets/images/annapurna-rasoi-og.webp`,
  inlineCritical: heroCriticalCss,
};

const homeSchemas = [
  baseLocalBusinessSchema(),
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you deliver daily in Paschim Vihar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Annapurna Rasoi delivers daily through Zomato across Paschim Vihar and nearby areas.",
        },
      },
      {
        "@type": "Question",
        name: "What are your most ordered dishes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rajma Chawal and Chole Rice are our most ordered dishes in Paschim Vihar.",
        },
      },
      {
        "@type": "Question",
        name: "Is this a dine-in restaurant?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, Annapurna Rasoi is a pure veg cloud kitchen focused on delivery orders.",
        },
      },
      {
        "@type": "Question",
        name: "How can I order quickly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use the direct Zomato ordering link on our website for the fastest checkout and delivery tracking.",
        },
      },
    ],
  },
];

const homeContent = nunjucks.render("index.njk", { site });
await writePage(
  "index.html",
  "layout.njk",
  layoutContext({ page: homePage, content: homeContent, schemas: homeSchemas })
);
addCanonical("/");

const menuPage = {
  path: "/menu/",
  title: "Menu | Annapurna Rasoi Paschim Vihar",
  description:
    "Explore Rajma Chawal, Chole Rice, Aloo Paratha, Poori Aloo and value combos in Paschim Vihar.",
  canonical: fullUrl("/menu/"),
  ogImage: `${site.domain}/assets/images/menu-pure-veg-paschim-vihar.webp`,
  inlineCritical: ".hero{padding:3.6rem 0 2.8rem}",
};

const menuSchemas = [
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu/" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Annapurna Rasoi Menu",
    url: fullUrl("/menu/"),
    hasMenuItem: [
      ...site.dishes.map((dish) => ({
        "@type": "MenuItem",
        name: dish.name,
        url: fullUrl(`/menu/${dish.slug}/`),
        offers: {
          "@type": "Offer",
          price: dish.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
      })),
      ...site.combos.map((combo) => ({
        "@type": "MenuItem",
        name: combo.name,
        offers: {
          "@type": "Offer",
          price: combo.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
      })),
    ],
  },
];

const menuContent = nunjucks.render("menu.njk", { site });
await writePage(
  "menu/index.html",
  "layout.njk",
  layoutContext({ page: menuPage, content: menuContent, schemas: menuSchemas })
);
addCanonical("/menu/");

for (const dish of site.dishes) {
  const dishPage = {
    path: `/menu/${dish.slug}/`,
    title: dish.title,
    description: dish.metaDescription,
    canonical: fullUrl(`/menu/${dish.slug}/`),
    ogType: "article",
    ogImage: `${site.domain}/assets/images/${dish.image}`,
    inlineCritical: ".hero{padding:3.6rem 0 2.8rem}",
  };

  const dishSchemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Menu", path: "/menu/" },
      { name: dish.name, path: `/menu/${dish.slug}/` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "MenuItem",
      name: dish.name,
      description: dish.longDescription,
      image: `${site.domain}/assets/images/${dish.image}`,
      offers: {
        "@type": "Offer",
        price: dish.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: site.orderUrl,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "150",
      },
    },
  ];

  const dishContent = nunjucks.render("dish.njk", { site, dish });
  await writePage(
    `menu/${dish.slug}/index.html`,
    "layout.njk",
    layoutContext({ page: dishPage, content: dishContent, schemas: dishSchemas })
  );
  addCanonical(`/menu/${dish.slug}/`);
}

const internalPages = [
  {
    file: "about/index.html",
    path: "/about/",
    title: "About Annapurna Rasoi | Pure Veg Cloud Kitchen",
    description:
      "Learn about Annapurna Rasoi, a pure vegetarian cloud kitchen serving Paschim Vihar and West Delhi.",
    h1: "About Annapurna Rasoi",
    eyebrow: "Annapurna Rasoi",
    subtext: "Pure vegetarian cloud kitchen focused on home-style North Indian meals.",
    contentTitle: "Our Kitchen Promise",
    paragraphs: [
      "Annapurna Rasoi was built to serve dependable veg food in Paschim Vihar with consistent taste, hygienic preparation, and fast delivery support.",
      "Our kitchen specializes in Rajma Chawal, Chole Rice, Aloo Paratha, and practical meal combos for office lunch and family dinner orders.",
      "Every meal is prepared fresh in a clean pure vegetarian setup with packaging standards designed for delivery-first quality.",
    ],
    areas: false,
    contactForm: false,
  },
  {
    file: "contact/index.html",
    path: "/contact/",
    title: "Contact Annapurna Rasoi | Nangloi, New Delhi",
    description: "Contact Annapurna Rasoi for pure veg food delivery details and support.",
    h1: "Contact Annapurna Rasoi",
    eyebrow: "Annapurna Rasoi",
    subtext: "Reach us for menu queries and fast delivery support.",
    contentTitle: "Get In Touch",
    paragraphs: [
      `Address: ${site.address}`,
      `Phone: <a href="${site.phoneHref}">${site.phoneDisplay}</a>`,
      "For fastest checkout and live order tracking, place your order through Zomato.",
    ],
    areas: false,
    contactForm: true,
  },
  {
    file: "veg-food-delivery-paschim-vihar/index.html",
    path: "/veg-food-delivery-paschim-vihar/",
    title: "Veg Food Delivery in Paschim Vihar | Annapurna Rasoi",
    description:
      "Fast veg food delivery in Paschim Vihar, Punjabi Bagh, Peera Garhi, Nangloi and nearby areas.",
    h1: "Veg Food Delivery in Paschim Vihar",
    eyebrow: "Delivery Coverage",
    subtext: "Reliable pure veg meal delivery across key West Delhi neighborhoods.",
    contentTitle: "Delivery Areas",
    paragraphs: [
      "Annapurna Rasoi delivers home-style vegetarian meals across Paschim Vihar, Punjabi Bagh, Peera Garhi, Nangloi, Mianwali Nagar, and Rajouri Garden.",
      "Choose Rajma Chawal, Chole Rice, and value combos for office lunch, family dinner, and regular daily meal plans.",
      "All meals are prepared in a hygienic pure veg kitchen and dispatched with packaging that protects freshness during delivery.",
    ],
    areas: true,
    contactForm: false,
  },
];

for (const internalPage of internalPages) {
  const page = {
    path: internalPage.path,
    title: internalPage.title,
    description: internalPage.description,
    canonical: fullUrl(internalPage.path),
    ogImage: `${site.domain}/assets/images/annapurna-rasoi-og.webp`,
  };

  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: internalPage.h1, path: internalPage.path },
    ]),
  ];

  const content = nunjucks.render("internal-page.njk", {
    site,
    page: internalPage,
  });
  await writePage(internalPage.file, "layout.njk", layoutContext({ page, content, schemas }));
  addCanonical(internalPage.path);
}

const notFoundPage = {
  path: "/404.html",
  title: "Page Not Found | Annapurna Rasoi",
  description:
    "The page you are looking for is unavailable. Explore Annapurna Rasoi menu and order fresh veg meals.",
  canonical: fullUrl("/404.html"),
  ogImage: `${site.domain}/assets/images/annapurna-rasoi-og.webp`,
};

const notFoundContent = nunjucks.render("404.njk", { site });
await writePage(
  "404.html",
  "layout.njk",
  layoutContext({ page: notFoundPage, content: notFoundContent, schemas: [] })
);

const redirects = [
  { from: "aloo-prantha-paschim-vihar/index.html", to: "/menu/aloo-paratha/" },
  { from: "chole-rice-paschim-vihar/index.html", to: "/menu/chole-rice/" },
  { from: "poori-aloo-paschim-vihar/index.html", to: "/menu/poori-aloo/" },
  { from: "rajma-rice-paschim-vihar/index.html", to: "/menu/rajma-rice/" },
  { from: "rajma-chawal-paschim-vihar.html", to: "/menu/rajma-rice/" },
  { from: "menu/rajma-chawal-paschim-vihar/index.html", to: "/menu/rajma-rice/" },
];

for (const redirect of redirects) {
  const html = await formatHtml(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${redirect.to}"><link rel="canonical" href="${fullUrl(redirect.to)}"><title>Redirecting...</title></head><body><p>Redirecting to <a href="${redirect.to}">${redirect.to}</a>.</p></body></html>`
  );
  const absPath = path.join(root, redirect.from);
  await fs.mkdir(path.dirname(absPath), { recursive: true });
  await fs.writeFile(absPath, html, "utf8");
}

const sitemapEntries = canonicalPages
  .map((pathname) => `  <url><loc>${fullUrl(pathname)}</loc></url>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
await fs.writeFile(path.join(root, "sitemap.xml"), sitemap, "utf8");

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${fullUrl("/sitemap.xml")}\n`;
await fs.writeFile(path.join(root, "robots.txt"), robots, "utf8");
