import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { pathToFileURL } from 'node:url';

// Vite and Astro add an 8 character content hash to emitted asset names.
// A real hash contains a digit or an uppercase letter, which keeps names such as "-portrait" intact.
const HASHED_NAME = /^(.+?)[.-]((?=[A-Za-z0-9_-]*[A-Z0-9])[A-Za-z0-9_-]{8})(\.[a-z0-9]+)$/;
const ASSET_TOKEN = /(^|[\s"'(,=]|&quot;|&#39;)(\/(?!\/)[^\s"'<>(),&]*\.(?:svg|png|ico|webp|jpe?g|avif|gif|mp4|webm|woff2?|ttf|otf|css|js|json|xml|pdf|txt|webmanifest)(?:[?#][^\s"'<>(),&]*)?)/gi;
const DEMO_SCRIPT_MARKERS = ['data-template-demo-badge'];

export function toPosix(value) {
  return value.split(path.sep).join('/');
}

export function walkFiles(root, base = root) {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full, base));
    else files.push(toPosix(path.relative(base, full)));
  }
  return files.sort();
}

export function routeFromHtmlFile(file) {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.slice(0, -'index.html'.length)}`;
  return `/${file}`;
}

// A route that is the parent of other routes keeps a folder with index.html, a leaf becomes a flat .html file.
export function flattenRoutes(routes) {
  const map = new Map();
  for (const route of routes) {
    if (route === '/') map.set(route, 'index.html');
    else if (!route.endsWith('/')) map.set(route, route.slice(1));
    else {
      const isParent = routes.some((other) => other !== route && other.startsWith(route));
      map.set(route, isParent ? `${route.slice(1)}index.html` : `${route.slice(1, -1)}.html`);
    }
  }
  return map;
}

export function stripHash(fileName) {
  const match = fileName.match(HASHED_NAME);
  return match ? `${match[1]}${match[3]}` : fileName;
}

// Build output gets a buyer-friendly layout: scripts are rebundled, styles and fonts move under assets/.
export function mapAssetPath(file) {
  const name = path.posix.basename(file);
  const dir = path.posix.dirname(file);
  const ext = path.posix.extname(name).toLowerCase();
  const isEmitted = dir === '_assets' || dir === 'assets';
  if (!isEmitted) return file;
  if (ext === '.js') return null;
  if (ext === '.css') return `assets/css/${stripHash(name)}`;
  if (/\.(woff2?|ttf|otf)$/.test(ext)) return `assets/fonts/${stripHash(name)}`;
  return `assets/${stripHash(name)}`;
}

export function relativeUrl(fromFile, toFile) {
  const fromDir = path.posix.dirname(fromFile);
  let relative = path.posix.relative(fromDir === '.' ? '' : fromDir, toFile);
  if (!relative.startsWith('.')) relative = `./${relative}`;
  return relative;
}

function splitSuffix(url) {
  const index = url.search(/[?#]/);
  return index === -1 ? [url, ''] : [url.slice(0, index), url.slice(index)];
}

function normalizeRoute(pathname, routeMap) {
  if (routeMap.has(pathname)) return pathname;
  const withSlash = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return routeMap.has(withSlash) ? withSlash : null;
}

export function createUrlRewriter({ routeMap, assetMap, aliases = new Map() }) {
  const resolveRoute = (pathname) => {
    const route = normalizeRoute(pathname, routeMap) ?? (aliases.has(pathname) ? aliases.get(pathname) : null);
    return route ? routeMap.get(route) : null;
  };

  return {
    asset(fromFile, url) {
      const [pathname, suffix] = splitSuffix(url);
      const target = assetMap.get(pathname.slice(1));
      return target ? `${relativeUrl(fromFile, target)}${suffix}` : null;
    },
    link(fromFile, url) {
      if (!url.startsWith('/') || url.startsWith('//')) return null;
      const [pathname, suffix] = splitSuffix(url);
      const page = resolveRoute(pathname);
      // Same-page anchors stay plain fragments so scroll handlers that look for href="#..." keep working.
      if (page === fromFile && suffix.startsWith('#')) return suffix;
      if (page) return `${relativeUrl(fromFile, page)}${suffix}`;
      return this.asset(fromFile, url);
    },
    absolute(siteUrl, url) {
      if (!url.startsWith(siteUrl)) return null;
      const [pathname, suffix] = splitSuffix(`/${url.slice(siteUrl.length)}`);
      const page = resolveRoute(pathname);
      if (page) return `${siteUrl}${page === 'index.html' ? '' : page.replace(/(^|\/)index\.html$/, '$1')}${suffix}`;
      const asset = assetMap.get(pathname.slice(1));
      return asset ? `${siteUrl}${asset}${suffix}` : null;
    },
  };
}

export function rewriteHtmlUrls(html, fromFile, rewriter, siteUrl) {
  let output = html.replace(/(\shref=)(["'])([^"']*)\2/gi, (match, attr, quote, url) => {
    const next = rewriter.link(fromFile, url) ?? (siteUrl ? rewriter.absolute(siteUrl, url) : null);
    return next ? `${attr}${quote}${next}${quote}` : match;
  });
  output = output.replace(/(\scontent=)(["'])([^"']*)\2/gi, (match, attr, quote, url) => {
    const next = siteUrl ? rewriter.absolute(siteUrl, url) : null;
    return next ? `${attr}${quote}${next}${quote}` : match;
  });
  // Island props keep internal links as HTML-escaped JSON strings.
  output = output.replace(/&quot;(\/[^&"]+)&quot;/g, (match, url) => {
    const next = rewriter.link(fromFile, url);
    return next ? `&quot;${next}&quot;` : match;
  });
  return output.replace(ASSET_TOKEN, (match, lead, url) => {
    const next = rewriter.asset(fromFile, url);
    return next ? `${lead}${next}` : match;
  });
}

export function rewriteCssUrls(css, fromFile, rewriter) {
  return css.replace(/url\((["']?)(\/(?!\/)[^)"']+)\1\)/g, (match, quote, url) => {
    const next = rewriter.asset(fromFile, url);
    return next ? `url(${quote}${next}${quote})` : match;
  });
}

// Keeps /*! legal */ comments and skips comment-like text inside strings.
export function stripCssComments(css) {
  let output = '';
  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];
    // Tailwind selectors escape quotes (\'), which must not open a string.
    if (char === '\\') {
      output += css.slice(index, index + 2);
      index += 1;
    } else if (char === '"' || char === "'") {
      const end = findStringEnd(css, index, char);
      output += css.slice(index, end);
      index = end - 1;
    } else if (char === '/' && css[index + 1] === '*') {
      const end = css.indexOf('*/', index + 2);
      const stop = end === -1 ? css.length : end + 2;
      if (css[index + 2] === '!') output += css.slice(index, stop);
      index = stop - 1;
    } else output += char;
  }
  return output;
}

function findStringEnd(text, start, quote) {
  for (let index = start + 1; index < text.length; index += 1) {
    if (text[index] === '\\') index += 1;
    else if (text[index] === quote) return index + 1;
  }
  return text.length;
}

export function findIslands(html) {
  const islands = [];
  const pattern = /<astro-island\b|<\/astro-island>/g;
  let depth = 0;
  let start = -1;
  for (const match of html.matchAll(pattern)) {
    if (match[0].startsWith('</')) {
      depth -= 1;
      if (depth === 0) islands.push([start, match.index + match[0].length]);
    } else {
      if (depth === 0) start = match.index;
      depth += 1;
    }
  }
  return islands;
}

export function protect(html, ranges, label) {
  const saved = [];
  let output = '';
  let cursor = 0;
  for (const [start, end] of ranges) {
    output += html.slice(cursor, start) + `<html-export-${label} data-index="${saved.length}"></html-export-${label}>`;
    saved.push(html.slice(start, end));
    cursor = end;
  }
  return { html: output + html.slice(cursor), saved };
}

export function restore(html, saved, label) {
  // Prettier may wrap the closing tag, so whitespace before ">" is allowed.
  const pattern = new RegExp(String.raw`<html-export-${label}\s+data-index="([0-9]+)"\s*>\s*</html-export-${label}\s*>`, 'g');
  const output = html.replace(pattern, (match, index) => saved[Number(index)]);
  if (output.includes(`<html-export-${label}`)) throw new Error(`Could not restore every protected ${label} block.`);
  return output;
}

export function stripHtmlComments(html) {
  return html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
}

export function classifyScript(attributes, content) {
  const type = attributes.match(/\stype=["']([^"']+)["']/i)?.[1]?.toLowerCase() ?? '';
  const src = attributes.match(/\ssrc=["']([^"']+)["']/i)?.[1] ?? null;
  if (type === 'module' && src && /^(?:[a-z]+:)?\/\//i.test(src)) return { kind: 'keep' };
  if (type === 'module') return src ? { kind: 'module-src', src } : { kind: 'module-inline', content };
  if (type && type !== 'text/javascript') return { kind: 'keep' };
  if (src) return { kind: 'keep' };
  if (DEMO_SCRIPT_MARKERS.some((marker) => content.includes(marker))) return { kind: 'drop' };
  if (/customElements\.define\(["']astro-island["']/.test(content) || /\(self\.Astro\|\|\(self\.Astro=\{\}\)\)/.test(content)) {
    return { kind: 'island-runtime', content };
  }
  return { kind: 'classic-inline', content };
}

// Names lose their hash in the export, so two sources with one base name would silently overwrite each other.
export function setUnique(map, key, value, kind) {
  if (map.has(key) && map.get(key) !== value) {
    throw new Error(`Two ${kind} sources map to "${key}": ${map.get(key)} and ${value}. Rename one of them.`);
  }
  map.set(key, value);
}

export function islandModuleKey(url) {
  return stripHash(path.posix.basename(splitSuffix(url)[0])).replace(/\.js$/, '');
}

function crc32(buffer) {
  return zlib.crc32(buffer) >>> 0;
}

export function writeZip(archivePath, sourceDir, rootName) {
  const files = walkFiles(sourceDir);
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const date = new Date();
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();

  for (const file of files) {
    const name = Buffer.from(`${rootName}/${file}`, 'utf8');
    const data = fs.readFileSync(path.join(sourceDir, file));
    const compressed = zlib.deflateRawSync(data, { level: 9 });
    const useDeflate = compressed.length < data.length;
    const body = useDeflate ? compressed : data;
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(useDeflate ? 8 : 0, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    localParts.push(local, name, body);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(useDeflate ? 8 : 0, 10);
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + body.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  fs.writeFileSync(archivePath, Buffer.concat([...localParts, ...centralParts, end]));
  return files.length;
}

export async function loadExportConfig(projectRoot) {
  const config = await import(pathToFileURL(path.join(projectRoot, 'site.config.mjs')).href);
  const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  const exportConfig = config.HTML_EXPORT ?? {};
  return {
    slug: exportConfig.slug ?? config.TEMPLATE_CONFIG?.id ?? pkg.name,
    title: exportConfig.title ?? config.TEMPLATE_CONFIG?.name ?? pkg.name,
    description: exportConfig.description ?? config.siteConfig?.description ?? '',
    version: config.TEMPLATE_CONFIG?.version ?? pkg.version,
    // Nova builds its URLs from BUILD_SITE_URL, which reads PUBLIC_SITE_URL set by the exporter; SITE_URL would keep the preview domain.
    siteUrl: config.BUILD_SITE_URL ?? config.SITE_URL,
    restrictedImages: exportConfig.restrictedImages ?? [],
  };
}
