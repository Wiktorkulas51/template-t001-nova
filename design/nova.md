---
name: Nova, Creative Agency
colors:
  surface: "#fffdf9"
  surface-dim: "#f4f0e9"
  surface-bright: "#ffffff"
  surface-container-lowest: "#fffdf9"
  surface-container-low: "#f7f3ed"
  surface-container: "#eee8df"
  surface-container-high: "#ddd4c9"
  surface-container-highest: "#b9aea2"
  on-surface: "#161616"
  on-surface-variant: "#68635d"
  outline: "#b9aea2"
  outline-variant: "#ddd4c9"
  surface-tint: "#b98b6e"
  primary: "#161616"
  accent: "#b98b6e"
  on-primary: "#fffdf9"
  primary-container: "#eee8df"
  on-primary-container: "#161616"
  secondary: "#68635d"
  on-secondary: "#fffdf9"
  secondary-container: "#f4f0e9"
  on-secondary-container: "#161616"
  tertiary: "#b98b6e"
  on-tertiary: "#fffdf9"
  tertiary-container: "#ead9cc"
  on-tertiary-container: "#4f3223"
  error: "#b42318"
  on-error: "#ffffff"
  error-container: "#fddbd7"
  on-error-container: "#641b16"
  success: "#2f6b4f"
  on-success: "#ffffff"
  success-container: "#dcefe4"
  on-success-container: "#173d2b"
  warning: "#9a621b"
  on-warning: "#ffffff"
  warning-container: "#f8e7c8"
  on-warning-container: "#59370d"
  info: "#285b77"
  on-info: "#ffffff"
  info-container: "#dcecf4"
  on-info-container: "#17394b"
  background: "#fffdf9"
  on-background: "#161616"
  brand-primary: "#161616"
  brand-accent: "#b98b6e"
  brand-dark: "#161616"
  brand-light: "#fffdf9"
  brand-cream: "#f4f0e9"
typography:
  display:
    fontFamily: Satoshi, sans-serif
    fontSize: 64px
    fontWeight: "700"
    lineHeight: 0.96
    letterSpacing: -0.065em
  headline:
    fontFamily: Satoshi, sans-serif
    fontSize: 42px
    fontWeight: "700"
    lineHeight: 0.98
    letterSpacing: -0.055em
  title:
    fontFamily: Satoshi, sans-serif
    fontSize: 20px
    fontWeight: "700"
    lineHeight: 1.3
  body:
    fontFamily: Satoshi, sans-serif
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 1.65
  label:
    fontFamily: Satoshi, sans-serif
    fontSize: 11px
    fontWeight: "600"
    lineHeight: 1.2
    letterSpacing: 0.18em
rounded:
  sm: 0.5rem
  DEFAULT: 0.75rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  container-px: "clamp(1rem, 4vw, 4rem)"
  section-py: "clamp(4rem, 8vw, 7.5rem)"
elevation:
  soft: "0 14px 40px -24px rgb(22 22 22 / 0.28)"
  strong: "0 28px 80px -32px rgb(22 22 22 / 0.38)"
ui:
  text-on-light: "#161616"
  text-on-light-subtle: "rgba(22, 22, 22, 0.64)"
  text-on-dark: "#fffdf9"
  text-on-dark-subtle: "rgba(255, 253, 249, 0.68)"
  type-lead-tracking: "-0.01em"
  type-lead-leading: "1.55"
  type-body-leading: "1.65"
  type-heading-tracking: "-0.065em"
  button-radius: "9999px"
  button-hover-effect: "lift"
  bg-base: "var(--color-brand-cream)"
  bg-page: "var(--color-brand-light)"
  bg-surface: "var(--color-surface)"
  bg-accent: "var(--color-brand-accent)"
fonts:
  sans: "Satoshi, sans-serif"
  heading: "Satoshi, sans-serif"
animations:
  scroll: "scroll 36s linear infinite"
---

# Nova, kierunek wizualny

Nova jest eleganckim template'em dla studia kreatywnego, agencji cyfrowej lub marki premium. Strona ma sprawiać wrażenie spokojnej, dopracowanej i kompetentnej. Najważniejsza jest czytelna hierarchia, dobre zdjęcia i kontrolowany kontrast.

## Zasady kompozycji

- Główne tło pozostaje jasne i ciepłe, z delikatną zmianą tonu pomiędzy sekcjami.
- Czerń służy do nawigacji, statystyk, mocnych nagłówków i końcowego wezwania do działania.
- Miedziany akcent pojawia się oszczędnie w słowach wyróżnionych, ikonach, linkach i przyciskach.
- Karty mają miękkie narożniki, cienką obwódkę i dużo pustej przestrzeni wewnątrz.
- Układy przełamują regularną siatkę przez duży obraz, proporcje 2+1 oraz szerokie pasy treści.
- Animacja pozostaje spokojna: wejście sekcji, delikatny zoom zdjęć i przewijane logo bez efektów pulsowania.

## Kolejność homepage

1. Pływająca nawigacja na jasnym hero.
2. Hero z dużym hasłem, zdjęciem osoby, dwoma CTA i czterema liczbami.
3. Pas zaufania z logotypami.
4. Portfolio w układzie bento, dwa główne projekty i jeden szerszy kadr.
5. Cztery usługi w kartach z prostymi ikonami.
6. Sekcja o zespole ze zdjęciem i listą korzyści.
7. Ciemne CTA z fotografią gór jako mocne domknięcie strony.
8. Minimalna stopka na ciemnym tle.

## Zdjęcia

Assety produkcyjne Nova znajdują się w `public/assets/images/t001-nova/`. Referencja wejściowa jest przechowywana w dokumentacji Templara i nie jest używana jako obraz produkcyjny. Każdy asset powinien mieć opis alternatywny, a zdjęcia muszą pozostać w proporcjach przewidzianych przez komponent.

## Główne ograniczenia

- Nie używać fioletowych gradientów, przypadkowych badge'y ani dekoracyjnych kropek.
- Nie zagęszczać sekcji przez nadmiar kart i równych kolumn.
- Nie wprowadzać nowych fontów z CDN. Używać `Outfit` dla nagłówków i `Satoshi` dla tekstu.
- Nie stosować kolorów bezpośrednio w komponentach. Kolory muszą pochodzić z tokenów profilu `nova`.
