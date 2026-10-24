import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import LitterPuppies from "@/features/litters/LitterPuppies/LitterPuppies";
import Button from "@/shared/ui/Button/Button";
import Copy from "@/shared/ui/Copy/Copy";
import {
  LITTERS,
  formatDate,
  getLitter,
  getParent,
  litterSlug,
  litterTitle,
  mutedPhoto,
} from "@/data/kennel";

import "@/features/parents/ParentProfile/ParentProfile.css";
import "./litter.css";

export function generateStaticParams() {
  return LITTERS.map((litter) => ({ letter: litterSlug(litter) }));
}

export async function generateMetadata({ params }) {
  const { letter } = await params;
  const litter = getLitter(letter);
  if (!litter) return { title: "Nie znaleziono miotu | Syberis" };

  return {
    title: `${litterTitle(litter.letter)} | Syberis`,
    description: litter.intro,
  };
}

const LITTER_STATUS = {
  current: "Aktualny miot",
  finished: "Miot zakończony",
};

export default async function LitterPage({ params }) {
  const { letter } = await params;
  const litter = getLitter(letter);
  if (!litter) notFound();

  const sire = getParent(litter.sireSlug);
  const dam = getParent(litter.damSlug);
  const isCurrent = litter.status === "current";
  const freeCount = litter.puppies.filter((p) => p.status === "free").length;
  const availabilityLine = isCurrent
    ? freeCount
      ? `${freeCount} z ${litter.puppies.length} wolnych`
      : "Brak wolnych szczeniąt"
    : "Wszystkie w nowych domach";

  return (
    <main className={`litter-page${isCurrent ? "" : " litter-page--finished"}`}>
      <section className="report-hero litter-hero">
        <div className="container">
          <div className="report-hero-grid">
            <div className="report-hero-image">
              <img
                src={isCurrent ? litter.photo : mutedPhoto(litter.photo)}
                alt={`${litterTitle(litter.letter)} — szczenięta Syberis`}
              />
            </div>

            <div className="report-hero-right litter-hero-right">
              <div className="litter-hero-main">
                <div className="title-stack litter-hero-titles">
                  <Copy animateOnScroll={false} delay={0.5}>
                    <h1 className="subheader">
                      {LITTER_STATUS[litter.status]}
                    </h1>
                  </Copy>
                  <Copy animateOnScroll={false} delay={0.5}>
                    <h1>{litterTitle(litter.letter)}</h1>
                  </Copy>
                </div>

                <div className="litter-hero-body">
                  <Copy splitType="words" delay={0.65} animateOnScroll={false}>
                    <p className="litter-hero-intro">{litter.intro}</p>
                  </Copy>

                  <p className="mono sm litter-hero-availability">
                    [ {availabilityLine}
                    {litter.handoverFrom
                      ? ` · wydania od ${formatDate(litter.handoverFrom)}`
                      : ""}{" "}
                    ]
                  </p>

                  <div className="litter-parents">
                    <p className="mono sm litter-parents-label">
                      Rodzice miotu
                    </p>
                    <Link href="/rodzice" className="litter-parent-card">
                      <img
                        src={sire.photo}
                        alt={sire.name}
                        style={
                          sire.photoPosition
                            ? { objectPosition: sire.photoPosition }
                            : undefined
                        }
                      />
                      <div>
                        <p className="mono sm">{sire.role}</p>
                        <h6>{sire.name}</h6>
                        <span
                          className="litter-parent-arrow"
                          aria-hidden="true"
                        >
                          <FiArrowRight />
                        </span>
                      </div>
                    </Link>
                    <Link href="/rodzice" className="litter-parent-card">
                      <img
                        src={dam.photo}
                        alt={dam.name}
                        style={
                          dam.photoPosition
                            ? { objectPosition: dam.photoPosition }
                            : undefined
                        }
                      />
                      <div>
                        <p className="mono sm">Matka</p>
                        <h6>{dam.name}</h6>
                        <span
                          className="litter-parent-arrow"
                          aria-hidden="true"
                        >
                          <FiArrowRight />
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="litter-split">
        <div className="litter-split-puppies">
          <LitterPuppies puppies={litter.puppies} defaultTitle="Szczeniaki" />
        </div>

        <aside className="litter-split-cta">
          <h5 className="v2">
            {isCurrent
              ? "Zainteresowany którymś ze szczeniąt?"
              : "Szukasz aktualnego miotu?"}
          </h5>
          <div className="litter-split-cta-actions">
            {isCurrent ? (
              <>
                <Button href="/kontakt">Zapytaj o szczeniaka</Button>
                <Button href="/mioty" variant="no-icon" theme="dark">
                  Wszystkie mioty
                </Button>
              </>
            ) : (
              <Button href="/mioty">Wszystkie mioty</Button>
            )}
          </div>
        </aside>
      </section>

      {litter.grownGallery?.length ? (
        <section className="litter-grown">
          <div className="container">
            <Copy variant="flicker">
              <p className="mono litter-grown-label">[ Jak urosły ]</p>
            </Copy>
            <Copy splitType="words">
              <h5 className="v2">Zdjęcia od nowych rodzin</h5>
            </Copy>
            <div className="litter-grown-grid">
              {litter.grownGallery.map((src) => (
                <div className="litter-grown-item" key={src}>
                  <img
                    src={isCurrent ? src : mutedPhoto(src)}
                    alt={`Dorosły pies z ${litterTitle(litter.letter)}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
