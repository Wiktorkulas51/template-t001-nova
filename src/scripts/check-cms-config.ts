// Why: check-cms-config.ts is the consistency keeper between sources of truth
// (src/data/*.json), wygenerowanym configiem Decap (public/admin/config.yml)
// i rejestrem sekcji (src/config/section-registry.ts). Uruchamiany przez
// `npm run cms:check` before the build to avoid any data crossover
// for production, e.g. a section in the page config without an entry in the registry or a file
// JSON that disappeared from disk but is still in the CMS.
//
// How it works: config is never edited manually, only generated
// from JSON via `npm run cms:gen`, so the script refreshes the config first,
// and then verifies completeness on real files.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import yaml from 'js-yaml';
import fg from 'fast-glob';
import { SECTION_REGISTRY } from '@config/section-registry';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'public/admin/config.yml');
const DATA_DIR = path.join(ROOT, 'src/data');
const LEGAL_DIR = path.join(ROOT, 'src/content/legal');
const SECTIONS_DIR = path.join(DATA_DIR, 'sections');

// Katalogi skanowane przez generator (src/scripts/generate-cms-config.ts).
// Pages with pages/ intentionally do NOT go to the CMS, they are configured by AI.
const CMS_DATA_DIRS = [
  path.join(DATA_DIR, 'global'),
  path.join(DATA_DIR, 'navigation'),
  path.join(DATA_DIR, 'sections'),
  LEGAL_DIR,
];

// The keys that the generator (getWidgetType) maps to the 'image' widget
const IMAGE_KEYS = new Set(['url', 'image', 'photo', 'ogImage']);

// Wyniki raportu
const errors: string[] = [];
const warnings: string[] = [];
let jsonFileCount = 0;
let collectionCount = 0;

function reportError(message: string): void {
  errors.push(message);
  console.error(` [ERROR] ${message}`);
}

// Warningi zbieramy i drukujemy dopiero po wszystkich walidacjach,
// to make the report readable (stderr does not mix with stdout)
function reportWarning(message: string): void {
  warnings.push(message);
}

function reportOk(message: string): void {
  console.log(`  [ok] ${message}`);
}

// ---------------------------------------------------------------------------
// Step 1: fresh config always from the generator, never manually
// ---------------------------------------------------------------------------
function regenerateConfig(): boolean {
  console.log('Krok 1/6: generowanie config.yml (npm run cms:gen)...');
  try {
    execSync('npm run cms:gen', { cwd: ROOT, stdio: 'inherit' });
    return true;
  } catch {
    reportError(
      'npm run cms:gen ended with an error. If the generator is running ' +
        'pisania, poczekaj i uruchom cms:check ponownie. Inaczej napraw ' +
        'src/scripts/generate-cms-config.ts.',
    );
    return false;
  }
}

// ---------------------------------------------------------------------------
// Step 2: config parsability (validation A)
// ---------------------------------------------------------------------------
function loadConfig(): any | null {
  console.log('Krok 2/6: parsowanie public/admin/config.yml...');
  if (!fs.existsSync(CONFIG_PATH)) {
    reportError(`Brak pliku ${CONFIG_PATH}. Uruchom npm run cms:gen.`);
    return null;
  }
  try {
    const config = yaml.load(fs.readFileSync(CONFIG_PATH, 'utf8'));
    reportOk('config.yml parses correctly as YAML');
    return config;
  } catch (err: any) {
    reportError(`config.yml does not parse as YAML: ${err.message}`);
    return null;
  }
}

// Collects all file paths from the collection (validation B)
function collectConfigFiles(config: any): Set<string> {
  const files = new Set<string>();
  if (!config?.collections) return files;
  collectionCount = config.collections.length;
  for (const collection of config.collections) {
    for (const file of collection.files ?? []) {
      if (typeof file.file === 'string') {
        files.add(file.file.replace(/\\/g, '/'));
      }
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// Step 3: completeness of JSON files <-> config.yml (validation B)
// ---------------------------------------------------------------------------
function checkFileCoverage(config: any): void {
  console.log('Step 3/6: consistency of JSON files on disk with config.yml...');
  const configFiles = collectConfigFiles(config);

  // Files that the generator should scan (relative paths to ROOT,
  // identically to the "file" paths in config.yml so that the comparison makes sense)
  const onDisk = new Set<string>();
  for (const dir of CMS_DATA_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      onDisk.add(path.relative(ROOT, path.join(dir, file)).replace(/\\/g, '/'));
    }
  }

  // Page configurations are not edited in the CMS (they are configured by AI), but they are included
  // to the balance sheet so that the report is complete
  for (const file of fg.sync('src/data/pages/*.json', { cwd: ROOT })) {
    onDisk.add(file.replace(/\\/g, '/'));
  }

  // 1) A file in the config that is not on disk -> fatal error
  for (const file of configFiles) {
    if (!fs.existsSync(path.join(ROOT, file))) {
      reportError(
        `Plik "${file}" jest w config.yml, ale nie istnieje na dysku. ` +
          'Delete entry from CMS or restore file.',
      );
    }
  }

  // 2) File on disk with no entry in CMS -> warning (intentional omissions)
  const missingFromCms = [...onDisk].filter((f) => !configFiles.has(f)).sort();
  for (const file of missingFromCms) {
    if (file.includes('/pages/')) {
      reportWarning(
        `${file} has no entry in the CMS. This is intentional: pages are configured with ` +
          'page configami przez AI, nie przez Decap.',
      );
    } else {
      reportWarning(
        `${file} has no entry in the CMS. If a section is intentionally unused, ` +
          'that is OK. Otherwise, fill in the data and run npm run cms:gen.',
      );
    }
  }

  jsonFileCount = onDisk.size;
  reportOk(
    `Checked ${onDisk.size} JSON files on disk and ${configFiles.size} entries in config.yml`,
  );
}

// ---------------------------------------------------------------------------
// Step 4: sections from page configs vs SECTION_REGISTRY (C validation)
// ---------------------------------------------------------------------------
function checkPageSections(): void {
  console.log('Step 4/6: sections from page configs vs SECTION_REGISTRY...');
  const pageFiles = fg.sync('src/data/pages/*.json', { cwd: ROOT });
  let sectionRefs = 0;

  for (const relative of pageFiles) {
    let page: any;
    try {
      page = JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
    } catch (err: any) {
      reportError(`${relative} does not parse as JSON: ${err.message}`);
      continue;
    }

    if (!Array.isArray(page?.sections)) {
      if (page?.sections !== undefined) {
        reportError(`${relative} has a "sections" field which is not a list.`);
      }
      continue;
    }

    for (const section of page.sections) {
      sectionRefs += 1;

      // The register entry is essential, without it the section will not render at all
      const entry = SECTION_REGISTRY[section.id];
      if (!entry) {
        reportError(
          `${relative}: sekcja "${section.id}" nie istnieje w SECTION_REGISTRY. ` +
            'Dodaj wpis w src/config/section-registry.ts.',
        );
        continue;
      }

      // The variant must exist, otherwise PageBuilder does not know the component
      const variant = entry.variants?.[section.variant ?? entry.defaultVariant];
      if (!variant) {
        reportError(
          `${relative}: sekcja "${section.id}" ma wariant "${section.variant}", ` +
            `which is not in SECTION_REGISTRY. Available: ${Object.keys(entry.variants).join(', ')}.`,
        );
        continue;
      }

      // If the variant declares a dataKey, the content file must exist
      const dataKey = variant.dataKey;
      if (dataKey && !fs.existsSync(path.join(SECTIONS_DIR, `${dataKey}.json`))) {
        reportError(
          `${relative}: sekcja "${section.id}" (wariant "${section.variant}") wskazuje ` +
            `dataKey "${dataKey}", ale plik src/data/sections/${dataKey}.json nie istnieje.`,
        );
      }
    }
  }

  reportOk(`Checked ${pageFiles.length} page configs and ${sectionRefs} section references`);
}

// ---------------------------------------------------------------------------
// Step 5: empty field collections (D validation) and image widgets (F validation)
// ---------------------------------------------------------------------------
// Decap rejects a collection whose file has an empty fields list ([]), therefore
// we check each list of fields recursively (nested fields too)
function hasEmptyFields(fields: any): boolean {
  if (Array.isArray(fields) && fields.length === 0) return true;
  if (!Array.isArray(fields)) return false;
  return fields.some((field) => {
    if (field?.fields !== undefined && hasEmptyFields(field.fields)) return true;
    if (field?.field?.fields !== undefined && hasEmptyFields(field.field.fields)) return true;
    return false;
  });
}

// Flattens nested fields into map name -> widget for easy comparison
// field type in config with JSON content
function flattenFields(fields: any[]): Map<string, string> {
  const map = new Map<string, string>();
  const walk = (list: any[]) => {
    for (const field of list ?? []) {
      if (!field || typeof field.name !== 'string') continue;
      map.set(field.name, field.widget ?? 'string');
      if (Array.isArray(field.fields)) walk(field.fields);
      if (field.field && Array.isArray(field.field.fields)) walk(field.field.fields);
    }
  };
  walk(fields);
  return map;
}

// Collects image references: keys from the IMAGE_KEYS list whose value
// looks like the path/URL of an image file
function collectImageRefs(obj: any): Array<{ key: string; value: string }> {
  const refs: Array<{ key: string; value: string }> = [];
  if (!obj || typeof obj !== 'object') return refs;
  for (const [key, value] of Object.entries(obj)) {
    if (
      IMAGE_KEYS.has(key) &&
      typeof value === 'string' &&
      /\.(png|jpe?g|webp|svg)$/i.test(value)
    ) {
      refs.push({ key, value });
    }
    if (Array.isArray(value) || (value && typeof value === 'object')) {
      refs.push(...collectImageRefs(value));
    }
  }
  return refs;
}

function checkFieldsAndWidgets(config: any): void {
  console.log('Step 5/6: empty field collections and image widgets...');
  let emptyCount = 0;
  let imageRefs = 0;

  for (const collection of config?.collections ?? []) {
    for (const file of collection.files ?? []) {
      // Validation D: empty fields list corrupts the entire Decap config
      if (hasEmptyFields(file.fields)) {
        emptyCount += 1;
        reportError(
          `The file "${file.file}" has an empty fields list. Decap rejects such a configuration. ` +
            'Dodaj co najmniej jedno pole do JSON albo do EXCLUDED_FIELDS w generatorze.',
        );
      }

      // Validation F: JSON images should have an image widget in the CMS
      if (!file.file || !fs.existsSync(path.join(ROOT, file.file))) continue;
      let data: any;
      try {
        data = JSON.parse(fs.readFileSync(path.join(ROOT, file.file), 'utf8'));
      } catch (err: any) {
        reportError(`${file.file} does not parse as JSON: ${err.message}`);
        continue;
      }
      const fieldMap = flattenFields(file.fields);
      for (const ref of collectImageRefs(data)) {
        imageRefs += 1;
        if (fieldMap.get(ref.key) !== 'image') {
          reportWarning(
            `Plik "${file.file}": klucz "${ref.key}" zawiera obrazek (${ref.value}), ` +
              `ale widget w CMS to "${fieldMap.get(ref.key) ?? 'brak pola'}". ` +
              'Dodaj mapowanie w generatorze (LABEL_MAP lub getWidgetType).',
          );
        }
      }
    }
  }

  if (emptyCount === 0) reportOk('Brak pustych kolekcji fields');
  reportOk(`${imageRefs} image reference widgets checked`);
}

// ---------------------------------------------------------------------------
// Step 6: hardcoded texts in components (E validation, warnings only)
// ---------------------------------------------------------------------------
function checkHardcodedTexts(): void {
  console.log('Krok 6/6: hardcoded teksty w komponentach (informacyjnie)...');
  const files = fg.sync(
    ['src/components/registry/**/*.astro', 'src/components/ui/molecules/**/*.astro'],
    { cwd: ROOT },
  );

  // Text between tags: >text<, without braces (JS interpolation)
  const textRegex = />[^<{]{15,}</g;
  const polishRegex = /[ąćęłńóśźż]/i;
  const found: Array<{ file: string; line: number; text: string }> = [];

  for (const relative of files) {
    const lines = fs.readFileSync(path.join(ROOT, relative), 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (const match of lines[i].matchAll(textRegex)) {
        const text = match[0].slice(1, -1).trim();
        // We are only interested in longer Polish phrases, this cannot fail,
        // because many hits are false positives (attributes, ternaries)
        if (text.length >= 15 && polishRegex.test(text)) {
          found.push({ file: relative, line: i + 1, text });
        }
      }
    }
  }

  const shown = found.slice(0, 30);
  for (const hit of shown) {
    reportWarning(
      `${hit.file}:${hit.line} prawdopodobny hardcoded tekst: "${hit.text.slice(0, 80)}"`,
    );
  }

  if (found.length === 0) {
    reportOk('Brak podejrzanych hardcoded tekstów w komponentach');
  } else if (found.length <= 30) {
    reportOk(`Znaleziono ${found.length} podejrzanych tekstów do ręcznego przejrzenia`);
  } else {
    reportOk(
      `Znaleziono ${found.length} podejrzanych tekstów, pokazano pierwsze 30 do ręcznego przejrzenia`,
    );
  }
}

// ---------------------------------------------------------------------------
// Podsumowanie i exit code
// ---------------------------------------------------------------------------
function printWarnings(): void {
  if (warnings.length === 0) return;
  console.log('');
  console.log(`Ostrzeżenia (${warnings.length}): do przejrzenia, nie blokują builda`);
  for (const warning of warnings) {
    console.warn(`  [OSTRZEŻENIE] ${warning}`);
  }
}

function printSummary(): void {
  printWarnings();
  console.log('');
  console.log('─'.repeat(64));
  if (errors.length > 0) {
    console.error(
      `cms:check: WYKRYTO ${errors.length} BŁĄDÓW KRYTYCZNYCH (${jsonFileCount} plików JSON, ${collectionCount} kolekcji)`,
    );
    console.error('Co robić: napraw błędy powyżej, potem uruchom npm run cms:gen i npm run cms:check ponownie.');
    process.exitCode = 1;
  } else {
    console.log(
      `cms:check: OK (${jsonFileCount} plików JSON, ${collectionCount} kolekcji, ${warnings.length} ostrzeżeń)`,
    );
  }
  console.log('─'.repeat(64));
}

function main(): void {
  console.log('cms:check: walidacja spójności JSON <-> CMS config <-> komponenty');
  console.log('');

  if (!regenerateConfig()) {
    printSummary();
    return;
  }

  const config = loadConfig();
  if (config === null) {
    printSummary();
    return;
  }

  checkFileCoverage(config);
  checkPageSections();
  checkFieldsAndWidgets(config);
  checkHardcodedTexts();

  printSummary();
}

main();
