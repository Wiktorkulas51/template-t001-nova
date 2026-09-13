import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import { formatInternalLink } from '@utils/url';

// Why: Contract test builds HTML manually to keep an eye on structure quickly
// special hero without running the full Astro runtime.
interface HeroTomRosData {
  sectionId?: string;
  title?: string;
  accentTitle?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string; hoverText?: string };
  secondaryCta?: { label: string; href: string; hoverText?: string };
  trustItems?: { icon: string; value: string; label: string }[];
  background?: { src: string; alt: string };
}

function renderHeroTomRosHtml(data: HeroTomRosData): string {
  const sectionId = data.sectionId || 'hero-tomros';
  const title = data.title || 'Team Tom Ros\nBody Transformation\nExpert';
  const accentTitle = data.accentTitle || '';
  const subtitle = data.subtitle || 'Body Transformation Expert.';
  const bg = data.background || { src: '/assets/placeholders/image-portrait.svg', alt: 'Tom Ros' };

  const accentHtml = accentTitle
    ? `<span class="ui-type-display-accent tom-ros-inline-accent"> ${accentTitle}</span>`
    : '';
  const primaryHtml = data.primaryCta
    ? `<a href="${formatInternalLink(data.primaryCta.href)}" class="ui-button ui-button-primary h-11 sm:h-12 min-h-11"><span class="ui-button-text-wrap"><span class="ui-button-text-default">${data.primaryCta.label}</span><span class="ui-button-text-hover">${data.primaryCta.hoverText || ''}</span></span></a>`
    : '';
  const secondaryHtml = data.secondaryCta
    ? `<a href="${formatInternalLink(data.secondaryCta.href)}" class="ui-button ui-button-outline h-11 sm:h-12 min-h-11"><span class="ui-button-text-wrap"><span class="ui-button-text-default">${data.secondaryCta.label}</span><span class="ui-button-text-hover">${data.secondaryCta.hoverText || ''}</span></span></a>`
    : '';
  const trustHtml = (data.trustItems || [])
    .map(
      (item) =>
        `<div class="flex items-center gap-3"><i class="ph ph-${item.icon} text-lg"></i><div class="text-left"><div class="text-lg font-bold text-brand-dark">${item.value}</div><div class="text-xs uppercase tracking-wider text-brand-dark/60">${item.label}</div></div></div>`,
    )
    .join('');

  return `<section id="${sectionId}-mobile" class="tom-ros-hero tom-ros-hero-mobile relative flex min-h-[calc(100svh-var(--site-header-height,5.75rem))] flex-col overflow-hidden md:hidden" aria-label="${title}">
    <img src="${bg.src}" alt="${bg.alt}" class="absolute inset-0 h-full w-full object-cover object-top" loading="eager" width="1365" height="1333" />
    <div class="tom-ros-hero-shadow tom-ros-hero-shadow-mobile"></div>
    <div class="ui-container"><div class="relative z-10 mt-auto flex w-full flex-col items-center pb-12 pt-16 text-center">
      <h1 class="ui-type-heading-hero font-heading font-bold tom-ros-hero-heading whitespace-pre-line text-brand-dark">${title}${accentHtml}</h1>
    </div></div>
  </section>
  <section class="ui-section tom-ros-hero tom-ros-hero-desktop relative hero-dock-bottom hidden overflow-visible md:block" id="${sectionId}">
    <img src="${bg.src}" alt="${bg.alt}" class="ui-hero-media absolute inset-0 size-full object-cover object-right-bottom" loading="eager" width="1365" height="1333" />
    <div class="tom-ros-hero-shadow"></div>
    <div class="ui-container"><div class="relative z-10 flex max-w-3xl flex-col items-start py-20 text-left md:py-28">
      <div class="space-y-6"><h1 class="ui-type-heading-hero font-heading font-bold tom-ros-hero-heading whitespace-pre-line text-brand-dark">${title}${accentHtml}</h1><p class="ui-type-lead leading-relaxed max-w-xl text-brand-dark/70">${subtitle}</p></div>
      <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row">${primaryHtml}${secondaryHtml}</div>
      ${trustHtml ? `<div class="mt-16 flex flex-wrap justify-center gap-8 border-t border-brand-dark/10 pt-8">${trustHtml}</div>` : ''}
    </div></div>
  </section>`;
}

describe('HeroTomRosBlock, kontrakt renderowania', () => {
  const defaultData: HeroTomRosData = {
    title: 'Team Tom Ros\nBody Transformation\nExpert',
    accentTitle: 'Built for life.',
    subtitle: "Body Transformation Expert. Personal trainer since 2000. Let's build the body you're proud of.",
    primaryCta: { label: 'CHECK OUT MY OFFER', href: '/offer/', hoverText: 'See my offer' },
    secondaryCta: { label: 'Watch videos', href: '/video/', hoverText: 'Watch the videos' },
    trustItems: [
      { icon: 'medal', value: '15+', label: 'Years of experience' },
      { icon: 'users', value: '500+', label: 'Happy clients' },
    ],
  };

  it('renderuje osobne sekcje mobile i desktop z motywem Tom Ros', () => {
    const $ = cheerio.load(renderHeroTomRosHtml(defaultData));
    expect($('section#hero-tomros').length).toBe(1);
    expect($('section#hero-tomros-mobile').length).toBe(1);
    expect($('section#hero-tomros').hasClass('ui-section')).toBe(true);
    expect($('section#hero-tomros').hasClass('hero-dock-bottom')).toBe(true);
    expect($('section#hero-tomros').hasClass('hidden')).toBe(true);
    expect($('section#hero-tomros').hasClass('md:block')).toBe(true);
    expect($('section#hero-tomros-mobile').hasClass('md:hidden')).toBe(true);
    expect($('.tom-ros-hero').length).toBe(2);
  });

  it('zachowuje dokładny tytuł i akcent oryginalnego hero', () => {
    const $ = cheerio.load(renderHeroTomRosHtml(defaultData));
    const h1 = $('section#hero-tomros h1');
    expect(h1.length).toBe(1);
    expect(h1.hasClass('ui-type-heading-hero')).toBe(true);
    expect(h1.hasClass('whitespace-pre-line')).toBe(true);
    expect(h1.text()).toContain('Team Tom Ros\nBody Transformation\nExpert');
    expect(h1.find('.ui-type-display-accent').text()).toContain('Built for life.');
    expect(h1.find('.tom-ros-inline-accent').length).toBe(1);
  });

  it('renderuje dokładne CTA z oryginalnymi ścieżkami', () => {
    const $ = cheerio.load(renderHeroTomRosHtml(defaultData));
    expect($('section#hero-tomros a.ui-button-primary .ui-button-text-default').text()).toBe('CHECK OUT MY OFFER');
    expect($('section#hero-tomros a.ui-button-primary').attr('href')).toBe('/offer/');
    expect($('section#hero-tomros a.ui-button-outline .ui-button-text-default').text()).toBe('Watch videos');
    expect($('section#hero-tomros a.ui-button-outline').attr('href')).toBe('/video/');
    expect($('a[href="#"]').length).toBe(0);
  });

  it('używa zdjęcia w tle po prawej bez klientowego overlayu', () => {
    const $ = cheerio.load(renderHeroTomRosHtml(defaultData));
    const img = $('section#hero-tomros img.ui-hero-media');
    expect(img.hasClass('object-cover')).toBe(true);
    expect(img.hasClass('object-right-bottom')).toBe(true);
    expect($('section#hero-tomros .bg-gradient-to-b').length).toBe(0);
    expect($('section#hero-tomros .hero-image-fade-left').length).toBe(0);
    expect($('section#hero-tomros .ui-glow-hero').length).toBe(0);
    expect($('section#hero-tomros-mobile .object-top').length).toBe(1);
    expect($('section#hero-tomros .tom-ros-hero-shadow').length).toBe(1);
    expect($('section#hero-tomros-mobile .tom-ros-hero-shadow-mobile').length).toBe(1);
    expect($('.tom-ros-hero-heading').length).toBe(2);
  });

  it('zachowuje strukturę globalnego buttonu z tekstem hover', () => {
    const $ = cheerio.load(renderHeroTomRosHtml(defaultData));
    const primary = $('section#hero-tomros a.ui-button-primary');
    expect(primary.hasClass('ui-button')).toBe(true);
    expect(primary.find('.ui-button-text-default').text()).toBe('CHECK OUT MY OFFER');
    expect(primary.find('.ui-button-text-hover').text()).toBe('See my offer');
  });

  it('renderuje trust items tylko gdy są podane', () => {
    const $ = cheerio.load(renderHeroTomRosHtml(defaultData));
    expect($('section#hero-tomros .ph-medal').length).toBe(1);
    expect($('section#hero-tomros .ph-users').length).toBe(1);
    const empty = cheerio.load(renderHeroTomRosHtml({ ...defaultData, trustItems: [] }));
    expect(empty('section#hero-tomros .ph-medal').length).toBe(0);
  });
});
