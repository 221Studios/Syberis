"use client";

import Preloader, {
  isInitialLoad,
  INTRO_DURATION,
} from "@/shared/layout/Preloader/Preloader";
import Showreel from "@/features/home/Showreel/Showreel";
import About from "@/features/home/About/About";
import FeaturedCards from "@/features/home/FeaturedCards/FeaturedCards";
import CTA from "@/features/home/CTA/CTA";
import Copy from "@/shared/ui/Copy/Copy";
import { KENNEL } from "@/data/kennel";

import "./hero.css";

export default function Home() {
  const heroDelay = isInitialLoad ? INTRO_DURATION : 0.5;
  const footerDelay = isInitialLoad ? INTRO_DURATION + 0.5 : 0.75;

  return (
    <>
      <Preloader />

      <section className="hero">
        <div className="hero-img">
          <img
            src="/images/hero.jpg"
            alt="Białe szczenię husky o niebieskich oczach"
          />
        </div>

        <div className="container">
          <div className="hero-header">
            <Copy animateOnScroll={false} delay={heroDelay}>
              <h1 className="subheader">Hodowla</h1>
            </Copy>
            <Copy animateOnScroll={false} delay={heroDelay}>
              <h1>{KENNEL.name}</h1>
            </Copy>
          </div>

          <div className="hero-footer">
            <Copy variant="flicker" delay={footerDelay} animateOnScroll={false}>
              <p className="mono sm">
                Niedługo nowy miot. Zapraszamy do kontaktu.
              </p>
            </Copy>
            <Copy variant="flicker" delay={footerDelay} animateOnScroll={false}>
              <p className="mono sm">[ Działamy od 2023 roku ]</p>
            </Copy>
          </div>
        </div>
      </section>

      <About />

      <Showreel />

      <CTA />

      <FeaturedCards />
    </>
  );
}
