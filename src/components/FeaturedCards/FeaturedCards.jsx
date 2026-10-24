"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "../Button/Button";
import Copy from "../Copy/Copy";

import "./FeaturedCards.css";

gsap.registerPlugin(ScrollTrigger);

const FEATURED_CARD_START_Y = "115%";

const FEATURED_CARDS_DATA = [
  {
    subtitle: "Aktualny miot",
    title: "Miot A",
    image: "/litters/kaja-a/cover.jpg",
    href: "/mioty/kaja-a",
  },
  {
    subtitle: "Nasze psy",
    title: "Rodzice",
    image: "/parents/ozzie-home.jpg",
    imagePosition: "50% 86%",
    imageScale: 1.8,
    imageOffsetX: "12%",
    imageOffsetY: "-24%",
    href: "/rodzice",
  },
  {
    subtitle: "Zdjęcia z hodowli",
    title: "Galeria",
    image: "/images/featured-1.jpg",
    href: "/galeria",
  },
  {
    subtitle: "Poprzednie mioty",
    title: "Miot A i B",
    image: "/litters/b/cover-muted.jpg",
    href: "/mioty",
  },
  {
    subtitle: "Zapytaj o szczeniaka",
    title: "Kontakt",
    image: "/images/featured-5.jpg",
    href: "/kontakt",
  },
];

export default function FeaturedCards({
  kicker = "[ Hodowla Syberis ]",
  title,
  ctaHref = "/mioty",
  ctaLabel = "Zobacz mioty",
  cards = FEATURED_CARDS_DATA,
}) {
  const featuredCardsRef = useRef(null);
  const featuredCardsContainerRef = useRef(null);

  useGSAP(
    () => {
      const section = featuredCardsRef.current;
      const cards =
        featuredCardsContainerRef.current?.querySelectorAll(".featured-card");

      if (!section || !cards?.length) return;

      let featuredCardsTrigger;

      function setup() {
        cleanup();

        cards.forEach((card) => gsap.set(card, { clearProps: "all" }));

        if (window.innerWidth < 1000) return;

        const totalCards = cards.length;

        featuredCardsTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * totalCards}px`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress * totalCards;

            cards.forEach((card, i) => {
              const cardProgress = gsap.utils.clamp(0, 1, progress - i);
              const nextCardProgress = gsap.utils.clamp(
                0,
                1,
                progress - (i + 1),
              );

              gsap.set(card, {
                y: gsap.utils.interpolate(
                  FEATURED_CARD_START_Y,
                  "-50%",
                  cardProgress,
                ),
                scale: gsap.utils.interpolate(1, 0.85, nextCardProgress),
                "--overlay-opacity": gsap.utils.interpolate(
                  0,
                  1,
                  nextCardProgress * 0.5,
                ),
              });
            });
          },
        });
      }

      function cleanup() {
        featuredCardsTrigger?.kill();
        featuredCardsTrigger = null;
      }

      // Showreel creates its pin after async SVG decode. Measuring FeaturedCards
      // start before that spacer exists pins "Poznaj mioty" over CTA / Znajdź nas.
      let cancelled = false;
      let bootRaf = 0;

      function showreelPinReady() {
        const showreel = document.querySelector(".showreel");
        if (!showreel) return true;
        return Boolean(showreel.closest(".pin-spacer"));
      }

      function boot(attempt = 0) {
        if (cancelled) return;
        if (!showreelPinReady() && attempt < 90) {
          bootRaf = window.requestAnimationFrame(() => boot(attempt + 1));
          return;
        }
        setup();
        ScrollTrigger.refresh();
      }

      bootRaf = window.requestAnimationFrame(() => boot(0));

      let featuredCardsResizeTimer;
      const handleFeaturedCardsResize = () => {
        clearTimeout(featuredCardsResizeTimer);
        featuredCardsResizeTimer = setTimeout(() => {
          setup();
          ScrollTrigger.refresh();
        }, 250);
      };

      window.addEventListener("resize", handleFeaturedCardsResize);

      return () => {
        cancelled = true;
        cleanup();
        cancelAnimationFrame(bootRaf);
        clearTimeout(featuredCardsResizeTimer);
        window.removeEventListener("resize", handleFeaturedCardsResize);
      };
    },
    { scope: featuredCardsRef },
  );

  return (
    <section className="featured-cards" ref={featuredCardsRef}>
      <div className="container">
        <div className="featured-cards-wrapper">
          <div className="featured-cards-header">
            <Copy variant="flicker">
              <p className="mono">{kicker}</p>
            </Copy>

            <Copy splitType="words">
              <h5 className="v2">
                {title ?? (
                  <>
                    Poznaj mioty, rodziców{" "}
                    <span className="featured-cards-nowrap">
                      i zdjęcia z hodowli
                    </span>
                  </>
                )}
              </h5>
            </Copy>

            <Copy variant="slide" delay={0.5}>
              <Button href={ctaHref}>{ctaLabel}</Button>
            </Copy>
          </div>

          <div
            className="featured-cards-container"
            ref={featuredCardsContainerRef}
          >
            {cards.map((card) => (
              <Link href={card.href} className="featured-card" key={card.title}>
                <div className="featured-card-img">
                  <img
                    src={card.image}
                    alt={card.alt ?? card.title}
                    style={
                      card.imagePosition || card.imageScale
                        ? {
                            objectPosition: card.imagePosition,
                            "--featured-card-img-scale": card.imageScale,
                            "--featured-card-img-x": card.imageOffsetX,
                            "--featured-card-img-y": card.imageOffsetY,
                          }
                        : undefined
                    }
                  />
                </div>
                <div className="featured-card-content">
                  <h6 className="subheader">{card.subtitle}</h6>
                  <h5>{card.title}</h5>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
