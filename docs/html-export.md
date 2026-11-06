# HTML export

`npm run export:html` turns the Astro build into a plain HTML, CSS and JavaScript package for HTML template marketplaces. It does not change the template source.

```bash
npm run export:html                      # builds, exports to release/html/
npm run export:html -- --out ../exports  # custom output folder
npm run export:html -- --skip-build      # reuse an existing export build in dist/
```

The output folder contains `<slug>-html/` and `<slug>-html-v<version>.zip`. `release/` is ignored by Git.

## What the export does

1. Builds with `HTML_EXPORT=1` (unminified HTML, CSS and JS, see `astro.config.mjs`), `PUBLIC_SITE_URL=https://example.com/` and base `/`, so preview-only extras stay out.
2. Flattens routes: `/` becomes `index.html`, a leaf route `/privacy-policy/` becomes `privacy-policy.html`, a route with children such as `/pl/` keeps `pl/index.html`. Pages whose canonical URL points at another page, such as `/en/`, are dropped as duplicates and links to them are redirected.
3. Rewrites every internal link and asset path to a relative path, so the site works from `file://` and from any hosting folder.
4. Rebundles module scripts with esbuild into classic deferred scripts: one readable file per page type in `assets/js/`, Astro islands and their renderer in `assets/js/vendor/islands.min.js`, lazy chunks (for example Leaflet) as separate vendor files loaded on demand.
5. Removes HTML comments, non-legal CSS comments and demo-only scripts, then formats HTML, CSS and JS with Prettier.
6. Embeds web fonts in `assets/css/fonts.css`, because browsers block font files on `file://`.
7. Replaces `HTML_EXPORT.restrictedImages` from `site.config.mjs` and their responsive variants with placeholders of the same size.
8. Writes `README.md` for the buyer, copies the project `LICENSE.md` into the package and font licenses, regenerates `sitemap.xml`, validates that no root-absolute or missing references remain, and creates the ZIP.

## Configuration

`site.config.mjs` exports `HTML_EXPORT` with `slug`, `title`, `description` and `restrictedImages`. List every image whose license does not allow redistribution inside a template package, as recorded in `ASSETS-LICENSES.md`.

## Known limits

- Island content (sliders, galleries) lives in the `props` attribute of `<astro-island>`; the buyer README explains how to edit it.
- WebGL effects cannot use images on `file://`; components must fall back to plain images there.
- Astro view transitions (`<ClientRouter />`) and other features that fetch pages at runtime need a fallback before export.
- Each lazy chunk is bundled on its own with its dependencies. That suits self-contained libraries such as Leaflet; a lazy chunk that shares React with an island (for example `React.lazy`) needs the bundling changed first.
- Asset, island and chunk names lose their hash. The export stops with an error when two sources would get the same name.
- `--skip-build` trusts the current `dist/`. Use it only right after an export build, never after a regular or preview build.
- Check the result in a browser from disk and from a static server before publishing.
