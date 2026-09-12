"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { SEX_LABEL, STATUS_LABEL, mutedPhoto } from "@/data/kennel";

import "./LitterPuppies.css";

const MOBILE_BREAKPOINT = 1000;
const NAME_HIDE_OFFSET = "170%";
const NAME_SHOW_OFFSET = "5%";

const SplitChars = ({ text, headingRef }) => (
  <h1 ref={headingRef}>
    {text.split("").map((char, index) => (
      <span className="letter" key={`${char}-${index}`}>
        {char === " " ? "\u00A0" : char}
      </span>
    ))}
  </h1>
);

function statusLabelForPuppy(puppy) {
  if (puppy.status === "free") {
    return puppy.sex === "female" ? "Wolna" : "Wolny";
  }

  if (puppy.status === "reserved") {
    return puppy.sex === "female" ? "Zarezerwowana" : "Zarezerwowany";
  }

  return STATUS_LABEL[puppy.status];
}

/**
 * Salle Blanche "Chefs" interaction — avatar row + letter-flip names —
 * wired to puppies of one litter.
 */
export default function LitterPuppies({
  puppies,
  defaultTitle = "Szczeniaki",
}) {
  const avatarContainerRef = useRef(null);
  const avatarRefs = useRef([]);
  const puppyNameRefs = useRef([]);
  const defaultHeadingRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const pickDefaultMobile = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT && puppies.length) {
        setActiveIndex((current) => (current == null ? 0 : current));
      }
    };
    pickDefaultMobile();
    window.addEventListener("resize", pickDefaultMobile);
    return () => window.removeEventListener("resize", pickDefaultMobile);
  }, [puppies]);

  useEffect(() => {
    const avatarContainer = avatarContainerRef.current;
    const avatars = avatarRefs.current.filter(Boolean);
    const puppyNames = puppyNameRefs.current.filter(Boolean);
    const defaultHeading = defaultHeadingRef.current;

    if (!defaultHeading || !avatars.length) return;

    const defaultLetters = defaultHeading.querySelectorAll(".letter");
    gsap.set(defaultLetters, { y: NAME_SHOW_OFFSET });

    let avatarHandlers = [];
    let handleContainerEnter = null;
    let handleContainerLeave = null;

    const enableHoverInteractions = () => {
      avatars.forEach((avatar, index) => {
        const nameElement = puppyNames[index];
        if (!nameElement) return;

        const nameLetters = nameElement.querySelectorAll(".letter");

        const handleAvatarEnter = () => {
          setActiveIndex(index);
          const root = avatar.closest(".litter-puppies");
          const hoverSize =
            parseFloat(
              getComputedStyle(root).getPropertyValue("--avatar-hover"),
            ) || 280;

          gsap.to(avatar, {
            width: hoverSize,
            height: hoverSize,
            duration: 0.5,
            ease: "power4.out",
          });

          gsap.to(defaultLetters, {
            y: `-${NAME_HIDE_OFFSET}`,
            duration: 0.75,
            ease: "power4.out",
            stagger: { each: 0.025, from: "center" },
          });

          gsap.to(nameLetters, {
            y: NAME_SHOW_OFFSET,
            duration: 0.75,
            ease: "power4.out",
            stagger: { each: 0.025, from: "center" },
          });
        };

        const handleAvatarLeave = () => {
          const root = avatar.closest(".litter-puppies");
          const idleSize =
            parseFloat(
              getComputedStyle(root).getPropertyValue("--avatar-size"),
            ) || 200;

          gsap.to(avatar, {
            width: idleSize,
            height: idleSize,
            duration: 0.5,
            ease: "power4.out",
          });

          gsap.to(nameLetters, {
            y: NAME_HIDE_OFFSET,
            duration: 0.75,
            ease: "power4.out",
            stagger: { each: 0.025, from: "center" },
          });
        };

        avatar.addEventListener("mouseenter", handleAvatarEnter);
        avatar.addEventListener("mouseleave", handleAvatarLeave);
        avatarHandlers.push({
          element: avatar,
          onEnter: handleAvatarEnter,
          onLeave: handleAvatarLeave,
        });
      });

      handleContainerEnter = () => {
        gsap.to(defaultLetters, {
          y: `-${NAME_HIDE_OFFSET}`,
          duration: 0.75,
          ease: "power4.out",
          stagger: { each: 0.025, from: "center" },
        });
      };

      handleContainerLeave = () => {
        setActiveIndex(null);
        puppyNames.forEach((name) => {
          const letters = name.querySelectorAll(".letter");
          gsap.to(letters, {
            y: NAME_HIDE_OFFSET,
            duration: 0.75,
            ease: "power4.out",
            stagger: { each: 0.025, from: "center" },
          });
        });

        gsap.to(defaultLetters, {
          y: NAME_SHOW_OFFSET,
          duration: 0.75,
          ease: "power4.out",
          stagger: { each: 0.025, from: "center" },
        });
      };

      avatarContainer.addEventListener("mouseenter", handleContainerEnter);
      avatarContainer.addEventListener("mouseleave", handleContainerLeave);
    };

    const disableHoverInteractions = () => {
      avatarHandlers.forEach(({ element, onEnter, onLeave }) => {
        element.removeEventListener("mouseenter", onEnter);
        element.removeEventListener("mouseleave", onLeave);
      });
      avatarHandlers = [];

      if (handleContainerEnter) {
        avatarContainer.removeEventListener("mouseenter", handleContainerEnter);
        handleContainerEnter = null;
      }
      if (handleContainerLeave) {
        avatarContainer.removeEventListener("mouseleave", handleContainerLeave);
        handleContainerLeave = null;
      }

      gsap.set(defaultLetters, { y: NAME_SHOW_OFFSET });
      puppyNames.forEach((name) => {
        const letters = name.querySelectorAll(".letter");
        gsap.set(letters, { y: NAME_HIDE_OFFSET });
      });
      avatars.forEach((avatar) => {
        gsap.set(avatar, { clearProps: "width,height" });
      });
      setActiveIndex(null);
    };

    let wasDesktop = window.innerWidth >= MOBILE_BREAKPOINT;

    const handleResize = () => {
      const isDesktop = window.innerWidth >= MOBILE_BREAKPOINT;
      if (isDesktop !== wasDesktop) {
        wasDesktop = isDesktop;
        if (isDesktop) {
          enableHoverInteractions();
        } else {
          disableHoverInteractions();
        }
      }
    };

    if (wasDesktop) {
      enableHoverInteractions();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      disableHoverInteractions();
    };
  }, [puppies]);

  const active = activeIndex != null ? puppies[activeIndex] : null;

  return (
    <section
      className={`litter-puppies${active ? " has-active" : ""}`}
    >
      <div className="litter-puppies-avatars" ref={avatarContainerRef}>
        {puppies.map((puppy, index) => (
          <button
            type="button"
            className={`litter-puppies-avatar${
              activeIndex === index ? " is-active" : ""
            }${puppy.status === "sold" ? " is-sold" : ""}`}
            key={puppy.slug}
            ref={(el) => {
              avatarRefs.current[index] = el;
            }}
            onClick={() => setActiveIndex(index)}
            aria-label={puppy.name}
            aria-pressed={activeIndex === index}
          >
            <img
              src={
                puppy.status === "sold" ? mutedPhoto(puppy.photo) : puppy.photo
              }
              alt={puppy.name}
              style={
                puppy.photoPosition
                  ? { objectPosition: puppy.photoPosition }
                  : undefined
              }
            />
          </button>
        ))}
      </div>

      <div className="litter-puppies-names">
        <div
          className="litter-puppies-name litter-puppies-name--default"
          ref={defaultHeadingRef}
        >
          <SplitChars text={defaultTitle} />
        </div>
        {puppies.map((puppy, index) => (
          <div
            className="litter-puppies-name"
            key={puppy.slug}
            ref={(el) => {
              puppyNameRefs.current[index] = el;
            }}
          >
            <SplitChars text={puppy.name} />
          </div>
        ))}
      </div>

      <div
        className={`litter-puppies-detail${active ? " is-visible" : ""}`}
        aria-live="polite"
      >
        {active ? (
          <>
            <h2 className="litter-puppies-detail-name">{active.name}</h2>
            <p className="mono sm litter-puppies-detail-meta">
              {statusLabelForPuppy(active)} · {SEX_LABEL[active.sex]}
            </p>
            <p className="litter-puppies-detail-copy">{active.description}</p>
            {active.traits?.length ? (
              <ul className="litter-puppies-traits">
                {active.traits.map((trait) => (
                  <li key={trait}>{trait}</li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <p className="litter-puppies-detail-copy litter-puppies-detail-hint">
            Najedź na zdjęcie, żeby zobaczyć imię i opis szczeniaka.
          </p>
        )}
      </div>
    </section>
  );
}
