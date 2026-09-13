import type { SectionEntry } from './types';

export const processSections: Record<string, SectionEntry> = {
  processTrainer: {
    id: 'processTrainer', label: 'Proces, timeline', groupId: 'process', hint: 'Naprzemienna oś czasu z czterema krokami', source: 'kasia',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke-width="2"/></svg>',
    defaultVariant: 'default', variants: { default: { component: 'KasiaTimelineBlock', dataKey: 'kasia-timeline' } },
  },
  processTimeline: {
    id: 'processTimeline', label: 'Proces z osią czasu', groupId: 'process', hint: 'Timeline kroków z paskiem postępu (scroll)',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1m0-12.8l-2.1 2.1M7.7 16.3l-2.1 2.1M12 8a4 4 0 100 8 4 4 0 000-8z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ProcessTimelineBlock', dataKey: 'process-timeline' } },
  },
  processTimelineScroll: {
    id: 'processTimelineScroll', label: 'Proces (oś czasu scroll)', groupId: 'process', hint: 'Oś czasu z numerowanymi kółkami i paskiem postępu sterowanym scrollowaniem (biblioteka marek-jodlowski)',
    source: 'marek-jodlowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ProcessTimelineScrollBlock', dataKey: 'process-timeline-scroll' } },
  },
  processIconSteps: {
    id: 'processIconSteps', label: 'Proces (4 kroki z ikonami)', groupId: 'process', hint: 'Kroki procesu z ikonami SVG i strzałkami dashed (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ProcessIconStepsBlock', dataKey: 'process-icon-steps' } },
  },
  timelineAlternate: {
    id: 'timelineAlternate', label: 'Oś czasu naprzemienna (scroll)', groupId: 'process', hint: 'Naprzemienna oś czasu z animowaną linią scroll (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14m-7-7a2 2 0 100-4 2 2 0 000 4zm0 14a2 2 0 100-4 2 2 0 000 4z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'TimelineAlternateBlock', dataKey: 'timeline-alternate' } },
  },
  stepsNumbered: {
    id: 'stepsNumbered', label: 'Kroki (numery w kwadracie)', groupId: 'process', hint: 'Kroki z numerami w kwadracie i strzałkami dashed (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'StepsNumberedBlock', dataKey: 'steps-numbered' } },
  },
  processRecruitment: {
    id: 'processRecruitment', label: 'Proces rekrutacji (3 kroki)', groupId: 'process', hint: 'Trzy karty kroków z ikonami, łącznikami i CTA',
    source: 'klisik',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ProcessRecruitmentBlock', dataKey: 'process-recruitment' } },
  },
  saunaHowItWorks: {
    id: 'saunaHowItWorks', label: 'Jak to działa? (wynajem)', groupId: 'process', hint: 'Karty kroków wynajmu sauny (biblioteka stalanowski)',
    source: 'stalanowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'SaunaHowItWorksWireframeBlock', dataKey: 'sauna-how-it-works' } },
  },
  production: {
    id: 'production', label: 'Produkcja saun i balii', groupId: 'process', hint: 'Karty produktów z produkcji (biblioteka stalanowski)',
    source: 'stalanowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'ProductionWireframeBlock', dataKey: 'production' } },
  },
};
