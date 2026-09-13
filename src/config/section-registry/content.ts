import type { SectionEntry } from './types';

export const contentSections: Record<string, SectionEntry> = {
  blog: {
    id: 'blog', label: 'Blog', groupId: 'content', hint: 'Lista ostatnich wpisów bloga',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'list',
    variants: {
      list: { component: 'BlogListBlock' },
    },
  },
  crossBorder: {
    id: 'crossBorder', label: 'Obsługa transgraniczna', groupId: 'content', hint: 'Kroki pomocy + siatka obszarów + karta CTA (biblioteka tymoteusz)',
    source: 'tymoteusz',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'CrossBorderBlock', dataKey: 'cross-border' } },
  },
  publicInfo: {
    id: 'publicInfo', label: 'Informacja publiczna', groupId: 'content', hint: 'Sekcje danych z układami row/stack i zmiennymi firmy (biblioteka tymoteusz)',
    source: 'tymoteusz',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'PublicInfoBlock', dataKey: 'public-info' } },
  },
  knowledgeCards: {
    id: 'knowledgeCards', label: 'Wiedza (karty artykułów)', groupId: 'content', hint: 'Grid kart artykułów z obrazami i linkiem czytaj dalej (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'KnowledgeCardsBlock', dataKey: 'knowledge-cards' } },
  },
  roomDetail: {
    id: 'roomDetail', label: 'Pokój, układ szczegółowy', groupId: 'content', hint: 'Bento galerii, opis pokoju i podstawowe informacje (biblioteka annawie)',
    source: 'annawie',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 5h16v14H4zM4 15h5l2-3 3 4 2-2 4 3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'RoomDetailBlock', dataKey: 'room-detail' } },
  },
  pageIntro: {
    id: 'pageIntro', label: 'Wprowadzenie podstrony', groupId: 'content', hint: 'Minimalny nagłówek strony dla podstron oczekujących na dane',
    source: 'annawie',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h7" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'PageIntroBlock' } },
  },
};
