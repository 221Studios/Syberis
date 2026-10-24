"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "@/shared/ui/Button/Button";
import Copy from "@/shared/ui/Copy/Copy";
import { SEX_LABEL, formatDate, litterTitle } from "@/data/kennel";

import "./ParentProfile.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Long-form profile of a breeding dog: photos are revealed by a compass wipe
 * driven by scroll, one fact block per photo.
 */

const WIPE_START_ANGLE = 225;
const COMPASS_ROTATIONS = [0, 84, -30, 105, 130];
const BLOCK_POSITIONS = [
  "top-left",
  "bottom-right",
  "top-right",
  "bottom-left",
  "top-left",
];

const SVG_NS = "http://www.w3.org/2000/svg";
const COMPASS_SIZE = 600;
const COMPASS_CENTER = 300;

function createTick(degree) {
  const isMajor = degree === 0 || degree % 30 === 0;
  const tick = document.createElementNS(SVG_NS, "line");
  tick.setAttributeNS(null, "x1", COMPASS_CENTER);
  tick.setAttributeNS(null, "y1", 15);
  tick.setAttributeNS(null, "x2", COMPASS_CENTER);
  tick.setAttributeNS(null, "y2", isMajor ? 60 : 45);
  tick.setAttributeNS(null, "stroke", "var(--base-300)");
  tick.setAttributeNS(null, "stroke-width", isMajor ? 2 : 1);
  tick.setAttributeNS(null, "stroke-opacity", isMajor ? 1 : 0.25);
  tick.setAttributeNS(
    null,
    "transform",
    `rotate(${degree}, ${COMPASS_CENTER}, ${COMPASS_CENTER})`,
  );
  return tick;
}

function createDegreeLabel(degree) {
  const label = document.createElementNS(SVG_NS, "text");
  label.setAttributeNS(null, "x", COMPASS_CENTER);
  label.setAttributeNS(null, "y", 80);
  label.setAttributeNS(null, "font-size", "12px");
  label.setAttributeNS(null, "font-family", "DMMono, monospace");
  label.setAttributeNS(null, "fill", "var(--base-300)");
  label.setAttributeNS(null, "text-anchor", "middle");
  label.setAttributeNS(
    null,
    "transform",
    `rotate(${degree}, ${COMPASS_CENTER}, ${COMPASS_CENTER})`,
  );
  label.appendChild(document.createTextNode(degree));
  return label;
}

export default function ParentProfile({ parent, litters }) {
  const sectionRef = useRef(null);
  const compassRef = useRef(null);

  const photos = parent.photos;
  const facts = parent.facts;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const compassSvg = compassRef.current;
      if (!section || !compassSvg) return;

      const layers = [...section.querySelectorAll(".report-img")];
      const wiperHand = section.querySelector(".report-wiper-hand");
      const wiperFixed = section.querySelector(".report-wiper-fixed");

      const total = photos.length;
      const segmentSize = 1 / total;
      let prevSegmentIndex = -1;

      while (compassSvg.firstChild)
        compassSvg.removeChild(compassSvg.firstChild);

      const ringGroup = document.createElementNS(SVG_NS, "g");
      compassSvg.appendChild(ringGroup);

      for (let i = 0; i < 360; i += 2) {
        ringGroup.appendChild(createTick(i));
        if (i % 30 === 0) ringGroup.appendChild(createDegreeLabel(i));
      }

      for (let i = 0; i < total; i++) {
        const clip = `conic-gradient(from ${WIPE_START_ANGLE}deg, #000 0deg, transparent 0deg)`;
        layers[i].style.maskImage = clip;
        layers[i].style.webkitMaskImage = clip;
      }

      gsap.set(wiperHand, { rotation: WIPE_START_ANGLE });
      gsap.set(wiperFixed, { opacity: 0 });
      gsap.set(layers, { scale: 1.25 });

      function setCompassRotate(el, angle) {
        el.setAttributeNS(
          null,
          "transform",
          `rotate(${angle} ${COMPASS_CENTER} ${COMPASS_CENTER})`,
        );
      }

      const ringTweenState = { angle: COMPASS_ROTATIONS[0] };
      setCompassRotate(ringGroup, ringTweenState.angle);

      function setMask(el, angle) {
        const mask = `conic-gradient(from ${WIPE_START_ANGLE}deg, #000 ${angle}deg, transparent ${angle}deg)`;
        el.style.maskImage = mask;
        el.style.webkitMaskImage = mask;
      }

      function getImageScale(imageIndex, segmentIndex, localProgress) {
        const cyclesAhead = segmentIndex - imageIndex;

        if (cyclesAhead < 0) return 1.25;
        if (cyclesAhead === 0) return 1.25 - 0.125 * localProgress;
        if (cyclesAhead === 1) return 1.125 - 0.125 * localProgress;
        return 1;
      }

      function onScroll(progress) {
        const segmentIndex = Math.min(
          Math.floor(progress / segmentSize),
          total - 1,
        );

        if (prevSegmentIndex !== segmentIndex) {
          prevSegmentIndex = segmentIndex;
          const targetAngle =
            COMPASS_ROTATIONS[segmentIndex % COMPASS_ROTATIONS.length];
          gsap.to(ringTweenState, {
            angle: targetAngle,
            duration: 0.75,
            ease: "power3.out",
            overwrite: true,
            onUpdate: () => setCompassRotate(ringGroup, ringTweenState.angle),
          });
        }

        const localProgress =
          (progress - segmentIndex * segmentSize) / segmentSize;
        const angle = localProgress * 360;

        gsap.set(wiperHand, {
          rotation: WIPE_START_ANGLE + segmentIndex * 360 + angle,
        });
        gsap.set(wiperFixed, { opacity: angle > 0 && angle < 360 ? 1 : 0 });

        for (let i = 0; i < total; i++) {
          if (i < segmentIndex) setMask(layers[i], 360);
          else if (i === segmentIndex) setMask(layers[i], angle);
          else setMask(layers[i], 0);

          gsap.set(layers[i], {
            scale: getImageScale(i, segmentIndex, localProgress),
          });
        }
      }

      const totalScroll = window.innerHeight * 2 * total;
      const extraScroll = window.innerHeight * 2;

      const scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalScroll + extraScroll}`,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => onScroll(self.progress),
      });

      return () => {
        scrollTrigger.kill();
        gsap.killTweensOf([ringTweenState]);
        while (compassSvg.firstChild)
          compassSvg.removeChild(compassSvg.firstChild);
      };
    },
    { scope: sectionRef, dependencies: [parent.slug] },
  );

  const litterLine = litters.length
    ? litters.map((litter) => litterTitle(litter.letter)).join(", ")
    : "Jeszcze bez miotu";

  return (
    <>
      <section className="report-hero">
        <div className="container">
          <div className="report-hero-grid">
            <div className="report-hero-image">
              <img src={parent.photo} alt={`${parent.name} — białe husky`} />
            </div>
            <div className="report-hero-right">
              <div className="report-header">
                <Copy animateOnScroll={false} delay={0.65}>
                  <h1 className="subheader">{parent.role}</h1>
                  <h1>{parent.name}</h1>
                </Copy>
              </div>
              <div className="report-hero-meta">
                <div className="report-hero-meta-left">
                  <Copy variant="flicker" delay={0.85} animateOnScroll={false}>
                    <p className="mono sm">{SEX_LABEL[parent.sex]}</p>
                    <p className="mono sm">ur. {formatDate(parent.born)}</p>
                  </Copy>
                </div>
                <div className="report-hero-meta-right">
                  <Copy variant="flicker" delay={0.85} animateOnScroll={false}>
                    <p className="mono sm">Umaszczenie: {parent.coat}</p>
                    <p className="mono sm">Oczy: {parent.eyes}</p>
                  </Copy>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="report-discovery">
        <div className="container">
          <div className="report-copy-grid">
            <div className="report-copy-empty" />
            <div className="report-copy-content">
              <Copy splitType="words">
                <h5 className="v2">Charakter</h5>
              </Copy>

              {parent.bio?.map((paragraph) => (
                <Copy splitType="lines" key={paragraph.slice(0, 24)}>
                  <p className="lg">{paragraph}</p>
                </Copy>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="report-section" ref={sectionRef}>
        <div className="report-canvas">
          <div className="report-layer">
            {photos.map((src, i) => (
              <div
                className="report-img"
                key={src + i}
                style={{
                  backgroundImage: `url(${src})`,
                  zIndex: i,
                  maskImage: `conic-gradient(from ${WIPE_START_ANGLE}deg, #000 0deg, transparent 0deg)`,
                  WebkitMaskImage: `conic-gradient(from ${WIPE_START_ANGLE}deg, #000 0deg, transparent 0deg)`,
                }}
              >
                {facts[i] && (
                  <div
                    className={`report-data-block report-data-${
                      BLOCK_POSITIONS[i % BLOCK_POSITIONS.length]
                    }`}
                  >
                    <p className="sm">{facts[i].label}</p>
                    <p className="mono">{facts[i].value}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <svg
            ref={compassRef}
            className="report-compass"
            width={COMPASS_SIZE}
            height={COMPASS_SIZE}
            viewBox={`0 0 ${COMPASS_SIZE} ${COMPASS_SIZE}`}
            xmlns="http://www.w3.org/2000/svg"
          />
          <div className="report-wiper-fixed">
            <div className="report-wiper-line">
              <div className="report-wiper-dot" />
            </div>
          </div>
          <div className="report-wiper-hand">
            <div className="report-wiper-line">
              <div className="report-wiper-dot" />
            </div>
          </div>
        </div>
      </section>

      <section className="report-current-conditions">
        <div className="container">
          <div className="report-copy-grid">
            <div className="report-copy-empty" />
            <div className="report-copy-content">
              <Copy splitType="words">
                <h5 className="v2">W hodowli</h5>
              </Copy>

              <Copy splitType="lines">
                <p className="lg">
                  Mioty: {litterLine}. Wszystkie nasze psy mieszkają z nami w
                  domu — szczeniaki rosną między ludźmi, a nie w kojcu.
                </p>
              </Copy>

              <Copy splitType="lines">
                <p className="lg">
                  {parent.traits?.length
                    ? `${parent.traits.join(" · ")}. `
                    : ""}
                  Chętnie opowiemy więcej o charakterze rodziców i pokażemy je
                  na spotkaniu przed odbiorem szczeniaka.
                </p>
              </Copy>

              <Copy variant="slide" delay={0.5}>
                <Button href="/mioty">Zobacz mioty</Button>
              </Copy>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
