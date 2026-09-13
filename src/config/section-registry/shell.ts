import type { SectionEntry } from './types';

export const shellSections: Record<string, SectionEntry> = {
  theme: {
    id: 'theme', label: 'Theme', groupId: 'theme', hint: 'Globalny motyw kolorystyczny',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: {
      default: { component: null },
    },
  },
  navbar: {
    id: 'navbar', label: 'Navbar', groupId: 'navbar', hint: 'Układ menu głównego',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'floating',
    variants: {
      centered: { component: 'Navbar', props: { layout: 'centered' } },
      floating: { component: 'Navbar', props: { layout: 'floating' } },
      local: { component: 'Navbar', props: { layout: 'local' } },
      plain: { component: 'Navbar', props: { layout: 'plain' } },
    },
  },
  footer: {
    id: 'footer', label: 'Footer', groupId: 'footer', hint: 'Wariant stopki',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'columns',
    variants: {
      columns: { component: 'FooterColumnsBlock' },
      minimal: { component: 'FooterMinimalBlock' },
      promo: { component: 'FooterPromoBlock' },
      nova: { component: 'NovaFooterBlock' },
    },
  },
  footerContact: {
    id: 'footerContact', label: 'Footer z panelem kontaktowym', groupId: 'footer', hint: 'Stopka z panelem 4 grup kontaktowych i gridem linków (biblioteka marek-jodlowski)',
    source: 'marek-jodlowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'FooterContactBlock', dataKey: 'footer-contact' } },
  },
  navbarContact: {
    id: 'navbarContact', label: 'Navbar z paskiem kontaktowym', groupId: 'navbar', hint: 'Navbar z paskiem kontaktowym, telefonem i sticky header (biblioteka marek-jodlowski)',
    source: 'marek-jodlowski',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'NavbarContactBlock', dataKey: 'navbar-contact' } },
  },
  lcNavbar: {
    id: 'lcNavbar', label: 'Navbar glass (nad hero)', groupId: 'navbar', hint: 'Glass floating navbar z logo 2x2 nad hero (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'LcNavbarBlock', dataKey: 'lc-navbar' } },
  },
  lcSubnav: {
    id: 'lcSubnav', label: 'Subnav sticky', groupId: 'navbar', hint: 'Sticky subnawigacja z logo 2x2, linkami i CTA (biblioteka lean-creative)',
    source: 'lean-creative',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 8h16M4 14h16M4 20h16" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default',
    variants: { default: { component: 'LcSubnavBlock', dataKey: 'lc-subnav' } },
  },
  navbarTrainer: {
    id: 'navbarTrainer', label: 'Navbar fitness', groupId: 'navbar', hint: 'Floating glass navbar z mobilnym drawerem', source: 'kasia',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default', variants: { default: { component: 'KasiaNavbarBlock', dataKey: 'kasia-navbar' } },
  },
  footerTrainer: {
    id: 'footerTrainer', label: 'Footer fitness', groupId: 'footer', hint: 'Stopka z brandingiem, lokalizacjami i socialami', source: 'kasia',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" stroke-linecap="round"/></svg>',
    defaultVariant: 'default', variants: { default: { component: 'KasiaFooterBlock', dataKey: 'kasia-footer' } },
  },
};
