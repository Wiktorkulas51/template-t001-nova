import { SECTION_GROUPS, SECTION_REGISTRY, type StudioSource } from '@config/section-registry';
import decorationCatalog from '@data/dev/component-library/decoration-catalog.json';
import uiCatalog from '@data/dev/component-library/ui-catalog.json';

// Why: direct alias to StudioSource from section-registry/types.ts,
// so that the list of customer sources has one source of truth (we avoid crossovers,
// gdy dodamy nowego klienta).
export type DeveloperCatalogSource = StudioSource;

export const DEVELOPER_SOURCE_LABELS: Record<DeveloperCatalogSource, string> = {
  starter: 'Starter Kit',
  heinrich: 'Heinrich House Studio',
  'tom-ros': 'Tom Ros',
  'modern-house': 'Modern House',
  tymoteusz: 'Tymoteusz Juszczak',
  'marek-jodlowski': 'Marek Jodłowski',
  promix: 'Promix',
  'lean-creative': 'Lean Creative',
  annawie: 'Anna Więckowska',
  stalanowski: 'Przemysław Stałanowski',
  klisik: 'Aleksandra Klisik',
};

export type DeveloperCatalogType = 'section' | 'ui' | 'pattern' | 'decoration';

export type DeveloperCatalogGroup = {
  id: string;
  label: string;
};

export type DeveloperCatalogMetadata = {
  uid: number;
  catalogType: DeveloperCatalogType;
  sectionId: string;
  sectionLabel: string;
  groupId: string;
  groupLabel: string;
  variantId: string;
  variantLabel?: string;
  componentName: string;
  hint?: string;
  source?: DeveloperCatalogSource;
  sourceLabel?: string;
  previewId?: string;
};

const groupLabels = Object.fromEntries(SECTION_GROUPS.map((group) => [group.id, group.label]));

/**
 * Builds a lightweight metadata catalog without importing Astro components.
 * This layer is used by the thumbnail gallery, so it should not load the component map.
 */
export function getDeveloperCatalogMetadata(): DeveloperCatalogMetadata[] {
  const items: DeveloperCatalogMetadata[] = [];

  Object.values(SECTION_REGISTRY).forEach((entry) => {
    if (entry.id === 'theme') return;

    Object.entries(entry.variants).forEach(([variantId, variant]) => {
      if (!variant.component) return;

      const source = variant.source ?? entry.source;

      items.push({
        uid: items.length + 1,
        catalogType: 'section',
        sectionId: entry.id,
        sectionLabel: entry.label,
        groupId: entry.groupId,
        groupLabel: groupLabels[entry.groupId] || entry.groupId,
        variantId,
        variantLabel: variant.label,
        componentName: variant.component,
        hint: entry.hint,
        // Dlaczego: najpierw source wariantu, potem sekcji. Wariant kliencki
        // in the starter section (e.g. hero.modernHouse) it must go under the filter
        // client, even though the section is starter.
        source,
        sourceLabel: source ? DEVELOPER_SOURCE_LABELS[source] : undefined,
      });
    });
  });

  uiCatalog.items.forEach((item) => {
    items.push({
      uid: items.length + 1,
      catalogType: item.catalogType as DeveloperCatalogType,
      sectionId: item.id,
      sectionLabel: item.label,
      groupId: item.groupId,
      groupLabel: uiCatalog.groups.find((group) => group.id === item.groupId)?.label || item.groupId,
      variantId: item.variantId,
      componentName: item.componentName,
      hint: item.hint,
      source: 'starter',
      previewId: item.previewId,
    });
  });

  decorationCatalog.items.forEach((item) => {
    items.push({
      uid: items.length + 1,
      catalogType: 'decoration',
      sectionId: item.id,
      sectionLabel: item.label,
      groupId: item.groupId,
      groupLabel: decorationCatalog.groups.find((group) => group.id === item.groupId)?.label || item.groupId,
      variantId: item.variantId,
      componentName: item.componentName,
      hint: item.hint,
      source: 'starter',
      previewId: item.previewId,
    });
  });

  return items;
}

export function getDeveloperCatalogGroups(): DeveloperCatalogGroup[] {
  return [
    ...SECTION_GROUPS,
    ...uiCatalog.groups,
    ...decorationCatalog.groups,
  ];
}
