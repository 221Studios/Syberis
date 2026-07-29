# Syberis

Witryna hodowlana husky **Syberis**: klimat i zaufanie plus jasna ścieżka do aktualnych miotów i kontaktu.

## Language

**Syberis**:
Nazwa hodowli i marki witryny (logo, tytuł, stopka).
_Avoid_: „Hodowla Husky” jako jedyna nazwa marki, Codegrid, house-of-epochs

**Języki**:
Witryna v1 jest **tylko po polsku** — kupujący to rynek lokalny. EN dochodzi dopiero przy realnym ruchu z zagranicy, wtedy jako prefix `/en` (ADR 0002).
_Avoid_: Słowniki i warstwa i18n „na zapas” bez treści EN; język tylko w cookie bez zmiany URL

**Paleta Syberis**:
Kolory marki: biel, niebieski i złoty — od białych husky z niebieskimi oczami.
_Avoid_: Losowe pastele spoza biel/niebieski/złoty jako baza marki; różowy „generic kawaii”

**Witryna (hybryda)**:
Publiczna strona hodowli łącząca prestiż i zaufanie z sprzedażą szczeniąt. Główne CTA to aktualne mioty i kontakt; OLX jest kanałem pomocniczym, nie całym produktem.
_Avoid_: Czysty sklep, czysty portfolio bez oferty; marketing „linie FCI”

**Rodzic**:
Dorosły husky należący do hodowli. Aktualni rodzice Syberis: **Ozzie (pies), Cynamon (pies), Kaja (suka), Mia (suka)**.
_Avoid_: Tata jako jedyna kategoria katalogu, „produkt”

**Para miotu**:
Każdy miot ma dokładnie jednego ojca i jedną matkę z rodziców hodowli. Mioty A i B: **Ozzie × Mia** (zakończone). Miot C: **Ozzie × Kaja** (aktualny).
_Avoid_: Miot bez przypisanych rodziców; wielu ojców/matek przy jednym miocie

**Miot C (aktualny)**:
Aktualna oferta Syberis: 5 szczeniąt — **Ciri, Celeste, Cleo, Coco, Cyan** — status startowy wszystkich: wolny (można rezerwować). Wydanie / finalizacja sprzedaży ok. 3.–4. miesiąc życia; start sprzedaży w horyzoncie ~3 miesięcy.
_Avoid_: Pokazywanie C jako zakończonego; sugerowanie natychmiastowego odbioru

**Rezerwacja**:
Zajęcie szczeniaka przed odbiorem; na stronie status przechodzi wolny → zarezerwowany (potem sprzedany).
_Avoid_: „Sprzedany” jako jedyny stan przed odbiorem

**Miot**:
Grupa szczeniąt z jednego miotu, oznaczona literą (A, B, C…). Strona miotu pokazuje rodziców oraz listę szczeniąt; imiona szczeniąt zaczynają się od litery miotu.
_Avoid_: Litter bez litery, „seria”, „batch”

**Szczeniak**:
Piesek należący do konkretnego miotu, z imieniem, zdjęciem, krótkim opisem i podstawowymi info. Wybór szczeniaka na stronie miotu przełącza te dane (switch/slider). Pola v1: imię, status, płeć, data urodzenia, umaszczenie, krótki opis, zdjęcie. Bez ceny i bez rodowodu/metryki FCI.
_Avoid_: Produkt, listing bez przynależności do miotu, cena na karcie, badge rodowodu FCI

**Hodowla (nie-FCI)**:
Legalna hodowla husky poza systemem FCI — bez rodowodów FCI. Szczenięta i rodzice mają pełny standard opieki i dokumentów poza FCI (m.in. chip, książeczka/szczepienia, odrobaczanie, umowa, badania tam gdzie są, odbiór/wizyta, realne warunki bytowania).
_Avoid_: Udawanie hodowli FCI; sugerowanie, że „nie-FCI” = brak opieki

**Status szczeniaka**:
Stan oferty jednego szczeniaka: wolny, zarezerwowany albo sprzedany. Widoczny przy wyborze szczeniaka w miocie.
_Avoid_: Tylko status całego miotu, „niedostępny” bez rozróżnienia rezerwacji

**Profil rodzica**:
Nie osobna podstrona — dane rodzica (bio, cechy, metryka) siedzą w kartach accordion na `/rodzice`.
_Avoid_: Osobny URL per pies w v1

**Strona miotu**:
Osobna strona miotu z rodzicami i przełącznikiem szczeniąt. Szczeniak nie ma własnej strony — wybór dzieje się na stronie miotu.
_Avoid_: Osobna podstrona każdego szczeniaka, listing szczeniąt poza miotem

**Miot zakończony**:
Wcześniejszy miot, w którym szczenięta są już kupione; może zawierać zdjęcia dorosłych psów od właścicieli.
_Avoid_: Usunięty miot, ukryty miot

## Nawigacja (język witryny)

**Rodzice**:
Dział z profilami psów hodowlanych (catalog).
_Avoid_: Catalog, Studio

**Mioty**:
Dział z listą miotów (aktualne i zakończone); osobna pozycja nawigacji, nie podrzędna wobec Rodziców.
_Avoid_: Chowanie oferty tylko w Kronikach

**Galeria**:
Dział ze zdjęciami z hodowli — ściana 3D z komponentu `catalog` (HoE). Historie z życia i zdjęcia od właścicieli siedzą przy miotach zakończonych, nie w osobnym dziale.
_Avoid_: Chronicles/Kroniki jako puste studio copy; osobny dział bez treści

**Kontakt**:
Dział z telefonami (**512 974 084** główny, **780 642 582** zapasowy), mailem **hodowlasyberis@gmail.com** oraz linkiem OLX (v1: `https://www.olx.pl/` jako placeholder do podmiany na konkretne ogłoszenie).
_Avoid_: Transmit, formularz jako obowiązek v1; osobne OLX per miot/szczeniak w v1

**Soft kawaii**:
Kierunek wizualny: realne zdjęcia dominują; pastel, zaokrąglenia, słodkie badge’e i lekkie ilustracje jako akcent — nie pełny cartoon-landing. Paleta bazowa: biel, niebieski, złoty.
_Avoid_: Full kawaii anime-wash, surowy heritage HoE bez cute

**Intro**:
Ekran ładowania 3–5 s z wyciętym najlepszym fragmentem animacji białego husky (`HUSKYANIMACJABIALY`); pokazywany przy każdym wejściu/odświeżeniu, bez przycisku Pomiń.
_Avoid_: Długie intro bez edycji; zapamiętywanie „pokazano raz” w v1

**Launch v1**:
Na start wchodzą prawdziwe dane: profile czterech rodziców, mioty A/B (zakończone) i C (aktualny) oraz pełny kontakt.
_Avoid_: Fake szczenięta na produkcji; sam placeholder bez oferty

**Mobile-first**:
Główny kontekst użycia to telefon (zakup/rezerwacja psa). Szablony bazowe (m.in. house-of-epochs) mają breakpointy ~1000px i `clamp`, ale Syberis weryfikujemy i dopinamy pod mobile jako priorytet QA, nie jako afterthought.
_Avoid_: Desktop-only layout; ciężkie efekty które psują UX na telefonie bez fallbacku

**Treść v1**:
Dane rodziców, miotów i szczeniąt trzymane w jednym pliku danych w repo: `syberis/src/data/kennel.js`; CMS później, gdy edycja zacznie boleć.
_Avoid_: CMS obowiązkowy na start; hardcode’owanie treści w JSX bez pliku danych

**Aplikacja `syberis/`**:
Kod witryny mieszka w katalogu `syberis/` (Next.js, App Router). To **dosłowny fork `house-of-epochs`**: komponenty, animacje i layout zostają, zmieniamy treść, kolory i zdjęcia. Pozostałe katalogi `CGMWT*` to szablony referencyjne, z których wolno wyciągać rozwiązania — nie są częścią produktu.
_Avoid_: Pisanie własnych komponentów zamiast przerabiania HoE; edytowanie szablonów CGMWT jako produkcji; drugi runtime obok Next

**Mapowanie HoE → Syberis**:
`home` → `/` (hero, About, Showreel, FeaturedCards, CTA) · `chronicles` → komponent `Deck` na liście `/mioty` · Salle Blanche `Chefs` → `LitterPuppies` na `/mioty/[letter]` · `catalog` → `/galeria` · Deadlock `Accordion` → `ParentsAccordion` na `/rodzice` · `transmit` → `/kontakt`.
_Avoid_: Kasowanie sekcji HoE zamiast wypełnienia ich treścią hodowli

**Slug**:
Ścieżki są po polsku i bez prefixu: `/mioty/c`, `/rodzice/ozzie`, `/galeria`, `/kontakt`.
_Avoid_: Angielskie slugi (`/litters/c`); różne adresy dla tego samego miotu

**Zdjęcia**:
Media pochodzą z folderów `Miot 1-*` w repo; skrypty `syberis/scripts/contact-sheets.py` (montaż poglądowy z indeksami) i `export-photos.py` (kadr + skala do `public/`) trzymają jedno źródło prawdy o tym, który plik ląduje gdzie.
_Avoid_: Wrzucanie 5 MB JPEG-ów z telefonu prosto do `public/`; stock foto obcych psów
