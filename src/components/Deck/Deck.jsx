"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import "./Deck.css";

gsap.registerPlugin(Observer, SplitText);

/**
 * Full-screen one-at-a-time slide deck driven by wheel, swipe or the visible
 * switch. Used for the litter list and, per litter, for picking a puppy.
 *
 * Each slide: { image, kicker, title, href?, meta, tags[], description? }
 */

function preloadImages(sources) {
  return Promise.all(
    sources.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        }),
    ),
  );
}

function DeckTitle({ href, title }) {
  const [hovered, setHovered] = useState(false);

  if (!href) return <h1>{title}</h1>;

  return (
    <Link
      href={href}
      className={`deck-title-link${hovered ? " deck-title-link-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h1>{title}</h1>
      <span className="deck-title-underline" />
    </Link>
  );
}

export default function Deck({ slides, counterPrefix = "NR", hint, action }) {
  const deckSlidesRef = useRef(null);
  const deckCurrentRef = useRef(0);
  const deckAnimatingRef = useRef(false);
  const deckObserverRef = useRef(null);
  const deckTimelineRef = useRef(null);
  const deckSplitsRef = useRef([]);
  const deckActiveFlickerSplits = useRef([]);
  const goToRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const deckSlidesEl = deckSlidesRef.current;
    if (!deckSlidesEl) return;

    const deckSlideEls = [...deckSlidesEl.querySelectorAll(".deck-slide")];
    const deckDecos = [...deckSlidesEl.querySelectorAll(".deck-deco")];
    const deckTotal = deckSlideEls.length;

    deckSplitsRef.current = deckSlideEls.map((slide) => {
      const deckH1s = slide.querySelectorAll(".deck-slide-title-block h1");
      return [...deckH1s].map((h1) =>
        SplitText.create(h1, { type: "words", wordsClass: "deck-word" }),
      );
    });

    function deckGetAllWords(slideIndex) {
      return deckSplitsRef.current[slideIndex].flatMap((split) => split.words);
    }

    function deckGetSlideExtras(slide) {
      const year = slide.querySelector(".deck-slide-year");
      const location = slide.querySelector(".deck-slide-footer > .mono");
      const counter = slide.querySelector(".deck-slide-counter");
      const tags = [...slide.querySelectorAll(".deck-slide-tag")];

      return {
        flickerTargets: [year, location, counter].filter(Boolean),
        tags,
      };
    }

    function deckRevertActiveFlicker() {
      deckActiveFlickerSplits.current.forEach((split) => split.revert());
      deckActiveFlickerSplits.current = [];
    }

    function deckAnimateSlideExtras(slide, tl, startLabel) {
      deckRevertActiveFlicker();

      const { flickerTargets, tags } = deckGetSlideExtras(slide);

      const flickerSplits = flickerTargets.map((el) =>
        SplitText.create(el, {
          type: "chars",
          charsClass: "deck-flicker-char",
        }),
      );

      deckActiveFlickerSplits.current = flickerSplits;

      const allFlickerChars = flickerSplits.flatMap((split) => split.chars);

      gsap.set(allFlickerChars, { opacity: 0 });
      gsap.set(tags, { y: 50, opacity: 0 });

      tl.to(
        allFlickerChars,
        {
          duration: 0.05,
          opacity: 1,
          ease: "power2.inOut",
          stagger: {
            amount: 0.5,
            each: 0.1,
            from: "random",
          },
        },
        startLabel,
      ).to(
        tags,
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
        },
        `${startLabel}+=0.2`,
      );
    }

    function deckResetAllSlides() {
      deckSlideEls.forEach((slide, i) => {
        const deckIsCurrent = i === deckCurrentRef.current;
        gsap.set(slide, {
          scale: 1,
          rotation: 0,
          opacity: deckIsCurrent ? 1 : 0,
          visibility: deckIsCurrent ? "visible" : "hidden",
        });
        slide.classList.toggle("deck-slide-current", deckIsCurrent);

        const deckWords = deckGetAllWords(i);
        gsap.set(deckWords, {
          opacity: deckIsCurrent ? 1 : 0,
          rotationX: deckIsCurrent ? 0 : -90,
          transformOrigin: "50% 50% -50px",
        });
      });
      gsap.set(deckDecos, { autoAlpha: 0, yPercent: 0 });
    }

    function deckInit() {
      deckResetAllSlides();

      const firstSlide = deckSlideEls[0];
      const firstWords = deckGetAllWords(0);

      gsap.set(firstWords, {
        opacity: 0,
        rotationX: -90,
        transformOrigin: "50% 50% -50px",
      });

      const introTl = gsap.timeline({ delay: 0.5 });

      introTl.to(firstWords, {
        rotationX: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        stagger: {
          each: 0.035,
          from: "random",
        },
      });

      deckAnimateSlideExtras(firstSlide, introTl, 0.5);

      introTl.add(() => {
        deckRevertActiveFlicker();
      });

      function deckGoTo(targetIndex, direction) {
        if (deckAnimatingRef.current) return;
        if (targetIndex === deckCurrentRef.current) return;
        deckAnimatingRef.current = true;

        if (deckTimelineRef.current) {
          deckTimelineRef.current.kill();
          deckTimelineRef.current = null;
        }

        const previous = deckCurrentRef.current;
        deckCurrentRef.current = (targetIndex + deckTotal) % deckTotal;
        setActiveIndex(deckCurrentRef.current);

        const currentSlide = deckSlideEls[previous];
        const upcomingSlide = deckSlideEls[deckCurrentRef.current];
        const deckUpcomingWords = deckGetAllWords(deckCurrentRef.current);

        gsap.set(upcomingSlide, {
          opacity: 0,
          scale: 1,
          rotation: 0,
          visibility: "visible",
        });
        gsap.set(deckUpcomingWords, {
          opacity: 0,
          rotationX: -90,
          transformOrigin: "50% 50% -50px",
        });

        const deckTl = gsap.timeline({
          defaults: {
            duration: 0.8,
            ease: "power3.inOut",
          },
          onComplete: () => {
            deckRevertActiveFlicker();
            deckResetAllSlides();
            deckTimelineRef.current = null;
            deckAnimatingRef.current = false;
          },
        });

        deckTimelineRef.current = deckTl;

        deckTl
          .addLabel("start", 0)
          .fromTo(
            deckDecos,
            {
              yPercent: (pos) => (pos ? -100 : 100),
              autoAlpha: 1,
            },
            {
              yPercent: (pos) => (pos ? -50 : 50),
            },
            "start",
          )
          .to(
            currentSlide,
            {
              scale: 1.35,
              rotation: direction * 5,
            },
            "start",
          )
          .addLabel("middle", ">")
          .add(() => {
            currentSlide.classList.remove("deck-slide-current");
            gsap.set(currentSlide, { opacity: 0, visibility: "hidden" });
            upcomingSlide.classList.add("deck-slide-current");
            gsap.set(upcomingSlide, { opacity: 1, visibility: "visible" });
          }, "middle")
          .to(
            deckDecos,
            {
              duration: 1.1,
              ease: "expo",
              yPercent: (pos) => (pos ? -100 : 100),
            },
            "middle",
          )
          .fromTo(
            upcomingSlide,
            {
              scale: 1.35,
              rotation: direction * 5,
            },
            {
              duration: 1.1,
              ease: "expo",
              scale: 1,
              rotation: 0,
            },
            "middle",
          )
          .to(
            deckUpcomingWords,
            {
              rotationX: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
              stagger: {
                each: 0.035,
                from: "random",
              },
            },
            "middle+=0.15",
          );

        deckAnimateSlideExtras(upcomingSlide, deckTl, "middle+=0.5");
      }

      goToRef.current = deckGoTo;

      function deckNavigate(direction) {
        deckGoTo(deckCurrentRef.current + direction, direction);
      }

      deckObserverRef.current = Observer.create({
        type: "wheel,touch",
        onDown: () => deckNavigate(-1),
        onUp: () => deckNavigate(1),
        wheelSpeed: -1,
        tolerance: 10,
      });
    }

    preloadImages(slides.map((slide) => slide.image)).then(deckInit);

    return () => {
      if (deckTimelineRef.current) deckTimelineRef.current.kill();
      if (deckObserverRef.current) deckObserverRef.current.kill();
      deckSplitsRef.current.forEach((slideSplits) =>
        slideSplits.forEach((split) => split.revert()),
      );
      deckRevertActiveFlicker();
      goToRef.current = null;
    };
  }, [slides]);

  const step = (direction) => {
    goToRef.current?.(deckCurrentRef.current + direction, direction);
  };

  const jumpTo = (index) => {
    goToRef.current?.(index, index > deckCurrentRef.current ? 1 : -1);
  };

  const deckTotalLabel = String(slides.length).padStart(2, "0");

  return (
    <div className="deck-page">
      <div className="deck-slides" ref={deckSlidesRef}>
        {slides.map((slide, i) => (
          <div className="deck-slide" key={slide.title + i}>
            <div
              className={`deck-slide-img${
                slide.image?.endsWith(".svg") ? " deck-slide-img--icon" : ""
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="deck-slide-content">
              <div className="deck-slide-top">
                <p className="mono deck-slide-year">{slide.meta}</p>
                {slide.tags?.length ? (
                  <div className="deck-slide-tags">
                    {slide.tags.map((tag) => (
                      <span className="deck-slide-tag" key={tag}>
                        <p className="mono sm">{tag}</p>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="deck-slide-title-block">
                <h1 className="subheader">{slide.kicker}</h1>
                <DeckTitle href={slide.href} title={slide.title} />
                {slide.description && (
                  <p className="lg deck-slide-description">
                    {slide.description}
                  </p>
                )}
              </div>
              <div className="deck-slide-footer">
                <p className="mono sm">{slide.footnote}</p>
                <p className="mono sm deck-slide-counter">
                  {counterPrefix} {String(i + 1).padStart(2, "0")} /{" "}
                  {deckTotalLabel}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="deck-deco"></div>
        <div className="deck-deco"></div>
      </div>

      {action && (
        <Link href={action.href} className="deck-action">
          <p className="mono sm">{action.label}</p>
        </Link>
      )}

      {slides.length > 1 && (
        <>
          <div className="deck-switch">
            <button
              type="button"
              className="deck-switch-arrow"
              onClick={() => step(-1)}
              aria-label="Poprzedni"
            >
              <FiArrowLeft />
            </button>

            <div className="deck-switch-dots">
              {slides.map((slide, i) => (
                <button
                  type="button"
                  key={slide.title + i}
                  className={`deck-switch-dot${
                    i === activeIndex ? " deck-switch-dot-active" : ""
                  }`}
                  onClick={() => jumpTo(i)}
                  aria-label={slide.title}
                  aria-current={i === activeIndex ? "true" : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              className="deck-switch-arrow"
              onClick={() => step(1)}
              aria-label="Następny"
            >
              <FiArrowRight />
            </button>
          </div>

          {hint && <p className="mono sm deck-hint">{hint}</p>}
        </>
      )}
    </div>
  );
}
