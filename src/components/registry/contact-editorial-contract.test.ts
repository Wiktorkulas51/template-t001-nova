// Test kontraktowy bloku ContactEditorialBlock, wzorowany na
// contact-studio-contract.test.ts i hero-cinematic-contract.test.ts.
// Checks the structure of editorial rows (numbering 01/02/03), glow, panel
// formularza z czerwonym paskiem oraz atrybuty wymagane przez form-handler.js.
import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import contactData from '@data/sections/contact-editorial.json';

interface ContactRow {
  num: string;
  label: string;
  value: string;
  href: string;
}

interface EditorialContactData {
  title: string;
  description: string;
  rows: ContactRow[];
  socials: { key: string; href: string; label: string }[];
  formId: string;
  fieldIdPrefix: string;
  fields: { name: string; label: string; type: string; options?: { value: string; label: string }[] }[];
  submitLabel: string;
}

function renderContactEditorialHtml(data: EditorialContactData): string {
  const rowsHtml = data.rows
    .map(
      (row) => `<a href="${row.href}" class="group flex items-center gap-5 border-b border-brand-dark/15 py-5 transition-colors duration-300 hover:border-brand-primary/40">
        <span aria-hidden="true" class="w-10 shrink-0 font-[Anton] text-2xl font-bold leading-none opacity-60 transition-colors duration-300 group-hover:text-brand-primary">${row.num}</span>
        <span class="min-w-0">
          <span class="block text-xs font-bold uppercase tracking-[0.22em] opacity-60">${row.label}</span>
          <span class="block truncate text-lg font-semibold text-brand-dark transition-colors duration-300 group-hover:text-brand-primary">${row.value}</span>
        </span>
        <i class="ph ph-arrow-up-right ml-auto shrink-0 text-brand-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"></i>
      </a>`).join('');

  const socialHtml = data.socials
    .map(
      (social) => `<a href="${social.href}" target="_blank" rel="noopener noreferrer" class="flex size-10 items-center justify-center rounded-md border border-brand-dark/15 bg-white text-brand-dark/60 transition-all duration-300 hover:border-brand-primary hover:text-brand-primary" aria-label="${social.label}">
        <i class="ph ph-${social.key}-logo text-lg"></i>
      </a>`).join('');

  const gridFields = data.fields.slice(0, 2);
  const restFields = data.fields.slice(2);

  const gridFieldHtml = gridFields
    .map(
      (field) => `<div><label class="ui-type-accent-label ui-form-label" for="${data.fieldIdPrefix}-${field.name}">${field.label}</label>
        <input id="${data.fieldIdPrefix}-${field.name}" name="${field.name}" type="${field.type === 'select' ? 'text' : field.type}" class="ui-form-input" /></div>`,
    )
    .join('');

  const restFieldHtml = restFields
    .map((field) => {
      if (field.type === 'select') {
        const optionsHtml = (field.options || [])
          .map((option) => `<option value="${option.value}">${option.label}</option>`)
          .join('');
        return `<div><label class="ui-type-accent-label ui-form-label" for="${data.fieldIdPrefix}-${field.name}">${field.label}</label>
          <select id="${data.fieldIdPrefix}-${field.name}" name="${field.name}" class="ui-form-input w-full appearance-none pr-10">
            <option value="" disabled selected>${field.label}</option>${optionsHtml}
          </select></div>`;
      }
      return `<div><label class="ui-type-accent-label ui-form-label" for="${data.fieldIdPrefix}-${field.name}">${field.label}</label>
        <textarea id="${data.fieldIdPrefix}-${field.name}" name="${field.name}" rows="5" class="ui-form-textarea"></textarea></div>`;
    })
    .join('');

  return `<section class="ui-section ui-bg-page relative overflow-hidden py-24 sm:py-32">
    <div class="ui-container">
      <div class="relative grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <div class="relative min-w-0">
          <div class="ui-glow ui-glow-contact" aria-hidden="true"></div>
          <div class="relative">
            <h2 class="font-heading font-bold ui-type-section-title font-[Anton] text-[clamp(2rem,5vw,4.5rem)] font-normal uppercase leading-[0.9] tracking-[-0.01em] text-brand-dark">${data.title}</h2>
            <p class="leading-relaxed ui-type-body mt-5 max-w-xl text-sm leading-relaxed text-brand-dark/70">${data.description}</p>
            <div class="mt-10">${rowsHtml}</div>
            <div class="mt-8 flex items-center gap-3">
              <span class="text-xs font-bold uppercase tracking-[0.22em] opacity-60">Znajdź nas</span>
              ${socialHtml}
            </div>
          </div>
        </div>
        <div class="relative min-w-0">
          <div class="ui-contact-form-panel relative overflow-hidden rounded-2xl border border-brand-dark/15 bg-white p-6 sm:p-8">
            <div aria-hidden="true" class="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-brand-primary via-brand-primary/60 to-transparent"></div>
            <div class="ui-contact-form-glow" aria-hidden="true"></div>
            <div class="relative z-[1]">
              <form id="${data.formId}" action="/send-form.php" method="POST" class="space-y-5" data-contact-form data-submit-label="${data.submitLabel}" data-success-message="Dziękujemy!" data-error-message="Błąd">
                <div class="grid gap-5 sm:grid-cols-2" data-form-fields>${gridFieldHtml}</div>
                <div class="space-y-5 mt-5" data-form-fields>${restFieldHtml}</div>
                <button type="submit" class="ui-button ui-button-primary h-12 w-full px-0">${data.submitLabel}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

describe('ContactEditorial — kontrakt renderowania', () => {
  const defaultData: EditorialContactData = {
    title: 'Porozmawiajmy o Twoim projekcie',
    description: 'Opisz krótko swój pomysł lub problem. Odezwiemy się w ciągu 24 godzin roboczych.',
    rows: [
      { num: '01', label: 'Telefon', value: '+48 600 000 000', href: 'tel:+48600000000' },
      { num: '02', label: 'E-mail', value: 'kontakt@example.com', href: 'mailto:kontakt@example.com' },
      { num: '03', label: 'Lokalizacja', value: 'ul. Przykładowa 1, 00-001 Warszawa', href: 'https://www.google.com/maps?q=ul.%20Przyk%C5%82adowa%201%2C%2000-001%20Warszawa' },
    ],
    socials: [
      { key: 'instagram', href: 'https://instagram.com/example', label: 'Instagram' },
      { key: 'facebook', href: 'https://facebook.com/example', label: 'Facebook' },
    ],
    formId: 'contact-editorial-form',
    fieldIdPrefix: 'ce',
    fields: [
      { name: 'name', label: 'Imię i nazwisko', type: 'text' },
      { name: 'email', label: 'E-mail', type: 'email' },
      {
        name: 'subject',
        label: 'Temat wiadomości',
        type: 'select',
        options: [
          { value: 'wycena', label: 'Wycena projektu' },
          { value: 'wspolpraca', label: 'Długoterminowa współpraca' },
          { value: 'inne', label: 'Inne' },
        ],
      },
      { name: 'message', label: 'Wiadomość', type: 'textarea' },
    ],
    submitLabel: 'Wyślij wiadomość',
  };

  it('renderuje <section> z ui-section i jasnym tłem (ui-bg-page)', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').hasClass('ui-bg-page')).toBe(true);
  });

  it('zawiera .ui-container i h2 z tytułem', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    expect($('.ui-container').length).toBe(1);
    expect($('h2').length).toBe(1);
    expect($('h2').text()).toContain('Porozmawiajmy o Twoim projekcie');
  });

  it('h2 ma typografię editorialną: font-[Anton], uppercase, clamp', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    const h2 = $('h2');
    expect(h2.hasClass('font-[Anton]')).toBe(true);
    expect(h2.hasClass('uppercase')).toBe(true);
    expect(h2.hasClass('text-[clamp(2rem,5vw,4.5rem)]')).toBe(true);
    expect(h2.hasClass('leading-[0.9]')).toBe(true);
  });

  it('grid split ma 2 kolumny na lg (lg:grid-cols-2) i items-start', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    const grid = $('.lg\\:grid-cols-2');
    expect(grid.length).toBe(1);
    expect(grid.hasClass('items-start')).toBe(true);
    expect(grid.hasClass('gap-10')).toBe(true);
    expect(grid.hasClass('lg:gap-14')).toBe(true);
  });

  it('lewa kolumna ma glow (ui-glow ui-glow-contact)', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    const glow = $('.ui-glow-contact');
    expect(glow.length).toBe(1);
    expect(glow.hasClass('ui-glow')).toBe(true);
    expect(glow.attr('aria-hidden')).toBe('true');
  });

  it('renderuje 3 ponumerowane wiersze 01/02/03', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    const rows = $('a.group');
    expect(rows.length).toBe(3);
    const numbers = rows.find('span[aria-hidden="true"]');
    expect(numbers.length).toBe(3);
    expect(numbers.eq(0).text()).toBe('01');
    expect(numbers.eq(1).text()).toBe('02');
    expect(numbers.eq(2).text()).toBe('03');
  });

  it('wiersze mają etykiety i wartości z danych', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    expect($('a.group span.text-xs').eq(0).text()).toBe('Telefon');
    expect($('a.group span.text-xs').eq(1).text()).toBe('E-mail');
    expect($('a.group span.text-xs').eq(2).text()).toBe('Lokalizacja');
    expect($('a.group span.truncate').eq(0).text()).toBe('+48 600 000 000');
    expect($('a.group span.truncate').eq(2).text()).toContain('ul. Przykładowa');
  });

  it('hrefy wierszy to tel:, mailto: i Google Maps', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    expect($('a.group').eq(0).attr('href')).toBe('tel:+48600000000');
    expect($('a.group').eq(1).attr('href')).toBe('mailto:kontakt@example.com');
    expect($('a.group').eq(2).attr('href')).toContain('https://www.google.com/maps?q=');
  });

  it('wiersze mają ikonę arrow-up-right ukrytą do hover', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    const arrows = $('.ph.ph-arrow-up-right');
    expect(arrows.length).toBe(3);
    arrows.each((_, el) => {
      expect($(el).hasClass('opacity-0')).toBe(true);
      expect($(el).hasClass('group-hover:opacity-100')).toBe(true);
    });
  });

  it('social media renderują kółka z ikonami instagram-logo i facebook-logo', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    expect($('.ph.ph-instagram-logo').length).toBe(1);
    expect($('.ph.ph-facebook-logo').length).toBe(1);
    const socialLinks = $('a[target="_blank"]');
    expect(socialLinks.eq(0).attr('aria-label')).toBe('Instagram');
    expect(socialLinks.eq(1).attr('aria-label')).toBe('Facebook');
  });

  it('karta formularza ma ui-contact-form-panel z czerwonym paskiem', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    const panel = $('.ui-contact-form-panel');
    expect(panel.length).toBe(1);
    expect(panel.hasClass('rounded-2xl')).toBe(true);
    expect(panel.hasClass('bg-white')).toBe(true);
    const bar = panel.find('.bg-gradient-to-b');
    expect(bar.length).toBe(1);
    expect(bar.hasClass('from-brand-primary')).toBe(true);
    expect(bar.hasClass('via-brand-primary/60')).toBe(true);
    expect(bar.hasClass('to-transparent')).toBe(true);
  });

  it('panel formularza ma glow (ui-contact-form-glow) i treść nad dekoracjami', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    expect($('.ui-contact-form-glow').length).toBe(1);
    const content = $('.z-\\[1\\]');
    expect(content.length).toBe(1);
    expect(content.find('form').length).toBe(1);
  });

  it('formularz ma data-contact-form (kontrakt form-handler.js)', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    const form = $('form[data-contact-form]');
    expect(form.length).toBe(1);
    expect(form.attr('id')).toBe('contact-editorial-form');
    expect(form.attr('action')).toBe('/send-form.php');
    expect(form.attr('method')).toBe('POST');
  });

  it('formularz zawiera pola name, email, select subject i textarea message', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    expect($('input[name="name"]').length).toBe(1);
    expect($('input[name="email"]').length).toBe(1);
    expect($('select[name="subject"]').length).toBe(1);
    expect($('textarea[name="message"]').length).toBe(1);
  });

  it('select subject ma opcje z danych', () => {
    const $ = cheerio.load(renderContactEditorialHtml(defaultData));
    const select = $('select[name="subject"]');
    expect(select.find('option').length).toBe(4);
    expect(select.find('option[value="wycena"]').text()).toBe('Wycena projektu');
  });

  it('JSON dostarcza formId, fieldIdPrefix i 4 pola formularza', () => {
    expect(contactData.formId).toBe('contact-editorial-form');
    expect(contactData.fieldIdPrefix).toBe('ce');
    expect(contactData.formFields.length).toBe(4);
    expect(contactData.formFields.map((field) => field.name)).toEqual(['name', 'email', 'subject', 'message']);
    expect(contactData.rows.labels.phone).toBe('Telefon');
    expect(contactData.socialLabel).toBe('Znajdź nas');
  });
});
