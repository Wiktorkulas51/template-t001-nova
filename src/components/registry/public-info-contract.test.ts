// Test kontraktowy bloku PublicInfoBlock, wzorowany na services-studio-contract.test.ts
// and contact-studio-contract.test.ts. Checks the structure of "public information":
// gradient orb, h1, opis, sekcje z h2, karty item (row/stack) oraz resolveVars
// na danych ze starter-kit company.json.
import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import company from '@data/global/company.json';
import publicInfoData from '@data/sections/public-info.json';

interface PublicInfoItem {
  title: string;
  content: string;
  layout?: 'stack' | 'row';
  link?: { label: string; href: string };
}

interface PublicInfoSection {
  id?: string;
  heading: string;
  items: PublicInfoItem[];
}

interface PublicInfoData {
  title: string;
  description: string;
  sections: PublicInfoSection[];
}

// Why: the same variable replacement as in the component, so that the test checks HTML
// with {{COMPANY_*}} actually resolved (values ​​from starter-kit company.json).
function resolveVars(str: string): string {
  return str
    .replace(/{{COMPANY_PHONE}}/g, company.phone)
    .replace(/{{COMPANY_EMAIL}}/g, company.email);
}

function renderItem(item: PublicInfoItem): string {
  if (item.layout === 'stack') {
    return `<div class="rounded-xl px-5 py-4" style="background:color-mix(in oklab, var(--color-brand-dark) 3%, transparent)">
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wider text-brand-dark/50">${item.title}</span>
          <div class="text-sm leading-relaxed text-brand-dark/70" style="white-space:pre-line">${resolveVars(item.content)}</div>
        </div>
      </div>`;
  }
  const linkHtml = item.link
    ? `<a href="${resolveVars(item.link.href)}" class="ml-2 text-sm font-medium transition-colors hover:opacity-80 text-brand-primary">${item.link.label} &rarr;</a>`
    : '';
  return `<div class="rounded-xl px-5 py-4" style="background:color-mix(in oklab, var(--color-brand-dark) 3%, transparent)">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <span class="text-xs font-medium uppercase tracking-wider text-brand-dark/50" style="width:8rem;flex-shrink:0;word-break:break-word">${item.title}</span>
          <div class="flex-1">
            <span class="text-sm text-brand-dark/70" style="line-height:1.6">${resolveVars(item.content)}</span>
            ${linkHtml}
          </div>
        </div>
      </div>`;
}

function renderPublicInfoHtml(data: PublicInfoData, sectionId = 'informacja-publiczna'): string {
  const sectionsHtml = data.sections
    .map(
      (section) => `<div class="mb-10 last:mb-0 scroll-mt-[40vh]" id="${section.id || ''}">
        <h2 class="font-heading font-bold pb-3 text-brand-dark/70 border-b border-brand-dark/10" style="font-weight:500;font-size:clamp(1.1rem,2vw,1.25rem)">${section.heading}</h2>
        <div class="grid gap-3">
          ${section.items.map(renderItem).join('')}
        </div>
      </div>`,
    )
    .join('');

  return `<section id="${sectionId}" class="ui-section ui-bg-page relative overflow-hidden">
    <div class="absolute top-0 right-0 h-96 w-96 max-w-full pointer-events-none" style="background:radial-gradient(ellipse 60% 60% at 100% 0%, color-mix(in oklab, var(--color-brand-primary) 8%, transparent) 0%, transparent 60%)"></div>
    <div class="ui-container">
      <div class="mx-auto max-w-3xl">
        <h1 class="font-heading font-bold ui-type-section-title mb-4 text-brand-dark">${data.title}</h1>
        <p class="leading-relaxed ui-type-body mb-14 max-w-2xl text-brand-dark/50" style="line-height:1.7">${data.description}</p>
        ${sectionsHtml}
      </div>
    </div>
  </section>`;
}

describe('PublicInfoBlock, kontrakt renderowania', () => {
  const plData = publicInfoData.pl as PublicInfoData;

  it('renderuje <section> z ui-section, ui-bg-page i id', () => {
    const $ = cheerio.load(renderPublicInfoHtml(plData));
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').hasClass('ui-bg-page')).toBe(true);
    expect($('section').hasClass('overflow-hidden')).toBe(true);
    expect($('section').attr('id')).toBe('informacja-publiczna');
  });

  it('zawiera gradient orb w prawym rogu (pointer-events-none)', () => {
    const $ = cheerio.load(renderPublicInfoHtml(plData));
    const orb = $('div.absolute.top-0.right-0');
    expect(orb.length).toBe(1);
    expect(orb.hasClass('pointer-events-none')).toBe(true);
    expect(orb.attr('style')).toContain('radial-gradient');
    expect(orb.attr('style')).toContain('var(--color-brand-primary)');
  });

  it('zawiera .ui-container i wąską kolumnę max-w-3xl', () => {
    const $ = cheerio.load(renderPublicInfoHtml(plData));
    expect($('.ui-container').length).toBe(1);
    expect($('.max-w-3xl').length).toBe(1);
  });

  it('renderuje h1 z tytułem z JSON i klasą ui-type-section-title', () => {
    const $ = cheerio.load(renderPublicInfoHtml(plData));
    expect($('h1').length).toBe(1);
    expect($('h1').hasClass('ui-type-section-title')).toBe(true);
    expect($('h1').text()).toContain('Informacja publiczna');
  });

  it('renderuje opis w <p> z tokenem text-brand-dark/50', () => {
    const $ = cheerio.load(renderPublicInfoHtml(plData));
    const paragraph = $('p').first();
    expect(paragraph.length).toBe(1);
    expect(paragraph.hasClass('text-brand-dark/50')).toBe(true);
    expect(paragraph.text()).toContain('Informacje publiczne');
  });

  describe('sekcje', () => {
    it('każda sekcja ma h2 z border-bottom (border-brand-dark/10)', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      const headings = $('h2');
      expect(headings.length).toBe(plData.sections.length);
      headings.each((_, el) => {
        expect($(el).hasClass('border-b')).toBe(true);
        expect($(el).hasClass('border-brand-dark/10')).toBe(true);
      });
    });

    it('sekcje mają id z JSON (dane-podmiotu, dane-kontaktowe, oplaty)', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      expect($('#dane-podmiotu').length).toBe(1);
      expect($('#dane-kontaktowe').length).toBe(1);
      expect($('#oplaty').length).toBe(1);
    });

    it('karty mają rounded-xl i tło color-mix z brand-dark 3%', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      const cards = $('.rounded-xl');
      expect(cards.length).toBeGreaterThanOrEqual(7);
      cards.each((_, el) => {
        expect($(el).attr('style')).toContain('color-mix(in oklab, var(--color-brand-dark) 3%, transparent)');
      });
    });

    it('etykiety itemów są uppercase z trackingiem', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      const firstLabel = $('.uppercase.tracking-wider').first();
      expect(firstLabel.length).toBe(1);
      expect(firstLabel.text()).toBe('Nazwa');
    });
  });

  describe('layout row', () => {
    it('wiersz ma sm:flex-row i wąską etykietę 8rem', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      const row = $('.sm\\:flex-row').first();
      expect(row.length).toBe(1);
      expect(row.find('[style*="width:8rem"]').length).toBe(1);
    });

    it('wiersz ma treść w div.flex-1 po prawej', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      const row = $('.sm\\:flex-row').first();
      expect(row.find('.flex-1').length).toBe(1);
    });
  });

  describe('layout stack', () => {
    it('stack ma flex-col bez sm:flex-row i white-space:pre-line', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      const stack = $('#oplaty .flex-col').first();
      expect(stack.length).toBe(1);
      expect(stack.hasClass('sm:flex-row')).toBe(false);
      expect(stack.find('[style*="white-space:pre-line"]').length).toBe(1);
    });

    it('stack zachowuje podziały linii z \n w treści', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      const stackContent = $('#oplaty [style*="white-space:pre-line"]').first();
      expect(stackContent.text()).toContain('\n');
    });

    it('sekcja "Opłaty" używa layout stack', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      const feesSection = $('#oplaty');
      expect(feesSection.find('[style*="white-space:pre-line"]').length).toBe(2);
    });
  });

  describe('resolveVars', () => {
    it('zamienia {{COMPANY_EMAIL}} w treści na company.email', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      expect($('body').text()).toContain(company.email);
    });

    it('link mailto ma resolved email z company.json', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      const mailtoLinks = $('a[href^="mailto:"]');
      expect(mailtoLinks.length).toBeGreaterThanOrEqual(2);
      mailtoLinks.each((_, el) => {
        expect($(el).attr('href')).toBe(`mailto:${company.email}`);
      });
    });

    it('link tel ma resolved telefon z company.json', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      const telLinks = $('a[href^="tel:"]');
      expect(telLinks.length).toBe(1);
      expect(telLinks.first().attr('href')).toBe(`tel:${company.phone}`);
    });

    it('linki mają czytelne etykiety i akcentowy kolor brand-primary', () => {
      const $ = cheerio.load(renderPublicInfoHtml(plData));
      const firstLink = $('a[href^="mailto:"]').first();
      expect(firstLink.text()).toContain('Wyślij wiadomość');
      expect(firstLink.hasClass('text-brand-primary')).toBe(true);
    });

    it('HTML nie zawiera surowych znaczników {{COMPANY_*}}', () => {
      const html = renderPublicInfoHtml(plData);
      expect(html).not.toContain('{{COMPANY_EMAIL}}');
      expect(html).not.toContain('{{COMPANY_PHONE}}');
    });
  });

  describe('dane JSON', () => {
    it('JSON zawiera sekcje pl i en', () => {
      expect(publicInfoData.pl).toBeDefined();
      expect(publicInfoData.en).toBeDefined();
      expect(publicInfoData.pl.sections.length).toBeGreaterThanOrEqual(3);
      expect(publicInfoData.en.sections.length).toBeGreaterThanOrEqual(3);
    });

    it('JSON nie zawiera danych klienta (Juszczak, NIP 5322033576, Ożarów)', () => {
      const json = JSON.stringify(publicInfoData);
      expect(json).not.toContain('Juszczak');
      expect(json).not.toContain('5322033576');
      expect(json).not.toContain('Ożarów');
    });
  });
});
