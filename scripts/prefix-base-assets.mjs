import fs from 'node:fs';
import path from 'node:path';
import { SITE_URL } from '../site.config.mjs';
import { resolvePublicBasePath } from '../src/utils/public-base-path.mjs';

// Why: Layout dostaje adres z PUBLIC_SITE_URL albo Astro.site (= SITE_URL), więc skrypt czyta to samo.
const basePath = resolvePublicBasePath({
  publicBasePath: process.env.PUBLIC_BASE_PATH,
  publicSiteUrl: process.env.PUBLIC_SITE_URL || SITE_URL,
});
if (!basePath) {
  console.log('prefix-base-assets: baza katalogu głównego, pomijam.');
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
  let updated = original.replace(assetPathPattern, (match, boundary) => {
    const assetPath = match.slice(boundary.length);
    if (!/^\/(?:_assets|assets|fonts|js|favicon|apple-touch)/.test(assetPath)) return match;
    return `${boundary}${prefix}${assetPath}`;
  });

  updated = updated.replaceAll('href="/favicon.svg"', `href="${prefix}/favicon.svg"`);
  updated = updated.replaceAll('href="/apple-touch-icon.png"', `href="${prefix}/apple-touch-icon.png"`);
  updated = updated.replaceAll('src="/logo.svg"', `src="${prefix}/logo.svg"`);
  if (process.env.PUBLIC_SITE_URL) {
    const socialImage = `${process.env.PUBLIC_SITE_URL.replace(/\/$/, '')}/og-image.png`;
    updated = updated.replaceAll('https://t001-nova.netlify.app/og-image.png', socialImage);
  }

  if (updated !== original) fs.writeFileSync(filePath, updated, 'utf8');
}

console.log(`prefix-base-assets: zastosowano ${prefix}/`);
