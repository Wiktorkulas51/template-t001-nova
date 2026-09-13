export type StudioSource = 'starter' | 'heinrich' | 'tom-ros' | 'modern-house' | 'tymoteusz' | 'marek-jodlowski' | 'promix' | 'lean-creative' | 'annawie' | 'stalanowski' | 'klisik' | 'kasia' | 'piekary9' | 'mystek';

export type VariantEntry = {
  component: any;
  /** Human-readable name shown in the developer catalog. */
  label?: string;
  props?: Record<string, any>;
  dataKey?: string;
  /** Source of origin of the variant; overwrites source from the section level (client variant in the starter section).*/
  source?: StudioSource;
};

export type SectionEntry = {
  id: string;
  label: string;
  groupId: string;
  icon: string;
  defaultVariant: string;
  variants: Record<string, VariantEntry>;
  hint?: string;
  /** The source of the block from the starter kit library or client project.*/
  source?: StudioSource;
};

export type SectionGroup = {
  id: string;
  label: string;
};

/**
 * The only group list used by registry, CMS, Studio and block gallery.
 * Order determines the order in which categories are displayed.
 */
export const SECTION_GROUPS: SectionGroup[] = [
  { id: 'theme', label: 'Motyw' },
  { id: 'navbar', label: 'Menu' },
  { id: 'footer', label: 'Footer' },
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'O nas' },
  { id: 'trust', label: 'Zaufanie' },
  { id: 'services', label: 'Usługi' },
  { id: 'portfolio', label: 'Realizacje' },
  { id: 'process', label: 'Proces' },
  { id: 'social', label: 'Opinie' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Kontakt' },
  { id: 'cta', label: 'CTA' },
  { id: 'content', label: 'Treść' },
];
