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

const FEATURED_CARDS_DATA = [
  {
    subtitle: "Aktualny miot",
    title: "Miot C",
    image: "/images/featured-2.jpg",
    href: "/mioty/c",
  },
  {
    subtitle: "Nasze psy",
    title: "Rodzice",
    image: "/images/featured-4.jpg",
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
    image: "/images/featured-3.jpg",
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
  title = "Wszystko o naszych białych husky",
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
          end: `+=${window.innerHeight * totalCards}px`,
          pin: true,
          pinSpacing: true,
          scrub: true,
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
                y: gsap.utils.interpolate("200%", "-50%", cardProgress),
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

      setup();

      let featuredCardsResizeTimer;
      const handleFeaturedCardsResize = () => {
        clearTimeout(featuredCardsResizeTimer);
        featuredCardsResizeTimer = setTimeout(setup, 250);
      };

      window.addEventListener("resize", handleFeaturedCardsResize);

      return () => {
        cleanup();
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
              <h5 className="v2">{title}</h5>
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
                  <img src={card.image} alt={card.alt ?? card.title} />
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
