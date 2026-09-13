import fs from 'node:fs';
import path from 'node:path';

const basePath = (process.env.PUBLIC_BASE_PATH || '').trim().replace(/^\/+|\/+$/g, '');
if (!basePath) {
  console.log('prefix-base-assets: brak PUBLIC_BASE_PATH, pomijam.');
  process.exit(0);
}

const distRoot = path.resolve('dist');
const prefix = `/${basePath}`;
const assetPathPattern = /(["'(=\s])\/(?!preview\/)[_a-zA-Z0-9-]+\//g;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

for (const filePath of walk(distRoot)) {
  if (!/\.(html|css|js)$/i.test(filePath)) continue;

  const original = fs.readFileSync(filePath, 'utf8');
  const updated = original.replace(assetPathPattern, (match, boundary) => {
    const assetPath = match.slice(boundary.length);
    if (!/^\/(?:_assets|assets|fonts|js|favicon|apple-touch)/.test(assetPath)) return match;
    return `${boundary}${prefix}${assetPath}`;
  });

  if (updated !== original) fs.writeFileSync(filePath, updated, 'utf8');
}

console.log(`prefix-base-assets: zastosowano ${prefix}/`);
