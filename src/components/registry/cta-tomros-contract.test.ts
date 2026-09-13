import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import { formatInternalLink } from '@utils/url';

// Why: the contract test builds HTML manually (pattern cta-spectrum-contract.test.ts),
// because rendering .astro in vitest would require additional runtime. The test keeps an eye on it
// agreements between CtaTomRosBlock component and CMS/JSON: fullscreen background image
// (opacity-[0.52] saturate-[0.8]), glow ui-glow-cta, feather gradient
// background photo, centered content and button with hoverText (copy of tom-ros CtaBlock).

interface CtaTomRosData {
  sectionId?: string;
  title?: string;
  description?: string;
  cta?: { label: string; href: string; hoverText?: string };
}

function renderCtaTomRosHtml(data: CtaTomRosData): string {
  const sectionId = data.sectionId || 'cta-tomros';
  const title = data.title || 'Zacznij już dziś';
  const description = data.description || 'Mam kilka wolnych miejsc dla nowych klientów każdego miesiąca.';

  const ctaHtml = data.cta
    ? `<a href="${formatInternalLink(data.cta.href)}" class="ui-button ui-button-primary h-11 sm:h-12 min-h-11"><span class="ui-button-text-wrap"><span class="ui-button-text-default">${data.cta.label}</span><span class="ui-button-text-hover">${data.cta.hoverText || ''}</span></span></a>`
    : '';

  return `<section class="ui-section ui-bg-page relative overflow-hidden" id="${sectionId}">
    <img src="/assets/placeholders/image-landscape.svg" alt="" class="absolute inset-0 size-full object-cover opacity-[0.52] saturate-[0.8]" aria-hidden="true" loading="lazy" />
    <div class="absolute inset-0 ui-glow-cta"></div>
    <div class="absolute inset-0" style="background: linear-gradient(to bottom, color-mix(in oklch, var(--color-surface) 46%, transparent) 0%, color-mix(in oklch, var(--color-surface) 68%, transparent) 100%);"></div>
    <div class="ui-container">
      <div class="relative z-10 mx-auto max-w-3xl py-24 text-center sm:py-32">
        <h2 class="ui-type-section-title font-heading font-bold mx-auto max-w-3xl">${title}</h2>
        <p class="ui-type-lead leading-relaxed mx-auto mt-6 max-w-2xl">${description}</p>
        <div class="pt-8">${ctaHtml}</div>
      </div>
    </div>
  </section>`;
}

describe('CtaTomRosBlock — kontrakt renderowania', () => {
  const defaultData: CtaTomRosData = {
    title: 'Zacznij już dziś',
    description: 'Mam kilka wolnych miejsc dla nowych klientów każdego miesiąca.',
    cta: { label: 'Dołącz do drużyny', href: '/kontakt/', hoverText: 'Napisz!' },
  };

  describe('struktura sekcji', () => {
    it('renderuje <section> z ui-section i id="cta-tomros"', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      const section = $('section#cta-tomros');
      expect(section.length).toBe(1);
      expect(section.hasClass('ui-section')).toBe(true);
    });

    it('sekcja ma overflow-hidden (zdjęcie nie wychodzi poza kadr)', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      expect($('section#cta-tomros').hasClass('overflow-hidden')).toBe(true);
    });

    it('zawiera .ui-container', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      expect($('.ui-container').length).toBe(1);
    });

    it('treść jest wycentrowana z max-w-3xl', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      expect($('.max-w-3xl').length).toBeGreaterThan(0);
      expect($('.mx-auto').length).toBeGreaterThan(0);
    });
  });

  describe('nagłówek', () => {
    it('ma dokladnie jeden <h2> i zero <h1>', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      expect($('h2').length).toBe(1);
      expect($('h1').length).toBe(0);
    });

    it('h2 ma klase ui-type-section-title i zawiera tytul', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      const h2 = $('h2');
      expect(h2.hasClass('ui-type-section-title')).toBe(true);
      expect(h2.text()).toBe('Zacznij już dziś');
    });
  });

  describe('opis', () => {
    it('opis renderuje sie jako .ui-type-lead', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      const p = $('.ui-type-lead');
      expect(p.length).toBe(1);
      expect(p.hasClass('max-w-2xl')).toBe(true);
      expect(p.text()).toContain('wolnych miejsc');
    });
  });

  describe('obraz tła', () => {
    it('pełnoekranowe zdjęcie ma src OK.webp i klasę absolute inset-0', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      const img = $('section#cta-tomros img');
      expect(img.length).toBe(1);
      expect(img.attr('src')).toBe('/assets/placeholders/image-landscape.svg');
      expect(img.hasClass('absolute')).toBe(true);
      expect(img.hasClass('inset-0')).toBe(true);
      expect(img.hasClass('object-cover')).toBe(true);
    });

    it('zdjęcie jest przyciemnione (opacity-[0.52] saturate-[0.8])', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      const img = $('section#cta-tomros img');
      expect(img.hasClass('opacity-[0.52]')).toBe(true);
      expect(img.hasClass('saturate-[0.8]')).toBe(true);
    });

    it('overlay gradient ui-glow-cta jest obecny', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      expect($('section#cta-tomros .ui-glow-cta').length).toBe(1);
    });

    it('linear-gradient do tła wtapia zdjęcie w sekcję', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      const overlay = $('section#cta-tomros [style*="linear-gradient(to bottom"]');
      expect(overlay.length).toBe(1);
      expect(overlay.attr('style')).toContain('var(--color-surface)');
    });
  });

  describe('CTA', () => {
    it('renderuje przycisk CTA jako link z ui-button-primary', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      expect($('a.ui-button-primary').length).toBe(1);
    });

    it('CTA ma trailing slash w href (formatInternalLink)', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      expect($('a.ui-button-primary').attr('href')).toBe('/kontakt/');
    });

    it('CTA nie ma href="#"', () => {
      const html = renderCtaTomRosHtml(defaultData);
      expect(html).not.toContain('href="#"');
    });

    it('CTA jest mobile-first (h-11 sm:h-12)', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      const cta = $('a.ui-button-primary');
      expect(cta.hasClass('h-11')).toBe(true);
      expect(cta.hasClass('sm:h-12')).toBe(true);
    });

    it('CTA ma hoverText (ui-button-text-hover)', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      expect($('a.ui-button-primary .ui-button-text-hover').text()).toBe('Napisz!');
    });

    it('CTA bez danych nie jest renderowany', () => {
      const $ = cheerio.load(renderCtaTomRosHtml({ title: 'Bez CTA' }));
      expect($('a.ui-button-primary').length).toBe(0);
    });
  });

  describe('mobile-first layout', () => {
    it('treść ma py-24 (mobile) i sm:py-32 (desktop)', () => {
      const $ = cheerio.load(renderCtaTomRosHtml(defaultData));
      const content = $('.max-w-3xl');
      expect(content.hasClass('py-24')).toBe(true);
      expect(content.hasClass('sm:py-32')).toBe(true);
    });
  });
});
