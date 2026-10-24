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
  title: "Mioty | Syberis",
  description:
    "Mioty białych husky w hodowli Syberis — oznaczane osobno dla każdej suczki.",
};

function litterSlide(litter) {
  const sire = getParent(litter.sireSlug);
  const dam = getParent(litter.damSlug);
  const free = countByStatus(litter.puppies, "free");
  const isCurrent = litter.status === "current";

  return {
    image: isCurrent ? litter.photo : mutedPhoto(litter.photo),
    meta: `Urodzone ${formatDate(litter.born)}`,
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
    <Deck
      slides={LITTERS.map(litterSlide)}
      counterPrefix="MIOT"
      hint="Przesuń palcem, aby zmienić miot"
    />
  );
}
