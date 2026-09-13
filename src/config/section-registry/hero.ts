import type { SectionEntry } from './types';

export const heroSections: Record<string, SectionEntry> = {
  heroTrainer: {
    id: 'heroTrainer', label: 'Hero fitness', groupId: 'hero', hint: 'Editorialny hero z portretem, mottem i dwoma CTA', source: 'kasia',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default', variants: { default: { component: 'KasiaHeroBlock', dataKey: 'kasia-hero' } },
  },
  hero: {
    id: 'hero', label: 'Hero', groupId: 'hero', hint: 'Warianty hero używane na stronie głównej projektu',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: {
      default: { component: 'HeroSplitBlock', dataKey: 'hero-split' },
      novaWireframe: { label: 'Hero fotograficzny', component: 'NovaHeroWireframeBlock', dataKey: 'nova-hero-wireframe' },
      modernHouse: { component: 'ModernHouseHeroBlock', dataKey: 'modern-house-hero', source: 'modern-house' },
    },
  },
  heroVideo: {
    id: 'heroVideo', label: 'Hero z wideo', groupId: 'hero', hint: 'Hero z wideo w tle (deferred loading)',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: {
      default: { component: 'HeroVideoBlock', dataKey: 'hero-video' },
    },
  },
  heroCinematic: {
    id: 'heroCinematic', label: 'Hero z wideo (studio)', groupId: 'hero', hint: 'Pełnoekranowe wideo z siatką kropek i CTA (biblioteka heinrich)',
    source: 'heinrich',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'HeroCinematicBlock', dataKey: 'hero-cinematic' } },
  },
  heroTomRos: {
    id: 'heroTomRos', label: 'Hero sport (pełne tło)', groupId: 'hero', hint: 'Pełnoekranowe hero Tom Ros z akcentem Barlow i zdjęciem w tle',
    source: 'tom-ros',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'HeroTomRosBlock', dataKey: 'hero-tomros' } },
  },
  heroLaw: {
    id: 'heroLaw', label: 'Hero kancelarii', groupId: 'hero', hint: 'Pełnoekranowe zdjęcie z overlayem i tytułem łamanym przed "Polsko-" (biblioteka tymoteusz)',
    source: 'tymoteusz',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'HeroLawBlock', dataKey: 'hero-law' } },
  },
  heroSplit: {
    id: 'heroSplit', label: 'Hero split (slideshow)', groupId: 'hero', hint: 'Pełnoekranowe hero ze slideshow, statystykami i trust barem (biblioteka marek-jodlowski)',
    source: 'marek-jodlowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'HeroSplitBlock', dataKey: 'hero-split' } },
  },
  heroEditorial: {
    id: 'heroEditorial', label: 'Hero editorial (bloby + marquee)', groupId: 'hero', hint: 'Hero z blobami w tle, trust badges i marquee klientów (biblioteka promix)',
    source: 'promix',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M12 12m-4 0a4 4 0 108 0 4 4 0 00-8 0z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'HeroEditorialBlock', dataKey: 'hero-editorial' } },
  },
  heroPhoto: {
    id: 'heroPhoto', label: 'Hero ze zdjęciem (fullscreen + marquee)', groupId: 'hero', hint: 'Fullscreen hero ze zdjęciem, gradientem i marquee logotypów (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zm9 3a1 1 0 11-2 0 1 1 0 012 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'HeroPhotoBlock', dataKey: 'hero-photo' } },
  },
  heroStats: {
    id: 'heroStats', label: 'Hero + statystyki', groupId: 'hero', hint: 'Hero z leadem i paskiem 3 statystyk (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 20h16M6 16V9m4 7V5m4 11v-4m4 4v-7" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'HeroStatsBlock', dataKey: 'hero-stats' } },
  },
  heroAccommodation: {
    id: 'heroAccommodation', label: 'Hero obiektu noclegowego', groupId: 'hero', hint: 'Spokojny hero fotograficzny bez dodatkowego runtime (biblioteka annawie)',
    source: 'annawie',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'HeroAccommodationBlock', dataKey: 'hero-accommodation' } },
  },
  heroWireframe: {
    id: 'heroWireframe', label: 'Hero z pełnoekranowym zdjęciem', groupId: 'hero', hint: 'Hero z pełnoekranowym zdjęciem i tekstem na lewo (biblioteka stalanowski)',
    source: 'stalanowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'HeroWireframeBlock', dataKey: 'hero-wireframe' } },
  },
  heroCountdown: {
    id: 'heroCountdown', label: 'Hero + countdown', groupId: 'hero', hint: 'Hero z licznikiem do zapisów (4 jednostki, deadline z JSON) i CTA (reimplementacja aleksandra-klisik)',
    source: 'klisik',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3M4 7h16v13a1 1 0 01-1 1H5a1 1 0 01-1-1V7zM4 11h16m-9 4h1m1 0h1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'HeroCountdownBlock', dataKey: 'hero-countdown' } },
  },
};
