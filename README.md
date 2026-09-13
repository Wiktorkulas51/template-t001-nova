# Nova Template

Nova to responsywny template strony internetowej dla agencji kreatywnych, studiów projektowych i ambitnych marek. Projekt korzysta z Astro, Tailwind CSS, TypeScript oraz danych przechowywanych w plikach JSON.

## Najważniejsze elementy

- Dwujęzyczna strona główna w języku polskim i angielskim.
- Sekcje hero, realizacje, usługi, zespół, FAQ, opinie oraz CTA.
- Responsywny układ dla telefonu, tabletu i desktopu.
- Dane treści oddzielone od komponentów.
- Obsługa Decap CMS.
- Favicony, obrazy responsywne, sitemap i podstawowe meta dane SEO.
- Gotowy system motywu oraz lokalne fonty.

## Uruchomienie

Wymagany jest Node.js zgodny z wersją określoną w `package.json`.

```bash
npm ci
npm run dev
```

Strona będzie dostępna pod adresem wyświetlonym przez Astro.

## Dokumentacja

- `CUSTOMIZATION.md`, konfiguracja marki, treści, obrazów i tokenów.
- `CONTENT-GUIDE.md`, zasady przygotowania treści dla homepage'u.
- `DEPLOYMENT.md`, build i publikacja na hostingu statycznym.
- `ASSETS-LICENSES.md`, zasady dotyczące assetów demonstracyjnych.
- `CHANGELOG.md`, historia wydań.

## Edycja treści

Najważniejsze pliki do personalizacji znajdują się tutaj:

- `src/data/i18n/nova.json`, treści strony Nova w języku polskim i angielskim.
- `src/data/sections/*.json`, dane sekcji i wariantów.
- `src/data/global/company.json`, dane firmy, kontakt i branding.
- `src/data/global/seo.json`, tytuł, opis, obraz Open Graph i indeksowanie.
- `src/data/pages/index.json`, kolejność sekcji strony głównej.
- `site.config.mjs`, domena, język i zakres stron generowanych w buildzie.

Treści należy zmieniać w JSON, a nie bezpośrednio w komponentach Astro. Po zmianie danych warto uruchomić `npm run cms:check` oraz `npm run check:types`.

## Build i kontrola jakości

```bash
npm run build
npm run check:types
npm run check:seo
npm run check:links
npm run check:images
npm run qa
```

Przed publikacją należy sprawdzić stronę ręcznie na telefonie i desktopie, przetestować nawigację, formularz, linki, podgląd Open Graph oraz działanie wersji językowych.

## Licencja

Warunki użycia znajdują się w pliku `LICENSE.md`. Kod template'u może być modyfikowany i używany w gotowych projektach internetowych, ale nie może być odsprzedawany jako osobny template ani redystrybuowany jako paczka źródłowa.

## Ważne informacje

Licencja projektu nie zastępuje licencji zewnętrznych zależności, fontów, zdjęć, ikon ani innych materiałów. Przed użyciem w projekcie komercyjnym należy sprawdzić prawa do każdego assetu i zastąpić dane demonstracyjne własnymi materiałami.

## Stack

- Astro 7
- Tailwind CSS 4
- TypeScript
- Decap CMS
- Vitest
