import type { SectionEntry } from './types';

export const ctaSections: Record<string, SectionEntry> = {
  cta: {
    id: 'cta', label: 'CTA z obrazem', groupId: 'cta', hint: 'CTA z pełnym obrazem w tle, maską i akcentem tytułu',
    source: 'modern-house',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ModernHouseCtaBlock', dataKey: 'modern-house-cta' } },
  },
  ctaSpectrum: {
    id: 'ctaSpectrum', label: 'CTA z equalizerem', groupId: 'cta', hint: 'Wezwanie do działania ze spektrum pasków w tle (biblioteka heinrich)',
    source: 'heinrich',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 14v-4M7 16v-8M11 18v-12M15 16v-8M19 14v-4M23 12" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'CtaSpectrumBlock', dataKey: 'cta-spectrum' } },
  },
  ctaTomRos: {
    id: 'ctaTomRos', label: 'CTA ze zdjęciem', groupId: 'cta', hint: 'Wezwanie z pełnoekranowym zdjęciem i poświatą (biblioteka tom-ros)',
    source: 'tom-ros',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'CtaTomRosBlock', dataKey: 'cta-tomros' } },
  },
  ctaContactForm: {
    id: 'ctaContactForm', label: 'CTA z formularzem', groupId: 'cta', hint: 'Nagłówek, boxy kontaktowe i formularz w karcie (biblioteka tymoteusz)',
    source: 'tymoteusz',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'CtaContactFormBlock', dataKey: 'cta-contact-form' } },
  },
  ctaLean: {
    id: 'ctaLean', label: 'CTA (prosty centered)', groupId: 'cta', hint: 'Prosty CTA z wariantem LinkedIn (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'CtaLeanBlock', dataKey: 'cta-lean' } },
  },
  ctaBridge: {
    id: 'ctaBridge', label: 'CTA pomostowe ze zdjęciem', groupId: 'cta', hint: 'Kompaktowa karta CTA wysunięta nad footerem',
    source: 'annawie',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 7h16M4 17h16M7 7v10m10-10v10M4 7l3-3 3 3m4 0l3-3 3 3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'CtaBridgeBlock', dataKey: 'cta-bridge' } },
  },
  novaCta: {
    id: 'novaCta', label: 'Końcowe wezwanie do działania', groupId: 'cta', hint: 'Autorska sekcja końcowego CTA dla templateu Nova',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'CtaBlock', dataKey: 'nova-cta' } },
  },
  calculator: {
    id: 'calculator', label: 'Kalkulator', groupId: 'cta', hint: 'Interaktywny kalkulator wyceny',
    source: 'annawie',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3v-6m-3 6v-2m0-8h.01M12 7h.01M15 7h.01M12 10h.01M15 10h.01M12 13h.01M15 13h.01M9 10h.01M9 13h.01M9 16h6" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'CalculatorBlock', dataKey: 'calculator' } },
  },
  calculatorWireframe: {
    id: 'calculatorWireframe', label: 'Kalkulator (formularz krokowy)', groupId: 'cta', hint: 'Kalkulator wyceny z krokami i podsumowaniem (biblioteka stalanowski)',
    source: 'stalanowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'CalculatorWireframeBlock', dataKey: 'calculator-wireframe' } },
  },
  ctaUp: {
    id: 'ctaUp', label: 'CTA banner (lime + zdjęcie)', groupId: 'cta', hint: 'Banner lime z wordmarkiem, kropkami i zdjęciem osoby (reimplementacja aleksandra-klisik)',
    source: 'klisik',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'CtaUpBlock', dataKey: 'cta-up' } },
  },
};
