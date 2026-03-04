# Annapurna Rasoi Website

[![CI](https://github.com/smayankthakur/Annapurna-Rasoi/actions/workflows/ci.yml/badge.svg)](https://github.com/smayankthakur/Annapurna-Rasoi/actions/workflows/ci.yml)

Production-ready, SEO-focused static website for **Annapurna Rasoi**, a pure vegetarian cloud kitchen serving Paschim Vihar and nearby West Delhi areas.

## Features

- SEO-optimized local landing pages with structured data (JSON-LD)
- Reusable template architecture using Nunjucks partials
- Mobile-first responsive design with accessible navigation
- Performance optimization (WebP assets, lazy loading, explicit media dimensions)
- CI validation for HTML, CSS, JS, and formatting
- GitHub Pages deployment workflow with optional preview deployment

## Tech Stack

- HTML5 (generated static output)
- CSS3 (responsive, mobile-first)
- Vanilla JavaScript
- Nunjucks templates + Node.js build scripts
- GitHub Actions for CI/CD

## Folder Structure

```text
/
|-- index.html
|-- menu/
|   |-- index.html
|   |-- rajma-rice/index.html
|   |-- chole-rice/index.html
|   |-- aloo-paratha/index.html
|   |-- poori-aloo/index.html
|-- about/index.html
|-- contact/index.html
|-- veg-food-delivery-paschim-vihar/index.html
|-- 404.html
|-- robots.txt
|-- sitemap.xml
|-- assets/
|   |-- css/style.css
|   |-- css/style.min.css
|   |-- js/script.js
|   |-- js/script.min.js
|   |-- images/*
|-- src/
|   |-- data/site.json
|   |-- templates/*.njk
|   |-- templates/partials/*.njk
|-- scripts/
|   |-- build.mjs
|   |-- minify-assets.mjs
|   |-- optimize-images.mjs
|-- .github/
|   |-- workflows/*
|   |-- ISSUE_TEMPLATE/*
|   |-- PULL_REQUEST_TEMPLATE.md
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Generate static pages + minified assets:

```bash
npm run build
```

3. Optimize images:

```bash
npm run optimize:images
```

4. Validate quality checks:

```bash
npm run validate
```

## Deployment (GitHub Pages)

1. Push to `main`.
2. GitHub Actions runs `.github/workflows/deploy-pages.yml`.
3. Pages artifact is deployed automatically.
4. Ensure repository settings have **Pages source: GitHub Actions** enabled.

## Alternative Deployments

- **Vercel Preview** via `.github/workflows/vercel-preview.yml` (requires Vercel secrets).
- **Netlify** using build command `npm run build` and publish directory as repository root.

## Contribution

1. Create a branch from `main`.
2. Make changes via template/data source files where possible.
3. Run `npm run validate`.
4. Open PR using the provided template.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
