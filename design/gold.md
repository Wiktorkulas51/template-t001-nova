---
theme: gold
name: Gold
colors:
  # Base Palette
  brand-primary: "#c5a86b"
  brand-accent: "#a68b52"
  brand-dark: "#0a0a0a"
  brand-light: "#faf8f3"
  brand-cream: "#faf8f3"

  # Functional Colors
  outline: "#d1d5db"
  outline-variant: "#e5e7eb"
  surface-tint: "#c5a86b"

  # Semantic Tokens
  primary: "#c5a86b"
  accent: "#a68b52"
  on-primary: "#ffffff"
  primary-container: "#faf8f3"
  on-primary-container: "#0a0a0a"
  inverse-primary: "#a68b52"
  secondary: "#0a0a0a"
  on-secondary: "#ffffff"
  secondary-container: "#faf8f3"
  on-secondary-container: "#0a0a0a"
  tertiary: "#a68b52"
  on-tertiary: "#ffffff"
  tertiary-container: "#faf8f3"
  on-tertiary-container: "#c5a86b"
  error: "#ef4444"
  on-error: "#ffffff"
  error-container: "#fee2e2"
  on-error-container: "#7f1d1d"
  success: "#166534"
  on-success: "#ffffff"
  success-container: "#dcfce7"
  on-success-container: "#14532d"
  warning: "#a16207"
  on-warning: "#ffffff"
  warning-container: "#fef3c7"
  on-warning-container: "#78350f"
  info: "#1d4ed8"
  on-info: "#ffffff"
  info-container: "#dbeafe"
  on-info-container: "#1e3a8a"
  background: "#ffffff"
  on-background: "#0a0a0a"
  surface: "#ffffff"
  on-surface: "#0a0a0a"
  surface-variant: "#faf8f3"
  on-surface-variant: "#0a0a0a"

spacing:
  base: "0.5rem"
  xs: "0.25rem"
  sm: "0.75rem"
  md: "1.5rem"
  lg: "3rem"
  xl: "5rem"
  container-px: "1.5rem"
  section-py: "5rem"

radius:
  sm: "0.25rem"
  base: "0.5rem"
  md: "0.75rem"
  lg: "1.25rem"
  xl: "2rem"
  full: "9999px"

ui:
  text-on-dark: "#ffffff"
  text-on-dark-subtle: "rgba(255, 255, 255, 0.7)"
  text-on-light: "#0a0a0a"
  text-on-light-subtle: "rgba(10, 10, 10, 0.7)"
  elevation-soft: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  elevation-strong: "0 20px 25px -5px rgb(0 0 0 / 0.1)"
  type-lead-tracking: "0.05em"
  type-lead-leading: "1.9"
  type-body-leading: "1.7"
  type-heading-tracking: "0.02em"
  button-radius: "9999px"
  button-hover-effect: "slide"
  bg-base: "var(--color-brand-dark)"
  bg-page: "var(--color-brand-light)"
  bg-surface: "var(--color-brand-light)"
  bg-accent: "var(--color-brand-primary)"

fonts:
  sans: '"Satoshi", ui-sans-serif, system-ui, sans-serif'
  heading: '"Playfair Display", serif'

animations:
  scroll: "scroll 40s linear infinite"
---

# Gold Design System

Focuses on the interplay between deep blacks, crisp whites, and luxurious gold accents.

## 🚫 Banned UI Patterns
- **Pulsing Accent Dots**: Never use `animate-pulse` on small decorative dots or notification markers. They are considered distracting and unprofessional ("nei nawidze czegos takiego").
