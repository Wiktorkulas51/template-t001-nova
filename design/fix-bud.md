---
name: Fix Bud
colors:
  # Base Palette
  brand-primary: "#2a438c"
  brand-accent: "#6482d9"
  brand-dark: "#1a1108"
  brand-light: "#fcfaf3"
  brand-cream: "#f8f6f0"

  # Functional Colors
  outline: "#9ca3af"
  outline-variant: "#e5e7eb"
  surface-tint: "#2a438c"

  # Semantic Tokens
  primary: "#2a438c"
  accent: "#6482d9"
  on-primary: "#ffffff"
  primary-container: "#fcfaf3"
  on-primary-container: "#1a1108"
  inverse-primary: "#6482d9"
  secondary: "#1a1108"
  on-secondary: "#ffffff"
  secondary-container: "#f8f6f0"
  on-secondary-container: "#1a1108"
  tertiary: "#6482d9"
  on-tertiary: "#ffffff"
  tertiary-container: "#fcfaf3"
  on-tertiary-container: "#2a438c"
  error: "#ef4444"
  on-error: "#ffffff"
  error-container: "#fee2e2"
  on-error-container: "#7f1d1d"
  success: "#166534"
  on-success: "#ffffff"
  success-container: "#dcfce7"
  on-success-container: "#14532d"
  warning: "#b45309"
  on-warning: "#ffffff"
  warning-container: "#fef3c7"
  on-warning-container: "#78350f"
  info: "#1d4ed8"
  on-info: "#ffffff"
  info-container: "#dbeafe"
  on-info-container: "#1e3a8a"
  background: "#ffffff"
  on-background: "#1a1108"
  surface: "#ffffff"
  on-surface: "#1a1108"
  surface-variant: "#f8f6f0"
  on-surface-variant: "#1a1108"

typography:
  display:
    fontFamily: Outfit, sans-serif
    fontSize: clamp(2.5rem, 8vw, 4.5rem)
    lineHeight: 1.1
    fontWeight: 700
  headline:
    fontFamily: Outfit, sans-serif
    fontSize: clamp(2rem, 5vw, 3rem)
    lineHeight: 1.2
    fontWeight: 700
  title:
    fontFamily: Outfit, sans-serif
    fontSize: 1.25rem
    lineHeight: 1.4
    fontWeight: 600
  body:
    fontFamily: Satoshi, sans-serif
    fontSize: 1rem
    lineHeight: 1.6
    fontWeight: 400
  label:
    fontFamily: Satoshi, sans-serif
    fontSize: 0.875rem
    lineHeight: 1.5
    fontWeight: 500

spacing:
  container-px: clamp(1rem, 5vw, 4rem)
  section-py: clamp(4rem, 10vw, 8rem)

elevation:
  soft: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
  strong: "0 25px 50px -12px rgb(0 0 0 / 0.25)"

radius:
  sm: "0.5rem"
  md: "1rem"
  lg: "2rem"
  xl: "2.5rem"
  full: "9999px"

ui:
  text-on-dark: "#ffffff"
  text-on-dark-muted: "rgba(255, 255, 255, 0.5)"
  text-on-dark-subtle: "rgba(255, 255, 255, 0.6)"
  text-on-dark-faint: "rgba(255, 255, 255, 0.4)"
  text-on-light: "#1a1108"
  text-on-light-subtle: "rgba(26, 17, 8, 0.6)"
  type-lead-tracking: "-0.01em"
  type-lead-leading: "1.5"
  type-body-leading: "1.5"
  type-heading-tracking: "-0.01em"
  button-radius: "2.5rem"
  button-hover-effect: "lift"
  bg-base: "var(--color-brand-dark)"
  bg-page: "var(--color-brand-light)"
  bg-surface: "var(--color-brand-light)"
  bg-accent: "var(--color-brand-primary)"

fonts:
  sans: '"Satoshi", ui-sans-serif, system-ui, sans-serif'
  heading: '"Outfit", ui-sans-serif, system-ui, sans-serif'

animations:
  scroll: "scroll 30s linear infinite"
---

## 🚫 Banned UI Patterns
- **Pulsing Accent Dots**: Never use `animate-pulse` on small decorative dots or notification markers. They are considered distracting and unprofessional ("nei nawidze czegos takiego").
