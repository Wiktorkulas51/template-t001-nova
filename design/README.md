# Profil wizualny Nova

To repozytorium publikuje jeden spójny profil wizualny: `nova.md`. Plik
opisuje tokeny kolorów, odstępów, promieni, typografii i animacji używane przez
komponenty template’u Nova.

## Synchronizacja

Po zmianie tokenów uruchom:

```bash
npm run design:sync
npm run design:lint
```

Skrypt synchronizuje profil do `src/styles/themes.css`,
`src/styles/tailwind-theme.css` oraz `tailwind.tokens.js`. Pliki wygenerowane
przez skrypt są częścią repozytorium, aby build po klonowaniu był powtarzalny.

Nova jest jedynym profilem obsługiwanym przez stronę i wewnętrzne Studio.
Nowe kierunki wizualne powinny powstawać w osobnym repozytorium lub jako nowy
template, a nie jako ukryty przełącznik w tym produkcie.
