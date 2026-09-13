# WebScale Starter Kit

Wewnętrzny, data-driven starter kit WebScale do szybkiego tworzenia stron klientów. Atomic Design, system JSON i Decap CMS.

Każdy klient otrzymuje osobną kopię projektu. Starter Kit nie jest przeznaczony do sprzedaży.

## Struktura

```
src/
├── components/
│   ├── ui/atoms/       # Podstawowe bloki (Button, Heading, Text...)
│   ├── ui/molecules/   # Grupy atomów (Navbar, Footer, SectionHeader...)
│   ├── ui/layout/      # Section, Container, RevealGroup
│   └── registry/       # Bloki wielokrotnego użytku (Hero, CTA, FAQ...)
├── data/               # JSON Source of Truth (global, navigation, sections)
├── pages/              # Strony (index, 404, cookies, polityka-prywatnosci)
├── scripts/            # Narzędzia (CMS gen, favicony, optymalizacja, design sync)
├── styles/             # Design tokens i globalne style
└── utils/              # Helpery (URL, scroll, normalizacja danych, animacje)
```

## Komendy

| Komenda | Opis |
|---------|------|
| `npm run dev` | Dev server |
| `npm run build` | Build + generowanie assetów |
| `npm run check:atomic` | Sprawdzenie zgodności z Atomic Design |
| `npm run design:sync` | Sync tokenów MD → CSS |
| `npm run cms:gen` | Generowanie Decap CMS config.yml |
| `npm run cms:check` | Walidacja spójności JSON <-> CMS config <-> rejestr sekcji |
| `npm run check:hardcoded` | Sprawdzenie, czy copy klienta nie znajduje się w komponentach |
| `npm run check:form` | Sprawdzenie konfiguracji formularza i zabezpieczeń |
| `npm run test:form` | Test endpointu PHP, jeśli PHP jest dostępne |
| `npm run cms:local` | Lokalna edycja treści w CMS |
| `npm run cms:proxy` | Lokalny serwer Decap CMS |
| `npm run assets:gen` | Generowanie faviconów |
| `npm run assets:img` | Optymalizacja zdjęć |
| `npm run test` | Uruchomienie testów (Vitest) |
| `npm run qa` | Standardowa bramka jakości |
| `npm run qa:client` | Bramka gotowości projektu klienta |
| `npm run build:prod` | Build produkcyjny bez narzędzi deweloperskich |
| `npm run audit:lighthouse` | Audyt Lighthouse mobile i desktop |
| `npm run push` | Build + FTP deploy |

Nad CMS czuwa `npm run cms:check`, które pilnuje, by dane w `src/data/`, config Decap (`public/admin/config.yml`) i rejestr sekcji (`src/config/section-registry.ts`) nigdy się nie rozjechały. Uruchamiaj je przed buildem, szczególnie po dodaniu nowych sekcji lub plików JSON.

## Workflow nowego klienta

1. Utwórz kopię projektu dla klienta.
2. Uzupełnij dane firmy, SEO, nawigację i zakres stron.
3. Wybierz sekcje w page configach.
4. Uruchom `npm run cms:gen` oraz `npm run cms:check`.
5. Wdróż pierwszą wersję na adres testowy.
6. Wykonaj `npm run qa` i ręczną kontrolę responsywności.
7. Zastąp wszystkie placeholdery prawdziwymi materiałami klienta.
8. Przed oddaniem uruchom `npm run qa:client`, `npm run build:prod` i test live.

Szczegółowy kontrakt znajduje się w `.docs/INTERNAL_CONTRACT.md`.

## Dokumentacja

- `.docs/CONTEXT.md` - architektura projektu
- `.docs/COMPONENTS.md` - mapa komponentów (Atomic Design)
- `.docs/CONTENT_ARCHITECTURE.md` - architektura danych stron i sekcji
- `.docs/AI_STANDARDS.md` - standardy kodu dla AI
- `.docs/CMS_STRUCTURE.md` - struktura Decap CMS
- `.docs/ASSETS_GUIDE.md` - branding i assety
- `.docs/INTERACTION_STANDARDS.md` - wzorce galerii, lightboxa i testów mobilnych
- `AGENTS.md` - instrukcje dla AI agentów

## Tech Stack

- Astro 7
- Tailwind CSS v4
- TypeScript
- Decap CMS
- Vitest
