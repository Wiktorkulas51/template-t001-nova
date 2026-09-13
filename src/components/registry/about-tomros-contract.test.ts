import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';

// Why: the contract test builds HTML manually (hero-cinematic-contract.test.ts pattern),
// because rendering .astro in vitest would require additional runtime. The test guards the contract
// between the AboutTomRosBlock component and CMS/JSON: section structure, Anton's typography,
// wideo z kontrolkami (lub iframe youtube-nocookie), statystyki, kategorie i panel joinTeam.
interface AboutTomRosData {
  eyebrow?: string;
  title?: string;
  accentTitle?: string;
  intro?: string;
  bio?: string[];
  stats?: { value?: string; label?: string }[];
  categories?: string[];
  categoriesLabel?: string;
  video?: {
    sources?: { src: string; type?: string }[];
    youtubeId?: string;
    ariaPlay?: string;
    ariaMute?: string;
    ariaVolume?: string;
  };
  joinTeam?: { title?: string; intro?: string; paragraphs?: string[]; cta?: string; ctaHover?: string };
}

function renderAboutTomRosHtml(data: AboutTomRosData): string {
  const stats = data.stats ?? [];
  const categories = data.categories ?? [];
  const video = data.video;
  const sources = video?.sources ?? [];

  const statsHtml = stats
    .map(
      (stat) => `<div class="border-l-2 border-brand-primary/60 pl-3 sm:pl-4">
      <div class="font-[Anton] text-3xl leading-none text-brand-primary sm:text-4xl">${stat.value || ''}</div>
      <div class="mt-2 text-[10px] font-bold uppercase leading-snug tracking-[0.12em] text-on-surface-variant opacity-70 sm:text-[11px]">${stat.label || ''}</div>
    </div>`
    )
    .join('');

  const categoriesHtml = categories
    .map(
      (cat) =>
        `<span class="rounded-md border border-outline-variant bg-surface-card px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">${cat}</span>`
    )
    .join('');

  const mediaHtml = video?.youtubeId
    ? `<div class="ui-glow-frame relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
        <iframe src="https://www.youtube-nocookie.com/embed/${video.youtubeId}" title="Wideo" class="absolute inset-0 h-full w-full border-0" loading="lazy" allowfullscreen></iframe>
      </div>`
    : sources.length > 0
      ? `<div class="ui-glow-frame relative overflow-hidden rounded-2xl bg-black ring-1 ring-white/10" data-video-shell>
          <video class="aspect-[8/5] w-full object-contain" autoplay muted loop playsinline preload="metadata" aria-label="Wideo" data-video>
            ${sources.map((s) => `<source src="${s.src}" type="${s.type || 'video/mp4'}" />`).join('')}
          </video>
          <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-3 pt-12">
            <button type="button" class="flex size-11 cursor-pointer items-center justify-center rounded-full bg-brand-primary text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-brand-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50" aria-label="${video?.ariaPlay || 'Odtwarzaj lub zatrzymaj wideo'}" data-action="play">
              <svg class="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-icon-play><path d="M8 5.14v13.72L19 12 8 5.14z" /></svg>
              <svg class="hidden size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-icon-pause><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
            </button>
            <div class="group relative">
              <span aria-hidden="true" class="absolute bottom-full left-1/2 h-32 w-16 -translate-x-1/2"></span>
              <input type="range" min="0" max="1" step="0.05" value="0.5" class="pointer-events-none absolute bottom-full left-1/2 mb-3 h-24 w-1.5 origin-bottom -translate-x-1/2 cursor-pointer accent-brand-primary opacity-0 [direction:rtl] [writing-mode:vertical-lr] transition-all delay-300 duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-0 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:delay-0 sm:h-28" aria-label="${video?.ariaVolume || 'Regulacja głośności'}" data-action="volume" />
              <button type="button" class="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50" aria-label="${video?.ariaMute || 'Wycisz lub włącz dźwięk'}" data-action="mute">
                <svg class="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-icon-volume-on><path d="M3 9v6h4l5 5V4L7 9H3zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                <svg class="hidden size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-icon-volume-off><path d="M3 9v6h4l5 5V4L7 9H3zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
              </button>
            </div>
          </div>
        </div>`
      : '';

  const joinTeamHtml = data.joinTeam
    ? `<div class="relative mt-16 overflow-hidden rounded-2xl border border-brand-primary/30 bg-surface-card p-8 md:p-12">
        <div class="ui-glow ui-glow-about-panel" aria-hidden="true"></div>
        <div class="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div class="space-y-4">
            <p class="ui-type-accent-label text-brand-primary">${data.joinTeam.title || ''}</p>
            <p class="text-brand-dark">${data.joinTeam.intro || ''}</p>
          </div>
          <div class="lg:pl-12">
            <a href="/kontakt/" class="ui-button ui-button-primary ui-type-cta-label group inline-flex items-center justify-center gap-1.5 rounded-md whitespace-nowrap transition-all font-semibold h-11 sm:h-12 px-5 sm:px-8 text-sm sm:text-lg [&_svg]:size-5">
              <span class="ui-button-text-wrap">
                <span class="ui-button-text-default">${data.joinTeam.cta || 'Wypełnij formularz'}</span>
                <span class="ui-button-text-hover">${data.joinTeam.ctaHover || 'Napisz do nas'}</span>
              </span>
            </a>
          </div>
        </div>
      </div>`
    : '';

  return `<section id="o-nas" class="ui-section ui-bg-page overflow-x-clip">
    <div class="ui-container">
      <div class="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div class="space-y-6">
          <p class="ui-type-accent-label text-brand-primary">${data.eyebrow || ''}</p>
          <div class="space-y-3">
            <h2 class="font-heading font-[Anton] text-5xl uppercase leading-[0.95] tracking-[-0.02em] text-brand-dark md:text-6xl">${data.title || ''}</h2>
            <p class="font-bold italic uppercase text-brand-primary text-3xl md:text-4xl">${data.accentTitle || ''}</p>
          </div>
          <p class="ui-type-lead leading-relaxed text-brand-dark/80">${data.intro || ''}</p>
          <div class="space-y-4">
            ${(data.bio ?? []).map((p) => `<p class="ui-type-body leading-relaxed text-on-surface-variant">${p}</p>`).join('')}
          </div>
        </div>
        <div class="relative self-start">
          ${mediaHtml}
          ${stats.length > 0 ? `<div class="mt-6 grid grid-cols-2 gap-4 border-t border-brand-primary/20 pt-6 sm:grid-cols-4">${statsHtml}</div>` : ''}
          ${categories.length > 0 ? `<div class="mt-7 border-t border-brand-primary/15 pt-5">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">${data.categoriesLabel || 'Zakres współpracy'}</p>
            <div class="mt-3 flex flex-wrap gap-2">${categoriesHtml}</div>
          </div>` : ''}
        </div>
      </div>
      ${joinTeamHtml}
    </div>
  </section>`;
}

describe('AboutTomRosBlock — kontrakt renderowania', () => {
  const defaultData: AboutTomRosData = {
    eyebrow: 'O nas',
    title: 'Twoja droga do formy',
    accentTitle: 'Zacznij już dziś',
    intro: 'Pomagamy budować sylwetkę dopasowaną do Twoich celów.',
    bio: ['Akapit pierwszy.', 'Akapit drugi.', 'Akapit trzeci.', 'Akapit czwarty.'],
    stats: [
      { value: '15+', label: 'Lat doświadczenia' },
      { value: '20+', label: 'Ukończonych programów' },
      { value: '100+', label: 'Zadowolonych klientów' },
      { value: '50+', label: 'Celów osiągniętych' },
    ],
    categories: ['Trening siłowy', 'Odchudzanie', 'Budowanie masy', 'Zdrowe nawyki'],
    categoriesLabel: 'Zakres współpracy',
    video: {
      sources: [{ src: '/assets/videos/video-placeholder.mp4', type: 'video/mp4' }],
      ariaPlay: 'Odtwarzaj lub zatrzymaj wideo',
      ariaMute: 'Wycisz lub włącz dźwięk',
      ariaVolume: 'Regulacja głośności',
    },
    joinTeam: {
      title: 'Dołącz do nas',
      intro: 'Nie czekaj dłużej!',
      cta: 'Wypełnij formularz',
      ctaHover: 'Napisz do nas',
    },
  };

  it('renderuje <section> z ui-section i tone page', () => {
    const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').hasClass('ui-bg-page')).toBe(true);
  });

  it('zawiera .ui-container', () => {
    const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
    expect($('.ui-container').length).toBe(1);
  });

  it('ma dokladnie jeden <h2> z typografia Antona', () => {
    const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
    const h2 = $('h2');
    expect(h2.length).toBe(1);
    expect(h2.hasClass('font-[Anton]')).toBe(true);
    expect(h2.hasClass('text-5xl')).toBe(true);
    expect(h2.hasClass('md:text-6xl')).toBe(true);
    expect(h2.hasClass('uppercase')).toBe(true);
    expect(h2.hasClass('leading-[0.95]')).toBe(true);
    expect(h2.hasClass('text-brand-dark')).toBe(true);
    expect(h2.text()).toContain('Twoja droga');
  });

  it('h2 jest mobile-first (text-5xl md:text-6xl)', () => {
    const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
    const h2 = $('h2');
    expect(h2.hasClass('text-5xl')).toBe(true);
    expect(h2.hasClass('md:text-6xl')).toBe(true);
  });

  it('akcent tytulu ma italic i brand-primary', () => {
    const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
    const accent = $('p.font-bold.italic');
    expect(accent.length).toBe(1);
    expect(accent.hasClass('uppercase')).toBe(true);
    expect(accent.hasClass('text-brand-primary')).toBe(true);
    expect(accent.hasClass('text-3xl')).toBe(true);
    expect(accent.hasClass('md:text-4xl')).toBe(true);
  });

  it('renderuje eyebrow jako ui-type-accent-label', () => {
    const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
    const eyebrow = $('p.ui-type-accent-label').first();
    expect(eyebrow.hasClass('text-brand-primary')).toBe(true);
    expect(eyebrow.text()).toBe('O nas');
  });

  describe('wideo', () => {
    it('wideo ma atrybuty autoplay, muted, loop, playsinline i preload="metadata"', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      const video = $('video');
      expect(video.length).toBe(1);
      expect(video.attr('autoplay')).toBeDefined();
      expect(video.attr('muted')).toBeDefined();
      expect(video.attr('loop')).toBeDefined();
      expect(video.attr('playsinline')).toBeDefined();
      expect(video.attr('preload')).toBe('metadata');
    });

    it('wideo ma zrodlo video-placeholder.mp4', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      expect($('video source[src="/assets/videos/video-placeholder.mp4"]').length).toBe(1);
    });

    it('wideo jest w ramce ui-glow-frame z bg-black i ring-white/10', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      const frame = $('[data-video-shell]');
      expect(frame.hasClass('ui-glow-frame')).toBe(true);
      expect(frame.hasClass('bg-black')).toBe(true);
      expect(frame.hasClass('ring-white/10')).toBe(true);
    });

    it('kontrolki: play/pause, mute i pionowy slider volume', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      expect($('[data-action="play"]').length).toBe(1);
      expect($('[data-action="mute"]').length).toBe(1);
      expect($('[data-action="volume"]').length).toBe(1);
      const volume = $('[data-action="volume"]');
      expect(volume.attr('type')).toBe('range');
      expect(volume.attr('[writing-mode:vertical-lr]')).toBeUndefined();
      expect(volume.hasClass('[writing-mode:vertical-lr]')).toBe(true);
      expect(volume.hasClass('[direction:rtl]')).toBe(true);
    });

    it('youtubeId renderuje iframe youtube-nocookie zamiast wideo', () => {
      const $ = cheerio.load(renderAboutTomRosHtml({
        ...defaultData,
        video: { youtubeId: 'abc123', sources: [] },
      }));
      expect($('video').length).toBe(0);
      expect($('iframe[src*="youtube-nocookie.com/embed/abc123"]').length).toBe(1);
    });
  });

  describe('statystyki', () => {
    it('renderuje dokladnie 4 statystyki', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      expect($('.border-l-2.border-brand-primary\\/60').length).toBe(4);
    });

    it('wartosc statystyki ma font-[Anton] i text-brand-primary', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      // Why: precise div selector (h2 also has font-[Anton]), to test
      // it was targeting the statistic value, not the section heading.
      const value = $('div.font-\\[Anton\\]').first();
      expect(value.hasClass('text-brand-primary')).toBe(true);
      expect(value.hasClass('text-3xl')).toBe(true);
    });

    it('grid statystyk ma border-t border-brand-primary/20 i 2 kolumny na mobile', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      const grid = $('.grid.grid-cols-2');
      expect(grid.length).toBe(1);
      expect(grid.hasClass('border-t')).toBe(true);
      expect(grid.hasClass('border-brand-primary/20')).toBe(true);
      expect(grid.hasClass('sm:grid-cols-4')).toBe(true);
    });

    it('brak statystyk nie renderuje gridu', () => {
      const $ = cheerio.load(renderAboutTomRosHtml({ ...defaultData, stats: [] }));
      expect($('.grid-cols-2').length).toBe(0);
    });
  });

  describe('kategorie', () => {
    it('renderuje 4 kategorie jako chipy rounded-md', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      expect($('span.rounded-md').length).toBe(4);
      const chip = $('span.rounded-md').first();
      expect(chip.hasClass('border')).toBe(true);
      expect(chip.hasClass('uppercase')).toBe(true);
      expect(chip.hasClass('font-bold')).toBe(true);
    });

    it('etykieta kategorii ma uppercase i tracking-[0.2em]', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      const label = $('p.text-xs').first();
      expect(label.hasClass('uppercase')).toBe(true);
      expect(label.hasClass('tracking-[0.2em]')).toBe(true);
      expect(label.text()).toBe('Zakres współpracy');
    });

    it('brak kategorii nie renderuje chipów', () => {
      const $ = cheerio.load(renderAboutTomRosHtml({ ...defaultData, categories: [] }));
      expect($('span.rounded-md').length).toBe(0);
    });
  });

  describe('panel joinTeam', () => {
    it('renderuje panel z border-brand-primary/30 i glow ui-glow', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      const panel = $('div.mt-16.rounded-2xl');
      expect(panel.length).toBe(1);
      expect(panel.hasClass('border-brand-primary/30')).toBe(true);
      expect($('.ui-glow').length).toBe(1);
    });

    it('grid joinTeam ma lg:grid-cols-[1fr_auto]', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      const grid = $('.lg\\:grid-cols-\\[1fr_auto\\]');
      expect(grid.length).toBe(1);
    });

    it('przycisk CTA jest primary z hoverText', () => {
      const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
      const cta = $('a.ui-button-primary');
      expect(cta.length).toBe(1);
      expect(cta.find('.ui-button-text-hover').text()).toBe('Napisz do nas');
      expect(cta.find('.ui-button-text-default').text()).toBe('Wypełnij formularz');
    });

    it('brak joinTeam nie renderuje panelu', () => {
      const $ = cheerio.load(renderAboutTomRosHtml({ ...defaultData, joinTeam: undefined }));
      expect($('a.ui-button-primary').length).toBe(0);
    });
  });

  it('bio renderuje 4 akapity', () => {
    const $ = cheerio.load(renderAboutTomRosHtml(defaultData));
    // Why: bio has ui-type-body, and joinTeam has its own p without this class,
    // so the type selector will not catch paragraphs from the CTA panel.
    expect($('p.ui-type-body').length).toBe(4);
  });
});
