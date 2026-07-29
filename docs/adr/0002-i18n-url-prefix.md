# i18n: v1 tylko PL, prefix URL zarezerwowany na EN

v1 wychodzi **tylko po polsku** — kupujący to lokalny rynek (OLX, telefon), a EN oznaczałby podwójną treść i tłumaczenia na pół gwizdka.

Gdy pojawi się realny ruch z zagranicy, język wynika ze ścieżki: `/` = PL, `/en/...` = EN, z przełącznikiem w UI. Odrzucamy model „jeden URL + cookie", bo psuje share linków do miotów i SEO.

Konsekwencja dla kodu: żadnych słowników w v1. Treść siedzi w `src/data/kennel.js` i w komponentach po polsku; dodanie EN to wtedy osobny krok (segment `[lang]` + słowniki), a nie martwa warstwa utrzymywana „na zapas".
