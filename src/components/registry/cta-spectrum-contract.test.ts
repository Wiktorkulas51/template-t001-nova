import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import { formatInternalLink } from '@utils/url';

// Why: the contract test builds HTML manually (hero-contract.test.ts pattern),
// because rendering .astro in vitest would require additional runtime. The test keeps an eye on it
// agreements between CtaSpectrumBlock component and CMS/JSON: spectrum background with stripes
// (inline height + animacja ui-spectrum-pulse), maska gradientowa, typografia h2
// and a CTA button with an arrow icon (visual copy of HeinrichCtaBlockV5).
interface SpectrumCtaData {
  title?: string;
  description?: string;
  cta?: { label: string; href: string };
}

function renderCtaSpectrumHtml(data: SpectrumCtaData): string {
  // The contract checks the pattern of stripes, so just a few instead of 100 are enough.
  const bars = Array.from(
    { length: 6 },
    (_, i) =>
      `<div class="ui-spectrum-bar flex-1" style="height: ${30 + i * 8}%; animation: ui-spectrum-pulse ${1.0 + (i % 5) * 0.3}s ease-in-out infinite; animation-delay: ${i * 0.03}s;"></div>`,
  ).join('');

  const ctaHtml = data.cta
    ? `<a href="${formatInternalLink(data.cta.href)}" class="ui-button ui-button-primary h-11 sm:h-12 min-h-11">${data.cta.label}<i class="ph ph-arrow-right text-base"></i></a>`
    : '';

  return `<section class="ui-section ui-bg-page relative overflow-hidden py-24 sm:py-32" id="cta-spectrum">
    <div class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" style="mask-image: linear-gradient(to bottom, transparent 10%, black 35%, black 65%, transparent 90%), linear-gradient(to right, black 8%, transparent 38%, transparent 62%, black 92%); mask-composite: intersect; -webkit-mask-image: linear-gradient(to bottom, transparent 10%, black 35%, black 65%, transparent 90%), linear-gradient(to right, black 8%, transparent 38%, transparent 62%, black 92%); -webkit-mask-composite: source-in;">
      <div class="hidden w-full items-center justify-center gap-[2px] px-4 sm:flex" style="height: 60%;">${bars}</div>
    </div>
    <div class="absolute inset-0 ui-console-grid opacity-20"></div>
    <div class="ui-container">
      <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 class="ui-type-section-title font-heading font-bold text-3xl font-light tracking-[0.08em] text-neutral-900 sm:text-4xl">${data.title || ''}</h2>
        <p class="ui-type-body leading-relaxed mx-auto mt-6 max-w-xl text-sm text-neutral-500">${data.description || ''}</p>
        <div class="mt-10">${ctaHtml}</div>
      </div>
    </div>
  </section>`;
}

describe('CtaSpectrumBlock — kontrakt renderowania', () => {
  const defaultData: SpectrumCtaData = {
    title: 'Gotowy, aby Twoje brzmienie zapadło w pamięć',
    description: 'Zapraszam do mojego domu. Każdy projekt traktuję indywidualnie.',
    cta: { label: 'Umów sesję', href: '/kontakt/' },
  };

  it('renderuje <section> z ui-section i id="cta-spectrum"', () => {
    const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').attr('id')).toBe('cta-spectrum');
  });

  it('zawiera .ui-container', () => {
    const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
    expect($('.ui-container').length).toBe(1);
  });

  it('ma dokladnie jeden <h2> i zero <h1>', () => {
    const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
    expect($('h2').length).toBe(1);
    expect($('h1').length).toBe(0);
  });

  it('h2 zawiera tytul', () => {
    const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
    expect($('h2').text()).toContain('brzmienie zapadło w pamięć');
  });

  it('h2 ma klasy typografii: font-light, tracking-[0.08em], text-neutral-900', () => {
    const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
    const h2 = $('h2');
    expect(h2.hasClass('font-light')).toBe(true);
    expect(h2.hasClass('tracking-[0.08em]')).toBe(true);
    expect(h2.hasClass('text-neutral-900')).toBe(true);
  });

  it('h2 jest mobile-first (text-3xl sm:text-4xl)', () => {
    const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
    const h2 = $('h2');
    expect(h2.hasClass('text-3xl')).toBe(true);
    expect(h2.hasClass('sm:text-4xl')).toBe(true);
  });

  it('opis renderuje sie jako .ui-type-body z max-w-xl', () => {
    const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
    const p = $('.ui-type-body');
    expect(p.length).toBe(1);
    expect(p.hasClass('max-w-xl')).toBe(true);
    expect(p.text()).toContain('indywidualnie');
  });

  describe('tlo spectrum', () => {
    it('paski spectrum maja klase ui-spectrum-bar i inline height', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
      const bars = $('.ui-spectrum-bar');
      expect(bars.length).toBeGreaterThan(0);
      expect(bars.first().attr('style')).toContain('height: 30%');
    });

    it('paski maja animacje ui-spectrum-pulse z delay (inline style)', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
      const style = $('.ui-spectrum-bar').first().attr('style') || '';
      expect(style).toContain('animation: ui-spectrum-pulse');
      expect(style).toContain('animation-delay: 0s');
    });

    it('wrapper spectrum ma mask-image (linear-gradient intersect)', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
      const wrapper = $('[style*="mask-image"]');
      expect(wrapper.length).toBe(1);
      const style = wrapper.attr('style') || '';
      expect(style).toContain('linear-gradient(to bottom, transparent 10%');
      expect(style).toContain('mask-composite: intersect');
    });

    it('paski desktop sa ukryte na mobile (hidden sm:flex)', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
      const desktopBars = $('.hidden.sm\\:flex');
      expect(desktopBars.length).toBe(1);
    });

    it('siatka kropek ma klase ui-console-grid i opacity-20', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
      const grid = $('.ui-console-grid');
      expect(grid.length).toBe(1);
      expect(grid.hasClass('opacity-20')).toBe(true);
    });
  });

  describe('CTA', () => {
    it('renderuje przycisk CTA jako link z ui-button-primary', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
      expect($('a.ui-button-primary').length).toBe(1);
    });

    it('CTA ma trailing slash w href (formatInternalLink)', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
      expect($('a.ui-button-primary').attr('href')).toBe('/kontakt/');
    });

    it('CTA nie ma href="#"', () => {
      const html = renderCtaSpectrumHtml(defaultData);
      expect(html).not.toContain('href="#"');
    });

    it('CTA jest mobile-first (h-11 sm:h-12)', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
      const cta = $('a.ui-button-primary');
      expect(cta.hasClass('h-11')).toBe(true);
      expect(cta.hasClass('sm:h-12')).toBe(true);
    });

    it('CTA zawiera ikone strzalki (ph-arrow-right)', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
      expect($('a.ui-button-primary .ph-arrow-right').length).toBe(1);
    });

    it('CTA bez href nie jest renderowany', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml({ title: 'Bez CTA' }));
      expect($('a.ui-button-primary').length).toBe(0);
    });
  });

  describe('mobile-first layout', () => {
    it('sekcja ma py-24 (mobile) i sm:py-32 (desktop)', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
      expect($('section').hasClass('py-24')).toBe(true);
      expect($('section').hasClass('sm:py-32')).toBe(true);
    });

    it('sekcja ma overflow-hidden (spectrum nie wychodzi poza ramy)', () => {
      const $ = cheerio.load(renderCtaSpectrumHtml(defaultData));
      expect($('section').hasClass('overflow-hidden')).toBe(true);
    });
  });
});
