# Profile designu Starter Kita

Starter Kit jest biblioteką bloków do szybkiego budowania stron. Pliki w tym
katalogu nie są szablonami całych stron. Są profilami wizualnymi, które
zmieniają tokeny używane przez te same bloki.

## Profile wspólne

Pliki znajdujące się bezpośrednio w katalogu `design/` są profilami
dostępnymi w Starter Kicie:

- `default.md` jest bazowym profilem neutralnym.
- `blush.md`, `fix-bud.md` i `gold.md` są gotowymi kierunkami wizualnymi.

Każdy profil jest synchronizowany do `src/styles/themes.css` jako osobny
blok `data-theme`. Wszystkie profile mogą pozostać dostępne w bibliotece
komponentów i w podglądzie Studio.

## Profil projektu klienta

Podczas onboardingu kopia Starter Kita wybiera jeden profil przez
`ACTIVE_TEMPLATE` w `site.config.mjs`. Treści, dane i lokalne wyjątki
pozostają w projekcie klienta.

Nie dodawaj jednorazowego profilu klienta do tego repozytorium tylko dlatego,
że został użyty w jednym wdrożeniu. Jeżeli profil okaże się przydatny w
kolejnych projektach, usuń nazwy klienta i wyjątki wdrożeniowe, a następnie
promuj go do biblioteki profili wspólnych.

## Zasada ponownego użycia

Profil jest dobrym kandydatem do Starter Kita, gdy:

1. opisuje kierunek wizualny, a nie jedną konkretną stronę;
2. działa z kilkoma blokami bez zmian w ich strukturze;
3. używa tokenów semantycznych zamiast kolorów hardcoded;
4. nie zawiera treści, zdjęć ani nazw klienta;
5. przyspiesza następne wdrożenie.

Style wyjątkowe dla jednego klienta powinny pozostać w jego kopii projektu.
