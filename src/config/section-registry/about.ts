import type { SectionEntry } from './types';

export const aboutSections: Record<string, SectionEntry> = {
  about: {
    id: 'about', label: 'O nas', groupId: 'about', hint: 'Sekcja o firmie: USP (statystyki + benefity) jako domyślna',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: {
      default: { component: 'UspPremiumBlock', dataKey: 'usp-premium' },
      classic: { component: 'AboutBlock', dataKey: 'about' },
    },
  },
  marquee: {
    id: 'marquee', label: 'Marki i logotypy', groupId: 'trust', hint: 'Karuzela logotypów partnerów',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: {
      default: { component: 'MarqueeBlock', dataKey: 'marquee' },
    },
  },
  appManagement: {
    id: 'appManagement', label: 'Split odwrócony', groupId: 'about', hint: 'Odwrócona sekcja split z obrazem i CTA',
    source: 'modern-house',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm3 15h4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ModernHouseSplitBlock', dataKey: 'app-management' } },
  },
  trustBar: {
    id: 'trustBar', label: 'Pasek zaufania', groupId: 'trust', hint: 'Liczniki zaufania + logotypy partnerów',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: {
      default: { component: 'TrustBarBlock', dataKey: 'trust-bar' },
    },
  },
  aboutMarquee: {
    id: 'aboutMarquee', label: 'O nas z marquee', groupId: 'about', hint: 'Split tekst+zdjęcie z 3 przewijanymi pasami klientów (biblioteka heinrich)',
    source: 'heinrich',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'AboutMarqueeSplitBlock', dataKey: 'about-marquee' } },
  },
  aboutTomRos: {
    id: 'aboutTomRos', label: 'O nas sport (wideo)', groupId: 'about', hint: 'Split z wideo, statystykami i panelami (biblioteka tom-ros)',
    source: 'tom-ros',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'AboutTomRosBlock', dataKey: 'about-tomros' } },
  },
  aboutLaw: {
    id: 'aboutLaw', label: 'O kancelarii (bio + creds)', groupId: 'about', hint: 'Biografia z akapitami + zdjęcie i karta wiarygodności (biblioteka tymoteusz)',
    source: 'tymoteusz',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'AboutLawBlock', dataKey: 'about-law' } },
  },
  aboutSplit: {
    id: 'aboutSplit', label: 'O nas (kształty zdjęć)', groupId: 'about', hint: 'Split z 5 kształtami obrazu (rounded, mosaic, split, arch, collage) i cytatem (biblioteka marek-jodlowski)',
    source: 'marek-jodlowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'AboutSplitBlock', dataKey: 'about-split' } },
  },
  uspPremium: {
    id: 'uspPremium', label: 'USP (statystyki + benefity)', groupId: 'about', hint: 'Pasek statystyk i karty benefitów (biblioteka promix)',
    source: 'promix',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'UspPremiumBlock', dataKey: 'usp-premium' } },
  },
  aboutExpert: {
    id: 'aboutExpert', label: 'Ekspert (portret + tagi)', groupId: 'about', hint: 'Split z portretem eksperta, checkami, tagami i LinkedIn (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'AboutExpertBlock', dataKey: 'about-expert' } },
  },
  novaTeam: {
    id: 'novaTeam', label: 'Zespół i wartości', groupId: 'about', hint: 'Autorska sekcja zespołu dla templateu Nova',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3" stroke-width="2"/><path d="M5 20c.8-3.3 3.1-5 7-5s6.2 1.7 7 5" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'TeamBlock', dataKey: 'nova-team' } },
  },
  audienceSplit: {
    id: 'audienceSplit', label: 'Dla kogo (split + grupy)', groupId: 'about', hint: 'Split z listą grup docelowych i separatorami (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'AudienceSplitBlock', dataKey: 'audience-split' } },
  },
  aboutSplitLean: {
    id: 'aboutSplitLean', label: 'O nas (split + obraz gradient)', groupId: 'about', hint: 'Split z tekstem i obrazem z gradientowym overlay (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'AboutSplitLeanBlock', dataKey: 'about-split-lean' } },
  },
  logoGrid: {
    id: 'logoGrid', label: 'Logotypy (statyczny grid)', groupId: 'trust', hint: 'Statyczny grid logotypów grayscale (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 5h7v7H4V5zm9 0h7v7h-7V5zM4 14h7v7H4v-7zm9 0h7v7h-7v-7z" stroke-width="2" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'LogoGridBlock', dataKey: 'logo-grid' } },
  },
  aboutWireframe: {
    id: 'aboutWireframe', label: 'O firmie (opis + zdjęcie)', groupId: 'about', hint: 'Sekcja o firmie z opisem i zdjęciem (biblioteka stalanowski)',
    source: 'stalanowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'AboutWireframeBlock', dataKey: 'about-wireframe' } },
  },
  saunaBenefits: {
    id: 'saunaBenefits', label: 'Zalety sauny', groupId: 'about', hint: 'Sekcja zalet wynajmu sauny i balii (biblioteka stalanowski)',
    source: 'stalanowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'SaunaBenefitsBlock', dataKey: 'sauna-benefits' } },
  },
};
