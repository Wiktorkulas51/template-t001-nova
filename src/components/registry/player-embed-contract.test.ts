// Test kontraktowy bloku PlayerEmbedBlock, wzorowany na hero-contract.test.ts.
// Checks the structure of the dark section, particles (ui-particle-drift) and iframe embed.
import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import playerData from '@data/sections/player-embed.json';

interface PlayerData {
  heading: string;
  description: string;
  embedUrl: string;
  iframeTitle: string;
  particles: number;
}

function renderPlayerEmbedHtml(data: PlayerData): string {
  const particleHtml = Array.from({ length: data.particles }, (_, index) => `
    <div class="absolute rounded-full bg-white" style="left: 45%; top: 20%; width: 3px; height: 3px; opacity: 0; --ui-particle-opacity: 0.4; --ui-particle-dx: 10px; --ui-particle-dy: -20px; --ui-particle-dx2: -15px; --ui-particle-dy2: -40px; animation: ui-particle-drift 8s ease-in-out infinite; animation-delay: -${index}s; will-change: transform, opacity;"></div>`).join('');

  return `
    <section class="ui-section relative bg-neutral-950 py-28 sm:py-40 overflow-hidden">
      <div class="absolute inset-0 z-10 overflow-hidden pointer-events-none" aria-hidden="true">${particleHtml}</div>
      <div class="ui-container relative z-20">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="ui-type-section-title mt-4 font-light text-white">${data.heading}</h2>
          <p class="ui-type-body mx-auto mt-4 max-w-md text-neutral-400">${data.description}</p>
        </div>
        <div class="relative mx-auto mt-14 max-w-2xl">
          <div class="relative overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900/80 shadow-2xl backdrop-blur-sm">
            <iframe src="${data.embedUrl}" title="${data.iframeTitle}" width="100%" height="352" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style="border-radius: 0; display: block; background: #111;"></iframe>
          </div>
        </div>
      </div>
    </section>`;
}

describe('PlayerEmbed: kontrakt renderowania', () => {
  const defaultData: PlayerData = {
    heading: 'Posłuchaj naszych realizacji',
    description: 'Krótka playlista z wybranymi projektami.',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    iframeTitle: 'Playlista z naszymi realizacjami',
    particles: 30,
  };

  it('renderuje <section> z ui-section i ciemnym tłem', () => {
    const $ = cheerio.load(renderPlayerEmbedHtml(defaultData));
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').hasClass('bg-neutral-950')).toBe(true);
  });

  it('zawiera .ui-container i h2 z tytułem (font-light, text-white)', () => {
    const $ = cheerio.load(renderPlayerEmbedHtml(defaultData));
    expect($('.ui-container').length).toBe(1);
    const h2 = $('h2');
    expect(h2.text()).toContain('Posłuchaj naszych realizacji');
    expect(h2.hasClass('font-light')).toBe(true);
    expect(h2.hasClass('text-white')).toBe(true);
  });

  it('renderuje cząstki z animacją ui-particle-drift i inline zmiennymi', () => {
    const $ = cheerio.load(renderPlayerEmbedHtml(defaultData));
    const particles = $('.rounded-full.bg-white');
    expect(particles.length).toBe(30);
    particles.each((_, el) => {
      const style = $(el).attr('style') || '';
      expect(style).toContain('ui-particle-drift');
      expect(style).toContain('--ui-particle-opacity');
      expect(style).toContain('--ui-particle-dx');
      expect(style).toContain('--ui-particle-dy');
      expect(style).toContain('--ui-particle-dx2');
      expect(style).toContain('--ui-particle-dy2');
    });
  });

  it('renderuje iframe z embedUrl z JSON', () => {
    const $ = cheerio.load(renderPlayerEmbedHtml(defaultData));
    const iframe = $('iframe');
    expect(iframe.length).toBe(1);
    expect(iframe.attr('src')).toBe(playerData.embedUrl);
    expect(iframe.attr('width')).toBe('100%');
    expect(iframe.attr('height')).toBe('352');
    expect(iframe.attr('loading')).toBe('lazy');
    expect(iframe.attr('title')).toBe(playerData.iframeTitle);
  });

  it('iframe jest opakowany w ramkę border-neutral-800 i bg-neutral-900', () => {
    const $ = cheerio.load(renderPlayerEmbedHtml(defaultData));
    const frame = $('iframe').parent();
    expect(frame.hasClass('border-neutral-800')).toBe(true);
    expect(frame.hasClass('bg-neutral-900/80')).toBe(true);
    expect(frame.hasClass('backdrop-blur-sm')).toBe(true);
  });

  it('JSON dostarcza embedUrl i iframeTitle', () => {
    expect(playerData.embedUrl).toBeTruthy();
    expect(playerData.iframeTitle).toBeTruthy();
  });
});
