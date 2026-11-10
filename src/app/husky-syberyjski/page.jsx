import Link from "next/link";
import "../seo-content.css";

export const metadata = {
  title: "Husky syberyjski – charakter, ruch i pielęgnacja | Syberis",
  description:
    "Jak wygląda życie z huskym syberyjskim? Poznaj potrzeby rasy, sprawdź, jak się przygotować, i dowiedz się, o co zapytać podczas wizyty w hodowli.",
  alternates: { canonical: "/husky-syberyjski" },
};

export default function SiberianHuskyPage() {
  return (
    <main className="seo-content seo-content--article">
      <h1>Husky syberyjski</h1>
      <p>
        Husky syberyjski to pies zaprzęgowy, który potrzebuje regularnego ruchu
        i zajęcia. Jeśli myślisz o szczeniaku, zacznij od sprawdzenia, jak
        spacery, nauka i opieka zmieszczą się w Twoim zwykłym tygodniu.
      </p>

      <h2>Charakter i codzienny ruch</h2>
      <p>
        Wzorzec rasy opisuje husky jako psa przyjaznego i kontaktowego. Na
        spacerach przydaje się bezpieczna smycz lub długa linka. Do swobodnego
        biegania wybieraj dobrze ogrodzony teren. Przed odbiorem ustal, kto
        zapewni psu codzienny ruch i opiekę, gdy domownicy są w pracy lub
        wyjeżdżają.
      </p>

      <h2>Sierść i pielęgnacja</h2>
      <p>
        Husky ma dwuwarstwową sierść z podszerstkiem. W okresie linienia warto
        zarezerwować więcej czasu na wyczesywanie. W Syberis możesz zobaczyć
        zdjęcia białych husky w różnym wieku i{" "}
        <Link href="/rodzice">poznać rodziców szczeniąt</Link>.
      </p>

      <h2>O co zapytać podczas wizyty?</h2>
      <p>
        Zapytaj, jak wygląda dzień szczeniaka, jakie sytuacje już poznał i co
        je. Ustal, jakie dokumenty dostaniesz przy odbiorze i jak przygotować
        transport do domu. Jeśli rozważasz konkretnego psa,{" "}
        <Link href="/mioty">sprawdź aktualne mioty</Link> i{" "}
        <Link href="/kontakt">umów wizytę w hodowli</Link>.
      </p>

      <p>
        <a href="https://www.fci.be/en/nomenclature/SIBERIAN-HUSKY-270.html">
          Wzorzec rasy FCI
        </a>
        {" · "}
        <a href="https://www.shca.org/the-siberian-husky">
          Informacje dla opiekunów od Siberian Husky Club of America
        </a>
      </p>
    </main>
  );
}
