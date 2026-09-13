import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

// ============================================================================
// Generowanie konfiguracji Decap CMS na podstawie struktury katalogu src/data.
// Whenever you change the JSON data or collection structure, run: npm run cms:gen
// The script SUITS config.yml, never edit it manually.
// ============================================================================

const DATA_DIR = path.join(process.cwd(), 'src/data');
// The PL mirror catalog exists only in bilingual projects. If it's not there,
// the generator creates only the main set of the collection (without _en/_pl suffixes).
const PL_DIR = path.join(DATA_DIR, 'pl');
const LEGAL_DIR = path.join(process.cwd(), 'src/content/legal');
const OUTPUT_FILE = path.join(process.cwd(), 'public/admin/config.yml');

// Backend GitHub OAuth (auth.php proxy, bez Netlify Identity).
// To placeholdery: podmien per projekt przy onboardzie (repo, domena).
const BACKEND_BRANCH = 'main';
const BACKEND_REPO = 'owner/repo';
const CMS_BASE_URL = 'https://twojastrona.pl';
const CMS_AUTH_ENDPOINT = 'admin/auth.php';
const CMS_SITE_URL = 'https://twojastrona.pl';

// Media: obrazy wgrywamy do /public/assets/uploads (URL /assets/uploads).
const MEDIA_FOLDER = 'public/assets/uploads';
const PUBLIC_FOLDER = '/assets/uploads';

// ----------------------------------------------------------------------------
// File type detection by value (path or URL).
// ----------------------------------------------------------------------------
const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|svg|avif|ico)(\?|#|$)/i;
const VIDEO_EXT_RE = /\.(mp4|webm|mov|ogv|m4v)(\?|#|$)/i;
const IMAGE_URL_MARKERS = ['unsplash', 'pravatar', 'images.'];

/** Does the value look like an image path/URL?*/
function isImageValue(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (v.startsWith('/assets/images/')) return true;
  if (IMAGE_EXT_RE.test(v)) return true;
  return IMAGE_URL_MARKERS.some((marker) => v.includes(marker));
}

/** Does the value appear to be a video file path?*/
function isVideoValue(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (v.startsWith('/assets/videos/')) return true;
  return VIDEO_EXT_RE.test(v);
}

// ----------------------------------------------------------------------------
// Label maps (PL) - readability in the CMS panel.
// ----------------------------------------------------------------------------
const LABEL_MAP: Record<string, string> = {
  // Global / firma
  name: 'Nazwa firmy (krótka)',
  fullName: 'Pełna nazwa firmy',
  branding: 'Branding / logo',
  icon: 'Ikona dekoracyjna',
  font: 'Krój pisma',
  useImage: 'Używaj grafiki logo',
  logoImage: 'Plik logo (górny pasek i stopka)',
  favicon: 'Favicona (ikona przeglądarki)',
  address: 'Ulica i numer',
  zipCode: 'Kod pocztowy',
  city: 'Miasto',
  nip: 'NIP',
  krs: 'KRS',
  regon: 'REGON',
  email: 'E-mail',
  phone: 'Telefon',
  whatsapp: 'Numer WhatsApp',
  siteUrl: 'URL strony',
  hours: 'Godziny pracy',
  socials: 'Social media',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'X (Twitter)',
  contactEmail: 'E-mail kontaktowy',
  smtp: 'Ustawienia SMTP (serwer poczty)',
  smtpHost: 'Host serwera SMTP',
  smtpPort: 'Port serwera SMTP',
  smtpUser: 'Login SMTP',
  smtpPass: 'Hasło SMTP',

  // SEO
  siteName: 'Nazwa serwisu',
  defaultTitle: 'Domyślny tytuł',
  defaultDescription: 'Domyślny opis',
  defaultOgImage: 'Domyślny obraz (OG)',
  ogImage: 'Obraz (OG)',
  index: 'Indeksowanie strony',
  follow: 'Podążaj za linkami',
  analytics: 'Analityka',
  googleAnalyticsId: 'Google Analytics ID',
  googleTagManagerId: 'Google Tag Manager ID',
  facebookPixelId: 'Facebook Pixel ID',
  clarityId: 'Clarity ID',
  customHead: 'Własny kod w <head> (piksele, meta, skrypty)',
  customBodyEnd: 'Własny kod na końcu strony (widgety, czat)',
  schemaTemplate: 'Szablon schematu',
  sectionPattern: 'Wzorzec sekcji',

  // Nawigacja
  menu: 'Menu główne',
  header: 'Menu górne',
  footer: 'Stopka',
  label: 'Etykieta',
  href: 'Link',
  prefix: 'Prefiks',
  columns: 'Kolumny',
  title: 'Tytuł',
  links: 'Linki',
  about: 'Opis / o firmie',
  legal: 'Linki prawne',
  cta: 'Przycisk CTA',
  cta1: 'Pierwszy przycisk',
  cta2: 'Drugi przycisk',
  ctaHref: 'Link przycisku',
  hoverText: 'Tekst po najechaniu na przycisk',
  newsletter: 'Newsletter',

  // Strony (pages)
  seo: 'SEO',
  heading: 'Nagłówek strony',
  sections: 'Sekcje strony',
  id: 'Identyfikator sekcji',
  variant: 'Wariant',

  // Sekcje - wspolne pola
  eyebrow: 'Nadtytuł',
  accentTitle: 'Tytuł akcentowany',
  subtitle: 'Podtytuł',
  intro: 'Wstęp',
  description: 'Opis',
  bio: 'Biografia',
  stats: 'Statystyki',
  value: 'Wartość',
  categories: 'Kategorie',
  image: 'Zdjęcie',
  img: 'Zdjęcie',
  imageAlt: 'Tekst alternatywny zdjęcia',
  video: 'Wideo',
  poster: 'Miniatura wideo',
  sources: 'Źródła wideo',
  type: 'Typ pliku',
  paragraphs: 'Akapity',
  primaryCta: 'Główny przycisk',
  secondaryCta: 'Przycisk dodatkowy',
  background: 'Tło',
  trustItems: 'Elementy zaufania',
  images: 'Zdjęcia',
  thumb: 'Miniatura',
  before: 'Zdjęcie „przed”',
  after: 'Zdjęcie „po”',
  alt: 'Opis alternatywny',
  prevLabel: 'Etykieta poprzedniego zdjęcia',
  nextLabel: 'Etykieta następnego zdjęcia',
  year: 'Rok',
  featured: 'Wyróżnione',
  group: 'Rodzaj zdjęcia',
  items: 'Elementy',
  moreLink: 'Link „więcej”',
  tagline: 'Nadtytuł (tagline)',
  marquee: 'Pasek przewijany',
  testimonials: 'Opinie',
  quote: 'Cytat',
  author: 'Autor',
  role: 'Rola',
  avatar: 'Awatar',
  videos: 'Wideo',
  youtubeId: 'Identyfikator filmu YouTube',
  steps: 'Kroki',
  number: 'Numer',
  price: 'Cena',
  priceNote: 'Dopisek ceny',
  priceOptions: 'Warianty ceny',
  priceNote2: 'Drugi dopisek ceny',
  features: 'Lista korzyści',
  popularBadge: 'Oznaczenie popularnej oferty',
  emptyPriceLabel: 'Tekst zamiast ceny',
  ctaFallback: 'Domyślny przycisk oferty',
  ctaHover: 'Tekst po najechaniu na przycisk oferty',
  titleFallback: 'Tytuł zastępczy filmu',
  emptyState: 'Tekst, gdy nie ma materiałów',
  categoriesLabel: 'Nagłówek kategorii',
  location: 'Lokalizacja',
  url: 'Plik zdjęcia',
  photo: 'Zdjęcie',
  question: 'Pytanie',
  highlight: 'Wyróżnienie',
  services: 'Usługi',
  team: 'Zespół',
  advantages: 'Atuty',

  // Strony prawne
  backLabel: 'Link powrotu do strony głównej',
  updatedLabel: 'Etykieta daty aktualizacji',
  faqTitle: 'Tytuł sekcji kontaktowej',
  faqText: 'Opis sekcji kontaktowej',
  contactLabel: 'Etykieta linku kontaktowego',
  contactHref: 'Link kontaktowy',
  servicesDescription: 'Opis usług w regulaminie',
  lastUpdated: 'Data aktualizacji',
  body: 'Treść (markdown)',

  // Formularz kontaktowy
  mapUrl: 'URL mapy',
  social: 'Social media',
  formFields: 'Pola formularza',
  required: 'Wymagane',
  placeholder: 'Placeholder',
  autoComplete: 'Autouzupełnianie',
  options: 'Opcje',
  rows: 'Liczba wierszy',
  submitLabel: 'Etykieta „Wyślij”',
  submittingLabel: 'Etykieta podczas wysyłania',
  resetLabel: 'Etykieta „Wyślij kolejną”',
  retryLabel: 'Etykieta ponowienia po błędzie',
  successMessage: 'Komunikat sukcesu',
  errorMessage: 'Komunikat błędu',
  invalidResponse: 'Komunikat nieprawidłowej odpowiedzi',
  networkError: 'Komunikat błędu sieci',
  q: 'Pytanie',
  a: 'Odpowiedź',
  buttonLabel: 'Etykieta przycisku',
  buttonHref: 'Link przycisku',

  // Kalkulator
  servicesLabel: 'Etykieta usług',
  addonsLabel: 'Etykieta dodatków',
  summaryTitle: 'Tytuł podsumowania',
  estimateLabel: 'Etykieta wyceny',
  emptyStateLabel: 'Komunikat pustego stanu',
  addons: 'Dodatki',
  currency: 'Waluta',
  ctaLabel: 'Etykieta CTA',
  ctaLink: 'Link CTA',

  // Portfolio / marquee
  span: 'Rozpiętość siatki',
  height: 'Wysokość kafelka',
  initials: 'Inicjały',
};

/**
 * Friendly filenames (instead of JSON filenames).
 * Sections get the label "Page → Section" filed in generateConfig,
 * that's why we keep the names of both parts short here.
 */
const FILE_LABEL_MAP: Record<string, string> = {
  // Strony starter-kita
  index: 'Strona główna',
  uslugi: 'Usługi',
  cennik: 'Cennik',
  'o-nas': 'O nas',
  realizacje: 'Realizacje',
  kontakt: 'Kontakt',

  // Sekcje
  hero: 'Hero',
  'hero-split': 'Sekcja główna',
  navbar: 'Menu strony',
  features: 'Oferta',
  about: 'O firmie',
  gallery: 'Galeria',
  cta: 'Sekcja CTA',
  testimonials: 'Opinie klientów',
  contact: 'Formularz kontaktowy',
  'contact-info-form': 'Formularz kontaktowy',
  faq: 'FAQ',
  process: 'Proces współpracy',
  'process-timeline-scroll': 'Proces współpracy',
  portfolio: 'Portfolio',
  marquee: 'Pasek partnerów',
  'nova-hero-wireframe': 'Hero fotograficzny',
  'nova-projects': 'Realizacje z kartami projektów',
  'nova-services': 'Oferta usług',
  'nova-team': 'Zespół i wartości',
  'nova-cta': 'Końcowe wezwanie do działania',

  // Nawigacja i globalne
  header: 'Menu górne',
  footer: 'Stopka',
  company: 'Dane firmy',
  seo: 'SEO',
  'custom-code': 'Kod własny (zaawansowane)',
  'form-messages': 'Formularz kontaktowy: komunikaty',

  // Strony prawne
  cookies: 'Polityka cookies',
  'privacy-policy': 'Polityka prywatności',
  terms: 'Regulamin',
};

// Technical fields that we do not display in the CMS (do not touch unnecessarily).
const EXCLUDED_FIELDS = new Set([
  'schemaTemplate', 'sectionPattern', 'footerAttribution',
  'version', 'id', 'order', 'uuid',
  // Teksty systemowe cookie consent (widgety kalendarza i mapy): komunikaty
  // consents and button labels managed by WebScale, not the client.
  'consentMessage', 'cookieSettingsLabel',
]);

// Fields that are supposed to be multi-line editor (text) in CMS, not markdown.
const MULTILINE_KEYS = new Set([
  'description',
  'about',
  'intro',
  'lead',
  'address',
  'consent',
  'quote',
  'a',
  'answer',
  'subtitle',
  'servicesDescription',
  'customHead',
  'customBodyEnd',
]);

// Empty lists with known object structure (when the data does not yet have an example).
const EMPTY_LIST_SCHEMAS: Record<string, Record<string, unknown>> = {
  // Stopka: linki prawne jako obiekty {label, href}, nawet gdy lista jest pusta.
  legal: { label: '', href: '' },
};

// Phosphor icons used in the starter kit (fallback if the data did not contain them).
// Thanks to this, select also has sensible options for projects created from scratch.
const FALLBACK_ICONS = [
  'users', 'barbell', 'heart', 'dumbbell', 'trophy', 'medal', 'clock', 'phone',
  'mail', 'map-pin', 'whatsapp-logo', 'calendar', 'check', 'star', 'lightning',
  'target', 'chart-line-up', 'shield-check', 'gear', 'pencil', 'camera', 'play',
  'arrow-right', 'arrow-up-right', 'sparkle', 'award', 'fire', 'drop', 'moon', 'sun',
];

/** Opcje selecta ikon, budowane na starcie z danych projektu. */
let iconOptions: { label: string; value: string }[] = [];

/** Fallback: replacing the technical key with a readable label.*/
function humanize(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/** Etykieta opcji ikony: "paint-roller" -> "Paint Roller". */
function capitalizeSegments(value: string): string {
  return value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

/** Recursively collecting the value of the 'icon' key from the JSON tree.*/
function collectIconsFromNode(node: unknown, out: Set<string>): void {
  if (Array.isArray(node)) {
    node.forEach((item) => collectIconsFromNode(item, out));
    return;
  }
  if (typeof node === 'object' && node !== null) {
    for (const [key, value] of Object.entries(node)) {
      if (key === 'icon' && typeof value === 'string' && value !== '') out.add(value);
      else collectIconsFromNode(value, out);
    }
  }
}

/** Scans the directory (recursively) for the value of the 'icon' key.*/
function collectIconsInDir(dir: string, out: Set<string>): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) collectIconsInDir(fullPath, out);
    else if (entry.name.endsWith('.json')) {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      collectIconsFromNode(content, out);
    }
  }
}

/** Builds a list of icon options: values ​​from data + Phosphor fallbacks (no duplicates).*/
function buildIconOptions(): void {
  const collected = new Set<string>();
  collectIconsInDir(path.join(DATA_DIR, 'sections'), collected);
  collectIconsInDir(path.join(DATA_DIR, 'global'), collected);
  collectIconsInDir(path.join(DATA_DIR, 'navigation'), collected);

  const values = [...collected, ...FALLBACK_ICONS.filter((icon) => !collected.has(icon))];
  iconOptions = values.map((value) => ({ label: capitalizeSegments(value), value }));
}

/** Widget selection based on key and sample value.*/
function getWidgetType(key: string, value: unknown): string {
  // Long content (legal, blog) - markdown.
  if (key === 'content' || key === 'body') return 'markdown';
  // Pola wielolinijkowe.
  if (MULTILINE_KEYS.has(key)) return 'text';
  // Video tracks (key 'src') - 'file' widget instead of a string, so that the client
  // selected a file from the media library instead of entering the path manually.
  if (key === 'src' && isVideoValue(value)) return 'file';
  // Video stored as a text path (/assets/videos/ directory).
  if (isVideoValue(value)) return 'string';
  if (isImageValue(value)) return 'image';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'list';
  if (typeof value === 'object' && value !== null) return 'object';
  return 'string';
}

/**
 * Merges the schemas of all elements of an object list (key union).
 * Thanks to this, fields are present only in some elements (e.g. contact.formFields[].options,
 * [].rows, faq.categories[].items[]) are not lost during generation.
 */
function mergeSchemas(items: Record<string, unknown>[]): Record<string, unknown> {
  const keys = new Set<string>();
  items.forEach((item) => Object.keys(item).forEach((k) => keys.add(k)));

  const merged: Record<string, unknown> = {};
  for (const key of keys) {
    // The first element with a given key provides an example value (for widget detection).
    const sample = items.find((item) => key in item);
    merged[key] = sample ? sample[key] : undefined;
  }
  return merged;
}

// Keys that remain in the CMS even when their value is empty. Usually empty
// the fields disappear (the client does not see SMTP/NIP garbage), but youtubeId is a field
// intentionally empty - the client has to paste the ID from YouTube, so it must be visible.
// Analytics IDs must also appear empty: the client replaces his own ID
// (GA4/GTM/FB Pixel/Clarity) without involving WebScale.
const ALWAYS_KEEP_EMPTY = new Set([
  'youtubeId',
  'googleAnalyticsId',
  'googleTagManagerId',
  'facebookPixelId',
  'clarityId',
  'logoImage',
  'favicon',
  'customHead',
  'customBodyEnd',
  // Social media: empty fields must be visible so that the customer can paste the link.
  'facebook',
  'instagram',
  'youtube',
  'twitter',
]);

/** Empty value = field does not appear in CMS (string "", null, [] or {}).*/
function isEmptyValue(value: unknown, key: string): boolean {
  if (ALWAYS_KEEP_EMPTY.has(key)) return false;
  if (value === '' || value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/** Recursively generating a list of fields for a data object.*/
function generateFields(obj: Record<string, unknown>): any[] {
  return Object.keys(obj)
    .filter((key) => !isEmptyValue(obj[key], key))
    .map((key) => {
    // We omit technical fields in the CMS so that the client does not spoil the configuration.
    if (EXCLUDED_FIELDS.has(key)) return null;

    const value = obj[key];
    const widget = getWidgetType(key, value);

    const field: any = {
      label: LABEL_MAP[key] ?? humanize(key),
      name: key,
      widget,
    };

    // The client cannot see the technical field names - the label depends on the type:
    // the photo in the gallery is "Photo", the video file is "Video File".
    if (key === 'src') {
      field.label = widget === 'image' ? 'Zdjęcie' : 'Plik wideo';
    }

    // The numbers in the data are integers (prices, ports, etc.).
    if (widget === 'number') field.value_type = 'int';

    // Pictures and empty fields do not have to be mandatory.
    if (widget === 'image') field.required = false;
    if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
      field.required = false;
    }

    // Video - 'file' widget with format filter (mp4/webm/mov), client selects
    // file from the media library instead of entering the path manually.
    if (widget === 'file' && isVideoValue(value)) {
      field.media_library = { config: { accept: ['.mp4', '.webm', '.mov', '.m4v'] } };
      field.hint = 'Wybierz plik wideo (mp4/webm/mov) z biblioteki mediów';
    }

    // YouTube - klient wkleja ID filmu (np. dQw4w9WgXcQ) z linku youtube.com/watch?v=...
    if (key === 'youtubeId') {
      field.hint = 'Wklej wyłącznie identyfikator filmu z linku YouTube, np. Q2oIJS_OQTI. Zostaw puste, jeśli używasz pliku MP4.';
      field.required = false;
    }

    if (key === 'whatsapp') {
      field.hint = 'Numer używany przez pływający przycisk WhatsApp na stronie. Podaj numer z kierunkowym, bez spacji lub z zachowaniem spacji.';
    }

    // Analytics IDs - the client pastes his own ID from Google/FB/Clarity panels.
    if (key === 'googleAnalyticsId' || key === 'googleTagManagerId' || key === 'facebookPixelId' || key === 'clarityId') {
      field.hint = 'Wklej własny identyfikator. Zostaw puste, jeśli nie używasz.';
    }

    if (key === 'index') {
      field.hint = 'Włączone = index, strona może pojawić się w Google. Wyłączone = noindex, strona nie powinna być indeksowana.';
    }

    if (key === 'follow') {
      // The frontend combines noindex with nofollow, so a separate switch was confusing.
      field.widget = 'hidden';
    }

    if (key === 'group') {
      field.label = 'Kategoria zdjęcia';
      field.widget = 'select';
      field.options = [
        { label: 'Moje zdjęcia', value: 'personal' },
        { label: 'Zdjęcia zawodników', value: 'athletes' },
      ];
    }

    // Phosphor icon selected from the list so that the customer does not need to know the names
    // icon library and didn't ruin the look of the section with a manual entry.
    if (key === 'icon') {
      field.widget = 'select';
      field.options = iconOptions;
      field.hint = 'Ikona Phosphor. Wybierz z listy, nie wpisuj ręcznie.';
    }

    if (key.toLowerCase().startsWith('aria')) {
      // Accessibility texts are important for the site, but they should not be burdensome
      // client technical settings for regular content editing.
      field.widget = 'hidden';
    }

    if (key === 'href' || key === 'ctaHref' || key === 'contactHref') {
      field.hint = 'Wpisz pełny adres strony albo adres podstrony, np. /uslugi/. Nie zmieniaj bez potrzeby.';
    }

    // Variable hints for markdown content.
    if (widget === 'markdown' && key === 'content') {
      field.hint = 'Zmienne: {{COMPANY_FULL_NAME}}, {{COMPANY_CITY}}, {{COMPANY_ADDRESS}}, {{COMPANY_NIP}}, {{COMPANY_EMAIL}}.';
    }
    if (widget === 'markdown' && key === 'body') {
      field.hint = 'Treść w markdownie. Zmienne: {{COMPANY_NAME}}, {{COMPANY_FULL_NAME}}, {{SITE_URL}}, {{COMPANY_EMAIL}} itd.';
    }

    if (widget === 'object') {
      field.fields = generateFields(value as Record<string, unknown>);

      // On-page SEO can have its own toggle. No value means
      // inheriting the global setting, so we don't change existing JSON.
      if (key === 'seo' && !field.fields.some((nestedField: any) => nestedField.name === 'index')) {
        field.fields.push({
          label: 'Indeksowanie tej strony',
          name: 'index',
          widget: 'boolean',
          default: true,
          required: false,
          hint: 'Włączone = index. Wyłączone = noindex. Pozostaw bez zmiany, aby korzystać z ustawienia globalnego.',
        });
      }
      // An object whose all fields have disappeared (empty values) also disappears -
      // Decap rejects fields with an empty fields list (e.g. analytics with an empty GA).
      if (field.fields.length === 0) return null;
    } else if (widget === 'list') {
      const arr = value as unknown[];
      const objectItems = arr.filter((it) => typeof it === 'object' && it !== null) as Record<string, unknown>[];

      if (objectItems.length > 0) {
        const merged = mergeSchemas(objectItems);
        // Decap uses summary for the name of a single list item.
        // label describes the entire list, so typing {{title}} there displays it
        // literally the text "{{title}}" to the user.
        if (typeof merged.title === 'string' && merged.title !== '') {
          field.summary = '{{title}}';
          if (key === 'items' && 'icon' in merged && 'price' in merged) {
            field.label = 'Oferty';
          }
        } else if (typeof merged.alt === 'string' && merged.alt !== '') {
          // Galleries do not have an item title. There is an alternative description
          // a clearer photo name than the technical file path.
          field.summary = '{{alt}}';
        }
        // Fields present only in some elements (e.g. gymUrl, gymUrlLabel)
        // cannot be mandatory for other elements.
        const optionalKeys = new Set<string>();
        for (const item of objectItems) {
          for (const k of Object.keys(merged)) {
            // The common list schema should respect empty values,
            // because not every offer has to have a price or price variants.
            if (!(k in item) || isEmptyValue(item[k], k)) optionalKeys.add(k);
          }
        }
        const listFields = generateFields(merged);
        for (const f of listFields) {
          if (optionalKeys.has(f.name)) {
            f.required = false;
            if (typeof f.label === 'string' && !f.label.includes('(opcjonalne)')) {
              f.label = `${f.label} (opcjonalne)`;
            }
          }
        }
        field.fields = listFields;
      } else if (EMPTY_LIST_SCHEMAS[key]) {
        // An empty list with a known object structure (e.g. footer.legal).
        field.fields = generateFields(EMPTY_LIST_SCHEMAS[key]);
      } else {
        // List of simple values ​​(strings) - Decap requires name in a single field,
        // w przeciwnym razie config.yml nie przechodzi walidacji.
        field.field = { label: 'Wartość', name: 'value', widget: 'string' };
      }
    }

    return field;
    })
    // Objects with all empty fields return null - we filter them out.
    .filter((f) => f !== null);
}

/** Hides the field specified by the path, keeping it in the data for compatibility.*/
function hideFieldPath(fields: any[], path: string[]): void {
  if (path.length === 0) return;
  const field = fields.find((item) => item.name === path[0]);
  if (!field) return;
  if (path.length === 1) {
    field.widget = 'hidden';
    return;
  }
  if (Array.isArray(field.fields)) hideFieldPath(field.fields, path.slice(1));
}

/** Przenosi pole w odpowiednie miejsce, bez zmiany struktury JSON. */
function moveFieldAfter(fields: any[], fieldName: string, afterName: string): void {
  const fieldIndex = fields.findIndex((item) => item.name === fieldName);
  const afterIndex = fields.findIndex((item) => item.name === afterName);
  if (fieldIndex < 0 || afterIndex < 0 || fieldIndex === afterIndex) return;

  const [field] = fields.splice(fieldIndex, 1);
  const adjustedAfterIndex = fields.findIndex((item) => item.name === afterName);
  fields.splice(adjustedAfterIndex + 1, 0, field);
}

/** Removes technical fields or fields not used by active components from the CMS view.*/
function hideUnusedCmsFields(baseName: string, fields: any[]): void {
  if (baseName === 'contact') {
    // Note: We do NOT hide formFields on purpose - the client is supposed to edit the form fields.
    hideFieldPath(fields, ['social', 'labels']);
    // Why: social, joinTeam, rows and socialLabel
    // are not used by any variant of ContactSplitBlock - these are blind spots
    // in the code. They stay in the data, but do not clutter the CMS panel.
    hideFieldPath(fields, ['social']);
    hideFieldPath(fields, ['joinTeam']);
    hideFieldPath(fields, ['rows']);
    hideFieldPath(fields, ['socialLabel']);
    moveFieldAfter(fields, 'joinTeam', 'description');
    const joinTeam = fields.find((item) => item.name === 'joinTeam');
    if (joinTeam) joinTeam.hint = 'Treść wyświetlana bezpośrednio pod opisem sekcji kontaktu.';
  }

  // Dlaczego: newsletter i promo to elementy wariantu footer "promo".
  // The active "columns" variant (used on all pages) does not use them,
  // so they do not clutter the CMS panel.
  if (baseName === 'footer') {
    hideFieldPath(fields, ['newsletter']);
    hideFieldPath(fields, ['promo']);
  }

  if (baseName === 'competitions') {
    hideFieldPath(fields, ['images', 'featured']);
  }

  if (baseName === 'features') {
    // The link to the partner's gym is a permanent element of one offer. Common scheme
    // list showed it as an empty field next to the other tabs.
    hideFieldPath(fields, ['items', 'gymUrl']);
    hideFieldPath(fields, ['items', 'gymUrlLabel']);
  }

  if (baseName === 'faq') {
    // Why: categories to variant grouped. The active variant uses flat
    // only items + cta, so categories are dead in the CMS panel.
    hideFieldPath(fields, ['categories']);
  }

  if (baseName === 'testimonials') {
    // Why: Marquee content has been moved to base fields
    // (title/description/testimonials). Obiekt marquee zostaje w danych
    // only as a fallback for components, so we hide it in the CMS.
    hideFieldPath(fields, ['marquee']);
  }

  if (baseName === 'portfolio') {
    // Why: span (grid span) and height (tile height) are classes
    // Layout CSS, not client content. The tile layout is determined by WebScale,
    // the client only edits the title, category and photo.
    hideFieldPath(fields, ['items', 'span']);
    hideFieldPath(fields, ['items', 'height']);
    // Dlaczego: categories to wariant categorized. Aktywny wariant bento
    // only uses items, so categories are dead in the CMS panel.
    hideFieldPath(fields, ['categories']);
    // Dlaczego: variants (Bento/Carousel/Categorized/Marquee/Masonry) to
    // layout variants that WebScale selects in page config. The client is editing
    // content in base fields (title/description/tagline), and variants
    // they only remain in the data as fallback for components.
    hideFieldPath(fields, ['variants']);
  }

  // Why: form-messages.json has 16 fields, but the client actually only changes it
  // button label and success/error messages. The rest (hover, privacy,
  // retry, defaultFields) to copy UI / technical details - remain in the data
  // for components, but do not clutter the client panel.
  if (baseName === 'form-messages') {
    hideFieldPath(fields, ['submittingLabel']);
    hideFieldPath(fields, ['resetLabel']);
    hideFieldPath(fields, ['retryLabel']);
    hideFieldPath(fields, ['invalidResponse']);
    hideFieldPath(fields, ['networkError']);
    hideFieldPath(fields, ['resetHover']);
    hideFieldPath(fields, ['submitHover']);
    hideFieldPath(fields, ['privacyNote']);
    hideFieldPath(fields, ['privacyLinkLabel']);
    hideFieldPath(fields, ['privacyHref']);
    hideFieldPath(fields, ['rodoConsent']);
    hideFieldPath(fields, ['defaultFields']);
    const heading = fields.find((item) => item.name === 'heading');
    if (heading) heading.label = 'Nagłówek formularza';
  }

  // Dlaczego: "Dane firmy" to centralne ustawienia klienta. Klient widzi tylko
  // dane kontaktowe, godziny, social media (z linkami) i logo. Branding
  // (ikona, font, tagline, suffix), SMTP, siteUrl (techniczne, ustala WebScale
  // on deployment), name (duplicate of full name) and contactEmail (duplicate
  // email) remain in the data, but not in the panel.
  if (baseName === 'company') {    hideFieldPath(fields, ['branding', 'icon']);
    hideFieldPath(fields, ['branding', 'font']);
    hideFieldPath(fields, ['branding', 'tagline']);
    hideFieldPath(fields, ['branding', 'logoSuffix']);
    hideFieldPath(fields, ['smtp']);
    hideFieldPath(fields, ['contactEmail']);
    hideFieldPath(fields, ['siteUrl']);
    hideFieldPath(fields, ['name']);
    // Why: the address is one whole (street, code, city in one field),
    // so the separate city/zipCode fields are not edited by the client.
    hideFieldPath(fields, ['city']);
    hideFieldPath(fields, ['zipCode']);
    const useImage = fields.find((item) => item.name === 'branding')?.fields?.find((f: any) => f.name === 'useImage');
    if (useImage) {
      // Why: the "Use logo graphics" switch is not needed - the logo is there
      // always graphics. We hide the field but leave it in the data for compatibility.
      useImage.widget = 'hidden';
    }
    const logoImage = fields.find((item) => item.name === 'branding')?.fields?.find((f: any) => f.name === 'logoImage');
    if (logoImage) {
      // Why: an empty field has no value, so the generator defaults to the widget
      // "string". We force "image" so that the client uploads a logo from the media library.
      logoImage.widget = 'image';
      logoImage.media_library = { config: { accept: ['.png', '.svg', '.webp', '.jpg', '.jpeg'] } };
      logoImage.hint = 'Wgraj logo (PNG/SVG). Wyświetla się w menu górnym i stopce.';
    }
    const favicon = fields.find((item) => item.name === 'branding')?.fields?.find((f: any) => f.name === 'favicon');
    if (favicon) {
      favicon.widget = 'image';
      favicon.media_library = { config: { accept: ['.png', '.svg', '.ico', '.webp'] } };
      favicon.hint = 'Wgraj faviconę (ikona w zakładce przeglądarki). Zalecany format PNG/SVG, kwadrat.';
    }
    // Why: social media are simple boxes with links. We add a hint to each
    // fields and to the section so that the customer knows that he is pasting the full profile address.
    const socialsField = fields.find((item) => item.name === 'socials');
    if (socialsField && Array.isArray(socialsField.fields)) {
      socialsField.hint = 'Wklej pełny link do profilu (np. https://facebook.com/twoja-firma). Puste pole = profil nie jest pokazywany na stronie.';
      for (const social of socialsField.fields) {
        if (['facebook', 'instagram', 'youtube', 'twitter'].includes(social.name)) {
          social.hint = 'Wklej pełny link do profilu, np. https://facebook.com/twoja-firma';
        }
      }
    }
    // Why: the address is one whole, the hint suggests the format.
    const addressField = fields.find((item) => item.name === 'address');
    if (addressField) {
      addressField.hint = 'Podaj pełny adres w jednej linii, np. ul. Przykładowa 123, 00-001 Warszawa';
    }
  }

  // Why: the client can paste his own code (pixels, chat widgets) via CMS.
  // This is an advanced option - we add hints so that you don't paste by accident
  // entire pages or secrets.
  if (baseName === 'seo') {
    // Why: siteName, siteUrl and contactEmail were duplicate company details
    // (company.json) and have been removed - SEO only contains SEO settings.
  }

  // Dlaczego: custom code to zaawansowana opcja, wydzielona do osobnego pliku
  // ("Custom code") so that it doesn't get mixed up with SEO. We add hints,
  // so that the client does not accidentally paste entire pages or secrets.
  if (baseName === 'custom-code') {
    const customHead = fields.find((item) => item.name === 'customHead');
    if (customHead) {
      customHead.hint = 'Zaawansowane. Kod wklejony tutaj trafi do <head> każdej strony (np. Facebook Pixel, meta tagi, dodatkowe skrypty).';
    }
    const customBodyEnd = fields.find((item) => item.name === 'customBodyEnd');
    if (customBodyEnd) {
      customBodyEnd.hint = 'Zaawansowane. Kod trafi na koniec każdej strony (np. widget czatu, skrypt ładowany na końcu).';
    }
  }
}

/** Converts Windows paths to POSIX (they are written to YAML).*/
function toPosix(p: string): string {
  return p.replace(/\\/g, '/');
}

/**
 * Skanuje katalog z plikami JSON i tworzy wpisy kolekcji "files".
 * @param labelPrefix np. "PL: " dla polskich wersji (gdy istnieje mirror PL).
 * @param allowList optional list of allowed filenames (no .json).
 * Sections not used on any page should not clutter the CMS.
 * @param excludeList optional list of filenames to exclude (without .json).
 *        Copy UI (etykiety techniczne, np. breadcrumbs/pagination) nie trafia
 * to the customer panel - these are not content, just interface constants.
 * @param labelMap map filename -> full label (e.g. "Home → Hero").
 */
function scanFiles(
  dir: string,
  labelPrefix: string,
  allowList?: Set<string>,
  excludeList?: Set<string>,
  hidePageSections = false,
  hidePageFields: string[] = [],
  labelMap?: Map<string, string>,
): any[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .filter((f) => !allowList || allowList.has(path.basename(f, '.json')))
    .filter((f) => !excludeList || !excludeList.has(path.basename(f, '.json')))
    .map((f) => {
      const filePath = path.join(dir, f);
      let name = path.basename(f, '.json');

      // In common directories (e.g. legal), Polish variants have the "-pl" suffix.
      // We label them "PL:" and look for the base name in FILE_LABEL_MAP.
      let plVariant = labelPrefix !== '';
      let baseName = name;
      if (name.endsWith('-pl')) {
        plVariant = true;
        baseName = name.slice(0, -3);
      }

      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      // The section label has the format "Page Name → Section Name", so
      // the client immediately knows where a given section is used.
      const fileLabel =
        (plVariant ? 'PL: ' : '') +
        (labelMap?.get(baseName) ?? FILE_LABEL_MAP[baseName] ?? humanize(baseName));
      const fields = generateFields(content);
      hideUnusedCmsFields(baseName, fields);
      if (hidePageSections) hideFieldPath(fields, ['sections']);
      for (const fieldName of hidePageFields) hideFieldPath(fields, [fieldName]);

      // The Hero title is intentionally three lines long, so the CMS must use a text field.
      // The string widget shows the same value without visual newlines.
      if (baseName === 'hero') {
        const heroTitle = fields.find((field) => field.name === 'title');
        if (heroTitle) {
          heroTitle.widget = 'text';
          heroTitle.hint = 'Każda linia jest wyświetlana jako osobna linia nagłówka.';
        }
      }

      return {
        name,
        label: fileLabel,
        file: toPosix(path.relative(process.cwd(), filePath)),
        fields,
      };
    });
}

/** Returns only active pages that are to be visible to the client in the CMS.*/
function getActivePageAllowList(dir: string): Set<string> {
  if (!fs.existsSync(dir)) return new Set();

  return new Set(
    fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.json'))
      .filter((file) => {
        const content = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
        return content.enabled !== false && content.devOnly !== true;
      })
      .map((file) => path.basename(file, '.json')),
  );
}

/**
 * It builds a map section -> the first page it appears on.
 * Order: index.json first, then the remaining page configs.
 * The same order source for sorting sections in the CMS.
 */
function buildSectionPageMap(aliases: Record<string, string>): Map<string, string> {
  const map = new Map<string, string>();
  const dirs = [path.join(DATA_DIR, 'pages')];
  if (fs.existsSync(PL_DIR)) dirs.push(path.join(PL_DIR, 'pages'));

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    files.sort((a, b) => (a === 'index.json' ? -1 : b === 'index.json' ? 1 : 0));
    for (const f of files) {
      const page = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (page.enabled === false || page.devOnly === true) continue;
      const pageSlug = path.basename(f, '.json');
      for (const section of page.sections ?? []) {
        const name = aliases[section.id] ?? toKebabCase(section.id);
        if (!map.has(name)) map.set(name, pageSlug);
      }
    }
  }
  return map;
}

/** Replaces the section ID from the page config with the name of the data file.*/
function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

/** Returns sections grouped by active CMS subpages.*/
function buildPageSectionMap(aliases: Record<string, string>): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  const dirs = [path.join(DATA_DIR, 'pages')];
  if (fs.existsSync(PL_DIR)) dirs.push(path.join(PL_DIR, 'pages'));

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    for (const f of files) {
      const page = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (page.enabled === false || page.devOnly === true) continue;
      const pageSlug = path.basename(f, '.json');
      const sections = map.get(pageSlug) ?? new Set<string>();
      for (const section of page.sections ?? []) {
        sections.add(aliases[section.id] ?? toKebabCase(section.id));
      }
      map.set(pageSlug, sections);
    }
  }
  return map;
}

/** The "files" collection (a series of JSON files).*/
function buildFileCollection(name: string, label: string, files: any[]): any {
  return { name, label, delete: false, editor: { preview: false }, files };
}

/** A collection of Markdown entries edited by Decap CMS.*/
function buildBlogCollection(): any | null {
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  if (!fs.existsSync(blogDir)) return null;

  return {
    name: 'blog',
    label: 'Blog',
    folder: 'src/content/blog',
    create: true,
    slug: '{{slug}}',
    fields: [
      { label: 'Tytuł', name: 'title', widget: 'string' },
      { label: 'Opis', name: 'description', widget: 'text' },
      { label: 'Data publikacji', name: 'pubDate', widget: 'datetime', date_format: 'YYYY-MM-DD', time_format: false },
      { label: 'Tagi', name: 'tags', widget: 'list', field: { label: 'Tag', name: 'tag', widget: 'string' } },
      { label: 'Zdjęcie główne', name: 'heroImage', widget: 'image', required: false },
      { label: 'Treść artykułu', name: 'body', widget: 'markdown' },
    ],
  };
}

function generateConfig() {
  console.log('🚀 Generowanie konfiguracji Decap CMS na podstawie src/data...');

  buildIconOptions();

  // Mirror PL: dodatkowe kolekcje tylko gdy istnieje katalog src/data/pl.
  // The starter kit is single-channel (PL), so there is no mirror by default.
  const hasPlMirror = fs.existsSync(PL_DIR);

  // We only show sections in the CMS if they are actually used in one of them
  // website. Unused files do not clutter the client panel.
  const SECTION_ALIASES: Record<string, string> = { videoSection: 'video-section' };
  const sectionPageMap = buildSectionPageMap(SECTION_ALIASES);
  const pageSectionMap = buildPageSectionMap(SECTION_ALIASES);

  // Section order = order of appearance on the page (index first,
  // then the remaining page configs). This allows the CMS to show sections as
  // they appear on the page, not alphabetically.
  const sectionOrder = new Map<string, number>();
  let orderIndex = 0;
  for (const name of sectionPageMap.keys()) sectionOrder.set(name, orderIndex++);
  const usedSections = new Set(sectionPageMap.keys());
  const sectionAllowList = usedSections.size > 0 ? usedSections : undefined;

  // Adaptacyjne etykiety sekcji: "Nazwa strony → Nazwa sekcji".
  const sectionLabelMap = new Map<string, string>();
  for (const [sectionName, pageSlug] of sectionPageMap) {
    const pageLabel = FILE_LABEL_MAP[pageSlug] ?? humanize(pageSlug);
    const sectionLabel = FILE_LABEL_MAP[sectionName] ?? humanize(sectionName);
    sectionLabelMap.set(sectionName, `${pageLabel} → ${sectionLabel}`);
  }

  // Sections sorted according to the order on the page (sectionOrder), not alphabetically.
  const sortBySectionOrder = (a: { name: string }, b: { name: string }) =>
    (sectionOrder.get(a.name) ?? 999) - (sectionOrder.get(b.name) ?? 999);
  const sectionsEn = scanFiles(path.join(DATA_DIR, 'sections'), '', sectionAllowList, undefined, false, [], sectionLabelMap).sort(sortBySectionOrder);
  const sectionsPl = hasPlMirror
    ? scanFiles(path.join(PL_DIR, 'sections'), 'PL: ', sectionAllowList, undefined, false, [], sectionLabelMap).sort(sortBySectionOrder)
    : [];

  const pagesEnDir = path.join(DATA_DIR, 'pages');
  const pagesPlDir = path.join(PL_DIR, 'pages');
  const pagesEn = scanFiles(pagesEnDir, '', getActivePageAllowList(pagesEnDir), undefined, true, ['enabled', 'heading']);
  const pagesPl = hasPlMirror
    ? scanFiles(pagesPlDir, 'PL: ', getActivePageAllowList(pagesPlDir), undefined, true, ['enabled', 'heading'])
    : [];

  // Why: breadcrumbs, pagination, lightbox and legal to copy UI (constant
  // etykiety interfejsu, np. "Poprzednia strona", "Ostatnia aktualizacja:"),
  // not the client's content. The client edits the content of legal pages through the collection
  // "Legal Pages" (content/legal/*.json), not common packaging labels.
  const NAVIGATION_UI_FILES = new Set(['breadcrumbs', 'pagination']);
  const navigationEn = scanFiles(path.join(DATA_DIR, 'navigation'), '', undefined, NAVIGATION_UI_FILES).sort(
    (a: { name: string }, b: { name: string }) => {
      // Why: the customer in the panel sees navigation in a logical order:
      // Top menu (header) first, Footer after it.
      const order = ['header', 'footer'];
      return (order.indexOf(a.name) + 1 || 99) - (order.indexOf(b.name) + 1 || 99);
    },
  );
  const navigationPl = hasPlMirror
    ? scanFiles(path.join(PL_DIR, 'navigation'), 'PL: ', undefined, NAVIGATION_UI_FILES).sort(
        (a: { name: string }, b: { name: string }) => {
          const order = ['header', 'footer'];
          return (order.indexOf(a.name) + 1 || 99) - (order.indexOf(b.name) + 1 || 99);
        },
      )
    : [];

  const GLOBAL_UI_FILES = new Set(['lightbox', 'legal', 'floating-bar', 'cookie-consent']);
  const globalEn = scanFiles(path.join(DATA_DIR, 'global'), '', undefined, GLOBAL_UI_FILES);
  const globalPl = hasPlMirror ? scanFiles(path.join(PL_DIR, 'global'), 'PL: ', undefined, GLOBAL_UI_FILES) : [];

  const legal = scanFiles(LEGAL_DIR, '');

  const pageSectionCollections = [...pageSectionMap.entries()].map(([pageSlug, sectionNames]) => {
    const pageLabel = FILE_LABEL_MAP[pageSlug] ?? humanize(pageSlug);
    const sectionLabelMap = new Map<string, string>();
    for (const sectionName of sectionNames) {
      const sectionLabel = FILE_LABEL_MAP[sectionName] ?? humanize(sectionName);
      sectionLabelMap.set(sectionName, sectionLabel);
    }

    const pageSections = scanFiles(
      path.join(DATA_DIR, 'sections'),
      '',
      sectionNames,
      undefined,
      false,
      [],
      sectionLabelMap,
    ).sort(sortBySectionOrder);

    return buildFileCollection(`sections_${pageSlug}`, pageLabel, pageSections);
  });

  const collections = [
    ...pageSectionCollections,
    buildFileCollection('pages', 'SEO stron', pagesEn),
    buildFileCollection('navigation', 'Nawigacja', navigationEn),
    buildFileCollection('global', 'Ustawienia Globalne', globalEn),
    buildFileCollection('legal', 'Strony Prawne', legal),
  ];

  const blogCollection = buildBlogCollection();
  if (blogCollection) collections.push(blogCollection);

  // Mirror PL collections (bilingual projects created from a starter kit).
  if (hasPlMirror) {
    collections.push(
      buildFileCollection('sections_pl', 'Treści sekcji (PL)', sectionsPl),
      buildFileCollection('pages_pl', 'SEO stron (PL)', pagesPl),
      buildFileCollection('navigation_pl', 'Nawigacja (PL)', navigationPl),
      buildFileCollection('global_pl', 'Ustawienia Globalne (PL)', globalPl),
    );
  }

  // Collections without files (e.g. empty mirror PL) are removed so as not to clutter the panel.
  const activeCollections = collections.filter((c) => !c.files || c.files.length > 0);

  const fullConfig = {
    backend: {
      name: 'github',
      repo: BACKEND_REPO,
      branch: BACKEND_BRANCH,
      base_url: CMS_BASE_URL,
      auth_endpoint: CMS_AUTH_ENDPOINT,
      auth_scope: 'repo',
    },
    media_folder: MEDIA_FOLDER,
    public_folder: PUBLIC_FOLDER,
    locale: 'pl',
    site_url: CMS_SITE_URL,
    display_url: CMS_SITE_URL,
    collections: activeCollections,
  };

  const headerComment = `# ============================================================
# Konfiguracja Decap CMS - wygenerowana automatycznie.
# Po każdej zmianie danych w src/data uruchom: npm run cms:gen
# Nie edytuj tego pliku ręcznie, zmiany znikną przy ponownej generacji.
# ------------------------------------------------------------
# Backend: GitHub OAuth (auth.php), repo: ${BACKEND_REPO}, gałąź: ${BACKEND_BRANCH}.
# Media: obrazy trafiają do /public/assets/uploads (URL: /assets/uploads).
# ============================================================
`;

  if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, headerComment + yaml.dump(fullConfig, { indent: 2 }), 'utf8');

  const totalFiles = activeCollections.reduce((sum, c) => sum + (c.files?.length ?? 0), 0);

  console.log(`✅ Zapisano: ${OUTPUT_FILE}`);
  console.log(`   Kolekcje plikowe: ${activeCollections.length} (${totalFiles} plików JSON)`);
}

generateConfig();
