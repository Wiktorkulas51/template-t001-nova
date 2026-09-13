import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import { formatInternalLink } from '@utils/url';

// Why: the contract test builds HTML manually (hero-contract.test.ts pattern),
// because rendering .astro in vitest would require additional runtime. The test keeps an eye on it
// agreements between the HeroCinematicBlock component and CMS/JSON: section structure,
// wideo z deferred loading (data-src + preload="none"), grayscale, typografia h1
// i przyciski CTA jako linki (kopia wizualna HeinrichHeroBlock z filip-halucha).
interface CinematicHeroData {
  title?: string;
  pageHeading?: string;
  cta?: { label: string; href: string };
  cta2?: { label: string; href: string };
  video?: { sources: string[]; poster?: string; grayscale?: boolean };
}

function renderHeroCinematicHtml(data: CinematicHeroData): string {
  const title = data.pageHeading || data.title || 'Nagranie i Miks';
  const video = data.video;
  const grayscale = video?.grayscale === true;
  const grayscaleClass = grayscale ? ' grayscale' : '';
  const grayscaleStyle = grayscale ? ' style="filter: grayscale(1);"' : '';

  const posterMobileHtml = video?.poster
    ? `<img id="hero-cinematic-poster-mobile" src="${video.poster}" alt="" />`
    : '';

  const videoHtml = video
    ? `<video id="hero-cinematic-media" class="absolute inset-0 size-full object-cover${grayscaleClass}" autoplay muted loop playsinline preload="none" poster="${video.poster || ''}" data-hero-video${grayscaleStyle}>${video.sources
        .map((src) => `<source data-src="${src}" type="video/mp4" />`)
        .join('')}</video>`
    : '';

  const ctaHtml = data.cta
    ? `<a href="${formatInternalLink(data.cta.href)}" class="ui-button ui-button-primary h-11 sm:h-12 min-h-11 bg-white text-neutral-900 shadow-none">${data.cta.label}</a>`
    : '';
  const cta2Html = data.cta2
    ? `<a href="${formatInternalLink(data.cta2.href)}" class="ui-button ui-button-outline h-11 sm:h-12 min-h-11 border-white/25 text-white/60">${data.cta2.label}</a>`
    : '';

  return `<section class="ui-section ui-bg-page relative flex min-h-[calc(100svh-var(--site-header-height,5.75rem))] flex-col overflow-hidden bg-black">
    <div class="absolute inset-0">
      ${posterMobileHtml}
      ${videoHtml}
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/55"></div>
      <div class="absolute inset-0 ui-console-grid ui-console-grid--dark opacity-18"></div>
    </div>
    <div class="ui-container">
      <div class="mx-auto flex w-full max-w-3xl flex-col items-center py-16 text-center md:py-24">
        <h1 class="ui-type-heading-hero font-heading font-bold max-w-3xl text-lg font-light uppercase tracking-[0.18em] text-white sm:text-xl md:text-2xl lg:text-3xl">${title}</h1>
        <div class="mt-16 flex flex-col gap-4 sm:flex-row">${ctaHtml}${cta2Html}</div>
      </div>
    </div>
  </section>`;
}

describe('HeroCinematicBlock — kontrakt renderowania', () => {
  const defaultData: CinematicHeroData = {
    title: 'Nagranie & Miks Mastering & Produkcja',
    cta: { label: 'Umów sesję', href: '/kontakt/' },
    cta2: { label: 'Posłuchaj', href: '/#realizacje' },
    video: {
      sources: ['/assets/placeholders/video-placeholder.mp4'],
      poster: '/assets/placeholders/video-poster.svg',
      grayscale: true,
    },
  };

  it('renderuje <section> z ui-section i ciemnym tłem', () => {
    const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').hasClass('bg-black')).toBe(true);
  });

  it('ma dokladnie jeden <h1> i zero <h2>', () => {
    const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
    expect($('h1').length).toBe(1);
    expect($('h2').length).toBe(0);
  });

  it('h1 zawiera tytul', () => {
    const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
    expect($('h1').text()).toContain('Nagranie & Miks');
  });

  it('pageHeading nadpisuje title (h1 = heading strony)', () => {
    const $ = cheerio.load(renderHeroCinematicHtml({
      ...defaultData,
      pageHeading: 'Studio nagrań Heinrich',
    }));
    expect($('h1').text()).toBe('Studio nagrań Heinrich');
  });

  it('h1 ma klasy typografii: font-light, uppercase, tracking, max-w-3xl, text-white', () => {
    const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
    const h1 = $('h1');
    expect(h1.hasClass('font-light')).toBe(true);
    expect(h1.hasClass('uppercase')).toBe(true);
    expect(h1.hasClass('tracking-[0.18em]')).toBe(true);
    expect(h1.hasClass('max-w-3xl')).toBe(true);
    expect(h1.hasClass('text-white')).toBe(true);
  });

  it('h1 jest mobile-first (text-lg sm:text-xl md:text-2xl lg:text-3xl)', () => {
    const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
    const h1 = $('h1');
    expect(h1.hasClass('text-lg')).toBe(true);
    expect(h1.hasClass('sm:text-xl')).toBe(true);
    expect(h1.hasClass('lg:text-3xl')).toBe(true);
  });

  it('zawiera .ui-container', () => {
    const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
    expect($('.ui-container').length).toBe(1);
  });

  describe('wideo w tle', () => {
    it('wideo ma atrybuty autoplay, muted, loop i playsinline', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      const video = $('video');
      expect(video.attr('autoplay')).toBeDefined();
      expect(video.attr('muted')).toBeDefined();
      expect(video.attr('loop')).toBeDefined();
      expect(video.attr('playsinline')).toBeDefined();
    });

    it('wideo ma preload="none" i źródła w data-src (deferred loading)', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      const video = $('video');
      expect(video.attr('preload')).toBe('none');
      expect(video.attr('src')).toBeUndefined();
      expect($('video source[data-src]').length).toBe(1);
      expect(video.find('source[src]').length).toBe(0);
    });

    it('poster jest ustawiony na wideo i jako obraz dla mobile', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      expect($('video').attr('poster')).toBe('/assets/placeholders/video-poster.svg');
      expect($('#hero-cinematic-poster-mobile').attr('src')).toBe('/assets/placeholders/video-poster.svg');
    });

    it('wideo jest grayscale gdy grayscale=true (class + filter)', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      const video = $('video');
      expect(video.hasClass('grayscale')).toBe(true);
      expect(video.attr('style')).toContain('filter: grayscale(1)');
    });

    it('wideo nie jest grayscale gdy grayscale=false', () => {
      const $ = cheerio.load(renderHeroCinematicHtml({
        ...defaultData,
        video: { ...defaultData.video!, grayscale: false },
      }));
      expect($('video').hasClass('grayscale')).toBe(false);
      expect($('video').attr('style')).toBeUndefined();
    });

    it('brak wideo w propsach nie renderuje elementu <video>', () => {
      const $ = cheerio.load(renderHeroCinematicHtml({ title: 'Bez wideo' }));
      expect($('video').length).toBe(0);
    });
  });

  describe('dekoracje tla', () => {
    it('ciemny gradient jest obecny', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      expect($('.bg-gradient-to-b').length).toBe(1);
    });

    it('siatka kropek ma klasy ui-console-grid, --dark i opacity-18', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      const grid = $('.ui-console-grid');
      expect(grid.length).toBe(1);
      expect(grid.hasClass('ui-console-grid--dark')).toBe(true);
      expect(grid.hasClass('opacity-18')).toBe(true);
    });
  });

  describe('CTA', () => {
    it('renderuje dwa przyciski CTA jako linki (primary + outline)', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      expect($('a.ui-button-primary').length).toBe(1);
      expect($('a.ui-button-outline').length).toBe(1);
    });

    it('CTA ma trailing slash w href (formatInternalLink)', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      expect($('a.ui-button-primary').attr('href')).toBe('/kontakt/');
    });

    it('CTA zachowuje zewnetrzne URL', () => {
      const $ = cheerio.load(renderHeroCinematicHtml({
        ...defaultData,
        cta: { label: 'Zobacz', href: 'https://example.com/strona' },
      }));
      expect($('a.ui-button-primary').attr('href')).toBe('https://example.com/strona');
    });

    it('CTA nie ma href="#"', () => {
      const html = renderHeroCinematicHtml(defaultData);
      expect(html).not.toContain('href="#"');
    });

    it('CTA primary jest mobile-first (h-11 sm:h-12)', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      const cta = $('a.ui-button-primary');
      expect(cta.hasClass('h-11')).toBe(true);
      expect(cta.hasClass('sm:h-12')).toBe(true);
    });

    it('CTA primary na ciemnym tle ma bialy kolor (bg-white text-neutral-900)', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      const cta = $('a.ui-button-primary');
      expect(cta.hasClass('bg-white')).toBe(true);
      expect(cta.hasClass('text-neutral-900')).toBe(true);
    });

    it('CTA outline na ciemnym tle ma jasny border (border-white/25)', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      expect($('a.ui-button-outline').hasClass('border-white/25')).toBe(true);
    });
  });

  describe('mobile-first layout', () => {
    it('sekcja ma flex-col (mobile) i min-h pokrywajacy caly ekran', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      expect($('section').hasClass('flex-col')).toBe(true);
      expect($('section').hasClass('min-h-[calc(100svh-var(--site-header-height,5.75rem))]')).toBe(true);
    });

    it('przyciski sa w kolumnie na mobile, w rzadzie od sm', () => {
      const $ = cheerio.load(renderHeroCinematicHtml(defaultData));
      const row = $('div.mt-16');
      expect(row.hasClass('flex-col')).toBe(true);
      expect(row.hasClass('sm:flex-row')).toBe(true);
    });
  });
});
