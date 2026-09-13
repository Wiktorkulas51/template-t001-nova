---
name: Starter Kit Default
colors:
  # Base Palette (Wireframe Gray)
  surface: "#ffffff"
  surface-dim: "#f9fafb"
  surface-bright: "#ffffff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f3f4f6"
  surface-container: "#e5e7eb"
  surface-container-high: "#d1d5db"
  surface-container-highest: "#9ca3b8"
  on-surface: "#111827"
  on-surface-variant: "#6b7280"
  outline: "#9ca3b8"
  outline-variant: "#e5e7eb"
  surface-tint: "#6b7280"

  # Semantic Tokens (Neutral Gray)
  primary: "#6b7280"
  accent: "#9ca3b8"
  on-primary: "#ffffff"
  primary-container: "#f3f4f6"
  on-primary-container: "#111827"
  secondary: "#6b7280"
  on-secondary: "#ffffff"
  secondary-container: "#f3f4f6"
  on-secondary-container: "#111827"
  tertiary: "#9ca3b8"
  on-tertiary: "#ffffff"
  tertiary-container: "#f3f4f6"
  on-tertiary-container: "#374151"
  error: "#ef4444"
  on-error: "#ffffff"
  error-container: "#fee2e2"
  on-error-container: "#7f1d1d"
  success: "#15803d"
  on-success: "#ffffff"
  success-container: "#dcfce7"
  on-success-container: "#14532d"
  warning: "#b45309"
  on-warning: "#ffffff"
  warning-container: "#fef3c7"
  on-warning-container: "#78350f"
  info: "#2563eb"
  on-info: "#ffffff"
  info-container: "#dbeafe"
  on-info-container: "#1e3a8a"
  background: "#ffffff"
  on-background: "#111827"
  
  # Brand Compatibility Tokens (Neutral Gray)
  brand-primary: "#6b7280"
  brand-accent: "#9ca3b8"
  brand-dark: "#111827"
  brand-light: "#f9fafb"
  brand-cream: "#ffffff"

typography:
  display:
    fontFamily: Gambarino, serif
    fontSize: 48px
    fontWeight: "400"
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline:
    fontFamily: Gambarino, serif
    fontSize: 32px
    fontWeight: "400"
    lineHeight: 1.2
  title:
    fontFamily: Satoshi, sans-serif
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 1.4
  body:
    fontFamily: Satoshi, sans-serif
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 1.5
  label:
    fontFamily: Satoshi, sans-serif
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 1

rounded:
  sm: 0.375rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px

spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  container-px: "1.5rem"
  section-py: "5rem"

elevation:
  soft: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
  strong: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"

ui:
  text-on-light: "#0f172a"
  text-on-light-subtle: "rgba(15, 23, 42, 0.7)"
  type-lead-tracking: "normal"
  type-lead-leading: "1.6"
  type-body-leading: "1.6"
  type-heading-tracking: "-0.02em"
  button-radius: "0.75rem"
  button-hover-effect: "lift"
  bg-base: "var(--color-surface-container-low)"
  bg-page: "var(--color-brand-light)"
  bg-surface: "var(--color-brand-light)"
  bg-accent: "var(--color-brand-primary)"

fonts:
  sans: 'Satoshi, sans-serif'
  heading: 'Gambarino, serif'

animations:
  scroll: "scroll 30s linear infinite"
---

# Starter Kit Design System

Modern, clean, and professional design system.

## 🚫 Banned UI Patterns
- **Pulsing Accent Dots**: Never use `animate-pulse` on small decorative dots or notification markers. They are considered distracting and unprofessional ("nei nawidze czegos takiego").
