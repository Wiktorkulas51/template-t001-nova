import copy from '@data/i18n/nova.json';

export type NovaLocale = 'pl' | 'en';

export function getNovaCopy(locale: NovaLocale = 'pl') {
  return copy[locale] ?? copy.pl;
}

export function getNovaSectionCopy(locale: NovaLocale, dataKey?: string) {
  if (!dataKey) return undefined;
  return getNovaCopy(locale).sections[dataKey as keyof typeof copy.pl.sections];
}

export function getNovaLocalePath(locale: NovaLocale): string {
  return locale === 'en' ? '/en/' : '/';
}

export function getNovaNavigationPath(href: string, locale: NovaLocale): string {
  if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href;
  }

  const normalized = href.startsWith('/') ? href : `/${href}`;
  if (locale === 'en') return normalized === '/' ? '/en/' : `/en${normalized}`;
  return normalized;
}
