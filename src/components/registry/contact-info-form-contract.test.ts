import { describe, it, expect, beforeAll } from 'vitest';
import * as cheerio from 'cheerio';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ContactInfoFormBlock from '@components/registry/contact/ContactInfoFormBlock.astro';

// Dlaczego: test kontraktowy renderuje PRAWDZIWY komponent Astro przez
// experimental_AstroContainer(renderToString from astro) and checks the structure
// HTML przez cheerio. Wzorzec: services-media-cards-contract.test.ts.
// Reflects a faithful copy of the "CONTACT" section from the lean-creative project
// (index.astro): lewa kolumna z 3 boxami kontaktowymi, prawa z formularzem
// opartym o data-atrybuty (data-form, data-form-submit, data-form-spinner,
// data-form-success) powered by JS submit.

interface BoxOverride {
  label: string;
  value: string;
  href: string;
  icon: string;
}

interface DataOverride {
  pl?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
    boxes?: BoxOverride[];
    form?: {
      nameLabel?: string;
      emailLabel?: string;
      phoneLabel?: string;
      messageLabel?: string;
      submitLabel?: string;
      sendingLabel?: string;
      successTitle?: string;
      successText?: string;
      rodoLinkLabel?: string;
      rodoText?: string;
      rodoHref?: string;
    };
    firstCall?: { heading?: string; text?: string };
  };
}

let container: AstroContainer;

async function renderBlock(props: Record<string, unknown> = {}): Promise<string> {
  return container.renderToString(ContactInfoFormBlock, { props });
}

describe('ContactInfoFormBlock, kontrakt renderowania', () => {
  beforeAll(async () => {
    container = await AstroContainer.create();
  });

  it('renderuje <section> z ui-section, tone page, id i borderem', async () => {
    const $ = cheerio.load(await renderBlock());
    expect($('section').length).toBe(1);
    expect($('section').hasClass('ui-section')).toBe(true);
    expect($('section').hasClass('ui-bg-page')).toBe(true);
    expect($('section').attr('id')).toBe('kontakt');
    expect($('section').hasClass('border-t')).toBe(true);
    expect($('section').hasClass('border-brand-dark/10')).toBe(true);
  });

  it('zawiera .ui-container', async () => {
    const $ = cheerio.load(await renderBlock());
    expect($('.ui-container').length).toBe(1);
  });

  describe('lewa kolumna', () => {
    it('renderuje accent-label (eyebrow), h2 i opis', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('.ui-type-accent-label').text()).toContain('Skontaktuj się');
      expect($('h2').length).toBe(1);
      expect($('h2').text()).toContain('Gotowy na lepszy przepływ');
      expect($('h2').hasClass('ui-type-heading-section-lg')).toBe(true);
    });

    it('renderuje dokładnie 3 boxy kontaktowe z linkami tel:/mailto:/maps', async () => {
      const $ = cheerio.load(await renderBlock());
      const boxes = $('.contact-info-box');
      expect(boxes.length).toBe(3);
      const hrefs = boxes.find('a').map((_, el) => $(el).attr('href')).get();
      expect(hrefs.some((h) => h.startsWith('tel:'))).toBe(true);
      expect(hrefs.some((h) => h.startsWith('mailto:'))).toBe(true);
      expect(hrefs.some((h) => h.startsWith('https://maps.google.com'))).toBe(true);
    });

    it('każdy box ma ikonę Phosphor, etykietę i wartość', async () => {
      const $ = cheerio.load(await renderBlock());
      $('.contact-info-box').each((_, el) => {
        expect($(el).find('i.ph').length).toBe(1);
        expect($(el).find('p').text().length).toBeGreaterThan(0);
        expect($(el).find('a').text().length).toBeGreaterThan(0);
      });
    });

    it('boxy używają globalnych tokenów zamiast klienckich', async () => {
      const $ = cheerio.load(await renderBlock());
      $('.contact-info-box').each((_, el) => {
        expect($(el).hasClass('border-brand-dark/10')).toBe(true);
        expect($(el).hasClass('bg-white')).toBe(true);
      });
    });

    it('renderuje opcjonalną kartę "Jak wygląda pierwsza rozmowa" (firstCall)', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('h3').filter((_, element) => $(element).text().includes('Jak wygląda pierwsza rozmowa')).length).toBe(1);
    });
  });

  describe('formularz', () => {
    it('form ma data-form i wspólny kontrakt kontaktowy', async () => {
      const $ = cheerio.load(await renderBlock());
      const form = $('form[data-form]');
      expect(form.length).toBe(1);
      expect(form.attr('data-contact-form')).toBeDefined();
      expect(form.attr('action')).toBe('/send-form.php');
    });

    it('renderuje pola name, email, phone i textarea message', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('input[name="name"]').length).toBe(1);
      expect($('input[name="email"]').length).toBe(1);
      expect($('input[name="phone"]').length).toBe(1);
      expect($('textarea[name="message"]').length).toBe(1);
    });

    it('pola wymagane (name, email, message) mają atrybut required', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('input[name="name"]').attr('required')).toBeDefined();
      expect($('input[name="email"]').attr('required')).toBeDefined();
      expect($('textarea[name="message"]').attr('required')).toBeDefined();
      expect($('input[name="phone"]').attr('required')).toBeUndefined();
    });

    it('submit button ma data-form-submit, a spinner data-form-spinner (ukryty)', async () => {
      const $ = cheerio.load(await renderBlock());
      const submit = $('button[data-form-submit]');
      expect(submit.length).toBe(1);
      expect(submit.text()).toContain('Wyślij wiadomość');
      const spinner = $('[data-form-spinner]');
      expect(spinner.length).toBe(1);
      expect(spinner.hasClass('hidden')).toBe(true);
      expect(spinner.find('svg.animate-spin').length).toBe(1);
    });

    it('success div ma data-form-success, jest ukryty i ma role status', async () => {
      const $ = cheerio.load(await renderBlock());
      const success = $('[data-form-success]');
      expect(success.length).toBe(1);
      expect(success.hasClass('hidden')).toBe(true);
      expect(success.find('[role="status"]').length).toBe(1);
      expect(success.text()).toContain('Wiadomość wysłana!');
    });

    it('renderuje wspólne stany loading i error', async () => {
      const $ = cheerio.load(await renderBlock());
      expect($('[data-form-feedback="loading"]').length).toBe(1);
      expect($('[data-form-feedback="error"]').length).toBe(1);
      expect($('form').attr('data-form-msg-success')).toContain('Dziękujemy');
    });

    it('notka RODO zawiera link do polityki prywatności z trailing slash', async () => {
      const $ = cheerio.load(await renderBlock());
      const rodoLink = $('form a[href="/polityka-prywatnosci/"]');
      expect(rodoLink.length).toBe(1);
      expect(rodoLink.text()).toContain('polityką prywatności');
      expect(rodoLink.hasClass('underline')).toBe(true);
    });

    it('inputy używają klienckich klas z podmienionymi tokenami', async () => {
      const $ = cheerio.load(await renderBlock());
      const input = $('input[name="email"]');
      expect(input.hasClass('placeholder:text-brand-dark/40')).toBe(true);
      expect(input.hasClass('focus:ring-brand-primary/10')).toBe(true);
      expect(input.hasClass('bg-white')).toBe(true);
    });
  });

  describe('i18n (pl/en)', () => {
    it('EN renderuje angielskie teksty, boxy i formularz', async () => {
      const $ = cheerio.load(await renderBlock({ locale: 'en' }));
      expect($('h2').text()).toContain('Ready for better workflows');
      expect($('.ui-type-accent-label').text()).toContain('Get in touch');
      expect($('.contact-info-box').length).toBe(3);
      expect($('.contact-info-box').first().find('a').text()).toContain('+48 123 456 789');
      expect($('button[data-form-submit]').text()).toContain('Send message');
      expect($('input[name="email"]').attr('placeholder')).toContain('john@company.com');
    });
  });

  describe('props data nadpisują JSON (wzorzec "props || json")', () => {
    it('nadpisany nagłówek i formularz trafiają do HTML', async () => {
      const overrides: DataOverride = {
        pl: {
          eyebrow: 'Testowy eyebrow',
          heading: 'Testowy nagłówek',
          boxes: [
            { label: 'Telefon', value: '+48 111 222 333', href: 'tel:+48111222333', icon: 'phone' },
          ],
          form: {
            nameLabel: 'Imię',
            submitLabel: 'Wyślij teraz',
            rodoLinkLabel: 'polityką prywatności',
            rodoText: 'Akceptuję politykę prywatności.',
            rodoHref: '/polityka-prywatnosci/',
          },
        },
      };
      const $ = cheerio.load(await renderBlock({ data: overrides }));
      expect($('h2').text()).toContain('Testowy nagłówek');
      expect($('.ui-type-accent-label').text()).toContain('Testowy eyebrow');
      expect($('.contact-info-box').length).toBe(1);
      expect($('button[data-form-submit]').text()).toContain('Wyślij teraz');
      expect($('form a[href="/polityka-prywatnosci/"]').length).toBe(1);
    });
  });

  it('nie zawiera danych klienta (Lean Creative)', async () => {
    const html = await renderBlock();
    expect(html).not.toContain('Lean Creative');
    expect(html).not.toContain('501 644 200');
    expect(html).not.toContain('p.kowalczyk');
    expect(html).not.toContain('leancreative');
    expect(html).not.toContain('ul. Bacha');
    expect(html).not.toContain('Tychy');
    expect(html).not.toContain('cta-ornament');
  });

  it('nie zawiera systemu data-reveal ani klienckich tokenów CSS', async () => {
    const html = await renderBlock();
    expect(html).not.toContain('data-reveal');
    expect(html).not.toContain('border-outline');
    expect(html).not.toContain('bg-brand-cream');
    expect(html).not.toContain('text-on-surface-variant');
    expect(html).not.toContain('btn-slide-accent');
  });
});
