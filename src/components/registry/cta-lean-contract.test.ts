import { describe, it, expect, beforeAll } from 'vitest';
import * as cheerio from 'cheerio';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import CtaLeanBlock from '@components/registry/cta/CtaLeanBlock.astro';

// Dlaczego: test kontraktowy renderuje PRAWDZIWY komponent Astro przez
// experimental_AstroContainer (wzorzec services-media-cards-contract.test.ts)
// and checks the HTML structure through cheerio to detect rendering regressions
// without running a full build. The contract reflects the CTA section
// from the lean-creative project transferred to the starter-kit library.

const LINKEDIN_DATA = {
  heading: 'Chcesz poznać nas lepiej?',
  description: 'Zajrzyj na nasz profil w mediach społecznościowych.',
  ctaLabel: 'Sprawdź na LinkedIn',
  ctaHref: 'https://www.linkedin.com/',
  variant: 'linkedin',
};

let container: AstroContainer;

async function renderBlock(props: Record<string, unknown> = {}): Promise<string> {
  return container.renderToString(CtaLeanBlock, { props });
}

describe('CtaLeanBlock, kontrakt renderowania', () => {
  beforeAll(async () => {
    container = await AstroContainer.create();
  });

  it('renderuje <section> z ui-section, tone base i borderem na górze', async () => {
    const $ = cheerio.load(await renderBlock());
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').hasClass('ui-bg-base')).toBe(true);
    expect($('section').hasClass('border-t')).toBe(true);
    expect($('section').hasClass('border-brand-dark/10')).toBe(true);
  });

  it('zawiera .ui-container', async () => {
    const $ = cheerio.load(await renderBlock());
    expect($('.ui-container').length).toBe(1);
  });

  describe('nagłówek i opis', () => {
    it('renderuje dokładnie jeden h2 z nagłówkiem z JSON', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('h2').length).toBe(1);
      expect($('h2').text()).toContain('Zastanawiasz się nad współpracą?');
      expect($('h2').text()).toContain('Porozmawiajmy o Twoim projekcie');
    });

    it('h2 używa tokena section-heading-lg i font-extrabold', async () => {
      const $ = cheerio.load(await renderBlock());
      const h2 = $('h2');
      expect(h2.hasClass('ui-type-heading-section-lg')).toBe(true);
      expect(h2.hasClass('font-extrabold')).toBe(true);
    });

    it('nagłówek renderuje <br /> między liniami (set:html)', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('h2 br').length).toBe(1);
    });

    it('renderuje opis lead z JSON', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('.ui-type-lead').length).toBe(1);
      expect($('.ui-type-lead').text()).toContain('Opisz nam swój pomysł');
    });

    it('treść jest wyśrodkowana (py-16 text-center)', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('.py-16.text-center').length).toBe(1);
    });
  });

  describe('przycisk', () => {
    it('renderuje Button jako <a> z href i etykietą', async () => {
      const $ = cheerio.load(await renderBlock());
      const btn = $('.ui-button');
      expect(btn.length).toBe(1);
      expect(btn.attr('href')).toBe('/kontakt/');
      expect(btn.text()).toContain('Skontaktuj się z nami');
    });

    it('przycisk używa variantu primary i rozmiaru lg', async () => {
      const $ = cheerio.load(await renderBlock());
      const btn = $('.ui-button');
      expect(btn.hasClass('ui-button-primary')).toBe(true);
      expect(btn.hasClass('h-11')).toBe(true);
    });
  });

  describe('wariant linkedin', () => {
    it('otwiera link zewnętrzny w nowej karcie (target blank, rel noopener)', async () => {
      const $ = cheerio.load(await renderBlock({ data: LINKEDIN_DATA }));
      const btn = $('.ui-button');
      expect(btn.attr('href')).toBe('https://www.linkedin.com/');
      expect(btn.attr('target')).toBe('_blank');
      expect(btn.attr('rel')).toContain('noopener');
      expect(btn.attr('rel')).toContain('noreferrer');
    });
  });

  describe('i18n (pl/en) i propsy', () => {
    it('locale en renderuje angielskie treści', async () => {
      const $ = cheerio.load(await renderBlock({ locale: 'en' }));
      expect($('h2').text()).toContain('Thinking about working together?');
      expect($('.ui-button').text()).toContain('Contact us');
    });

    it('props.data nadpisuje JSON', async () => {
      const custom = {
        heading: 'Własny nagłówek',
        description: 'Własny opis',
        ctaLabel: 'Własne CTA',
        ctaHref: '/cennik/',
        variant: 'simple',
      };
      const $ = cheerio.load(await renderBlock({ data: custom }));
      expect($('h2').text()).toContain('Własny nagłówek');
      expect($('.ui-button').text()).toContain('Własne CTA');
      expect($('.ui-button').attr('href')).toBe('/cennik/');
    });
  });

  it('nie zawiera danych klienta lean-creative ani klienckich tokenów', async () => {
    const html = await renderBlock();
    expect(html).not.toContain('pomóc Twojej firmie');
    expect(html).not.toContain('linkedin.com/in/');
    expect(html).not.toContain('btn-slide-teal');
    expect(html).not.toContain('border-outline');
    expect(html).not.toContain('data-reveal');
  });
});
