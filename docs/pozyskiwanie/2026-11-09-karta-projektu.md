# Syberis — karta projektu i audyt punktu startowego

Odczyt z 9 listopada 2026 r. Etap 1 planu pozyskiwania klientów.

## Karta projektu

| Pole | Ustalenie i status | Uzupełnienie |
| --- | --- | --- |
| Firma i oferta | **Deklaracja hodowli.** Syberis, domowa hodowla białych husky syberyjskich poza FCI. | Potwierdzić aktualną ofertę, dokumenty, badania oraz warunki wizyty, rezerwacji i odbioru. |
| Oferta priorytetowa | **Deklaracja hodowli.** Miot Kai i Ozziego jest zakończony. Miot C po Mii i Ozziem liczy sześć szczeniąt. Cora, Chia i Celi są zarezerwowane, a Cosmo, Cziko i Cezar dostępne. Wizyty i odbiór od 10 stycznia 2027 r. | Rok wynika z daty rozmowy. Imiona dobrano na potrzeby aktualizacji. Dodać zdjęcia i datę urodzenia, gdy hodowla je poda. |
| Odbiorca | **Propozycja.** Osoby rozważające szczenię husky, które chcą ocenić dopasowanie rasy do swojego domu, poznać rodziców i sprawdzić warunki odbioru. | Wypisać najczęstsze pytania i kryteria hodowli przy wyborze domu. |
| Lokalizacja i rynek | **Deklaracja hodowli.** Okolice Radomia. Chętni mogą zgłaszać się z dowolnej lokalizacji. Szczegóły miejsca wizyty i odbioru hodowla przekazuje po umówieniu. | Publicznie podawać tylko okolice Radomia. |
| Akcja klienta | **Deklaracja hodowli.** Odebrane zapytanie o szczeniaka przez telefon lub SMS. Profil OLX i e-mail są kanałami dodatkowymi. | Ustalić, kto rejestruje zapytania i jak odnotowuje ich wynik. |
| Wartościowe zapytanie | **Propozycja.** Unikalne, odebrane zapytanie z możliwością odpowiedzi, dotyczące aktualnego lub planowanego miotu i z realną gotowością do rozmowy o potrzebach psa oraz odbiorze. | Uzgodnić kryteria z hodowlą. Zapisać osobno statusy zapytania, rezerwacji i odbioru. |
| Źródła ruchu i baza | **Obserwacja.** OLX to udokumentowany kanał obecności. Ruch, liczba zapytań, rezerwacji i sprzedaży są do ustalenia. | Poprosić o porównywalne 90 dni z Search Console, analityki i rejestru zapytań, o ile istnieją. Bez historii zacząć pomiar od daty uruchomienia. |
| Cel, termin i możliwości | **Propozycja.** Pozyskać odpowiednie domy dla trzech dostępnych piesków. Liczba potrzebnych zapytań, docelowy termin oceny i zasoby do obsługi pozostają do ustalenia. | Ustalić wskaźniki od pierwszego kontaktu do odbioru oraz warunki współpracy. |

Proponowana ścieżka przy dostępnym miocie to wejście na stronę → aktualny miot → zdjęcia, status i rodzice → zapytanie → rozmowa → ewentualna rezerwacja i odbiór. Jeżeli wszystkie szczenięta znalazły domy, ścieżka prowadzi do zapytania o kolejny miot, o ile hodowla chce przyjmować takie zgłoszenia.

## Wersje i obserwacje

**A — publiczna.** [README zdalnego repozytorium](https://github.com/221Studios/Syberis/blob/3f352088ded1e65dca63efc04628a6e0401a9b55/README.md) wskazuje [syberis.221studio.pl](https://syberis.221studio.pl/). Nie udało się powiązać odpowiedzi publicznej z żadnym commitem Syberis.

**B — projekt.** Aktualizację oferty wykonano na gałęzi `codex/syberis-aktualny-miot` w osobnym katalogu roboczym. Bazą jest `3f35208`, zgodny z aktualnym `main` w obu sprawdzonych adresach repozytorium. Pierwotny katalog ma `main` na `82798bc`. Historie są rozbieżne o 12 commitów tylko lokalnie i 32 tylko po stronie zdalnej.

**C — docelowa.** Proponowany stan to działająca strona Syberis pod zatwierdzonym adresem, z prawidłowym HTTPS, zweryfikowaną ofertą i dostępnym kontaktem na telefonie. Wdrożenie do ustalenia po ustaleniu właściciela hostingu i wersji źródłowej.

| Wersja | Adres lub obszar | Wynik odczytu | Wpływ i następny krok |
| --- | --- | --- | --- |
| A | [Strona po HTTPS](https://syberis.221studio.pl/) | **Potwierdzone.** Windows curl zwrócił błąd 60, a Python niezależnie potwierdził niedopasowanie nazwy hosta w certyfikacie. | Odbiorca może zobaczyć ostrzeżenie przed wejściem. Opiekun hostingu powinien zweryfikować konfigurację domeny, przypisanie certyfikatu i routing. |
| A | [Strona po HTTP](http://syberis.221studio.pl/) | **Potwierdzone.** HTTP 200 bez przekierowania. Dokument ma tytuł „221 — grupa projektowa \| Poznań”, canonical do `https://221.pl/` i adres kontaktowy Studia 221. | Główny adres otwiera stronę innej marki. Po naprawie sprawdzić przekierowanie HTTP do HTTPS i treść docelową. |
| A | `/mioty`, `/mioty/kaja-a`, `/rodzice`, `/kontakt`, `/galeria` | **Potwierdzone.** Wszystkie adresy zwróciły 404 po HTTP. Po HTTPS występuje błąd certyfikatu. | Publicznej ścieżki klienta Syberis nie dało się przejść na żadnym urządzeniu. Powtórzyć testy po przywróceniu strony. |
| A | Indeksowanie i wydajność | **Obserwacja.** `robots.txt` i `sitemap.xml` zwracają 404 po HTTP. Próbka wyszukiwania jest w [notatce publicznej](2026-11-09-zrodla-publiczne.md). Próba przez API PageSpeed Insights zwróciła 429 z powodu limitu zapytań. | Po naprawie uruchomić pomiary strony głównej i aktualnego miotu w PSI na telefonie i komputerze. Odczytać indeksację w Search Console. |
| B | Strona główna, `/mioty/c` i `/mioty/kaja-a` | **Zaktualizowano w projekcie.** Strona główna kieruje do miotu C. Miot Kai jest zakończony. Aki, Aria, Ayla i Abi są oznaczeni jako sprzedani, zgodnie z imionami zapisanymi w aktualnej bazie kodu. | Odebrać publiczną wersję po przywróceniu hostingu. |
| B | Kontakt i warunki | **Zaktualizowano lokalnie.** Telefon i SMS na pierwszym ekranie kontaktu. Termin wizyty i odbioru podaje strona miotu C. Link OLX kieruje do [profilu sprzedawcy](https://www.olx.pl/oferty/uzytkownik/18Del/) powiązanego z [ogłoszeniem wskazanym przez hodowlę](https://www.olx.pl/d/oferta/siberian-husky-biala-suczka-niebieskie-oczy-szczeniak-hodowla-syberis-CID103-ID1ciAfS.html?reason=seller_listing). | Wskazane ogłoszenie dotyczy suczki. Podpiąć konkretne ogłoszenie miotu C, kiedy będzie dostępne. |

Źródła kodu zdalnego: [dane hodowli i miotów](https://github.com/221Studios/Syberis/blob/3f352088ded1e65dca63efc04628a6e0401a9b55/src/data/kennel.js), [strona główna](https://github.com/221Studios/Syberis/blob/3f352088ded1e65dca63efc04628a6e0401a9b55/src/app/page.jsx), [komponent kontaktu](https://github.com/221Studios/Syberis/blob/3f352088ded1e65dca63efc04628a6e0401a9b55/src/features/contact/Contact.jsx). Test HTTP można powtórzyć poleceniem `curl.exe -IL https://syberis.221studio.pl/` oraz żądaniami GET po HTTP.

Na aktualnej bazie przeszły testy projektu i build. W lokalnej przeglądarce przy szerokościach 390 i 1440 px sprawdzono przejście ze strony głównej do miotu C, status wszystkich szczeniąt obu miotów oraz widoczność i adresy linków telefonu i SMS na stronie kontaktu.

## Dostępy i odbiór

| System | Właściciel i stan | Dowód odbioru |
| --- | --- | --- |
| Domena i hosting | Opiekun do potwierdzenia. README opisuje wdrożenie na serwerze Studio 221. | HTTPS działa bez ostrzeżeń, HTTP przekierowuje, a strona główna, miot i kontakt wyświetlają treści Syberis. |
| Dane hodowli i OLX | Właściciel hodowli do potwierdzenia. Profil powiązany w zdalnym kodzie. | Potwierdzone dostępność, zdjęcia, warunki odbioru oraz aktywny adres ogłoszenia. |
| Search Console i analityka | Stan kont i uprawnień do potwierdzenia. | Eksport dla poprawnej domeny z okresem, krajami, zapytaniami, stronami, kliknięciami, wyświetleniami, CTR i pozycją. |
| Rejestr kontaktów | System i osoba obsługująca zapytania do potwierdzenia. | Zbiorcze liczby odebranych, kwalifikowanych, zarezerwowanych i zakończonych odbiorem w tym samym okresie. |

- **Zachować** układ miot → szczenięta → rodzice → kontakt i możliwość kontaktu bez formularza.
- **Uzupełnić** aktualne dane miotu, warunki odbioru i odpowiedzialność za zapytania.
- **Poprawić** publiczny routing i HTTPS, następnie uzgodnić komunikat o dostępności we wszystkich kanałach.
- **Zweryfikować** źródło wdrożenia, działanie kontaktu na telefonie i komputerze, Search Console oraz pomiary.

Etap 1 pozostaje otwarty do czasu ustalenia punktu odniesienia i odbioru publicznej ścieżki. Część publiczną etapu 2 można rozpocząć od [profilu OLX](https://www.olx.pl/oferty/uzytkownik/18Del/).
