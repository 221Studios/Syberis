# Syberis — źródła publiczne i próbka widoczności

Odczyt 9 listopada 2026 r. Wersja A oznacza publiczny adres wymieniony w README zdalnego projektu. Obserwacje OLX pochodzą z publicznych kopii platformy odczytanych przez narzędzie wyszukiwania. Informacje w treści ogłoszeń mają status deklaracji ogłoszeniodawcy.

## Dostępność wersji A

| Adres | Sprawdzenie i wynik | Wpływ i kolejny krok |
| --- | --- | --- |
| [HTTPS](https://syberis.221studio.pl/) | Potwierdzone w Windows, 9 listopada. `curl.exe` zwraca błąd 60, `SEC_E_WRONG_PRINCIPAL`, przy zwykłej walidacji TLS na stronie głównej i testowanych ścieżkach. | Wejście na udokumentowany adres HTTPS jest zablokowane. Po poprawce konfiguracji hosta ponowić test bez pomijania walidacji. |
| [HTTP](http://syberis.221studio.pl/) | Potwierdzone. `GET /` zwraca 200 bez przekierowania i wyświetla witrynę Studio 221 (tytuł `221 – grupa projektowa \| Poznań`). `/mioty`, `/mioty/kaja-a`, `/mioty/c`, `/rodzice`, `/kontakt`, `/galeria`, `/robots.txt` i `/sitemap.xml` zwracają 404. | Klient nie przechodzi do oferty ani kontaktu tymi adresami. Po uruchomieniu serwisu sprawdzić przekierowanie HTTP → HTTPS i odpowiedź każdej z głównych ścieżek. |
| `syberis.fly.dev` | Historyczny adres widoczny w stopce lokalnego commita `82798bc`. Lokalny resolver i Google Public DNS zwracają NXDOMAIN. [A](https://dns.google/resolve?name=syberis.fly.dev&type=A) · [AAAA](https://dns.google/resolve?name=syberis.fly.dev&type=AAAA) | Przekierowania przez ten adres nie da się potwierdzić. Aktualny adres wskazano w `README.md` zdalnego commita `3f35208`. |

Odtworzenie obserwacji w PowerShellu poleceniami `curl.exe -sS -D - -o NUL https://syberis.221studio.pl/` i `curl.exe -sS -D - -o NUL http://syberis.221studio.pl/mioty`. Odbiór na telefonie i komputerze oraz pomiar PageSpeed mają sens po przywróceniu działającego HTTPS na stronie Syberis. Właściciel konfiguracji domeny i serwera jest do potwierdzenia.

## Widoczność

Warunki próbki z 9 listopada 2026 r. — tekstowe wyniki narzędzia wyszukiwania internetowego, lokalizacja i urządzenie końcowe nieustalone. Próbka nie określa pozycji w Google, stanu indeksacji, wyników map ani reklam. Brak wyniku w próbce można zweryfikować po przywróceniu strony w inspekcji URL w Search Console.

| Fraza | Intencja | Typ i zaobserwowany wynik |
| --- | --- | --- |
| `"Syberis" hodowla husky Radom` | Znalezienie konkretnej hodowli | Wśród zwróconych wyników jest bezpośrednie [ogłoszenie Syberis na OLX](https://www.olx.pl/d/oferta/siberian-husky-biala-suczka-niebieskie-oczy-szczeniak-hodowla-syberis-CID103-ID1ciAfS.html) i starsza [oferta Budynia](https://www.olx.pl/d/oferta/budyn-bialy-pies-szczeniak-syberian-husky-niebieskie-oczy-hodowla-syberis-CID103-ID1aIbEK.html). Własnej domeny nie znaleziono w próbce. |
| `biały husky szczeniak Radom hodowla` | Zakup szczeniaka w regionie | Wyniki obejmują [listę ofert OLX dla Radomia](https://www.olx.pl/zwierzeta/psy/psy-rasowe/husky/radom/q-hodowla/) i bezpośrednie ogłoszenie Syberis. Własnej podstrony ofertowej nie znaleziono w próbce. |
| `site:syberis.221studio.pl` | Próbka widocznych adresów | Pusta próbka. Do weryfikacji w Search Console po potwierdzeniu domeny. |
| `"Syberis" "husky" "hodowlasyberis@gmail.com"` i wariant z numerami z projektu | Dopasowanie danych kontaktowych | Puste próbki. Oficjalnego profilu mapowego nie potwierdzono na podstawie tego wyszukiwania. |

## Kanał OLX

- **Potwierdzone powiązanie adresu.** Bezpośrednie ogłoszenie Syberis odsyła przez „Więcej od tego ogłoszeniodawcy” do tego samego profilu, który widnieje w `src/data/kennel.js` na `origin/main`. Odczyt tekstowy profilu pokazał zakładki ogłoszeń, ocen i kontaktu bez danych pozwalających wiarygodnie ustalić liczbę aktywnych ogłoszeń i ocen. [Profil OLX](https://www.olx.pl/oferty/uzytkownik/18Del/)
- **Deklaracja ogłoszeniodawcy.** Ogłoszenie ID 1097878136 dotyczy białej suczki, deklaruje datę urodzenia 1 sierpnia 2026 r. oraz metrykę, książeczkę zdrowia, chip, szczepienie i odrobaczenie odpowiednio do wieku. W odczytanej kopii ogłoszenia widnieje odświeżenie 23 października 2026 r., a lista ofert podaje lokalizację Radom. [Ogłoszenie](https://www.olx.pl/d/oferta/siberian-husky-biala-suczka-niebieskie-oczy-szczeniak-hodowla-syberis-CID103-ID1ciAfS.html) · [Lista OLX](https://www.olx.pl/zwierzeta/psy/psy-rasowe/husky/q-niebieskie%20oczy/)
- **Do weryfikacji.** Ogłoszenie nie identyfikuje suczki po imieniu ani po rodzicach. Data 1 sierpnia różni się od danych o zakończonym miocie Kai w starej lokalnej kopii (28 lipca) i na `origin/main` (15 lipca). Właściciel ma potwierdzić imię, przynależność do miotu, dostępność, aktualne warunki, zakres dokumentów oraz to, czy starsze ogłoszenie nadal jest aktywne. Kopie OLX pochodzą z różnych odczytów, a bezpośrednia próba terminalowa na OLX dostała HTTP 403. [Ogłoszenie](https://www.olx.pl/d/oferta/siberian-husky-biala-suczka-niebieskie-oczy-szczeniak-hodowla-syberis-CID103-ID1ciAfS.html) · [Dane na origin/main](https://github.com/221Studios/Syberis/blob/3f352088ded1e65dca63efc04628a6e0401a9b55/src/data/kennel.js)
