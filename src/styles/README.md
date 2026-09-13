# Warstwy CSS

`global.css` jest jedynym wejściem globalnego arkusza stylów. Importy są
łączone podczas builda, dlatego samo rozdzielenie plików źródłowych nie tworzy
dodatkowych requestów w przeglądarce.

## Odpowiedzialność plików

- `fonts.css` ładuje lokalne fonty.
- `themes.css` zawiera wygenerowane tokeny profili designu.
- `tailwind-bridge.css` łączy Tailwind z tokenami.
- `foundations.css` zawiera fundamenty dokumentu, dostępności i bazowych
  zmiennych UI.
- `components.css` zawiera wspólne komponenty, typografię, przyciski,
  formularze oraz treści prose.
- `navigation.css` zawiera drawer mobilny i stany wspólnej nawigacji.
- `section-patterns.css` zawiera wzorce tła sekcji i nakładki obrazów.
- `ui-theme.css` zawiera zmienne kompatybilności UI i shadcn.
- `patterns.css` zawiera wspólne wzorce bibliotekowe wyodrębnione z
  fundamentów, między innymi marquee, galerie oraz wzorce pochodzące z
  wcześniejszych wdrożeń klientów.
- `motion.css` zawiera wspólny system animacji.

## Wydajność

Domyślny build używa jednego globalnego arkusza CSS. Nie włączaj automatycznie
podziału CSS na wiele plików tylko dlatego, że pliki źródłowe są rozdzielone.
Style specyficzne dla klienta można wydzielić do osobnego importu dopiero
wtedy, gdy pomiar konkretnego builda pokaże korzyść dla rozmiaru CSS,
renderowania krytycznej strony albo LCP.
