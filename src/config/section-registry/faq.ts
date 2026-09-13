import type { SectionEntry } from './types';

export const faqSections: Record<string, SectionEntry> = {
  faq: {
    id: 'faq', label: 'FAQ', groupId: 'faq', hint: 'Pytania i odpowiedzi',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'simple',
    variants: {
      simple: { component: 'FaqSimpleBlock', dataKey: 'faq' },
      grid: { component: 'FaqGridBlock', dataKey: 'faq' },
      list: { component: 'FaqListBlock', dataKey: 'faq' },
      grouped: { component: 'FaqGroupedBlock', dataKey: 'faq' },
    },
  },
  faqAccordion: {
    id: 'faqAccordion', label: 'FAQ (accordion)', groupId: 'faq', hint: 'Accordion z pierwszym pytaniem otwartym i nagłówkiem section-heading-lg (biblioteka marek-jodlowski)',
    source: 'marek-jodlowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'FaqAccordionBlock', dataKey: 'faq-accordion' } },
  },
  faqLean: {
    id: 'faqLean', label: 'FAQ (plus rotate)', groupId: 'faq', hint: 'Accordion z plusem obracanym o 45° (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'FaqLeanBlock', dataKey: 'faq-lean' } },
  },
  faqFlat: {
    id: 'faqFlat', label: 'FAQ (płaski)', groupId: 'faq', hint: 'Płaski FAQ bez accordionu (biblioteka stalanowski)',
    source: 'stalanowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'FaqFlatBlock', dataKey: 'faq-flat' } },
  },
  faqUp: {
    id: 'faqUp', label: 'FAQ (ścięte rogi + lime)', groupId: 'faq', hint: 'Accordion z clip-path, ikoną help i CTA pod spodem (reimplementacja aleksandra-klisik)',
    source: 'klisik',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.5M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'FaqUpBlock', dataKey: 'faq-up' } },
  },
  faq3: {
    id: 'faq3', label: 'FAQ (FAQ3)', groupId: 'faq', hint: 'Nowoczesny accordion z czterema pytaniami i obrotem ikony plusa',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'Faq3Block', dataKey: 'faq3' } },
  },
};
