# Wspólne slugi PL dla obu języków

Adresy podstron mają jeden zestaw slugów po polsku (`/rodzice`, `/mioty`, `/kroniki`,
`/kontakt`), używany także w wersji angielskiej (`/en/mioty/c`). Język zmienia treść,
nie ścieżkę. Dzięki temu każdy miot i każdy rodzic ma jedną parę adresów, a
przełącznik języka jest bezstanowym linkiem `localePath(locale, route)` — nie musi
tłumaczyć bieżącej ścieżki.

**Odrzucone:** mapowanie slugów per język (`/en/litters/c`). Wymaga tablicy tłumaczeń
slugów w proxy i w przełączniku, a przy jednym rynku docelowym (Polska) nie kupuje
niczego poza estetyką adresu.
