# Nova, customization guide

This guide explains the safest way to adapt Nova for a new brand.

## Start here

```bash
npm ci
npm run dev
```

The homepage is assembled from JSON data. Change content in `src/data`, not directly in Astro components.

## Brand and company data

Update:

```text
src/data/global/company.json
src/data/global/seo.json
src/data/navigation/header.json
src/data/navigation/footer.json
site.config.mjs
```

Use `company.json` for company details, branding and social links. Use `seo.json` for page titles, descriptions and indexing settings.

## Homepage content

The Nova homepage uses the following files:

```text
src/data/i18n/nova.json
src/data/sections/nova-hero-wireframe.json
src/data/sections/nova-projects.json
src/data/sections/nova-services.json
src/data/sections/nova-team.json
src/data/sections/faq3.json
src/data/sections/testimonial-v2.json
src/data/sections/nova-cta.json
```

Update both language objects in `src/data/i18n/nova.json` when changing homepage copy.

## Images

Replace the files in `public/assets/images/t001-nova/`. Keep the existing names when possible. If a name changes, update every matching JSON path.

Use descriptive `alt` text for every image. Do not put private client assets into the repository.

## Colors and typography

Review the design tokens in `design/`, `src/styles/themes.css` and `src/styles/global.css`. Keep token names stable so existing components continue to work.

## Validation

```bash
npm run check:data
npm run check:types
npm run check:seo
npm run check:links
npm run check:images
npm run build
```

Open the generated site on desktop and mobile before publishing.
