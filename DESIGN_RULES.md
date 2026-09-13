# Design Rules — Starter Kit

**Czytaj jako pierwsze przed jakąkolwiek pracą wizualną.**

---

## 1. Czego NIGDY nie robić

### 🚫 Kropki i indykatory
ZLE:
```html
<span class="size-1.5 rounded-full bg-brand-primary"></span>
<span class="h-2 w-2 rounded-full bg-green-500"></span>
```
DOBRZE: Nie używaj kropek. W ogóle. Żadnych. Jeśli potrzebujesz separatora — użyj tekstu, linii, kształtu geometrycznego.

### 🚫 Pulsujące elementy
ZLE:
```html
<div class="animate-pulse h-2 w-2 rounded-full bg-red-500"></div>
```
DOBRZE: Zero `animate-pulse`. Statyczne akcenty albo nic.

### 🚫 Fake quotes (udawane cytaty)
ZLE:
```html
<p class="border-l-2 pl-8 italic text-brand-dark/60">Cytat</p>
```
DOBRZE: Użyj dedykowanego bloku cytatu z left-borderem i SVG quote mark.

### 🚫 Hardcoded kolory
ZLE:
```css
background: #2563eb;
color: #333;
border: 1px solid #e5e7eb;
```
DOBRZE: Zawsze tokeny. `var(--color-brand-primary)`, `text-brand-dark/70`, `border-brand-dark/10`.

### 🚫 Bezpośrednie klasy layoutu na atomach
ZLE: `<Heading tag="h2" class="mt-10 mb-20" />`
DOBRZE: Spacing kontroluje rodzic (SectionHeader, ButtonGroup, container div).

### 🚫 Raw HTML zamiast atomów
ZLE: `<section class="py-16"><h2 class="text-3xl">Tytuł</h2><p class="text-lg">Opis</p></section>`
DOBRZE: `<Section tone="page"><Container><Heading tag="h2" variant="section-title">Tytuł</Heading><Text variant="lead">Opis</Text></Container></Section>`

### 🚫 Ghost button z opacity
ZLE: `<button class="bg-white/5 text-brand-dark/70">` — niewidoczny na jasnym tle
DOBRZE: Ghost button = border + solid text. Always visible.

### 🚫 Przycisk bez text swap (roll tekstu)
ZLE: własny `<a class="ui-button">` z samym tekstem albo liczenie, że efekt hover "sam się zrobi".
DOBRZE: `Button.astro` ma text swap wbudowany domyślnie (wrap `.ui-button-text-wrap` z dwoma spany, roll 600ms na hover + wypełnienie `::after`). `hoverText` podajesz TYLKO gdy labelka na hover ma być inna; bez niego roll pokazuje ten sam tekst. Raw wrap strukturę pisz ręcznie wyłącznie tam, gdzie Button.astro nie wchodzi (navbar, cookie consent), i zawsze z pełnym `.ui-button-text-wrap` oraz `ui-type-cta-label` (bez tego tekst dostaje font body zamiast fontu CTA).

### 🚫 Ciemne sekcje
ZLE: `<Section tone="base">` na ciemnym tle bez białego tekstu.
DOBRZE: Tylko `page` (biały), `base` (off-white), `accent` (brand). Żadnych granatów, czerni.

### 🚫 Generic 3-kolumnowy layout wszędzie
ZLE: "3 kolumny, 6 kart, równo rozłożone" — to wygląda jak każdy template.
DOBRZE: Zmieniaj układy. 2+1, staggered, grid z różnymi proporcjami. Nie bądź przewidywalny.

### 🚫 Własny hover lift na kartach (translate/shadow/border na hover)
ZLE: `class="rounded-2xl border hover:-translate-y-1 hover:shadow-xl transition-all"` na karcie — każdy blok miałby inną animację, a reveal w motion.css i tak ją zabija (używa własności `translate` z wyższą specyficznością).
DOBRZE: klasa `ui-card-interactive` na kontenerze karty. Jedna animacja dla wszystkich kart w kitcie: lift `translateY(-0.25rem)` przez `transform` + border brand-primary 34% + shadow, 250ms easeOutCubic. Interplay z data-motion jest załatwiony globalnie w motion.css. Dodajesz klasę TYLKO kartom, które mają reagować na hover; statyczne karty zostają statyczne.

---

## 2. Design preferences

- **Mobile-first:** klasy domyślne = mobile, `md:` = desktop
- **Typografia:** bez Inter, Roboto, Space Grotesk. Starter self-hostuje Outfit (sans, domyślny), Satoshi (sans) i Gambarino (heading serif) w `src/styles/fonts.css`; nowe fonty doładowujesz przez `npm run fonts` (download-fonts.ts), nigdy przez Google Fonts CDN. Używaj `--font-sans`/`--font-heading` z themes.css.
- **Kolory:** stonowana paleta + 1 akcent. Żadnych gradientów purple-blue
- **Layout:** dużo przestrzeni, nie zagęszczaj. Sekcje mają oddychać
- **Zdjęcia:** WebP, max 200KB, bez stockowych uśmiechniętych ludzi
- **Motion:** subtelny scroll reveal; dekoracje są statyczne domyślnie, a ich jawne wyjątki muszą respektować reduced motion
- **Separatory:** używaj cienkich linii, beamów, geometrycznych kształtów — nie kropek

---

## 3. Obowiązkowe zasady techniczne

1. Każdy text → `Text.astro` lub `Heading.astro` (nigdy `<p>`, `<h1>`)
2. Każda sekcja → `Section.astro` z `Container.astro` wewnątrz
3. Importy przez aliasy (`@components/`, `@utils/`, `@data/`)
4. Trailing slash `/` na wszystkich wewnętrznych linkach
5. Po zmianach: `npm run check:atomic -- --scan-dirs src/components/[nazwa]`
6. Lighthouse: Performance 95+, Accessibility 95+, SEO 100
7. Każdy przycisk/CTA → atom `Button.astro` (text swap i wypełnienie `::after` są domyślne, nic nie włączasz). `hoverText` tylko do podmiany labelki na hover
8. Każda interaktywna karta → klasa `ui-card-interactive` na kontenerze (kontrakt w `components.css`, interplay z motion w `motion.css`). Zero własnych `hover:-translate-y-*`, `hover:shadow-*`, `hover:border-*` na kartach. Test kontraktowy: `card-contract.test.ts`

