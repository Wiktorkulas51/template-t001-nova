// Test kontraktowy bloku ContactStudioBlock, wzorowany na contact-contract.test.ts
// and hero-contract.test.ts. Checks the split structure (info + form), icons
// Phosphor, spectrum bars and attributes required by form-handler.js.
import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import contactData from '@data/sections/contact-studio.json';

interface InfoItem {
  type: string;
  label: string;
  value: string;
  href?: string;
}

interface ContactStudioData {
  heading: string;
  infoItems: InfoItem[];
  socials: { platform: string; href: string }[];
  bars: number;
  fields: { name: string; label: string; type: string; options?: { value: string; label: string }[] }[];
}

function renderContactStudioHtml(data: ContactStudioData): string {
  const barHtml = Array.from({ length: data.bars }, (_, index) =>
    `<div class="ui-spectrum-bar flex-1" style="height: ${30 + (index % 50)}%; animation: ui-spectrum-pulse ${1.0 + (index % 5) * 0.3}s ease-in-out infinite; animation-delay: ${index * 0.03}s;"></div>`).join('');

  const infoHtml = data.infoItems
    .map((item) => {
      const icons: Record<string, string> = { address: 'map-pin', email: 'envelope', hours: 'clock' };
      const valueHtml = item.href
        ? `<a href="${item.href}" class="ui-inline-link inline-flex items-center gap-1.5 whitespace-nowrap text-neutral-700 transition-colors hover:text-neutral-900">${item.value}</a>`
        : `<span class="inline-flex items-center text-neutral-700">${item.value}</span>`;
      return `<div class="flex items-center gap-2 text-sm leading-none text-neutral-500">
        <span class="flex items-center text-neutral-300"><i class="ph ph-${icons[item.type] || 'map-pin'}" style="font-size: 16px"></i></span>
        <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">${item.label}:</span>
        ${valueHtml}
      </div>`;
    })
    .join('');

  const socialHtml = data.socials
    .map(
      (social) => `<a href="${social.href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 rounded-sm border border-neutral-200 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 transition-all duration-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white">
        <i class="ph ph-${social.platform}-logo" style="font-size: 13px" class="opacity-60"></i>${social.platform}
      </a>`).join('');

  const gridFields = data.fields.slice(0, 2);
  const restFields = data.fields.slice(2);

  const gridFieldHtml = gridFields
    .map(
      (field) => `<div><label class="ui-type-accent-label ui-form-label" for="cs-${field.name}">${field.label}</label>
        <input id="cs-${field.name}" name="${field.name}" type="${field.type === 'select' ? 'text' : field.type}" class="ui-form-input" /></div>`,
    )
    .join('');

  const restFieldHtml = restFields
    .map((field) => {
      if (field.type === 'select') {
        const optionsHtml = (field.options || [])
          .map((option) => `<option value="${option.value}">${option.label}</option>`)
          .join('');
        return `<div><label class="ui-type-accent-label ui-form-label" for="cs-${field.name}">${field.label}</label>
          <select id="cs-${field.name}" name="${field.name}" class="ui-form-input w-full appearance-none pr-10">
            <option value="" disabled selected>${field.label}</option>${optionsHtml}
          </select></div>`;
      }
      return `<div><label class="ui-type-accent-label ui-form-label" for="cs-${field.name}">${field.label}</label>
        <textarea id="cs-${field.name}" name="${field.name}" rows="5" class="ui-form-textarea"></textarea></div>`;
    })
    .join('');

  return `
    <section class="ui-section relative bg-neutral-50 py-28 sm:py-40 overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none" aria-hidden="true">
        <div class="hidden w-full items-center justify-center gap-[2px] px-4 sm:flex" style="height: 40%;">${barHtml}</div>
      </div>
      <div class="ui-container relative">
        <div class="mx-auto max-w-lg text-center"><h2 class="ui-type-section-title mt-4">${data.heading}</h2></div>
        <div class="mt-16 grid gap-0 overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm lg:grid-cols-12">
          <div class="p-8 sm:p-10 lg:col-span-5 lg:border-r lg:border-neutral-200">
            <div class="flex h-full flex-col justify-center">
              <div class="space-y-6">${infoHtml}</div>
              <div class="mt-6 border-t border-neutral-100 pt-6">
                <p class="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Social media</p>
                <div class="flex flex-wrap gap-2">${socialHtml}</div>
              </div>
            </div>
          </div>
          <div class="p-10 sm:p-12 lg:col-span-7">
            <form id="contact-studio-form" action="/send-form.php" method="POST" class="space-y-5" data-contact-form data-submit-label="Wyślij" data-success-message="Dziękujemy!" data-error-message="Błąd">
              <div class="grid gap-5 sm:grid-cols-2" data-form-fields>${gridFieldHtml}</div>
              <div class="space-y-5 mt-5" data-form-fields>${restFieldHtml}</div>
              <button type="submit" class="ui-button ui-button-primary h-12 w-full px-0">Wyślij wiadomość</button>
            </form>
          </div>
        </div>
      </div>
    </section>`;
}

describe('ContactStudio — kontrakt renderowania', () => {
  const defaultData: ContactStudioData = {
    heading: 'Kontakt',
    infoItems: [
      { type: 'address', label: 'Adres', value: 'ul. Przykładowa 1, 00-001 Warszawa', href: 'https://www.google.com/maps?q=52.2297,21.0122' },
      { type: 'email', label: 'E-mail', value: 'kontakt@example.com', href: 'mailto:kontakt@example.com' },
      { type: 'hours', label: 'Godziny pracy', value: 'Pon-Pt 9:00 - 17:00' },
    ],
    socials: [
      { platform: 'facebook', href: 'https://facebook.com/example' },
      { platform: 'instagram', href: 'https://instagram.com/example' },
      { platform: 'youtube', href: 'https://youtube.com/@example' },
    ],
    bars: 20,
    fields: [
      { name: 'name', label: 'Imię i nazwisko', type: 'text' },
      { name: 'email', label: 'E-mail', type: 'email' },
      {
        name: 'project',
        label: 'Rodzaj projektu',
        type: 'select',
        options: [
          { value: 'strona', label: 'Strona internetowa' },
          { value: 'sklep', label: 'Sklep internetowy' },
          { value: 'inne', label: 'Inne' },
        ],
      },
      { name: 'message', label: 'Wiadomość', type: 'textarea' },
    ],
  };

  it('renderuje <section> z ui-section i jasnym tłem', () => {
    const $ = cheerio.load(renderContactStudioHtml(defaultData));
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').hasClass('bg-neutral-50')).toBe(true);
  });

  it('zawiera .ui-container i h2 z tytułem', () => {
    const $ = cheerio.load(renderContactStudioHtml(defaultData));
    expect($('.ui-container').length).toBe(1);
    expect($('h2').text()).toContain('Kontakt');
  });

  it('renderuje słupki spectrum z animacją ui-spectrum-pulse', () => {
    const $ = cheerio.load(renderContactStudioHtml(defaultData));
    const bars = $('.ui-spectrum-bar');
    expect(bars.length).toBe(20);
    bars.each((_, el) => {
      expect($(el).attr('style')).toContain('ui-spectrum-pulse');
    });
  });

  it('karta split ma grid 12 kolumn z polami 5 i 7', () => {
    const $ = cheerio.load(renderContactStudioHtml(defaultData));
    const card = $('.lg\\:grid-cols-12');
    expect(card.length).toBe(1);
    expect(card.find('.lg\\:col-span-5').length).toBe(1);
    expect(card.find('.lg\\:col-span-7').length).toBe(1);
  });

  it('infoItems renderują ikony Phosphor map-pin, envelope i clock', () => {
    const $ = cheerio.load(renderContactStudioHtml(defaultData));
    expect($('.ph.ph-map-pin').length).toBe(1);
    expect($('.ph.ph-envelope').length).toBe(1);
    expect($('.ph.ph-clock').length).toBe(1);
    expect($('.ui-inline-link').length).toBe(2);
  });

  it('social media używają ikon facebook-logo, instagram-logo i youtube-logo', () => {
    const $ = cheerio.load(renderContactStudioHtml(defaultData));
    expect($('.ph.ph-facebook-logo').length).toBe(1);
    expect($('.ph.ph-instagram-logo').length).toBe(1);
    expect($('.ph.ph-youtube-logo').length).toBe(1);
  });

  it('formularz ma data-contact-form (kontrakt form-handler.js)', () => {
    const $ = cheerio.load(renderContactStudioHtml(defaultData));
    const form = $('form[data-contact-form]');
    expect(form.length).toBe(1);
    expect(form.attr('action')).toBe('/send-form.php');
    expect(form.attr('method')).toBe('POST');
  });

  it('formularz zawiera pola name, email, select project i textarea message', () => {
    const $ = cheerio.load(renderContactStudioHtml(defaultData));
    expect($('input[name="name"]').length).toBe(1);
    expect($('input[name="email"]').length).toBe(1);
    expect($('select[name="project"]').length).toBe(1);
    expect($('textarea[name="message"]').length).toBe(1);
  });

  it('select project ma opcje z JSON', () => {
    const $ = cheerio.load(renderContactStudioHtml(defaultData));
    const select = $('select[name="project"]');
    expect(select.find('option').length).toBe(4);
    expect(select.find('option[value="strona"]').text()).toBe('Strona internetowa');
  });

  it('JSON dostarcza unikalny formId i pola z formFields', () => {
    expect(contactData.formId).toBe('contact-studio-form');
    expect(contactData.formFields.length).toBe(4);
    expect(contactData.formFields.map((field) => field.name)).toEqual(['name', 'email', 'project', 'message']);
  });
});
