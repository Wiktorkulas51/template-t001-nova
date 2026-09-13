import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

/**
 * Decap CMS content overview: what the customer sees in the panel.
 * Reads the generated public/admin/config.yml and prints the structure:
 * kolekcje -> pliki -> pola (etykieta, nazwa, widget).
 *
 * Usage: npm run cms:list
 *
 * Before running, make sure the config is up to date (npm run cms:gen).
 */

const CONFIG_PATH = path.join(process.cwd(), 'public/admin/config.yml');

if (!fs.existsSync(CONFIG_PATH)) {
  console.error('Brak public/admin/config.yml. Uruchom najpierw: npm run cms:gen');
  process.exit(1);
}

const config: any = yaml.load(fs.readFileSync(CONFIG_PATH, 'utf8'));
const collections = config?.collections ?? [];

if (collections.length === 0) {
  console.log('Brak kolekcji w config.yml.');
  process.exit(0);
}

console.log(`\n📦 Decap CMS — zawartość panelu (${collections.length} kolekcji)\n`);

let totalFiles = 0;
let totalFields = 0;

// Why: we print nested fields (objects/lists) with indentation,
// so that the client/AI can see the full editable structure in the panel.
function printFields(fields: any[], indent: number): number {
  let count = 0;
  for (const field of fields ?? []) {
    if (!field || typeof field !== 'object') continue;
    const name = field.name ?? '?';
    const widget = field.widget ?? 'string';
    const hidden = widget === 'hidden';
    const optional = field.required === false ? ' (opcjonalne)' : '';
    const pad = ' '.repeat(indent);
    const marker = hidden ? ' [ukryte]' : '';
    const label = field.label ?? name;
    console.log(`${pad}• ${label}${optional}${marker}  <${name}: ${widget}>`);
    count += 1;
    if (Array.isArray(field.fields)) {
      count += printFields(field.fields, indent + 2);
    }
    if (field.field && Array.isArray(field.field.fields)) {
      count += printFields(field.field.fields, indent + 2);
    }
  }
  return count;
}

for (const collection of collections) {
  const files = collection.files ?? [];
  if (files.length === 0) continue;
  console.log(`── ${collection.label} (${files.length}) ──`);
  for (const file of files) {
    const fileLabel = file.label ?? file.name ?? file.file;
    const fields = file.fields ?? [];
    console.log(`\n  📄 ${fileLabel}  →  ${file.file}`);
    totalFiles += 1;
    totalFields += printFields(fields, 4);
  }
  console.log('');
}

console.log('─'.repeat(64));
console.log(`Podsumowanie: ${collections.length} kolekcji, ${totalFiles} plików, ${totalFields} pól (w tym zagnieżdżone)`);
console.log('Pola z [ukryte] nie są widoczne dla klienta w panelu.');
