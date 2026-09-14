import type { SectionEntry } from './types';

export const portfolioSections: Record<string, SectionEntry> = {
  portfolio: {
    id: 'portfolio', label: 'Portfolio', groupId: 'portfolio', hint: 'Prezentacja prac',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'bento',
    variants: {
      bento: { component: 'PortfolioBentoBlock', dataKey: 'portfolio' },
      nova: { label: 'Realizacje z kartami projektów', component: 'ProjectsBlock', dataKey: 'nova-projects' },
      carousel: { component: 'PortfolioCarouselBlock', dataKey: 'portfolio' },
      categorized: { component: 'PortfolioCategorizedBlock', dataKey: 'portfolio' },
      marquee: { component: 'PortfolioMarqueeBlock', dataKey: 'portfolio' },
      'double-marquee': { component: 'PortfolioDoubleMarqueeBlock', dataKey: 'portfolio' },
      masonry: { component: 'PortfolioMasonryBlock', dataKey: 'portfolio' },
    },
  },
  gallery: {
    id: 'gallery', label: 'Galeria', groupId: 'portfolio', hint: 'Galeria zdjęć z miniaturkami i lightboxem',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: {
      default: { component: 'GalleryBlock', dataKey: 'gallery' },
    },
  },
  galleryCrossfade: {
    id: 'galleryCrossfade', label: 'Galeria z przejściami', groupId: 'portfolio', hint: 'Galeria z crossfade, miniaturkami i licznikiem',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: {
      default: { component: 'GalleryCrossfadeBlock', dataKey: 'gallery-crossfade' },
    },
  },
  marqueeWall: {
    id: 'marqueeWall', label: 'Ściana zdjęć', groupId: 'portfolio', hint: 'Marquee z 3 rzędami zdjęć (galeria sukcesów)',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: {
      default: { component: 'MarqueeImageWallBlock', dataKey: 'marquee-image-wall' },
    },
  },
  galleryStudio: {
    id: 'galleryStudio', label: 'Galeria studio (slider)', groupId: 'portfolio', hint: 'Ciemny slider zdjęć z miniaturkami, lightboxem i listą sprzętu (biblioteka heinrich)',
    source: 'heinrich',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'GalleryStudioBlock', dataKey: 'gallery-studio' } },
  },
  playerEmbed: {
    id: 'playerEmbed', label: 'Player (embed)', groupId: 'portfolio', hint: 'Ciemna sekcja z embedem i unoszącymi się cząstkami (biblioteka heinrich)',
    source: 'heinrich',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 9v6m3-6v6m3-6v6M6 9v6m12-6v6" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'PlayerEmbedBlock', dataKey: 'player-embed' } },
  },
  transformationsWall: {
    id: 'transformationsWall', label: 'Ściana metamorfoz', groupId: 'portfolio', hint: '3 rzędy marquee z metamorfozami klientów (biblioteka tom-ros)',
    source: 'tom-ros',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'TransformationsWallBlock', dataKey: 'transformations-wall' } },
  },
  competitions: {
    id: 'competitions', label: 'Zawody (galeria)', groupId: 'portfolio', hint: 'Medale + masonry zdjęć z zawodów (biblioteka tom-ros)',
    source: 'tom-ros',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 21h8m-4-4v4m-5-5h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2zM12 7a3 3 0 100 6 3 3 0 000-6z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'CompetitionsBlock', dataKey: 'competitions' } },
  },
  saunaGallery: {
    id: 'saunaGallery', label: 'Galeria saun i balii', groupId: 'portfolio', hint: 'Galeria zdjęć z lightboxem (biblioteka stalanowski)',
    source: 'stalanowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'SaunaGalleryBlock', dataKey: 'sauna-gallery' } },
  },
};
