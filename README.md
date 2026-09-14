# Nova Template

Nova is a responsive website template for creative agencies, design studios and ambitious brands. The project uses Astro, Tailwind CSS, TypeScript and JSON based content files.

## Need a white-label delivery partner?

Have website projects that need extra delivery capacity? [Work with WebScale](https://webscale.pl/?utm_source=nova-readme&utm_medium=backlink&utm_campaign=t001-nova) for outsourced and white-label design, development and implementation support.

## Features

- Bilingual homepage with English and Polish versions.
- Hero, selected work, services, team, FAQ, testimonials and CTA sections.
- Responsive layout for mobile, tablet and desktop.
- Content separated from Astro components.
- Favicon generation, responsive images, sitemap and basic SEO metadata.
- Local fonts and a documented theme system.

## Getting started

Node.js 22 or newer is required, as specified in `package.json`.

```bash
npm ci
npm run dev
```

Astro will display the local development URL in the terminal.

## Documentation

- `CUSTOMIZATION.md`, brand, content, image and token customization.
- `CONTENT-GUIDE.md`, rules for replacing Nova demonstration content.
- `DEPLOYMENT.md`, build and static hosting instructions.
- `ASSETS-LICENSES.md`, responsibilities for demonstration assets.
- `MARKETPLACE-READINESS.md`, release status and final publication checklist.
- `CHANGELOG.md`, release history.

## Editing content

The main customization files are:

- `src/data/i18n/nova.json`, Nova content in English and Polish.
- `src/data/sections/*.json`, section and variant data.
- `src/data/global/company.json`, company, contact and branding data.
- `src/data/global/seo.json`, title, description, Open Graph image and indexing settings.
- `src/data/pages/index.json`, homepage section order.
- `site.config.mjs`, domain, locale and build scope.

Change content in JSON files instead of editing Astro components directly. After content changes, run `npm run check:data` and `npm run check:types`.

## Build and quality checks

```bash
npm run build
npm run check:types
npm run check:seo
npm run check:links
npm run check:images
npm run package:marketplace
```

Before publication, manually check the website on mobile and desktop, test navigation and forms, verify links, inspect Open Graph metadata, and check both language versions.

## Marketplace package

Run:

```bash
npm run package:marketplace
```

The command creates `release/t001-nova.zip` from the current Git commit. Generated files, local dependencies and unrelated uncommitted changes are not included in the archive.

## License

The current Nova release is free to use under the terms described in `LICENSE.md`. The source may be modified and used in one finished website project, but it may not be resold or redistributed as a source template package.

Future Nova versions, Pro editions and implementation services may be paid and may use different terms.

The template license does not replace the licenses of third-party dependencies, fonts, photographs, icons or other materials. Check every asset license and replace the demonstration materials before commercial use.

## Stack

- Astro 7
- Tailwind CSS 4
- TypeScript
- Vitest
