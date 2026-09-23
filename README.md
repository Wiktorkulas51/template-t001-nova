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

## AI-assisted development

Nova is structured for fast customization with Cursor, Claude, Codex and GitHub Copilot. The homepage is data-driven, sections are registered and reusable, design tokens are documented, and validation commands catch common mistakes before deployment.

Start with [`AI-QUICKSTART.md`](AI-QUICKSTART.md). After an AI-assisted change, run:

```bash
npm run ai:check
```

Use `npm run build` before packaging or publishing the template.

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

Freelancers, developers and agencies who need to use Nova across multiple projects can email [kontakt@webscale.pl](mailto:kontakt@webscale.pl) with the subject `Nova multi-project license request`. You can simply ask for the license or [open a prefilled email with optional questions](mailto:kontakt@webscale.pl?subject=Nova%20multi-project%20license%20request&body=Hi%20WebScale%2C%0A%0AI%27d%20like%20to%20request%20a%20free%20multi-project%20license%20for%20Nova.%0A%0A1.%20What%20best%20describes%20you%3F%20Freelancer%2C%20developer%2C%20agency%2C%20or%20other%3F%0A%0A2.%20Where%20did%20you%20find%20Nova%2C%20and%20what%20made%20you%20choose%20it%3F%0A%0A3.%20What%20types%20of%20projects%20do%20you%20plan%20to%20build%20with%20it%3F%0A%0A4.%20What%20would%20you%20improve%20after%20trying%20the%20template%3F%20Optional%20if%20you%20have%20not%20used%20it%20yet.%0A%0A5.%20When%20you%20first%20looked%20at%20Nova%2C%20what%20price%20would%20you%20have%20expected%20for%20multi-project%20use%3F%20Optional.%0A%0A6.%20What%20would%20be%20most%20useful%20to%20you%20in%20the%20future%3F%20Complete%20templates%2C%20website%20sections%2C%20UI%20components%2C%20or%20something%20else%3F%20Optional.%0A%0AThank%20you.). Sharing feedback is appreciated, and the suggested questions in `LICENSE.md` are optional. Permission is valid only after written approval. See `LICENSE.md` for the terms.

Future Nova versions, Pro editions and implementation services may be paid and may use different terms.

The template license does not replace the licenses of third-party dependencies, fonts, photographs, icons or other materials. Check every asset license and replace the demonstration materials before commercial use.

## Stack

- Astro 7
- Tailwind CSS 4
- TypeScript
- Vitest
