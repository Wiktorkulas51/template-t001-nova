import { describe, expect, it } from 'vitest';
import {
  classifyScript,
  createUrlRewriter,
  findIslands,
  flattenRoutes,
  mapAssetPath,
  protect,
  restore,
  rewriteCssUrls,
  rewriteHtmlUrls,
  setUnique,
  stripCssComments,
  stripHtmlComments,
} from './export-html-core.mjs';

const routeMap = flattenRoutes(['/', '/privacy-policy/', '/pl/', '/pl/privacy-policy/']);
const assetMap = new Map([
  ['assets/images/house.webp', 'assets/images/house.webp'],
  ['assets/style-DTBH6cSk.css', mapAssetPath('assets/style-DTBH6cSk.css')],
  ['assets/instrument-sans-latin-wght-normal-BbzFLZTg.woff2', mapAssetPath('assets/instrument-sans-latin-wght-normal-BbzFLZTg.woff2')],
]);
const rewriter = createUrlRewriter({ routeMap, assetMap, aliases: new Map([['/en/', '/']]) });

describe('HTML export helpers', () => {
  it('flattens leaf routes and keeps folders for parent routes', () => {
    expect(Object.fromEntries(routeMap)).toEqual({
      '/': 'index.html',
      '/privacy-policy/': 'privacy-policy.html',
      '/pl/': 'pl/index.html',
      '/pl/privacy-policy/': 'pl/privacy-policy.html',
    });
  });

  it('moves hashed build assets into readable folders', () => {
    expect(mapAssetPath('assets/style-DTBH6cSk.css')).toBe('assets/css/style.css');
    expect(mapAssetPath('_assets/leaflet.BgX4OC_Y.css')).toBe('assets/css/leaflet.css');
    expect(mapAssetPath('assets/instrument-sans-latin-wght-normal-BbzFLZTg.woff2')).toBe('assets/fonts/instrument-sans-latin-wght-normal.woff2');
    expect(mapAssetPath('_assets/client.Cc8zK87F.js')).toBeNull();
    expect(mapAssetPath('assets/images/review-avatar-01.webp')).toBe('assets/images/review-avatar-01.webp');
    expect(mapAssetPath('assets/team-portrait.jpg')).toBe('assets/team-portrait.jpg');
  });

  it('refuses two sources with the same unhashed name', () => {
    const map = new Map();
    setUnique(map, 'index', 'index.AAAA1111.js', 'lazy chunk');
    setUnique(map, 'index', 'index.AAAA1111.js', 'lazy chunk');
    expect(() => setUnique(map, 'index', 'index.BBBB2222.js', 'lazy chunk')).toThrow(/Two lazy chunk sources/);
  });

  it('rewrites links, anchors, aliases and island props relative to the page', () => {
    const html = '<a href="/#faq">FAQ</a><a href="/pl/">PL</a><a href="/en/">EN</a><img src="/assets/images/house.webp" srcset="/assets/images/house.webp 800w">'
      + '<x props="{&quot;href&quot;:[0,&quot;/privacy-policy/&quot;],&quot;sep&quot;:[0,&quot;/&quot;]}"></x>';
    expect(rewriteHtmlUrls(html, 'pl/index.html', rewriter, 'https://example.com/')).toBe(
      '<a href="../index.html#faq">FAQ</a><a href="./index.html">PL</a><a href="../index.html">EN</a><img src="../assets/images/house.webp" srcset="../assets/images/house.webp 800w">'
      + '<x props="{&quot;href&quot;:[0,&quot;../privacy-policy.html&quot;],&quot;sep&quot;:[0,&quot;/&quot;]}"></x>',
    );
    expect(rewriteHtmlUrls('<a href="/#faq">', 'index.html', rewriter)).toBe('<a href="#faq">');
    expect(rewriteHtmlUrls('<link rel="canonical" href="https://example.com/privacy-policy/">', 'index.html', rewriter, 'https://example.com/'))
      .toBe('<link rel="canonical" href="https://example.com/privacy-policy.html">');
  });

  it('rewrites CSS urls and strips comments except legal ones', () => {
    const css = String.raw`/*! legal */ .a\:b\[x\=\'y\'\]{} /* Polski komentarz */ @font-face{src:url(/assets/instrument-sans-latin-wght-normal-BbzFLZTg.woff2)}`;
    const output = rewriteCssUrls(stripCssComments(css), 'assets/css/style.css', rewriter);
    expect(output).toContain('/*! legal */');
    expect(output).not.toContain('Polski');
    expect(output).toContain('url(../fonts/instrument-sans-latin-wght-normal.woff2)');
  });

  it('protects islands through formatting and strips comments outside them', () => {
    const html = '<main><!-- internal --><astro-island uid="a"><div><!-- --></div><!--astro:end--></astro-island></main>';
    const { html: protectedHtml, saved } = protect(html, findIslands(html), 'island');
    const formatted = stripHtmlComments(protectedHtml).replace('></html-export-island>', '></html-export-island\n>');
    expect(restore(formatted, saved, 'island')).toBe('<main><astro-island uid="a"><div><!-- --></div><!--astro:end--></astro-island></main>');
  });

  it('classifies scripts for rebundling', () => {
    expect(classifyScript(' type="module" src="/_assets/a.js"', '').kind).toBe('module-src');
    expect(classifyScript(' type="module"', 'console.log(1)').kind).toBe('module-inline');
    expect(classifyScript('', 'customElements.define("astro-island",x)').kind).toBe('island-runtime');
    expect(classifyScript('', 'document.querySelectorAll("astro-island").length').kind).toBe('classic-inline');
    expect(classifyScript(' type="module" src="https://cdn.example.com/a.js"', '').kind).toBe('keep');
    expect(classifyScript('', 'document.querySelector("[data-template-demo-badge]")').kind).toBe('drop');
    expect(classifyScript(' type="application/ld+json"', '{}').kind).toBe('keep');
  });
});
