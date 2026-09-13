# Nova, deployment guide

## Build

Use Node.js 22 or newer, as required by `package.json`.

```bash
npm ci
npm run build
```

Production files are generated in `dist/`.

## Site URL

Update the public URL in `site.config.mjs`:

```js
export const SITE_URL = 'https://example.com';
```

The URL is used by canonical links, sitemap generation and Open Graph metadata.

## Static hosting

Nova is designed for static hosting. Upload the contents of `dist/` or connect the repository to a provider that supports Astro builds.

```text
Build command: npm run build
Publish directory: dist
Node version: 22
```

## Contact form

The default form points to `/send-form.php`. Configure that endpoint for the hosting environment or replace it with the form provider used by the final website.

Do not commit SMTP credentials, API keys or other secrets. Keep them in environment variables on the hosting provider.

## Final checks

After deployment, verify both language versions, mobile navigation, the contact form, canonical URL, sitemap.xml, robots.txt, favicon, Open Graph image and legal pages.
