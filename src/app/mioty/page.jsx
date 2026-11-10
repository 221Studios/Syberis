import Deck from "@/features/litters/Deck/Deck";
import {
  LITTERS,
  countByStatus,
  formatDate,
  getParent,
  litterSlug,
  litterTitle,
  mutedPhoto,
} from "@/data/kennel";

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
  return (
    <main aria-label="Mioty">
      <Deck
        slides={LITTERS.map(litterSlide)}
        counterPrefix="MIOT"
        hint="Przesuń palcem, aby zmienić miot"
      />
    </main>
  );
}
