import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import * as prettier from 'prettier';
import sharp from 'sharp';
import {
  classifyScript,
  createUrlRewriter,
  findIslands,
  flattenRoutes,
  islandModuleKey,
  loadExportConfig,
  mapAssetPath,
  protect,
  relativeUrl,
  restore,
  rewriteCssUrls,
  rewriteHtmlUrls,
  routeFromHtmlFile,
  setUnique,
  stripCssComments,
  stripHash,
  stripHtmlComments,
  toPosix,
  walkFiles,
  writeZip,
} from './export-html-core.mjs';

const PRETTIER_OPTIONS = { printWidth: 120, singleQuote: false, htmlWhitespaceSensitivity: 'css' };

function parseArgs(argv) {
  const options = { skipBuild: false, outDir: null, siteUrl: undefined };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--skip-build') options.skipBuild = true;
    else if (argv[index] === '--out') options.outDir = argv[++index];
    else if (argv[index] === '--site-url') options.siteUrl = argv[++index];
    else throw new Error(`Unknown option: ${argv[index]}`);
  }
  return options;
}

function runBuild(projectRoot) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  execFileSync(npm, ['run', 'build'], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, HTML_EXPORT: '1' },
  });
}

function hash(value) {
  return crypto.createHash('sha1').update(value).digest('hex').slice(0, 10);
}

function bundleBanner(outFile) {
  const depth = outFile.split('/').length - 1;
  const up = '../'.repeat(depth) || './';
  return [
    `var __htmlExportRoot = window.__htmlExportRoot || (window.__htmlExportRoot = new URL(${JSON.stringify(up)}, document.currentScript.src).href);`,
    'var __htmlExportLoadChunk = window.__htmlExportLoadChunk || (window.__htmlExportLoadChunk = function (name) {',
    '  var chunks = (window.__htmlExportChunks = window.__htmlExportChunks || {});',
    '  if (chunks[name]) return Promise.resolve(chunks[name]);',
    '  return new Promise(function (resolve, reject) {',
    '    var script = document.createElement("script");',
    '    script.src = __htmlExportRoot + "assets/js/vendor/" + name + ".min.js";',
    '    script.onload = function () { resolve(chunks[name]); };',
    '    script.onerror = reject;',
    '    document.head.appendChild(script);',
    '  });',
    '});',
  ].join('\n');
}

function createDistPlugin({ distDir, assetMap, virtualModules, chunks }) {
  const assetsDir = path.join(distDir, '_assets');

  // Module syntax that only works over HTTP is rewritten so the bundle runs as a classic script from file://.
  const transform = (code) => code
    .replace(/__vite__mapDeps\(\[[\d,\s]*\]\)/g, '[]')
    .replace(/\bimport\((["'])(\.\/|\/_assets\/)([^"']+\.js)\1\)/g, (match, quote, prefix, file) => {
      const name = stripHash(file).replace(/\.js$/, '');
      setUnique(chunks, name, path.join(assetsDir, file), 'lazy chunk');
      return `__htmlExportLoadChunk(${JSON.stringify(name)})`;
    })
    .replace(/(["'`])\/((?:_assets|assets)\/[^"'`\s]+)\1/g, (match, quote, file) => {
      const target = assetMap.get(file);
      return target ? `(__htmlExportRoot + ${JSON.stringify(target)})` : match;
    });

  return {
    name: 'html-export-dist',
    setup(build) {
      build.onResolve({ filter: /^virtual:/ }, (args) => ({ path: args.path, namespace: 'html-export' }));
      build.onResolve({ filter: /^\/[^/]/ }, (args) => ({ path: path.join(distDir, args.path.split('?')[0]) }));
      build.onLoad({ filter: /.*/, namespace: 'html-export' }, (args) => ({
        contents: transform(virtualModules.get(args.path)),
        resolveDir: distDir,
        loader: 'js',
      }));
      build.onLoad({ filter: /\.js$/ }, (args) => {
        if (!path.resolve(args.path).startsWith(path.resolve(distDir))) return undefined;
        return { contents: transform(fs.readFileSync(args.path, 'utf8')), loader: 'js' };
      });
    },
  };
}

async function bundle({ entry, outFile, outRoot, plugin, minify, globalName, footer }) {
  const result = await esbuild.build({
    stdin: { contents: entry, resolveDir: process.cwd(), loader: 'js' },
    bundle: true,
    write: false,
    format: 'iife',
    globalName,
    minify,
    target: 'es2020',
    charset: 'utf8',
    legalComments: 'inline',
    logLevel: 'error',
    logOverride: { 'empty-import-meta': 'silent' },
    banner: { js: bundleBanner(outFile) },
    footer: footer ? { js: footer } : undefined,
    plugins: [plugin],
  });
  let code = result.outputFiles[0].text;
  if (!minify) {
    // esbuild marks module boundaries with build paths; short section names are more useful to a buyer.
    code = code
      .replace(/^(\s*)\/\/ html-export:virtual:inline-(.+)-[0-9a-f]{10}$/gm, '$1// $2')
      .replace(/^(\s*)\/\/ (?:dist\/)?_assets\/([^\s.]+)\S*\.js$/gm, '$1// $2')
      .replace(/\/\*\*? (?:@__PURE__|#__KEEP__) \*\/\s*/g, '');
    code = await prettier.format(code, { ...PRETTIER_OPTIONS, parser: 'babel' });
  }
  const target = path.join(outRoot, outFile);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, code);
}

function canonicalRoute(html, siteUrl) {
  const href = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1]
    ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1];
  if (!href || !siteUrl || !href.startsWith(siteUrl)) return null;
  return `/${href.slice(siteUrl.length)}`.split(/[?#]/)[0];
}

function readScripts(html) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
    ...classifyScript(match[1], match[2]),
  }));
}

function placeholderSvg(width, height) {
  const size = Math.max(12, Math.round(Math.min(width, height) / 14));
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#d9d5cd"/>
  <rect x="${size}" y="${size}" width="${width - size * 2}" height="${height - size * 2}" fill="none" stroke="#b9b3a8" stroke-width="${Math.max(1, size / 8)}" stroke-dasharray="${size / 2} ${size / 3}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size}" fill="#6f695f" text-anchor="middle">Placeholder image</text>
  <text x="50%" y="50%" dy="${size * 1.5}" font-family="Arial, sans-serif" font-size="${Math.round(size * 0.7)}" fill="#6f695f" text-anchor="middle">${width} × ${height}</text>
</svg>`);
}

async function replaceRestrictedImages(outRoot, restrictedImages) {
  const replaced = [];
  for (const image of restrictedImages) {
    const name = path.posix.basename(image).replace(/\.[^.]+$/, '');
    const responsiveDir = path.join(outRoot, 'assets/images-responsive');
    const variantPattern = new RegExp(`^${name}-[0-9]+[.][a-z]+$`);
    const variants = fs.existsSync(responsiveDir)
      ? fs.readdirSync(responsiveDir).filter((file) => variantPattern.test(file)).map((file) => `assets/images-responsive/${file}`)
      : [];
    for (const file of [image, ...variants]) {
      const target = path.join(outRoot, file);
      if (!fs.existsSync(target)) continue;
      // Reading from a buffer avoids sharp holding the file open on Windows while it is overwritten.
      const { width, height } = await sharp(fs.readFileSync(target)).metadata();
      const buffer = await sharp(placeholderSvg(width, height)).webp({ quality: 82 }).toBuffer();
      fs.writeFileSync(target, buffer);
      replaced.push(file);
    }
  }
  return replaced;
}

function copyFontLicenses(projectRoot, outRoot) {
  const fontFiles = fs.existsSync(path.join(outRoot, 'assets/fonts')) ? fs.readdirSync(path.join(outRoot, 'assets/fonts')) : [];
  const copied = [];
  for (const scope of ['@fontsource-variable', '@fontsource']) {
    const scopeDir = path.join(projectRoot, 'node_modules', scope);
    if (!fs.existsSync(scopeDir)) continue;
    for (const family of fs.readdirSync(scopeDir)) {
      const license = path.join(scopeDir, family, 'LICENSE');
      if (!fontFiles.some((file) => file.startsWith(`${family}-`)) || !fs.existsSync(license)) continue;
      const target = path.join(outRoot, 'licenses', `font-${family}.txt`);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(license, target);
      copied.push(`licenses/font-${family}.txt`);
    }
  }
  return copied;
}

// Chrome blocks font files on file:// as cross-origin requests, so @font-face rules move to fonts.css with data URIs.
function embedFonts(outRoot) {
  const blocks = [];
  for (const file of walkFiles(outRoot).filter((item) => item.endsWith('.css'))) {
    const target = path.join(outRoot, file);
    const css = fs.readFileSync(target, 'utf8');
    const next = css.replace(/@font-face\s*\{[^}]*\}\s*/g, (block) => {
      if (!/url\(["']?[^)"']*fonts\//.test(block)) return block;
      blocks.push(block.replace(/url\((["']?)([^)"']+\.(woff2?|ttf|otf))\1\)/g, (match, quote, url, ext) => {
        const font = path.posix.normalize(path.posix.join(path.posix.dirname(file), url));
        const mime = ext === 'woff2' ? 'font/woff2' : ext === 'woff' ? 'font/woff' : `font/${ext}`;
        return `url("data:${mime};base64,${fs.readFileSync(path.join(outRoot, font)).toString('base64')}")`;
      }).trim());
      return '';
    });
    if (next !== css) fs.writeFileSync(target, next);
  }
  fs.writeFileSync(
    path.join(outRoot, 'assets/css/fonts.css'),
    `/* Web fonts embedded as data URIs so they also load when index.html is opened from disk. The original files are in assets/fonts/. */\n${blocks.join('\n\n')}\n`,
  );
}

function writeSitemap(outRoot, siteUrl, pages) {
  if (!siteUrl) return;
  const urls = pages
    .filter((page) => !page.endsWith('404.html'))
    .map((page) => `  <url><loc>${siteUrl}${page === 'index.html' ? '' : page.replace(/(^|\/)index\.html$/, '$1')}</loc></url>`);
  fs.writeFileSync(path.join(outRoot, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
}

function validateOutput(outRoot) {
  const problems = [];
  const files = walkFiles(outRoot);
  for (const file of files.filter((item) => /\.(html|css)$/.test(item))) {
    const text = fs.readFileSync(path.join(outRoot, file), 'utf8');
    const refs = [];
    for (const match of text.matchAll(/\s(?:href|src|poster)=["']([^"']+)["']/gi)) refs.push(match[1]);
    for (const match of text.matchAll(/\ssrcset=["']([^"']+)["']/gi)) refs.push(...match[1].split(',').map((part) => part.trim().split(/\s+/)[0]));
    // Quotes inside a style attribute are HTML-escaped (&quot;), so they are matched too.
    for (const match of text.matchAll(/url\((?:&quot;|&#39;|["'])?([^)"'&]+)(?:&quot;|&#39;|["'])?\)/g)) refs.push(match[1]);
    for (const ref of refs) {
      if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(ref) || ref === '') continue;
      if (ref.startsWith('/')) {
        problems.push(`${file}: root-absolute reference ${ref}`);
        continue;
      }
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), ref.split(/[?#]/)[0]));
      if (!fs.existsSync(path.join(outRoot, target))) problems.push(`${file}: missing ${ref}`);
    }
    if (file.endsWith('.html') && /_vercel\/insights/.test(text)) problems.push(`${file}: contains Vercel Analytics`);
  }
  for (const file of files.filter((item) => item.endsWith('.js'))) {
    const text = fs.readFileSync(path.join(outRoot, file), 'utf8');
    const absolute = text.match(/["'`]\/(?:_assets|assets)\/[^"'`]+/);
    if (absolute) problems.push(`${file}: root-absolute asset path ${absolute[0]}`);
  }
  return problems;
}

function buildReadme({ config, pages, hasIslands, hasForms, hasMap, replacedImages, fontLicenses }) {
  const pageList = pages.map((page) => `- \`${page}\``).join('\n');
  const restricted = replacedImages.length
    ? `The following files are neutral placeholders because the original demo photos are licensed in a way that does not allow redistribution in a template package. Replace them with images you have the right to use, keeping the same file names or updating the references in the HTML:\n\n${replacedImages.map((file) => `- \`${file}\``).join('\n')}`
    : 'All images included in this package may be used in websites built with the template.';
  return `# ${config.title} HTML template

${config.description}

Version ${config.version}. This package is a static HTML, CSS and JavaScript website. It needs no build step, framework or server-side code.

## Quick start

1. Unzip the package.
2. Open \`index.html\` in a browser. The site also works from any static hosting, including a subfolder.
3. Edit the HTML files in a code editor and refresh the browser.

## Structure

${pageList}
- \`assets/css/\`: stylesheets. \`style.css\` contains the whole design system: colors, fonts and spacing are CSS custom properties at the top of the file.
- \`assets/js/\`: site scripts (navigation, menus, tabs, form and other interactions), one readable file per page type.
- \`assets/js/vendor/\`: precompiled third-party code and interactive components (minified).
- \`assets/fonts/\`: self-hosted web font files. \`assets/css/fonts.css\` embeds the same fonts as data URIs, because browsers block separate font files on pages opened from disk. On a web server you may point the \`@font-face\` rules at these files instead.
- \`assets/images/\` and \`assets/images-responsive/\`: images and their smaller responsive variants.
- \`licenses/\`: licenses of bundled fonts.
- \`sitemap.xml\`: sitemap with the example domain.

## Languages

English pages are at the root and Polish pages are in \`pl/\`. Each language is a separate HTML file, so translate or remove text directly in that file. The language switcher in the header links between matching pages. To drop a language, delete its files and remove the switcher links.

## Editing content

- Text, links and images are plain HTML. Search for the text you want to change.
- Replace \`https://example.com/\` in the \`<head>\` of every page (canonical, alternate and Open Graph tags) and in \`sitemap.xml\` with your domain.
- Page title and description are in the \`<title>\` and \`<meta name="description">\` tags.
- Logos and favicons are in the package root (\`logo.svg\`, \`favicon.svg\` and related files).
${hasIslands ? `- Some sections, such as sliders and galleries, are interactive components from \`assets/js/vendor/islands.min.js\`. Their text and image paths are stored in the \`props\` attribute of the surrounding \`<astro-island>\` element as HTML-escaped JSON. Edit the values in that attribute, keeping its structure, and update the matching visible HTML next to it so the page looks right before the script runs.\n` : ''}
## Images

${restricted}

When you replace an image, also replace or delete its variants in \`assets/images-responsive/\` and adjust the \`srcset\` attribute, or remove \`srcset\` and \`sizes\` to use a single file.
${hasForms ? `
## Contact form

The form does not send data anywhere. It validates the fields and shows a confirmation message in the browser, so no submission reaches the template author or any third party.

To receive messages, connect your own form endpoint, for example Formspree, Web3Forms, Basin or a script on your server:

1. Add \`action="https://your-endpoint.example/submit"\` and \`method="post"\` to the \`<form>\` element. Every field needs a \`name\` attribute; the template fields already have them.
2. Remove the \`data-contact-form\` attribute from the form, so the demo handler in \`assets/js/\` no longer stops the submission. Alternatively, edit the submit handler in the site script and send the data with \`fetch()\` to your endpoint.
3. Check your provider's spam protection and privacy requirements, and update the privacy policy page.
` : ''}${hasMap ? `
## Map

The map uses Leaflet with OpenStreetMap tiles loaded from \`tile.openstreetmap.org\`. Change the coordinates in the map element's data attributes in the HTML. For high-traffic sites, follow the OpenStreetMap tile usage policy or switch to a tile provider of your choice. Tiles need an internet connection and may not load when the page is opened from disk; they load on a web server.
` : ''}
## Browser support

Current versions of Chrome, Edge, Firefox and Safari.

## License

See \`LICENSE.md\`. Third-party code keeps its own license: license headers are kept inside the bundled files in \`assets/js/vendor/\`${fontLicenses.length ? `, and font licenses are in \`licenses/\`` : ''}.
`;
}

export async function exportHtml({ projectRoot, outDir, skipBuild = false, siteUrl = 'https://example.com/' }) {
  // A neutral site URL at the root keeps preview-only extras (demo badge, analytics) out of the package,
  // and it overrides any local .env value because Vite gives process.env priority.
  process.env.PUBLIC_SITE_URL = siteUrl;
  process.env.PUBLIC_BASE_PATH = '/';
  const config = await loadExportConfig(projectRoot);
  if (!skipBuild) runBuild(projectRoot);

  const distDir = path.join(projectRoot, 'dist');
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(config.slug)) throw new Error(`Invalid HTML_EXPORT.slug: "${config.slug}"`);
  const exportName = `${config.slug}-html`;
  const outRoot = path.join(outDir, exportName);
  fs.rmSync(outRoot, { recursive: true, force: true });
  fs.mkdirSync(outRoot, { recursive: true });

  const distFiles = walkFiles(distDir);
  const htmlFiles = distFiles.filter((file) => file.endsWith('.html'));
  const sources = new Map(htmlFiles.map((file) => [routeFromHtmlFile(file), fs.readFileSync(path.join(distDir, file), 'utf8')]));

  // Pages whose canonical URL points at another exported page are duplicates (for example /en/ next to the English root).
  const aliases = new Map();
  for (const [route, html] of sources) {
    const canonical = canonicalRoute(html, config.siteUrl);
    if (canonical && canonical !== route && sources.has(canonical)) aliases.set(route, canonical);
  }
  const routes = [...sources.keys()].filter((route) => !aliases.has(route));
  const routeMap = flattenRoutes(routes);

  const assetMap = new Map();
  const assetTargets = new Map();
  for (const file of distFiles) {
    if (file.endsWith('.html') || /^sitemap.*\.xml$/.test(file)) continue;
    const target = mapAssetPath(file);
    if (!target) continue;
    setUnique(assetTargets, target, file, 'asset');
    assetMap.set(file, target);
    fs.mkdirSync(path.dirname(path.join(outRoot, target)), { recursive: true });
    fs.copyFileSync(path.join(distDir, file), path.join(outRoot, target));
  }
  const rewriter = createUrlRewriter({ routeMap, assetMap, aliases });

  const virtualModules = new Map();
  const chunks = new Map();
  const plugin = createDistPlugin({ distDir, assetMap, virtualModules, chunks });
  const islandModules = new Map();
  const islandRuntime = new Map();
  const siteBundles = new Map();
  const pages = [];

  for (const route of routes) {
    const outFile = routeMap.get(route);
    const original = sources.get(route);
    const islandRanges = findIslands(original);
    const { html: withoutIslands, saved: islands } = protect(original, islandRanges, 'island');

    const scripts = readScripts(withoutIslands);
    const siteImports = [];
    let html = '';
    let cursor = 0;
    for (const script of scripts) {
      html += withoutIslands.slice(cursor, script.start);
      cursor = script.end;
      if (script.kind === 'keep') html += withoutIslands.slice(script.start, script.end);
      else if (script.kind === 'classic-inline') {
        const { code } = await esbuild.transform(script.content, { loader: 'js', charset: 'utf8', legalComments: 'inline' });
        html += `<script>${code}</script>`;
      } else if (script.kind === 'module-src') siteImports.push(script.src);
      else if (script.kind === 'module-inline') {
        const name = script.content.match(/#region \S*?\/([\w-]+)\.astro/)?.[1] ?? 'inline';
        const id = `virtual:inline-${name}-${hash(script.content)}`;
        virtualModules.set(id, script.content);
        siteImports.push(id);
      } else if (script.kind === 'island-runtime') {
        const id = `virtual:runtime-${hash(script.content)}`;
        islandRuntime.set(id, script.content.replace(/\bimport\(/g, '__htmlExportImport('));
      }
    }
    html += withoutIslands.slice(cursor);
    html = html.replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*>/gi, '');

    const rewrittenIslands = islands.map((island) => {
      const withKeys = island.replace(/\s(component-url|renderer-url|before-hydration-url)=(["'])([^"']*)\2/g, (match, attr, quote, url) => {
        if (!url) return match;
        setUnique(islandModules, islandModuleKey(url), url, 'island module');
        return ` ${attr}=${quote}${islandModuleKey(url)}${quote}`;
      });
      return rewriteHtmlUrls(withKeys, outFile, rewriter, config.siteUrl);
    });

    const segments = html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/i);
    html = segments.map((segment, index) => (index % 2 === 0 ? stripHtmlComments(segment) : segment)).join('');
    html = rewriteHtmlUrls(html, outFile, rewriter, config.siteUrl);

    const tags = [];
    if (islands.length) tags.push(`<script defer src="${relativeUrl(outFile, 'assets/js/vendor/islands.min.js')}"></script>`);
    if (siteImports.length) {
      const key = siteImports.join('|');
      if (!siteBundles.has(key)) siteBundles.set(key, { imports: siteImports, pages: [] });
      siteBundles.get(key).pages.push(outFile);
      tags.push(`<script defer src="__SITE_BUNDLE_${hash(key)}__"></script>`);
    }
    html = html.replace('</head>', `${tags.join('')}</head>`);
    pages.push({ outFile, html, islands: rewrittenIslands, hasForm: /<form\b/i.test(original), hasMap: /leaflet|data-location-map/i.test(original) });
  }

  // Bundle names follow the first page that uses them, so a single shared bundle becomes main.js.
  const bundleNames = new Map();
  for (const [key, entry] of siteBundles) {
    let name = 'main';
    if (siteBundles.size > 1) {
      const first = entry.pages[0].replace(/\.html$/, '').split('/').pop();
      name = first === 'index' ? 'home' : first;
      while ([...bundleNames.values()].includes(name)) name = `${name}-2`;
    }
    bundleNames.set(key, name);
    const entrySource = entry.imports.map((id) => `import ${JSON.stringify(id)};`).join('\n');
    await bundle({ entry: entrySource, outFile: `assets/js/${name}.js`, outRoot, plugin, minify: false });
  }

  if (islandModules.size) {
    const registry = [...islandModules].map(([key, url], index) => `import * as m${index} from ${JSON.stringify(url)};`);
    registry.push(`const modules = { ${[...islandModules.keys()].map((key, index) => `${JSON.stringify(key)}: m${index}`).join(', ')} };`);
    registry.push('window.__htmlExportImport = (url) => {');
    registry.push('  const key = String(url).split("?")[0].split(/[\\/:]/).pop();');
    registry.push('  return modules[key] ? Promise.resolve(modules[key]) : Promise.reject(new Error(`Unknown island module: ${key}`));');
    registry.push('};');
    virtualModules.set('virtual:island-registry', registry.join('\n'));
    for (const [id, content] of islandRuntime) virtualModules.set(id, content);
    const entrySource = ['virtual:island-registry', ...islandRuntime.keys()].map((id) => `import ${JSON.stringify(id)};`).join('\n');
    await bundle({ entry: entrySource, outFile: 'assets/js/vendor/islands.min.js', outRoot, plugin, minify: true });
  }

  const builtChunks = new Set();
  while ([...chunks.keys()].some((name) => !builtChunks.has(name))) {
    for (const [name, file] of [...chunks]) {
      if (builtChunks.has(name)) continue;
      builtChunks.add(name);
      await bundle({
        entry: `export * from ${JSON.stringify(toPosix(file))};\nexport { default } from ${JSON.stringify(toPosix(file))};`,
        outFile: `assets/js/vendor/${name}.min.js`,
        outRoot,
        plugin,
        minify: true,
        globalName: '__htmlExportChunk',
        footer: `(window.__htmlExportChunks = window.__htmlExportChunks || {})[${JSON.stringify(name)}] = __htmlExportChunk;`,
      });
    }
  }

  const hasFonts = [...assetMap.values()].some((file) => file.startsWith('assets/fonts/'));
  for (const page of pages) {
    let html = page.html;
    if (hasFonts) {
      // Fonts are embedded in fonts.css, so a preload of the separate file would only download it twice.
      html = html.replace(/<link\b[^>]*\bas=["']font["'][^>]*>/gi, '');
      html = html.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/i, (link) => `<link rel="stylesheet" href="${relativeUrl(page.outFile, 'assets/css/fonts.css')}">${link}`);
    }
    for (const [key, name] of bundleNames) {
      html = html.replace(`__SITE_BUNDLE_${hash(key)}__`, relativeUrl(page.outFile, `assets/js/${name}.js`));
    }
    html = await prettier.format(html, { ...PRETTIER_OPTIONS, parser: 'html' });
    html = restore(html, page.islands, 'island');
    const target = path.join(outRoot, page.outFile);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html);
  }

  for (const file of walkFiles(outRoot).filter((item) => item.endsWith('.css'))) {
    const target = path.join(outRoot, file);
    const css = rewriteCssUrls(stripCssComments(fs.readFileSync(target, 'utf8')), file, rewriter);
    fs.writeFileSync(target, await prettier.format(css, { ...PRETTIER_OPTIONS, parser: 'css' }));
  }
  if (hasFonts) embedFonts(outRoot);

  const replacedImages = await replaceRestrictedImages(outRoot, config.restrictedImages);
  const fontLicenses = copyFontLicenses(projectRoot, outRoot);
  const pageFiles = pages.map((page) => page.outFile);
  // The Apache rules in public/.htaccess only serve the WebScale preview frame; the buyer's host sets its own headers.
  fs.rmSync(path.join(outRoot, '.htaccess'), { force: true });
  writeSitemap(outRoot, config.siteUrl, pageFiles);

  fs.copyFileSync(path.join(projectRoot, "LICENSE.md"), path.join(outRoot, "LICENSE.md"));
  fs.writeFileSync(path.join(outRoot, 'README.md'), buildReadme({
    config,
    pages: pageFiles,
    hasIslands: islandModules.size > 0,
    hasForms: pages.some((page) => page.hasForm),
    hasMap: pages.some((page) => page.hasMap),
    replacedImages,
    fontLicenses,
  }));

  const problems = validateOutput(outRoot);
  if (problems.length) throw new Error(`HTML export validation failed:\n${problems.join('\n')}`);

  const archivePath = path.join(outDir, `${exportName}-v${config.version}.zip`);
  const count = writeZip(archivePath, outRoot, exportName);
  return { archivePath, outRoot, count, pages: pageFiles, replacedImages };
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  try {
    const options = parseArgs(process.argv.slice(2));
    const outDir = path.resolve(options.outDir ?? path.join(projectRoot, 'release', 'html'));
    const result = await exportHtml({ projectRoot, outDir, skipBuild: options.skipBuild, siteUrl: options.siteUrl });
    console.log(`HTML export: ${result.pages.length} pages, ${result.count} files`);
    if (result.replacedImages.length) console.log(`Placeholders: ${result.replacedImages.join(', ')}`);
    console.log(`Folder: ${result.outRoot}`);
    console.log(`ZIP: ${result.archivePath}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
