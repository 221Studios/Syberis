"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import "./Copy.css";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Copy({
  children,
  variant = "rotate",
  splitType = "chars",
  animateOnScroll = true,
  delay = 0,
}) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      let elements = [];

      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      const splits = [];

      if (variant === "rotate") {
        const allTargets = [];

        elements.forEach((element) => {
          if (splitType === "lines") {
            const split = SplitText.create(element, {
              type: "lines",
              linesClass: "copy-line",
            });

            splits.push(split);
            allTargets.push(...split.lines);
          } else if (splitType === "words") {
            const split = SplitText.create(element, {
              type: "words",
              wordsClass: "copy-word",
            });

            splits.push(split);
            allTargets.push(...split.words);
          } else {
            const split = SplitText.create(element, {
              type: "words,chars",
              wordsClass: "copy-word",
              charsClass: "copy-char",
            });

            splits.push(split);

            split.words.forEach((word) => {
              allTargets.push(...word.querySelectorAll(".copy-char"));
            });
          }
        });

        gsap.set(elements, {
          perspective: 700,
          transformStyle: "preserve-3d",
        });

        gsap.set(allTargets, {
          opacity: 0,
          rotationX: -90,
          transformOrigin: "50% 50% -50px",
        });

        function playRotateReveal() {
          const tl = gsap.timeline();

          if (splitType === "lines") {
            tl.to(allTargets, {
              delay: delay,
              rotationX: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.05,
            });
          } else if (splitType === "words") {
            tl.to(allTargets, {
              delay: delay,
              rotationX: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
              stagger: {
                each: 0.035,
                from: "random",
              },
            });
          } else {
            const allWords = [];

            splits.forEach((split) => {
              split.words.forEach((word) => {
                allWords.push({
                  chars: [...word.querySelectorAll(".copy-char")],
                });
              });
            });

            allWords.forEach(({ chars }) => {
              const wordTl = gsap.timeline().to(chars, {
                rotationX: 0,
                opacity: 1,
                duration: 0.75,
                ease: "power3.out",
                stagger: {
                  each: 0.035,
                  from: "random",
                },
              });

              tl.add(wordTl, delay + Math.random() * 0.4);
            });
          }

          return tl;
        }

        if (animateOnScroll) {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 90%",
            once: true,
            onEnter: () => playRotateReveal(),
          });
        } else {
          playRotateReveal();
        }
      }

      if (variant === "flicker") {
        const allChars = [];

        elements.forEach((element) => {
          const split = SplitText.create(element, {
            type: "chars",
            charsClass: "copy-char",
          });

          splits.push(split);
          allChars.push(...split.chars);
        });

        gsap.set(allChars, { opacity: 0 });

        const flickerAnimation = gsap.to(allChars, {
          delay: delay,
          duration: 0.05,
          opacity: 1,
          ease: "power2.inOut",
          stagger: {
            amount: 0.5,
            each: 0.1,
            from: "random",
          },
          paused: animateOnScroll,
        });

        if (animateOnScroll) {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
            onEnter: () => flickerAnimation.play(),
          });
        } else {
          flickerAnimation.play();
        }
      }

      if (variant === "slide") {
        gsap.set(elements, { y: 50, opacity: 0 });

        const slideAnimation = gsap.to(elements, {
          delay: delay,
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
          paused: animateOnScroll,
        });

        if (animateOnScroll) {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 90%",
            once: true,
            onEnter: () => slideAnimation.play(),
          });
        } else {
          slideAnimation.play();
        }
      }

      return () => {
        splits.forEach((split) => split.revert());
      };
    },
    {
      scope: containerRef,
      dependencies: [variant, splitType, animateOnScroll, delay],
    },
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
