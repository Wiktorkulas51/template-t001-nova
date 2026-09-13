import type { SectionEntry } from './types';

export const contactSections: Record<string, SectionEntry> = {
  contactTrainer: {
    id: 'contactTrainer', label: 'Kontakt, formularz', groupId: 'contact', hint: 'Formularz kontaktowy z neutralnym stanem demonstracyjnym', source: 'kasia',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5v10a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default', variants: { default: { component: 'KasiaContactBlock', dataKey: 'kasia-contact' } },
  },
  locationsTrainer: {
    id: 'locationsTrainer', label: 'Lokalizacje, karty', groupId: 'contact', hint: 'Dwie neutralne karty lokalizacji z linkiem do mapy', source: 'kasia',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 21s7-5.1 7-11a7 7 0 10-14 0c0 5.9 7 11 7 11z" stroke-width="2"/><circle cx="12" cy="10" r="2" stroke-width="2"/></svg>',
    defaultVariant: 'default', variants: { default: { component: 'KasiaLocationsBlock', dataKey: 'kasia-locations' } },
  },
  contact: {
    id: 'contact', label: 'Kontakt', groupId: 'contact', hint: 'Formularz kontaktowy z danymi i mapa',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: {
      default: { component: 'ContactSplitBlock', props: { variant: 'default' }, dataKey: 'contact' },
      split: { component: 'ContactSplitBlock', props: { variant: 'split' }, dataKey: 'contact' },
      map: { component: 'ContactSplitBlock', props: { variant: 'map' }, dataKey: 'contact' },
      simple: { component: 'ContactSplitBlock', props: { variant: 'simple' }, dataKey: 'contact' },
    },
  },
  contactStudio: {
    id: 'contactStudio', label: 'Kontakt studio (split)', groupId: 'contact', hint: 'Split dane+formularz ze spektrum w tle (biblioteka heinrich)',
    source: 'heinrich',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ContactStudioBlock', dataKey: 'contact-studio' } },
  },
  contactEditorial: {
    id: 'contactEditorial', label: 'Kontakt editorialny', groupId: 'contact', hint: 'Ponumerowane wiersze + formularz w karcie (biblioteka tom-ros)',
    source: 'tom-ros',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ContactEditorialBlock', dataKey: 'contact-editorial' } },
  },
  onlineAdvice: {
    id: 'onlineAdvice', label: 'Porady online', groupId: 'contact', hint: 'Kroki obsługi zdalnej + formularz w karcie (biblioteka tymoteusz)',
    source: 'tymoteusz',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'OnlineAdviceBlock', dataKey: 'online-advice' } },
  },
  contactPremium: {
    id: 'contactPremium', label: 'Kontakt (mailto + FAQ)', groupId: 'contact', hint: 'Karta kontaktu mailto z FAQ accordion i GradientOrb (biblioteka promix)',
    source: 'promix',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ContactPremiumBlock', dataKey: 'contact-premium' } },
  },
  contactInfoForm: {
    id: 'contactInfoForm', label: 'Kontakt (boxy + formularz)', groupId: 'contact', hint: 'Boxy kontaktowe (tel/email/adres) + formularz z JS submit (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ContactInfoFormBlock', dataKey: 'contact-info-form' } },
  },
  contactWireframe: {
    id: 'contactWireframe', label: 'Kontakt (formularz + mapa)', groupId: 'contact', hint: 'Formularz kontaktowy, dane i mapa Google (biblioteka stalanowski)',
    source: 'stalanowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ContactWireframeBlock', dataKey: 'contact-wireframe' } },
  },
};
