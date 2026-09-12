"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { SEX_LABEL, formatDate } from "@/data/kennel";

import Copy from "@/components/Copy/Copy";

import "./ParentsAccordion.css";

const EXPANDED = 52;
const COLLAPSED = 16;
const DURATION = 0.6;
const EASE = "power3.out";
const DEFAULT_ACTIVE = 0;
const MOBILE_BREAKPOINT = 1000;

function weightOf(parent) {
  return parent.facts?.find((f) => f.label === "Waga")?.value ?? null;
}

/**
 * Deadlock Studio-style hover accordion — four parents, full kennel info
 * in the expanded card (no separate profile pages).
 */
export default function ParentsAccordion({ parents }) {
  const sectionRef = useRef(null);
  const panelsRef = useRef([]);
  const detailsRef = useRef([]);
  const activeRef = useRef(DEFAULT_ACTIVE);
  const stackedRef = useRef(false);

  const applyLayout = useCallback((stacked) => {
    sectionRef.current?.classList.toggle("parents-accordion--stacked", stacked);

    panelsRef.current.forEach((panel, i) => {
      if (!panel) return;
      const details = detailsRef.current[i];

      if (stacked) {
        gsap.killTweensOf(panel);
        gsap.killTweensOf(details);
        panel.classList.remove("is-expanded");
        panel.style.flexGrow = "";
        panel.style.flexShrink = "";
        panel.style.flexBasis = "";
        if (details) gsap.set(details, { opacity: 1, y: 0 });
        return;
      }

      const isActive = i === activeRef.current;
      panel.classList.toggle("is-expanded", isActive);
      panel.style.flexGrow = isActive ? EXPANDED : COLLAPSED;
      panel.style.flexShrink = "0";
      panel.style.flexBasis = "0";
      if (details) {
        gsap.set(details, {
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 12,
        });
      }
    });
  }, []);

  const setActive = useCallback((index) => {
    if (stackedRef.current) return;
    if (activeRef.current === index) return;
    const prevIndex = activeRef.current;
    activeRef.current = index;

    panelsRef.current.forEach((panel, i) => {
      if (!panel) return;
      gsap.to(panel, {
        flexGrow: i === index ? EXPANDED : COLLAPSED,
        duration: DURATION,
        ease: EASE,
      });
      panel.classList.toggle("is-expanded", i === index);
    });

    const prevDetails = detailsRef.current[prevIndex];
    if (prevDetails) {
      gsap.to(prevDetails, {
        opacity: 0,
        y: 12,
        duration: 0.2,
        ease: "power2.in",
        overwrite: true,
      });
    }

    const activeDetails = detailsRef.current[index];
    if (activeDetails) {
      gsap.to(activeDetails, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.15,
        overwrite: true,
      });
    }
  }, []);

  useEffect(() => {
    panelsRef.current.forEach((panel, i) => {
      if (!panel) return;
      const isActive = i === DEFAULT_ACTIVE;
      panel.classList.toggle("is-expanded", isActive);
      panel.style.flexGrow = isActive ? EXPANDED : COLLAPSED;
      panel.style.flexShrink = "0";
      panel.style.flexBasis = "0";

      const details = detailsRef.current[i];
      if (details) {
        gsap.set(details, {
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 12,
        });
      }
    });

    const handleResize = (initial = false) => {
      const stacked = window.innerWidth < MOBILE_BREAKPOINT;
      if (!initial && stacked === stackedRef.current) return;
      stackedRef.current = stacked;
      applyLayout(stacked);
    };

    handleResize(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [applyLayout, parents]);

  return (
    <section className="parents-accordion" ref={sectionRef}>
      <div className="parents-accordion-header">
        <Copy animateOnScroll={false} delay={0.65}>
          <h1 className="subheader">Nasi</h1>
        </Copy>
        <Copy animateOnScroll={false} delay={0.65}>
          <h1>Rodzice</h1>
        </Copy>
      </div>

      <div className="parents-accordion-panels">
        <div className="container">
          {parents.map((parent, index) => {
            const weight = weightOf(parent);

            return (
              <div
                key={parent.slug}
                ref={(el) => {
                  panelsRef.current[index] = el;
                }}
                className="parents-accordion-panel"
                onMouseEnter={() => setActive(index)}
              >
                <img
                  className="parents-accordion-img"
                  src={parent.photo}
                  style={
                    parent.photoPosition || parent.photoScale
                        ? {
                            objectPosition: parent.photoPosition,
                            "--parent-photo-scale": parent.photoScale,
                            "--parent-photo-x": parent.photoOffsetX,
                            "--parent-photo-y": parent.photoOffsetY,
                          }
                        : undefined
                    }
                  alt={`${parent.name} — białe husky`}
                />

                <div className="parents-accordion-overlay" />

                <div className="parents-accordion-inner">
                  <span className="parents-accordion-number mono">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="parents-accordion-content">
                    <p className="parents-accordion-title">{parent.name}</p>
                    <p className="parents-accordion-role mono">
                      {parent.role}
                    </p>
                  </div>

                  <div
                    className="parents-accordion-details"
                    ref={(el) => {
                      detailsRef.current[index] = el;
                    }}
                  >
                    <p className="mono parents-accordion-meta">
                      {SEX_LABEL[parent.sex]} · ur. {formatDate(parent.born)}
                      {weight ? ` · ${weight}` : ""}
                    </p>
                    <p className="mono parents-accordion-meta">
                      {parent.coat} · oczy {parent.eyes.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
