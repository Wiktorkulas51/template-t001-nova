# Starter Kit — AI Context

## 0. FIRST COMMAND (always before work)

```bash
npm run qa:help
```

## 0a. WORKFLOW ORDER (for a contextless agent)

1. **Read context** — AGENTS.md, .docs/CONTEXT.md, DESIGN_RULES.md
2. **Configure company data** — edit `src/data/global/company.json` and `src/config/site.ts`
3. **Choose components** — check `.docs/COMPONENTS.md`, `src/config/component-manifest.ts` and `src/components/registry/`
4. **Implement** — use atoms (Heading, Text, Button), layouts (Section, Container, Grid), registry blocks
5. **QA** — run `npm run qa`
6. **Build** — `npm run build`
7. **Rendered HTML check** — verify `dist/` for correct structure

## 0b. SOURCE OF TRUTH (where company data lives)

| What | Where |
|---|---|
| Company name, address, phone, email, social media | `src/data/global/company.json` |
| SEO (title, description, OG image, URL) | `src/data/global/seo.json` |
| Navigation (menu, CTA) | `src/data/navigation/header.json` |
| Footer (links, newsletter) | `src/data/navigation/footer.json` |
| Domains, URL, active template | `site.config.mjs` |
| Site configuration (colors, fonts, nav, social, contact, locale) | `src/config/site.ts` |
| Section content (FAQ, testimonials, marquee) | `src/data/sections/*.json` |
| Page config (section order) | `src/data/pages/*.json` |

**Rule:** All texts and data in JSON, NEVER in `.astro`. Edit JSON, not components.

## 0c. HOW TO CREATE A NEW PAGE

1. Add page config in `src/data/pages/[slug].json`:
   ```json
   { "seo": { "title": "...", "description": "..." }, "sections": [...] }
   ```
2. The page automatically appears under `/[slug]/` (thanks to `[...page].astro`)
3. Make sure the page has exactly one `<h1>`
4. All internal links must have a trailing slash (`/contact/` not `/contact`)
5. Run `npm run qa`

## 0d. HOW TO USE COMPONENTS

- **Atoms**: `Heading.astro`, `Text.astro`, `Button.astro`, `Logo.astro` — always render text through them
- **Layout**: `Section.astro`, `Container.astro`, `Grid.astro`, `Stack.astro`
- **Molecules**: `Navbar`, `Footer`, `SectionHeader`, `CookieConsent`
- **Registry (blocks)**: `FooterColumnsBlock`, `TestimonialsMarqueeBlock`, etc.
- **Forbidden**: `animate-pulse`, pill badges (`rounded-full bg-brand-primary/10`), `<p>`/`<h1>` instead of Heading/Text

## 1. Project Documentation (read before acting)

- `DESIGN_RULES.md` — **read first**: design preferences, anti-patterns, what NOT to do
- `.docs/BLOCK_PREFERENCES.md` — **approved block list**: only blocks marked "OK" may be used. The rest → custom from atoms
- `.docs/CONTEXT.md` — architecture, path aliases, design sync
- `.docs/AI_STANDARDS.md` — **mandatory** code standards and anti-patterns
- `.docs/COMPONENTS.md` — map of all components (Atomic Design)
- `.docs/CONTENT_ARCHITECTURE.md` — page and section data architecture
- `.docs/BLOCK_FIRST_WORKFLOW.md` — how to build blocks (3 layers: structure/theming/decoration slots)
- `.docs/ASSETS_GUIDE.md` — branding, favicons, image optimization
- `.docs/CMS_STRUCTURE.md` — Decap CMS + config.yml generation
- `.docs/CMS_PANEL.md` — **actual client CMS panel structure** (collections, items, fields, file-to-panel mapping)
- `.docs/CMS_RULES.md` — **what the client can change in CMS and what not** (onboarding, field hiding)
- `.docs/STARWIND.md` — Starwind UI: list of components + imports + docs links
- `.docs/WIREFRAME_WORKFLOW.md` — **how AI creates pages via JSON page config + sections (Phase 1)**
- `.docs/QA-RUNBOOK.md` — **how to run QA and what to do manually**
- `.docs/QA-TASKS.md` — **list of tasks to do**
- `.docs/VERSION_TOOLBAR.md` — **UI variant prototyping** (toolbar `?vt=1`, section 10 below)

## 2. Key Commands

## 2a. Template product scaffold

Starter Kit jest źródłem dla dwóch zastosowań: projektów WebScale oraz osobnych produktów Templar. Nowy template twórz poza tym repozytorium przez:

```powershell
./create-template.ps1 -Id T001 -Name Nova
```

Skrypt tworzy `D:\Programy\client-projects\templates\T001-Nova`, pomija sekrety, zależności, buildy i wewnętrzną dokumentację Starter Kita, a następnie aktualizuje nazwę pakietu, demo URL i plik `TEMPLATE.md`. Nie używaj tego skryptu do onboardingu klienta.

| Command | Description |
|---------|------|
| `npm run dev` | Dev server |
| `npm run build` | Build with asset generation |
| `npm run check:atomic` | Atomic Design compliance after component changes |
| `npm run check:imports` | Checks whether imports use aliases |
| `npm run check:data` | Validates page configuration and section data contracts |
| `npm run design:sync` | Sync design tokens MD → CSS |
| `npm run cms:gen` | Generate Decap CMS config.yml |
| `npm run cms:list` | Preview CMS panel content (collections, files, fields, hidden) |
| `npm run assets:gen` | Generate favicons from SVG |
| `npm run assets:img` | Image optimization (AVIF plus WebP, variants 220/800/1600 px, autoOrient EXIF, deterministic skip in CI) |
| `npm run assets:videos` | Local video compression via ffmpeg (mp4/webm, CRF 26/28, max 1920px, webm→mp4) |
| `npm run test` | Vitest |
| `npm run push` | Build + FTP deploy |
| `npm run qa:help` | **Always the first command** — QA profiles |
| `npm run qa` | **Standard gate: tests + check:mobile + check:links + check:content + build** |
| `npm run qa:strict` | Like qa, but with --strict legacy mode |
| `npm run qa:client` | check:content + build:prod (before client delivery) |
| `npm run audit:site` | **Technical audit + full text** — crawler, SEO, placeholders, Polish diacritics |
| `npm run audit:lighthouse` | Builds `dist`, runs `astro preview`, then Lighthouse mobile + desktop; JSON and HTML report goes to `audit-reports/` |

## 2a. BUILD_SCOPE — what goes into the build (CRITICAL for clients)

**Dev has everything, build only builds what was ordered.** `site.config.mjs` defines `BUILD_SCOPE`:
```js
export const BUILD_SCOPE = {
  pages: ['/', '/pl', '/cookies'],   // path allowlist; [] = all
  forceRemove: ['studio', 'dev', 'qa', 'blog'], // dev-only, always excluded
  images: true,                       // removes unused images from build
};
```

**How it works (prune at source, zero post-build cleanup):**
- `scope-pages.mjs stage` (before `astro build`) — moves `.astro` files outside scope
  to `src/pages/_disabled/` (folder ignored by Astro). Pages outside scope
  **are not built at all** — no junk in dist, zero risk of deleting
  needed CSS/JS via cleanup scripts.
- `scope-pages.mjs restore` (after `astro build`) — restores pages to `src/pages/`,
  dev still has everything. If the build crashes, run manually `npm run scope:restore`.
- `[...page].astro` — in build generates only page configs matching `pages`
  (`import.meta.env.PROD`), in dev all of them. **Note (Astro 7 bug):** scope
  logic must be inline in `getStaticPaths` — non-exported functions from frontmatter
  are stripped from the prerender module (`isPageAllowed is not defined`).
- `clean-dist.mjs` — only the last line of defense: deny list + public files
  (deploy-turbo.php). **NEVER touches assets/ (CSS/JS).**
- `prune-images.mjs` — removes from dist/ images not referenced by any HTML/JS/CSS.
  `public/assets/images/` (dev/source) remains untouched.

**Rules:**
- `pages` — builds ONLY ordered pages (one-page: `['/']`). Prefix works:
  `'/pl'` keeps `/pl/`, `/pl/cookies/`. **Root `'/'` matches only `/`, never subpages.**
  404 is always preserved.
- `forceRemove` — dev-only pages (dev, demo, qa), matched by first path segment.
- **Changing client scope** = edit `pages` in `site.config.mjs`, no changes to page code.

### ⛔ NEVER leave pages in `src/pages/_disabled/` (applies to every project)

**This is a recurring AI mistake — FORBIDDEN. The rule works identically in the starter kit
and in a client project copied from it — do not remove this section during onboarding.**

1. **DO NOT call `node src/scripts/scope-pages.mjs stage` manually.** `stage` is executed
   exclusively by `npm run build` (which in `finally` always does `restore`).
2. **DO NOT move files manually from `src/pages/` to `src/pages/_disabled/`**
   (dev/components.astro, qa/* etc.) — this is NOT "cleanup",
   it breaks the dev server: `/dev/components/` starts returning 404.
3. **If you see files in `src/pages/_disabled/`** — do not continue the task,
   do not build, do not commit. First: `npm run scope:restore`.
4. **At the end of each session check:** `Get-ChildItem src/pages/_disabled -Recurse -File`
   must be empty. If not → `npm run scope:restore`.
5. `scope-pages.mjs` has a built-in safety guard (restore of previous session before
   next stage + error after build when `_disabled` is not empty) — do
   not bypass it and do not remove this guard.

## 2b. QA Rules for AI

- **Always** start a task with `npm run qa:help`
- **Do not consider a task done without a `npm run qa` result**
- `npm run qa:client` may exit with code 1 due to intentional starter placeholders — this is expected
- Source of tasks: `.docs/QA-TASKS.md`
- Manual tests to run after automation: `.docs/QA-RUNBOOK.md`
- After every UI change run `npm run qa`
- Check rendered HTML in `dist/` before considering the task done

## 2b. Technical Audit (`npm run audit:site`)

**Crawler + full text extraction + quality analysis.** Run when:
- You want to check for placeholders (Lorem ipsum, "Content to be added", TODO)
- You want to review full page text for spelling and punctuation errors
- You want to detect missing Polish diacritics
- You want to check HTTP status of all subpages (404, 500)
- You want to see broken internal links

**How to use:**
```bash
npm run audit:site    # dev server must be running on localhost:4321
```

**What it generates (in `audit-reports/`):**
| File | Content |
|------|-----------|
| `audit-*.json` | Raw data (JSON) |
| `audit-*.md` | Technical report (summary + issues) |
| `text-dump-*.md` | **FULL TEXT from all pages** — for error review |

**Code structure:** `src/scripts/audit/` (types, crawler, analyzer, reporter, index)

**Full documentation:** `.docs/AUDIT.md`

## 2c. Lighthouse CLI for AI

Before performance, accessibility, Best Practices or SEO audits read:

```text
.docs/LIGHTHOUSE_AI_WORKFLOW.md
```

This file describes when to run `npm run audit:lighthouse`, how to read the JSON report, how to prioritize fixes and how to compare results before and after the change. The command measures mobile and desktop, saving HTML and JSON reports to `audit-reports/`. Lighthouse reports are local artifacts and should not be committed.

## 3. Components — what to use

| Source | Components | Import |
|--------|-----------|--------|
| **Custom (ui)** | **Button** — 9 variants (primary/accent/outline/ghost/secondary/success/warning/error/info), 4 sizes (sm/md/lg/icon), href→link, slot icon-left/right | `@components/ui/atoms/Button.astro` |
| | **Card** — Card + CardHeader + CardTitle + CardDescription + CardContent + CardFooter | `@components/ui/atoms/card` |
| | **Heading** | `@components/ui/atoms/Heading.astro` |
| | **Text** | `@components/ui/atoms/Text.astro` |
| **Layout (ui)** | Container, Section, Grid, Stack, AspectRatio | `@components/ui/layout/...` |
| **Local UI** | Shared Astro components in `atoms/`, `molecules/` and `layout/` plus React components in `src/components/ui/*.tsx` | `@components/ui/...` |

**Rules:**
- 🚫 **DO NOT use small dots/indicators** (`h-2 w-2 rounded-full bg-brand-primary`) — user hates them. Use `ui-type-accent-label` or nothing instead.
- 🚫 **DO NOT use `animate-pulse`** on any decorative elements
- **Button and Card** → always custom (`ui/atoms/`)
- **Layout** → `Grid`, `Stack`, `AspectRatio` from `ui/layout/`
- **Rest of UI** → first check local components in `src/components/ui/`, only then add a new dependency
- **Texts** → `Heading.astro` / `Text.astro` from `ui/atoms/`
- 🚫 **NO Badge** — removed. Use `ui-type-accent-label` or plain `<span>`
- 🚫 **NO `ui/atoms/Card.astro`** — it is `ui/atoms/card/` (folder with sub-components)

## 4. Architecture

### Page Builder (for client pages)
```
src/data/pages/[slug].json        → Page config (sections, variants, SEO)
src/data/pages/_registry.ts       → Auto-collects all page configs (import.meta.glob)
src/pages/[...page].astro         → Catch-all: slug → page config → PageBuilder
src/components/PageBuilder.astro  → Renders sections from page config, loads data via dataKey
src/data/sections/*.json          → Section content (hero, features, testimonials...)
src/config/section-registry.ts    → Maps ID → variants + dataKey
src/config/component-map.ts       → Maps string name → component import
```

**How it works**: `GET /roofing` → `[...page].astro` → loads `src/data/pages/roofing.json` → `PageBuilder` → for each section checks registry, loads component from component-map, passes data from `src/data/sections/[dataKey].json` via props.

### Developer UI (component library)
```
src/pages/dev/components/                   → Catalog and previews of ready blocks
src/components/dev/component-library/      → Gallery, catalog and preview components
src/data/dev/component-library/            → Descriptive data for the library
```

### Studio core (configurator engine)
- `src/studio/` — adapters, profiles and state resolver, no public `/studio/` route
- State persisted in URL (`?studio=hero&hero=showcase`) + localStorage
- Each block in `SECTION_REGISTRY` has a group (`shell`/`sections`/`conversion`), variants and hint

### Block Data
- `src/data/pages/*.json` → section order and page variants
- `src/data/sections/*.json` → block content and presentation data
- `src/config/section-registry.ts` → identifiers, variants, `dataKey` and Studio groups

### Theme System
- `/design/*.md` → design tokens → `npm run design:sync` → `tailwind.tokens.js` + CSS vars
- Theme on `<html data-theme="...">` — switch via URL param, path or ACTIVE_TEMPLATE
- Tokens: `text-brand-primary`, `ui-bg-page`, `ui-type-lead`, `ui-elevation-soft` etc.

### Animations (Motion)
- Full standard of allowed and forbidden patterns: `.docs/ANIMATIONS.md`
- `public/js/motion.js` → IntersectionObserver + `data-motion-*` attributes, styles in `src/styles/motion.css`
- Single parameter set for all modes: 1000ms, `cubic-bezier(0.16,1,0.3,1)`, stagger 120ms, blur 5px, distance 0.75rem
- `data-motion="fade"` — single exceptional element, animation on load
- `data-motion-sequence="fade"` — exceptional sequence of children with stagger, animation on load
- `data-motion-sequence="viewport"` — exceptional sequence of children with stagger, animation on scroll
- `data-motion-section` on `Section.astro` → auto-reveal: when a section has no explicit `data-motion`, JS auto-selects targets and splits content (header into tagline/h2/lead, repeating units like cards, steps or questions into separate sequential reveal targets). **Default mechanism for below-the-fold sections, zero markup in components**
- `data-motion-skip` — element immediately visible (new hero after View Transition)
- `data-motion-media` — targets with images/video get fade without blur (perf)
- LCP protection: elements in viewport get `data-motion-visible` immediately
- `prefers-reduced-motion` → all visible immediately, animations and smooth scroll disabled

### Blog (Content Collections)
- `src/content/blog/*.md` — blog posts with frontmatter (title, description, pubDate, tags, heroImage)
- `src/pages/blog/index.astro` — blog list
- `src/pages/blog/[...slug].astro` — single post
- Blog uses `import.meta.glob` to load posts, not the Astro Content Collections API

### Blog — cannibalization control (MANDATORY before publishing)
- `npm run check:cannibalization` — full corpus report: pairs of articles competing for the same phrases
- `npm run check:cannibalization -- --file src/content/blog/new.md` — checks a NEW article before publishing; similarity >= 30% to an existing one = BLOCKED
- A new article must answer a different search intent than existing ones. Phrase variants ("who updates", "who maintains", "what they order after launch") are forbidden
- Lesson learned (webscale 2026-08): 163 articles with overlapping intents forced 301s and content merging; do not repeat

### SEO — pre-client-deployment check
- `npm run check:seo` — starter mode (requires noindex); `npm run check:seo:client` — client mode (requires `seo.index=true` in `src/data/global/seo.json`)
- check:seo also enforces: twitter:card, og:image must not be SVG, no leaks of /dev/ and /qa/ into sitemap, presence of lastmod
- `seo.json` has `index: false` by default (starter safe); WHEN DEPLOYING FOR CLIENT switch `index` and `follow` to true and run `check:seo:client` — forgetting this step is the classic "why is the site not indexing" scenario
- og:image must be PNG/JPG min. 1200x630 (`/og-image.png`); SVG does not render on FB/LinkedIn/X
- Client pages with a language other than PL: pass `lang` prop to Layout (default "pl"); hardcoded lang confuses Google

### Subpages (standalone `.astro`)
- `src/pages/index.astro` — Home (Hero + Features + Testimonials + CTA)
- `src/pages/about.astro` — About (AboutSection + Stats + CTA)
- `src/pages/contact.astro` — Contact (form + contact details)
- `src/pages/pricing.astro` — Pricing (3 plans + FAQ + CTA)
- `src/pages/services/index.astro` — Services (services grid + process + CTA)
- `src/pages/blog/index.astro` + `[...slug].astro` — Blog (list + single post)
- Each page imports Navbar + Footer directly (not via PageBuilder)

### Central Project Configuration
- `site.config.mjs` — URL and default environment theme
- `src/config/site.ts` — default theme value used by the existing shell
- `src/config/site.ts` also holds `locale` and `i18n` — see section below

### Locale & i18n (detachable)

**Starter Kit is English-first as a product.** Code, docs, AGENTS.md, comments, demo content are in English. The language of a specific client site is configured, not hardcoded.

```ts
// src/config/site.ts
export const siteConfig = {
  locale: 'pl', // 'pl' | 'en' | 'de' — language of generated content
  i18n: {
    enabled: false,          // false = single-language site
    locales: ['pl'],          // when enabled: ['pl','en']
    defaultLocale: 'pl',
  }
}
```

**Single-language mode (default, most client projects):**
- `locale: 'pl'`, `i18n.enabled: false`
- No `/pl/` prefix, no language switcher, no locale directories, no `t()` abstraction
- AI generates all content ONLY in `site.locale`. Do not create `src/locales`, translated routes or switchers.

**Multi-language mode (optional, on demand):**
- `locale: 'pl'`, `i18n.enabled: true`, `locales: ['pl','en']`
- Routing, locale content and switcher become active
- `src/locales/pl.json` / `en.json` hold only global strings (nav, footer, legal). Section content is created per locale via `src/data/sections` + page configs.

**AI rule:**
> `site.locale` determines the language of generated website content. When `i18n.enabled` is false, generate all project content only in `site.locale`. Do not create locale directories, translated routes or language switchers. When `i18n.enabled` is true, generate content for every configured locale.

This keeps simple Polish sites simple and keeps the product sellable globally without forcing `t('nav.about')` everywhere.

### Data Flow
```
src/data/global/    → company.json, seo.json    (global data)
src/data/navigation/ → header.json, footer.json  (navigation)
src/data/sections/  → hero.json, features.json... (section content — linked via dataKey)
src/content/blog/*.md → blog posts
src/pages/blog/     → blog pages (index + [...slug])
src/pages/index.astro, about.astro, contact.astro, pricing.astro, services/ → standalone subpages
src/locales/        → pl.json, en.json (only when i18n.enabled = true)
```

## 🔴 RULE #0: Registry components first

Before writing ANY HTML check:
1. `src/components/registry/` — 171 public Astro blocks, full list comes from the component manifest
2. `src/components/ui/` — layout (Section, Container), atomy (Heading, Text, Button, Card)
3. `src/config/section-registry.ts` — 165 section and variant entries, the single source for PageBuilder section selection

If an existing block can be used (even with props) → use it. Create a custom block ONLY when the design requires something the existing block cannot achieve even with props (e.g. video in hero, unique gallery layout).

## 🔴 RULE #1: Content in JSON, not in Astro

**BY DEFAULT store all texts and page content in JSON files** (`src/data/sections/*.json` or `src/data/pages/[slug].json`), **NEVER in Astro components**.

| Location | What it contains |
|---|---|
| `src/data/pages/[slug].json` | Page configuration: SEO, section order, variants |
| `src/data/sections/[dataKey].json` | Section content (headings, descriptions, CTAs, opinions etc.) |
| `src/data/global/` | Global data (company, SEO) |
| `src/data/navigation/` | Menu, footer |

**Do NOT:**
- Do NOT hardcode texts in `.astro` (e.g. `<Heading>Our services</Heading>`)
- Do NOT use props to pass longer content from page config
- Do NOT create `src/data/` records with a single line — group into meaningful blocks

**Do:**
- Each block in registry has a `dataKey` → edit the corresponding file in `src/data/sections/`
- If a block has no `dataKey`, add it and create a JSON file with a schema
- For simple pages (hero + CTA + footer) `src/data/pages/[slug].json` is enough

```json
// src/data/sections/hero.json — GOOD
{
  "tagline": "Trusted experts",
  "title": "We build with passion",
  "description": "20 years of industry experience.",
  "primaryCTA": { "label": "See projects", "href": "/portfolio/" }
}
```

```astro
<!-- In component: NEVER do this -->
<Heading tag="h1">We build with passion</Heading>
<Text>20 years of industry experience.</Text>
```

## 5. Client JavaScript

Every client script must be in `public/js/` as **vanilla JS** (no TypeScript, no imports, no bundling).
No component uses inline `<script>` (TypeScript → bundler → minification → unreadable).

### How to add a new script:
1. Create file `public/js/name.js`
2. Use IIFE: `(function() { ... })()` — do not pollute global scope
3. In component use: `<script is:inline src="/js/name.js"></script>`
4. All scripts from `public/js/` are copied to `dist/js/` unchanged

### Example:
```js
// public/js/navbar.js
(function() {
  var header = document.querySelector('[data-site-header]');
  if (!header) return;
  // ... logic
})();
```

### Existing scripts (public/js/):
- `navbar.js` — header height + scroll behavior + mobile drawer
- `motion.js` — global scroll reveal and auto-reveal sections (IntersectionObserver)
- `lenis.js` — optional smooth scroll with Astro transition handling
- `lightbox.js` — image lightbox
- `toast.js` — toast notifications
- `back-to-top.js` — back to top button
- `cookie-consent.js` — cookie consent with localStorage

RULE: **no TypeScript in client scripts** — only vanilla JS in `public/js/`.

## 6. Client Build (clean HTML + CSS + JS)

When you want to generate a clean client build without dev tools:

```powershell
npm run build:prod
```

This does:
1. `astro build` — generates all pages
2. `node src/scripts/clean-dist.mjs` — removes junk (studio, _assets, admin, etc.)

### What the client gets in dist/:
- Clean HTML (indentation, no astro-xxx, no data-astro-cid)
- Single CSS file (`assets/Layout.css`) with color variables at the top
- JS in `js/` — readable vanilla JS (not minified)
- Self-hosted fonts in `fonts/`

### How the client changes colors:
1. Opens `assets/Layout.css`
2. Finds `--color-brand-primary`
3. Changes the value

## 7. Page Creation Workflow from Ready Blocks

1. Read the brief and the list of approved blocks in `.docs/BLOCK_PREFERENCES.md`.
2. Choose sections and variants from `src/config/section-registry.ts`.
3. Fill `src/data/pages/[slug].json` with section order.
4. Fill `src/data/sections/*.json` with content and presentation data.
5. Do not change markups or classes of existing blocks without a separate visual scope.
6. Run `npm run check:registrations`, `npm run check:page-registry`, tests and build.

## 🔴 RULE #0: POLISH DIACRITICS ARE MANDATORY — CRITICAL

**Every Polish text on the site MUST have correct Polish diacritics (ąćęłńóśźż).**

This is not a recommendation or best practice. It is an **ABSOLUTE REQUIREMENT**.
Missing Polish diacritics in page content is a CRITICAL bug — the client sees it immediately.

### Consequences:
- `npm run check:content` will **BLOCK** the build if it detects Polish text without diacritics
- Pre-commit hook will **BLOCK** the commit if it detects Polish text without diacritics
- If an AI agent generates text without Polish diacritics, it is an agent bug
- Review rendered HTML in `dist/` before delivery — missing diacritics are visible there immediately

### Where to check:
- `src/data/global/seo.json` — defaultTitle, defaultDescription
- `src/data/global/company.json` — tagline, name, fullName
- `src/data/sections/*.json` — all section content
- `src/data/pages/*.json` — SEO per-page
- `src/pages/**/*.astro` — hardcoded texts in page components
- `src/content/**/*.md` / `*.mdoc` — blog and legal content
- `src/config/site.ts` — tagline, descriptions

### Example — BAD (BLOCKED):
```json
{ "title": "Profesjonalne uslugi dla Twojej firmy" }
```

### Example — GOOD:
```json
{ "title": "Profesjonalne usługi dla Twojej firmy" }
```

### Note:
- URLs, slugs, file names, technical variables — do NOT need diacritics
- Only content visible on the page (headings, descriptions, buttons, SEO)
- Code comments are an **exception** — always in English (EN), without Polish diacritics (see Rule 12 in section 9)

## 9. Rules (mandatory)

1. **Every text** via `Text.astro` / `Heading.astro` — never raw `<p>` / `<h1-h6>`
2. **Every section** via `Section.astro` with `ui-container` inside
3. **Mobile-first** — default classes = mobile, `md:` = desktop. For layout use `Stack direction={{ default: "col", md: "row" }}` instead of manual `flex flex-col md:flex-row`
4. **No hardcoded colors** — only tokens: `text-brand-*`, `ui-bg-*`, `ui-text-*`
5. **Block-First** — structure (Tailwind) → theming (`ui-*`) → decorations (slots)
6. **Run `npm run check:atomic`** after every component change
7. **Reuse before Create** — check the table in section 3 before creating a new component
8. **Trailing slash /** for all internal links in Astro (use `formatInternalLink()` from `@utils/url`)
9. **Studio Compatibility** — blocks in registry must be registered in `SECTION_REGISTRY` and `COMPONENT_MAP`
10. **When adding a new block** → add to registry + component-map + section-registry + template JSON
11. **Comments in Astro:** inside JSX expressions (`{...}`) use JSX comments `{/* */}` or `/* */`, NOT `<!-- -->` — HTML comment inside expression breaks Astro compilation (CompilerError: Unexpected token)
12. **Code comment language — English only:** all comments in source files (`*.ts`, `*.js`, `*.mjs`, `*.astro`, `*.css`) must be written **exclusively in English** (EN). This applies to line comments `//`, block comments `/* */`, JSX `{/* */}` and JSDoc. Polish in code comments is forbidden.
13. **Locale determines content language:** `site.locale` decides the language of all generated content. When `i18n.enabled` is false, generate everything only in `site.locale` and do not create locale folders, translated routes or switchers. When `i18n.enabled` is true, generate for all `i18n.locales`.

## 10. UI Prototyping with VersionToolbar

VersionToolbar (`src/components/dev/VersionToolbar.astro`) is a sticky bar at the bottom of the page (DEV only). It scans the DOM for `data-version-group` and lets you switch UI versions via URL param `?sv=`.

### HTML Attributes

- `data-version-group="{name}"` — container grouping versions
- `data-version="{id}"` — single version (only active is visible)
- `data-version-label="{label}"` — readable name in toolbar
- `data-css-toggle-group="{name}"` — CSS preset group
- `data-css-toggle-presets='[{"label":"...","props":{"--var":"val"}}]'` — CSS presets for rapid prototyping

### AI Workflow — step by step

1. **Find component** — ready blocks are in `src/components/registry/`

2. **Exploration setup:**
   - Read the existing component, e.g. `HeroEditorialBlock.astro`
   - Wrap its content in `data-version-group`:
     ```astro
     <section data-version-group="hero">
       <div data-version="original" data-version-label="Original">
         <!-- existing content -->
       </div>
     </section>
     ```
   - First `data-version` is ALWAYS "original" (copy of original)
   - Save file, refresh page in browser — toolbar should now show "hero > Original"

3. **Generating variants:**
   - Add 2-3 alternative versions as `<div data-version="v2" data-version-label="Direction A" style="display:none">`
   - Each version in the same file — DO NOT create separate files
   - Use readable labels in `data-version-label`
   - Save, refresh — toolbar shows all versions as buttons

4. **Presentation:**
   - Tell the user: "there are 3 versions, switch at the bottom of the page or via URL: ?sv=hero:v2"
   - Clicking toolbar buttons lets the user compare versions without reload

5. **Decision and cleanup:**
   - User says "v2" (or "keep original", "give something else")
   - If chosen — copy chosen version to top level, remove ALL `data-version-group` and `data-version`
   - If "something else" — remove old variants, make new ones (step 3)
   - NEVER leave dead divs or hidden versions

6. **CSS toggle (quick experiments without duplicating structure):**
   ```html
   <div data-css-toggle-group="colors" data-css-toggle-presets='[
     {"label":"Dark","props":{"--bg":"#0a0a0a","--text":"#fff"}},
     {"label":"Light","props":{"--bg":"#fafafa","--text":"#111"}}
   ]'>
   ```
   Component uses `var(--bg)` and `var(--text)` in styles. Useful when you want to show 2 color versions without copying entire HTML.

### Example — full cycle

User: "make 3 hero versions"

```
1. AI reads the specific block from `src/components/registry/`, e.g. `HeroEditorialBlock.astro`
2. AI wraps in data-version-group, creates v1 (original), v2 (new layout), v3 (different direction)
3. AI saves, refreshes, sees toolbar with 3 buttons
4. AI: "there are 3 versions, switch at the bottom of the page"
5. User: "v2"
6. AI copies v2 into `HeroEditorialBlock.astro`, removes data-version-group, saves
7. Toolbar disappears, code is clean
```

### Rules

- Variants are TEMPORARY — always clean up after decision
- Do not create separate files — everything in one component
- After each step refresh the page and check if toolbar shows expected options
- Toolbar disappears automatically when no `data-version-group` in DOM
- Demo: open `/dev/demo/` in dev server to see how it works

## 11. Image System — workflow for AI

### Where to get images
- **Raw client images** → put into `src/assets/raw/` (may be in subfolders)
- **CMS uploads** → go to `public/assets/uploads/`; do not move them manually to `src/`
- **Unsplash/stock images** → download to `src/assets/raw/` respecting the license
- **Ready optimized** → `public/assets/images/` or `public/assets/upload-derivatives/`

### How to optimize images (step by step)

When the user says "optimize images", "make images for the page", "prepare graphics":

1. **Put raw files** into `src/assets/raw/` (JPEG, PNG, WebP, AVIF — whatever comes from the client)
2. **Run** `npm run assets:img`
3. Script automatically:
   - Converts to AVIF at **50%** quality and WebP at **80%** quality
    - Generates **8 widths**: 220, 480, 640, 800, 1080, 1280, 1600 and 1920px
   - **autoOrient**: fixes EXIF orientation (phone photos not rotated 90°)
   - Keeps folder structure from `src/assets/raw/`
    - Deterministic skip by source size (manifest `node_modules/.cache/images-manifest.json`), also works in CI where mtime is random
    - For CMS uploads keeps the original and writes derivatives to `public/assets/upload-derivatives/`
4. Result: WebP and AVIF in `public/assets/images/` and `public/assets/upload-derivatives/`, with width suffixes.

### Local video (optimization)

When the project has local video (`public/assets/videos/`):

1. **Put files** into `public/assets/videos/` (mp4/webm)
2. **Run** `npm run assets:videos`
3. Script (ffmpeg) automatically:
   - Compresses H.264: CRF 26 (≤1280px height) / CRF 28 (larger)
   - Scales only down (max width 1920, keeps aspect ratio)
   - Converts webm → mp4 (removes source after successful conversion)
   - `-movflags +faststart` (play while downloading)
4. For video use: `preload="metadata"` + poster (frame instead of blank screen)

### Where optimized images go
```
src/assets/raw/                         → raw images (you put manually)
public/assets/images/                   → variants from src/assets/raw
public/assets/upload-derivatives/       → variants of CMS uploads
public/assets/images/[name].webp       → base variant 800px
public/assets/images/[name]@220.webp   → thumbnail variant 220px
public/assets/images/[name]@1600.webp  → retina variant 1600px
```

### How to use images in components

**In registry blocks (data from JSON):**
```json
// src/data/sections/portfolio.json
{
  "images": [
    { "src": "/assets/images/project-1.webp", "alt": "Project 1" }
  ]
}
```

**In SmartImage (atom):**
```astro
<SmartImage 
  src="/assets/images/project-1.webp" 
  alt="Description" 
  width={800} 
  height={600}
/>
```

**In Image (astro:assets):**
```astro
---
import { Image } from 'astro:assets';
---
<Image src={import('../assets/images/project-1.webp')} alt="Description" layout="constrained" />
```

### Image Rules
- ALWAYS optimize images before use (`npm run assets:img`)
- Do not use images >200KB on the page — if larger, re-run `npm run assets:img`
- For hero/banners use `loading="eager"` and `fetchpriority="high"` only when the image is the actual LCP
- Do not link directly to raw images from `src/assets/raw/`
- Do not add preload for many gallery thumbnails
- For images from `src/` use Astro `Picture`, and for JSON and CMS use `SmartImage`
- Do not assume a file in `public/` will be optimized by Astro without `npm run assets:img`
- For full rules read `.docs/IMAGE_PERFORMANCE.md`

### Phosphor Icons
- Do not import `@phosphor-icons/web/*` manually. `npm run dev` and `npm run build` generate full regular CSS to `src/styles/.generated/phosphor.css` from the package version installed in the project.
- Atom `Icon.astro` normalizes the name with optional `ph-` prefix, so data can use both `brain` and `ph-brain`.
- Build automatically removes unused icon rules from `dist` and checks that every icon present in HTML has a CSS definition. Do not append Unicode codes manually.
- Build also automatically removes unused images, videos and fonts from `dist`. Sources in `public/` remain available during development.
- Diagnostics after build: `npm run check:icons`.

## 11a. Starter Kit Asset Placeholders

This section is for the Starter Kit repository only. Do not copy it to a client project.

The Starter Kit uses local placeholders so every block has a visible and stable preview before client assets arrive. A placeholder is not just a file in `public`. It must also be wired to the data the block and Studio use.

### Placeholder Catalog

All default placeholder assets are kept in `public/assets/placeholders/`:

| File | Usage |
|---|---|
| `image-landscape.svg` | Panoramic images, portfolio cards and promo sections |
| `image-square.svg` | Thumbnails, square tiles and gallery items |
| `image-portrait.svg` | Vertical images in portfolio and galleries |
| `image-gray.svg` | Neutral gray image without specific context |
| `video-poster.svg` | Poster visible before video loads and on mobile |
| `video-placeholder.mp4` | Short local loop for video, autoplay and transition testing |
| `logo-placeholder.svg` | Company logo, partner logos and Studio preview |

### How to wire placeholders

1. Use public paths, e.g. `/assets/placeholders/image-landscape.svg`.
2. Store section data in `src/data/sections/*.json`. Do not write placeholder paths directly in the Astro component.
3. For global logo use `src/data/global/company.json` and the `branding.logoImage` field.
4. For footer image use `src/data/navigation/footer.json` and the `promo.imageSrc` field.
5. For video set both `video.sources` and `video.poster` in `src/data/sections/hero-video.json`.
6. For gallery, portfolio and partner logos replace `src`, `thumb` or `img` values in the relevant section file.
7. After adding a new placeholder to `public` wire it to data immediately. The file alone will not be visible in Studio.

### Rules for Blocks and Studio
- Studio fetches section data via `dataKey` from `src/config/section-registry.ts`, so every block with media must have a correct `dataKey`.
- A new block with media must be added to `SECTION_REGISTRY` and `COMPONENT_MAP`, and its example media must go to the section JSON.
- Studio preview should use the same data as the demo page. Do not create a separate hidden prop set only for the iframe unless needed for a technical test.
- In components use `SmartImage` for images coming from JSON or CMS. If the image is entirely optional, use its visible `placeholder` fallback.
- Video must have a local poster. Do not use an external URL in the default Starter Kit.
- Do not add fake paths like `/assets/images/realization-1.webp` or `/assets/videos/hero.mp4` if the files do not exist.
- Do not use external images as the default preview source. When the client provides images, replace the JSON and run the asset pipeline according to section 11.
- Placeholders should have descriptive `alt`, e.g. `Landscape image placeholder` or `Logo placeholder 1`.
- Do not put placeholders into `src/assets/raw/` and do not run image optimization for ready SVG files from `public`.

### Replacing placeholders with client assets

During client onboarding replace placeholder paths in JSON with client assets. Keep the data structure, `alt` fields, proportions and required poster for video. Once all references point to client assets, remove the `public/assets/placeholders/` directory and unused placeholder entries from data. After replacement run:

```bash
npm run assets:img
npm run test -- --run
npm run build
```

Before finishing visually check `/dev/components/`, the relevant frame from `/dev/components/preview/` and the generated HTML in `dist/`. Placeholders are intentional in the Starter Kit but must not remain on the final client site.

## 12. Deploy via Netlify (for demo and preview)

### Benefits
- Auto-deploy from GitHub: push to branch = automatic build + preview URL
- Each branch is a separate domain (ideal for sending to client before publishing)
- Zero server configuration
- Custom domain can be attached

### Configuration (once)
1. Connect repository to Netlify (via Netlify Dashboard → Add new site → Import from Git)
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variable: `NODE_VERSION = "22"`

### Workflow for AI
1. **Demo/preview** → push to branch `feat/*` → Netlify generates URL `feat--name.netlify.app`
2. **Send to client** → this preview URL (no need to deploy to production)
3. **After approval** → merge to master, deploy to production via FTP or Netlify

### Netlify Forms (optional)
If you do not have your own PHP server, use Netlify Forms:
1. Add `netlify` attribute to the `<form>` tag in the contact component
2. Netlify automatically captures submissions and sends to the email assigned to the account
3. You do not need `send-form.php` or SMTP

### Difference: FTP vs Netlify
| Aspect | FTP | Netlify |
|--------|-----|---------|
| Configuration | Requires server + .env + secrets | Zero configuration |
| Preview URL | None | Automatic for every branch |
| Forms | send-form.php (PHP) | Netlify Forms (HTML attr) |
| CMS | auth.php on server | Decap CMS + Git Gateway |
| When to use | Production (own hosting) | Demo, preview, staging |
