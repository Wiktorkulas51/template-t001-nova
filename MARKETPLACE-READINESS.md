---
title: Nova marketplace readiness
template: T001
status: release-candidate
date: 2026-09-13
---

# Marketplace readiness

Ten dokument opisuje stan przygotowania `T001, Nova` do sprzedaży jako kod źródłowy template'u.

## Zrealizowane etapy

### Etap 1, audyt repozytorium

- Zdefiniowano zakres aktywnego template'u: homepage, wersja polska, wersja angielska oraz strony prawne.
- Potwierdzono build statyczny Astro i ścieżkę `dist/`.
- Dodano listę dokumentów potrzebnych kupującemu.

### Etap 2, porządek i separacja

- Usunięto dwa niepowiązane pliki wideo z `public/assets/videos/`.
- Dodano `.marketplaceignore` dla plików lokalnych i generowanych.
- Dodano instrukcję assetów oraz obowiązek zastąpienia materiałów demonstracyjnych.

### Etap 3, dokumentacja kupującego

- `CUSTOMIZATION.md` opisuje zmianę marki, danych, obrazów i tokenów.
- `CONTENT-GUIDE.md` opisuje wymianę demonstracyjnej treści Nova.
- `DEPLOYMENT.md` opisuje instalację, build i publikację.
- `ASSETS-LICENSES.md` opisuje odpowiedzialność za fonty, zdjęcia, ikony i inne assety.
- `CHANGELOG.md` zawiera pierwszą wersję release candidate.

### Etap 4, licencja i legal

- `LICENSE.md` zawiera rozdział Personal, Agency, ograniczenia oraz prawa do zewnętrznych zależności.
- Naprawiono polski link kontaktowy na stronach prawnych, aby nie generował ścieżki `/pl/pl/#kontakt`.

### Etap 7, QA i paczka źródłowa

- Dodano `npm run package:marketplace`.
- Skrypt tworzy `release/t001-nova.zip` wyłącznie z plików zapisanych w aktualnym commicie.
- Build, linki, obrazy, SEO, dane sekcji i kontrola atomic design przechodzą.

## Pominięte etapy

Etap 5, materiały sprzedażowe marketplace, oraz etap 6, wybór kanału sprzedaży, zostały pominięte zgodnie z decyzją właściciela projektu.

## Warunki przed publiczną sprzedażą

1. Zastąpić demonstracyjne zdjęcia, avatary, dane kontaktowe i copy własnymi materiałami albo dołączyć potwierdzone licencje.
2. Wykonać ręczny przegląd homepage'u w przeglądarce na telefonie i desktopie.
3. Ustalić finalną treść licencji z prawnikiem.
4. Uruchomić `npm run build`, `npm run check:links`, `npm run check:seo`, `npm run check:images` oraz `npm run package:marketplace` po ostatniej zmianie.

## Znane ograniczenia release candidate

- Repozytorium nadal zawiera pełną bibliotekę komponentów Starter Kit, dlatego nie jest to minimalny bundle tylko dla jednej strony.
- Pełne `npm run qa` raportuje istniejące błędy kontraktów w testach tras dev oraz w niezatwierdzonych zmianach komponentów hero. Nie blokują one builda Nova, ale muszą zostać usunięte przed deklaracją pełnej zgodności QA.
