import { describe, it, expect, beforeAll } from 'vitest';
import * as cheerio from 'cheerio';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import KnowledgeCardsBlock from '@components/registry/content/KnowledgeCardsBlock.astro';

// Dlaczego: test kontraktowy renderuje PRAWDZIWY komponent Astro przez
// experimental_AstroContainer(renderToString from astro) and checks the structure
// HTML by cheerio. This allows it to detect regressions in rendering without
// running a full build. Pattern: services-media-cards-contract.test.ts.

interface DataOverrides {
  pl?: {
    heading?: string;
    items?: Array<Record<string, unknown>>;
  };
  en?: {
    heading?: string;
    items?: Array<Record<string, unknown>>;
  };
}

const PLACEHOLDER_SRC = '/assets/placeholders/image-landscape.svg';

let container: AstroContainer;

async function renderBlock(props: Record<string, unknown> = {}): Promise<string> {
  return container.renderToString(KnowledgeCardsBlock, { props });
}

describe('KnowledgeCardsBlock, kontrakt renderowania', () => {
  beforeAll(async () => {
    container = await AstroContainer.create();
  });

  it('renderuje <section> z ui-section, tone page, id i borderem', async () => {
    const $ = cheerio.load(await renderBlock());
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').hasClass('ui-bg-page')).toBe(true);
    expect($('section').attr('id')).toBe('wiedza');
    expect($('section').hasClass('border-t')).toBe(true);
  });

  it('zawiera .ui-container', async () => {
    const $ = cheerio.load(await renderBlock());
    expect($('.ui-container').length).toBe(1);
  });

  describe('nagłówek sekcji', () => {
    it('renderuje dokładnie jeden h2 z nagłówkiem', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('h2').length).toBe(1);
      expect($('h2').text()).toContain('Wiedza, która pomaga podejmować lepsze decyzje');
    });

    it('nagłówek jest wyśrodkowany (text-center)', async () => {
      const $ = cheerio.load(await renderBlock());
      const wrap = $('.text-center');
      expect(wrap.length).toBe(1);
      expect(wrap.hasClass('mx-auto')).toBe(true);
    });

    it('pod nagłówkiem jest widoczna kreska dekoracyjna (bg-brand-primary)', async () => {
      const $ = cheerio.load(await renderBlock());
      // Dlaczego: atrybutowy selektor [class~="h-0.5"] zamiast .h-0\.5,
      // because a dot in the class name requires double escaping in JS.
      const divider = $('[class~="h-0.5"]');
      expect(divider.length).toBe(1);
      expect(divider.hasClass('bg-brand-primary')).toBe(true);
      expect(divider.hasClass('w-14')).toBe(true);
      expect(divider.hasClass('hidden')).toBe(false);
    });
  });

  describe('karty artykułów', () => {
    it('renderuje dokładnie 3 karty, każda to link <a> z klasą lc-card-hover', async () => {
      const $ = cheerio.load(await renderBlock());
      const cards = $('a.lc-card-hover');
      expect(cards.length).toBe(3);
      cards.each((_, el) => {
        expect($(el).hasClass('group')).toBe(true);
        expect($(el).hasClass('overflow-hidden')).toBe(true);
        expect($(el).hasClass('rounded-md')).toBe(true);
        expect($(el).hasClass('border-brand-dark/10')).toBe(true);
        expect($(el).hasClass('bg-white')).toBe(true);
        expect($(el).hasClass('hover:border-brand-primary/30')).toBe(true);
      });
    });

    it('grid jest mobile-first (3 kolumny na lg, 2 na sm, 1 na mobile)', async () => {
      const $ = cheerio.load(await renderBlock());
      const grid = $('.grid');
      expect(grid.hasClass('grid-cols-1')).toBe(true);
      expect(grid.hasClass('sm:grid-cols-2')).toBe(true);
      expect(grid.hasClass('lg:grid-cols-3')).toBe(true);
      expect(grid.hasClass('max-w-5xl')).toBe(true);
      expect(grid.hasClass('mx-auto')).toBe(true);
      expect(grid.hasClass('mt-12')).toBe(true);
    });

    it('każda karta ma h3 z tytułem i opisem', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('h3').length).toBe(3);
      const titles = [
        'Jak poprawić wydajność zespołu produkcyjnego',
        '5 sposobów na redukcję kosztów operacyjnych',
        'Jak wdrożyć kulturę ciągłego doskonalenia',
      ];
      $('h3').each((i, el) => {
        expect($(el).text()).toContain(titles[i]);
        expect($(el).hasClass('!font-extrabold')).toBe(true);
        expect($(el).hasClass('group-hover:text-brand-primary')).toBe(true);
      });
      expect($('.ui-type-text-feature-sm').length).toBe(3);
    });

    it('opis używa tokena text-brand-dark/70 zamiast klienckiego text-on-surface-variant', async () => {
      const $ = cheerio.load(await renderBlock());
      $('.ui-type-text-feature-sm').each((_, el) => {
        expect($(el).hasClass('text-brand-dark/70')).toBe(true);
      });
    });

    it('każda karta ma etykietę CTA w span.lc-arrow-link z ikoną strzałki', async () => {
      const $ = cheerio.load(await renderBlock());
      const links = $('span.lc-arrow-link');
      expect(links.length).toBe(3);
      links.each((_, el) => {
        expect($(el).text()).toContain('Czytaj dalej');
        expect($(el).hasClass('mt-auto')).toBe(true);
        expect($(el).hasClass('pt-3')).toBe(true);
      });
      expect($('span.lc-arrow-link-icon').length).toBe(3);
    });
  });

  describe('obrazy', () => {
    it('renderuje 3 obrazy z placeholderem biblioteki', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('img').length).toBe(3);
      $('img').each((_, el) => {
        expect($(el).attr('src')).toBe(PLACEHOLDER_SRC);
        expect($(el).hasClass('h-40')).toBe(false);
        expect($(el).hasClass('h-full')).toBe(true);
        expect($(el).hasClass('object-cover')).toBe(true);
        expect($(el).hasClass('group-hover:scale-105')).toBe(true);
      });
    });

    it('wrapper obrazu ma wysokość h-40 i tło bg-brand-primary/10 (zamiana primary-container)', async () => {
      const $ = cheerio.load(await renderBlock());
      const wrappers = $('div.h-40');
      expect(wrappers.length).toBe(3);
      wrappers.each((_, el) => {
        expect($(el).hasClass('overflow-hidden')).toBe(true);
        expect($(el).hasClass('bg-brand-primary/10')).toBe(true);
      });
    });
  });

  describe('i18n (pl/en)', () => {
    it('EN renderuje angielski nagłówek, tytuły i etykiety CTA', async () => {
      const $ = cheerio.load(await renderBlock({ locale: 'en' }));
      expect($('h2').text()).toContain('Knowledge that helps you make better decisions');
      expect($('h3').first().text()).toContain('How to improve the productivity');
      expect($('span.lc-arrow-link').first().text()).toContain('Read more');
    });

    it('props data nadpisuje domyślny JSON (wzorzec "props || json")', async () => {
      const overrides: DataOverrides = {
        pl: {
          heading: 'Testowy nagłówek sekcji',
          items: [
            { title: 'Testowy artykuł 1', description: 'Opis testowy', imageSrc: PLACEHOLDER_SRC, imageAlt: 'alt', href: '/test/artykul-1/', ctaLabel: 'Czytaj dalej' },
          ],
        },
      };
      const $ = cheerio.load(await renderBlock({ data: overrides }));
      expect($('h2').text()).toContain('Testowy nagłówek sekcji');
      expect($('h3').length).toBe(1);
      expect($('h3').text()).toContain('Testowy artykuł 1');
    });
  });

  it('nie zawiera danych klienta (Lean Creative)', async () => {
    const html = await renderBlock();
    expect(html).not.toContain('Lean Creative');
    expect(html).not.toContain('OEE');
    expect(html).not.toContain('ukryte straty');
    expect(html).not.toContain('lean-creative-blog');
  });

  it('nie zawiera systemu data-reveal ani klienckich tokenów CSS', async () => {
    const html = await renderBlock();
    expect(html).not.toContain('data-reveal');
    expect(html).not.toContain('border-outline');
    expect(html).not.toContain('bg-brand-cream');
    expect(html).not.toContain('text-on-surface-variant');
    expect(html).not.toContain('--color-primary-container');
  });
});
