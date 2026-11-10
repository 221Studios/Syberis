import Link from "next/link";
import Deck from "@/features/litters/Deck/Deck";
import {
  LITTERS,
  countByStatus,
  formatDate,
  getCurrentLitter,
  getParent,
  litterSlug,
  litterTitle,
  mutedPhoto,
} from "@/data/kennel";
import "../seo-content.css";

export const metadata = {
  alternates: { canonical: "/mioty" },
  title: "Szczeniaki husky – aktualne mioty | Syberis",
  description:
    "Szczeniaki husky syberyjskiego z hodowli Syberis w okolicach Radomia. Zobacz zdjęcia, poznaj rodziców i sprawdź dostępność.",
};

function litterSlide(litter) {
  const sire = getParent(litter.sireSlug);
  const dam = getParent(litter.damSlug);
  const free = countByStatus(litter.puppies, "free");
  const isCurrent = litter.status === "current";

  return {
    image: isCurrent ? litter.photo : mutedPhoto(litter.photo),
    meta:
      isCurrent && litter.handoverFrom
        ? `Odbiór od ${formatDate(litter.handoverFrom)}`
        : litter.born && `Urodzone ${formatDate(litter.born)}`,
    kicker: isCurrent ? "Aktualny miot" : "Miot zakończony",
    title: litterTitle(litter.letter),
    href: `/mioty/${litterSlug(litter)}`,
    footnote: `${sire.name} × ${dam.name}`,
    tags: [
      `${litter.puppies.length} szczeniąt`,
      isCurrent ? `Wolne: ${free}` : "Wszystkie w domach",
    ],
  };
}

export default function LittersPage() {
  const current = getCurrentLitter();

  return (
    <main>
      <Deck
        slides={LITTERS.map(litterSlide)}
        counterPrefix="MIOT"
        hint="Przesuń palcem, aby zmienić miot"
        action={{ href: "#o-miotach", label: "O miotach" }}
      />
      <section className="seo-content" id="o-miotach">
        <h1>Szczeniaki husky syberyjskiego</h1>
        <p>
          W domowej hodowli Syberis w okolicach Radomia wychowujemy białe husky
          syberyjskie. Na stronie każdego miotu znajdziesz zdjęcia szczeniąt i
          informacje o ich rodzicach. Status przy każdym szczeniaku pokazuje
          jego dostępność.
        </p>
        <p>
          {current ? (
            <Link href={`/mioty/${litterSlug(current)}`}>
              Zobacz aktualny miot {current.letter}
            </Link>
          ) : (
            <Link href="/kontakt">Zapytaj o kolejny miot</Link>
          )}
          {" · "}
          <Link href="/rodzice">Poznaj rodziców</Link>
          {" · "}
          <Link href="/kontakt">Umów wizytę</Link>
          {" · "}
          <Link href="/husky-syberyjski">Poznaj rasę</Link>
        </p>
      </section>
    </main>
  );
}
