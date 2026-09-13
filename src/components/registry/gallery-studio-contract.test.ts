// Test kontraktowy bloku GalleryStudioBlock, wzorowany na gallery-crossfade-contract.test.ts.
// It doesn't render the Astro component, only HTML according to its structure, so
// kontrakt (slider, lightbox, miniatury, equipment) jest sprawdzany w izolacji.
import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import studioData from '@data/sections/gallery-studio.json';

interface StudioImage {
  src: string;
  alt: string;
}

interface StudioData {
  heading: string;
  description: string;
  equipment: { category: string; items: string }[];
  images: StudioImage[];
}

function renderGalleryStudioHtml(data: StudioData): string {
  const lightboxGalleryJson = JSON.stringify(
    data.images.map((image) => ({ src: image.src, title: image.alt, alt: image.alt })),
  );

  const slideHtml = data.images
    .map(
      (image, index) => `
        <div class="ui-gallery-slide absolute inset-0" data-index="${index}" style="transform: translateX(${index * 100}%)">
          <div class="h-full w-full cursor-zoom-in" data-lightbox data-href="${image.src}" data-title="${image.alt}" data-lightbox-gallery='${lightboxGalleryJson}'>
            <img src="${image.src}" alt="${image.alt}" class="ui-gallery-slide-img h-full w-full object-cover grayscale" />
          </div>
        </div>`,
    )
    .join('');

  const thumbHtml = data.images
    .map((image, index) => {
      const activeClass = index === 0 ? 'border-neutral-400 opacity-100' : 'border-transparent opacity-50';
      return `<button type="button" data-gallery-studio-thumb data-index="${index}" class="shrink-0 size-16 overflow-hidden rounded-sm border-2 transition-all duration-300 hover:opacity-80 sm:size-20 ${activeClass}" aria-label="Przejdź do zdjęcia ${index + 1}"><img src="${image.src}" alt="" class="h-full w-full object-cover grayscale pointer-events-none" /></button>`;
    })
    .join('');

  const equipmentHtml = data.equipment
    .map(
      (item) => `
        <div class="mx-auto max-w-60 text-center">
          <h4 class="text-xs tracking-[0.2em] text-neutral-500 uppercase">${item.category}</h4>
          <p class="mt-2 text-sm leading-relaxed text-neutral-400 whitespace-pre-line">${item.items}</p>
        </div>`,
    )
    .join('');

  return `
    <section class="ui-section relative bg-neutral-950 py-24 sm:py-32 overflow-hidden">
      <div class="ui-container">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="ui-type-section-title mt-4 text-white">${data.heading}</h2>
          <p class="ui-type-body mt-4 text-neutral-400">${data.description}</p>
        </div>
        <div class="mt-16" data-gallery-studio>
          <div id="gallery-studio-stage" class="group relative mx-auto max-w-7xl aspect-[16/9] overflow-hidden rounded-sm">
            ${slideHtml}
            <button id="gallery-studio-prev" type="button" aria-label="Poprzednie zdjęcie"></button>
            <button id="gallery-studio-next" type="button" aria-label="Następne zdjęcie"></button>
          </div>
          <div class="mx-auto mt-4 max-w-7xl overflow-x-auto ui-scrollbar-thin">
            <div class="flex gap-2 px-1">${thumbHtml}</div>
          </div>
        </div>
        <div class="ui-divider ui-divider--dark my-20" aria-hidden="true"><span class="ui-divider__dot"></span></div>
        <div class="mt-16 text-center">
          <h3 class="text-lg font-bold tracking-wide text-white uppercase">Wyposażenie</h3>
          <div class="mt-10 grid gap-8 sm:grid-cols-3">${equipmentHtml}</div>
        </div>
      </div>
    </section>`;
}

describe('GalleryStudio — kontrakt renderowania', () => {
  const defaultData: StudioData = {
    heading: 'Nasze realizacje',
    description: 'Zobacz wybrane projekty z naszej pracowni.',
    equipment: [
      { category: 'Monitoring', items: 'Monitory studyjne\nSłuchawki kontrolne' },
      { category: 'Oświetlenie', items: 'Światło stałe\nSoftboxy' },
      { category: 'Wideo', items: 'Kamery 4K\nStreaming' },
      { category: 'Audio', items: 'Konsola\nMikrofony' },
      { category: 'Postprodukcja', items: 'Montaż\nKorekcja koloru' },
      { category: 'Lokalizacja', items: 'Sala studyjna\nParking' },
    ],
    images: Array.from({ length: 6 }, (_, index) => ({
      src: '/assets/placeholders/image-landscape.svg',
      alt: `Realizacja ${index + 1}`,
    })),
  };

  it('renderuje <section> z ui-section i ciemnym tłem', () => {
    const $ = cheerio.load(renderGalleryStudioHtml(defaultData));
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').hasClass('bg-neutral-950')).toBe(true);
  });

  it('zawiera .ui-container i h2 z tytułem', () => {
    const $ = cheerio.load(renderGalleryStudioHtml(defaultData));
    expect($('.ui-container').length).toBe(1);
    expect($('h2').text()).toContain('Nasze realizacje');
  });

  it('JSON dostarcza maksymalnie 6 zdjęć', () => {
    expect(studioData.images.length).toBeLessThanOrEqual(6);
  });

  it('slider renderuje slajdy .ui-gallery-slide z obrazem ui-gallery-slide-img', () => {
    const $ = cheerio.load(renderGalleryStudioHtml(defaultData));
    expect($('.ui-gallery-slide').length).toBe(6);
    expect($('.ui-gallery-slide-img').length).toBe(6);
  });

  it('każdy slajd jest triggerem globalnego lightboxa z galerią JSON', () => {
    const $ = cheerio.load(renderGalleryStudioHtml(defaultData));
    const triggers = $('[data-lightbox]');
    expect(triggers.length).toBe(6);
    triggers.each((_, el) => {
      const galleryAttr = $(el).attr('data-lightbox-gallery');
      expect(galleryAttr).toBeTruthy();
      const gallery = JSON.parse(galleryAttr as string);
      expect(Array.isArray(gallery)).toBe(true);
      expect(gallery.length).toBe(6);
    });
  });

  it('renderuje przyciski prev/next', () => {
    const $ = cheerio.load(renderGalleryStudioHtml(defaultData));
    expect($('#gallery-studio-prev').length).toBe(1);
    expect($('#gallery-studio-next').length).toBe(1);
  });

  it('renderuje miniatury z aktywną pierwszą (border-neutral-400)', () => {
    const $ = cheerio.load(renderGalleryStudioHtml(defaultData));
    const thumbs = $('[data-gallery-studio-thumb]');
    expect(thumbs.length).toBe(6);
    expect(thumbs.eq(0).hasClass('border-neutral-400')).toBe(true);
    expect(thumbs.eq(1).hasClass('border-transparent')).toBe(true);
  });

  it('renderuje divider ui-divider ui-divider--dark', () => {
    const $ = cheerio.load(renderGalleryStudioHtml(defaultData));
    const divider = $('.ui-divider.ui-divider--dark');
    expect(divider.length).toBe(1);
    expect(divider.find('.ui-divider__dot').length).toBe(1);
  });

  it('renderuje equipment grid z 3 kolumnami i kategoriami uppercase', () => {
    const $ = cheerio.load(renderGalleryStudioHtml(defaultData));
    const grid = $('.grid.sm\\:grid-cols-3');
    expect(grid.length).toBe(1);
    const categories = $('h4');
    expect(categories.length).toBe(6);
    expect(categories.eq(0).text()).toBe('Monitoring');
    expect(categories.eq(0).hasClass('uppercase')).toBe(true);
    expect($('p.whitespace-pre-line').length).toBe(6);
  });

  it('nie renderuje pustych linków (href="#")', () => {
    const html = renderGalleryStudioHtml(defaultData);
    expect(html).not.toContain('href="#"');
  });
});
