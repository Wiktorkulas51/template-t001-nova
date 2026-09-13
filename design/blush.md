---
name: Blush
colors:
  surface: "#ffffff"
  surface-dim: "#fff7fb"
  surface-bright: "#ffffff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#ffe9f4"
  surface-container: "#ffd2e9"
  surface-container-high: "#ffb3d9"
  surface-container-highest: "#ff94c9"
  on-surface: "#1a1a1a"
  on-surface-variant: "#4a4a4a"
  inverse-surface: "#1a1a1a"
  inverse-on-surface: "#ffffff"
  outline: "#f4b5d4"
  outline-variant: "#ffddeb"
  surface-tint: "#ff4fa3"

  primary: "#ff4fa3"
  accent: "#ff85c2"
  on-primary: "#ffffff"
  primary-container: "#ffe3f2"
  on-primary-container: "#5f103d"
  inverse-primary: "#ffb4d9"
  secondary: "#ff85c2"
  on-secondary: "#1a1a1a"
  secondary-container: "#ffeaf5"
  on-secondary-container: "#5f103d"
  tertiary: "#1a1a1a"
  on-tertiary: "#ffffff"
  tertiary-container: "#f5f5f5"
  on-tertiary-container: "#1a1a1a"
  error: "#ef4444"
  on-error: "#ffffff"
  error-container: "#fee2e2"
  on-error-container: "#7f1d1d"
  success: "#2f7d5a"
  on-success: "#ffffff"
  success-container: "#e3f4eb"
  on-success-container: "#174b34"
  warning: "#a16207"
  on-warning: "#ffffff"
  warning-container: "#fef3c7"
  on-warning-container: "#78350f"
  info: "#2563eb"
  on-info: "#ffffff"
  info-container: "#dbeafe"
  on-info-container: "#1e3a8a"
  background: "#ffffff"
  on-background: "#1a1a1a"

  brand-primary: "#ff4fa3"
  brand-accent: "#ff85c2"
  brand-dark: "#1a1a1a"
  brand-light: "#ffffff"
  brand-cream: "#fff7fb"

typography:
  display:
    fontFamily: Outfit, sans-serif
    fontSize: "clamp(2rem, 6vw, 3.5rem)"
    fontWeight: "800"
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline:
    fontFamily: Outfit, sans-serif
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
    fontWeight: "700"
    lineHeight: 1.2
  title:
    fontFamily: Satoshi, sans-serif
    fontSize: "1.25rem"
    fontWeight: "600"
    lineHeight: 1.4
  body:
    fontFamily: Satoshi, sans-serif
    fontSize: "1rem"
    fontWeight: "400"
    lineHeight: 1.6
  label:
    fontFamily: Satoshi, sans-serif
    fontSize: "0.875rem"
    fontWeight: "600"
    lineHeight: 1

rounded:
  sm: 0.375rem
  DEFAULT: 0.75rem
  md: 0.875rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px

spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-px: "1rem"
  section-py: "4rem"

elevation:
  soft: "0 6px 20px -10px rgb(255 79 163 / 0.35)"
  strong: "0 20px 35px -20px rgb(255 79 163 / 0.45)"

ui:
  text-on-dark: "#ffffff"
  text-on-dark-subtle: "rgba(255, 255, 255, 0.75)"
  text-on-light: "#1a1a1a"
  text-on-light-subtle: "rgba(26, 26, 26, 0.7)"
  type-lead-tracking: "normal"
  type-lead-leading: "1.7"
  type-body-leading: "1.6"
  type-heading-tracking: "-0.02em"
  button-radius: "9999px"
  button-hover-effect: "lift"
  bg-base: "var(--color-brand-light)"
  bg-page: "var(--color-brand-light)"
  bg-surface: "var(--color-brand-light)"
  bg-accent: "var(--color-brand-primary)"

fonts:
  sans: "Satoshi, sans-serif"
  heading: "Outfit, sans-serif"
---

# Design System: Blush

Kierunek: kobiecy premium, nowoczesny minimalizm, wysoki kontrast i duzo przestrzeni.

## Zasady UI
- Biale tlo jako baza, rozowe akcenty tylko na elementach CTA, badge i detalach.
- Czarne, czytelne naglowki i teksty body.
- Kafelki ofert: delikatny border + subtelny cien, bez ciezkich gradientow.
- Mobile-first: jedna kolumna kart na mobile, rozbudowa na `md` i wyzej.

## Logo
- Główna część logotypu w kolorze `#1a1a1a`
- Akcentowa część logotypu w kolorze `#ff4fa3`
