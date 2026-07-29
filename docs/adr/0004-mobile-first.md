# Mobile-first jako priorytet QA

Kupujący psy wchodzą głównie z telefonu. Szablony (house-of-epochs i inne) mają responsywne `@media` / `clamp`, więc nie startujemy z desktop-only. Przy budowie Syberis mobile jest pierwszym targetem weryfikacji; ciężkie efekty (Three/GSAP) dostają fallback albo uproszczenie, jeśli psują telefon.
