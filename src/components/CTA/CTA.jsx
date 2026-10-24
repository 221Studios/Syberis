"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  FiActivity,
  FiBookOpen,
  FiCpu,
  FiHeart,
  FiMapPin,
  FiMessageCircle,
  FiPackage,
} from "react-icons/fi";
import Button from "../Button/Button";
import Copy from "../Copy/Copy";
import { CONTACT, KENNEL } from "@/data/kennel";

import "./CTA.css";

gsap.registerPlugin(ScrollTrigger);

const CTA_SVG_NS = "http://www.w3.org/2000/svg";
const CTA_CENTER = 300;
const CTA_CARDINAL_RADIUS = 170;
const PROXIMITY_RADIUS = 220;
const PUSH_FORCE = 6;
const TILT_AMOUNT = 0.08;
const NEIGHBOR_INFLUENCE = 0.15;
const SPRING_STIFFNESS = 0.05;
const BOUNCE_FRICTION = 0.85;
const CURSOR_SMOOTHING = 0.75;
/** Keep transforms inside the CTA so document width/height never grow (scrollbar flash). */
const MAX_CARD_SHIFT = 36;
const MAX_CARD_TILT = 4;

const CTA_CARDINALS = [
  { label: "N", angle: -90 },
  { label: "E", angle: 0 },
  { label: "S", angle: 90 },
  { label: "W", angle: 180 },
];

const LEGAL_NOTE =
  "Nasza hodowla jest zarejestrowana w Ogólnopolskim Klubie Hodowców Rasowych Psów i Kotów „Cat & Dog Club” (woj. świętokrzyskie). Działamy w pełni legalnie i wydajemy dokumentację tego stowarzyszenia.";

const SERVICES = [
  {
    label: "Odrobaczanie i szczepienia",
    Icon: FiActivity,
  },
  {
    label: "Książeczka zdrowia",
    Icon: FiBookOpen,
  },
  {
    label: "Socjalizacja w domu i kontakt z dziećmi",
    Icon: FiHeart,
  },
  {
    label: "Zachipowane szczeniaki",
    Icon: FiCpu,
  },
  {
    label: "Wyprawka na start",
    Icon: FiPackage,
  },
  {
    label: "Kontakt po odbiorze",
    Icon: FiMessageCircle,
  },
];

const LOCATION_NOTES = [
  {
    label: "Odwiedziny",
    value: "Po umówieniu zapraszamy poznać pieski na żywo",
  },
  { label: "Rezerwacje", value: "Telefonicznie lub mailowo" },
];

function createCtaTick(degree) {
  const isMajor = degree === 0 || degree % 30 === 0;
  const ctaTick = document.createElementNS(CTA_SVG_NS, "line");
  ctaTick.setAttributeNS(null, "x1", CTA_CENTER);
  ctaTick.setAttributeNS(null, "y1", 55);
  ctaTick.setAttributeNS(null, "x2", CTA_CENTER);
  ctaTick.setAttributeNS(null, "y2", isMajor ? 95 : 85);
  ctaTick.setAttributeNS(null, "stroke", isMajor ? "white" : "grey");
  ctaTick.setAttributeNS(null, "stroke-width", isMajor ? 3 : 1);
  ctaTick.setAttributeNS(
    null,
    "transform",
    `rotate(${degree}, ${CTA_CENTER}, ${CTA_CENTER})`,
  );
  return ctaTick;
}

function createCtaDegreeLabel(degree) {
  const ctaLabel = document.createElementNS(CTA_SVG_NS, "text");
  ctaLabel.setAttributeNS(null, "x", CTA_CENTER);
  ctaLabel.setAttributeNS(null, "y", 45);
  ctaLabel.setAttributeNS(null, "font-size", "15px");
  ctaLabel.setAttributeNS(null, "font-family", "DMMono, Arial, sans-serif");
  ctaLabel.setAttributeNS(null, "fill", "grey");
  ctaLabel.setAttributeNS(null, "text-anchor", "middle");
  ctaLabel.setAttributeNS(null, "style", "letter-spacing:1.0");
  ctaLabel.setAttributeNS(
    null,
    "transform",
    `rotate(${degree}, ${CTA_CENTER}, ${CTA_CENTER})`,
  );
  ctaLabel.appendChild(document.createTextNode(degree));
  return ctaLabel;
}

function createCtaCardinal(label, angle) {
  const rad = (angle * Math.PI) / 180;
  const x = CTA_CENTER + CTA_CARDINAL_RADIUS * Math.cos(rad);
  const y = CTA_CENTER + CTA_CARDINAL_RADIUS * Math.sin(rad);

  const ctaDir = document.createElementNS(CTA_SVG_NS, "text");
  ctaDir.setAttributeNS(null, "x", x);
  ctaDir.setAttributeNS(null, "y", y);
  ctaDir.setAttributeNS(null, "font-size", "30px");
  ctaDir.setAttributeNS(
    null,
    "font-family",
    "DMMono, Helvetica, Arial, sans-serif",
  );
  ctaDir.setAttributeNS(null, "fill", "white");
  ctaDir.setAttributeNS(null, "text-anchor", "middle");
  ctaDir.setAttributeNS(null, "dominant-baseline", "central");
  ctaDir.appendChild(document.createTextNode(label));
  return ctaDir;
}

function createCtaCenterLine(x1, y1, x2, y2) {
  const ctaLine = document.createElementNS(CTA_SVG_NS, "line");
  ctaLine.setAttributeNS(null, "x1", x1);
  ctaLine.setAttributeNS(null, "y1", y1);
  ctaLine.setAttributeNS(null, "x2", x2);
  ctaLine.setAttributeNS(null, "y2", y2);
  ctaLine.setAttributeNS(null, "stroke", "grey");
  ctaLine.setAttributeNS(null, "stroke-width", 1);
  ctaLine.setAttributeNS(null, "stroke-opacity", 0.5);
  return ctaLine;
}

export default function CTA() {
  const ctaRef = useRef(null);
  const ctaCompassRef = useRef(null);
  const ctaPointerRef = useRef(null);
  const ctaServicesRef = useRef(null);

  useGSAP(
    () => {
      const svg = ctaCompassRef.current;
      if (!svg) return;

      let ctaTrigger;

      function setup() {
        cleanup();

        while (svg.firstChild) svg.removeChild(svg.firstChild);

        const ctaPointer = document.createElementNS(CTA_SVG_NS, "polygon");
        ctaPointer.setAttributeNS(null, "points", "300,5 309,21 291,21");
        ctaPointer.setAttributeNS(null, "fill", "#e9c26a");
        svg.appendChild(ctaPointer);
        ctaPointerRef.current = ctaPointer;

        const ctaCircle = document.createElementNS(CTA_SVG_NS, "circle");
        ctaCircle.setAttributeNS(null, "cx", CTA_CENTER);
        ctaCircle.setAttributeNS(null, "cy", CTA_CENTER);
        ctaCircle.setAttributeNS(null, "r", 46);
        ctaCircle.setAttributeNS(null, "fill", "white");
        ctaCircle.setAttributeNS(null, "fill-opacity", 0.1);
        svg.appendChild(ctaCircle);

        svg.appendChild(createCtaCenterLine(CTA_CENTER, 215, CTA_CENTER, 385));
        svg.appendChild(createCtaCenterLine(215, CTA_CENTER, 385, CTA_CENTER));

        CTA_CARDINALS.forEach(({ label, angle }) => {
          svg.appendChild(createCtaCardinal(label, angle));
        });

        for (let i = 0; i < 360; i += 2) {
          svg.appendChild(createCtaTick(i));
          if (i % 30 === 0) svg.appendChild(createCtaDegreeLabel(i));
        }

        ctaTrigger = ScrollTrigger.create({
          trigger: ctaRef.current,
          start: "top 75%",
          end: "bottom 25%",
          scrub: true,
          onUpdate: (self) => {
            const ctaRotation = self.progress * 180;
            ctaPointerRef.current.setAttributeNS(
              null,
              "transform",
              `rotate(${ctaRotation}, ${CTA_CENTER}, ${CTA_CENTER})`,
            );
          },
        });
      }

      function cleanup() {
        ctaTrigger?.kill();
        ctaTrigger = null;
      }

      setup();

      let ctaResizeTimer;
      const handleCtaResize = () => {
        clearTimeout(ctaResizeTimer);
        ctaResizeTimer = setTimeout(setup, 250);
      };

      window.addEventListener("resize", handleCtaResize);

      return () => {
        cleanup();
        clearTimeout(ctaResizeTimer);
        window.removeEventListener("resize", handleCtaResize);
        while (svg.firstChild) svg.removeChild(svg.firstChild);
      };
    },
    { scope: ctaRef },
  );

  useEffect(() => {
    const cardsContainer = ctaServicesRef.current;
    if (!cardsContainer) return;

    const cards = Array.from(
      cardsContainer.querySelectorAll(".cta-service-card"),
    );
    if (!cards.length) return;

    const cursor = { x: 0, y: 0, vx: 0, vy: 0 };
    let hasCursor = false;
    let prevCursorX = 0;
    let prevCursorY = 0;

    const cardPhysics = cards.map((el, i) => {
      gsap.set(el, {
        x: 0,
        y: 0,
        rotation: 0,
        zIndex: i,
        transformOrigin: "50% 50%",
        willChange: "transform",
      });

      return {
        el,
        restX: 0,
        restY: 0,
        restR: 0,
        x: 0,
        y: 0,
        r: 0,
        vx: 0,
        vy: 0,
        vr: 0,
      };
    });

    function handlePointerMove(e) {
      if (!hasCursor) {
        hasCursor = true;
        prevCursorX = cursor.x = e.clientX;
        prevCursorY = cursor.y = e.clientY;
        return;
      }

      cursor.vx =
        cursor.vx * CURSOR_SMOOTHING +
        (e.clientX - prevCursorX) * (1 - CURSOR_SMOOTHING);
      cursor.vy =
        cursor.vy * CURSOR_SMOOTHING +
        (e.clientY - prevCursorY) * (1 - CURSOR_SMOOTHING);
      prevCursorX = cursor.x = e.clientX;
      prevCursorY = cursor.y = e.clientY;
    }

    function handlePointerLeave() {
      hasCursor = false;
      cursor.vx = 0;
      cursor.vy = 0;
    }

    function calculatePushForce(card) {
      const speed = Math.sqrt(cursor.vx ** 2 + cursor.vy ** 2);
      if (speed < 0.5) return { fx: 0, fy: 0 };

      const rect = card.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - card.x;
      const cy = rect.top + rect.height / 2 - card.y;
      const dist = Math.sqrt((cursor.x - cx) ** 2 + (cursor.y - cy) ** 2);

      if (dist > PROXIMITY_RADIUS) return { fx: 0, fy: 0 };

      const weight = (1 - dist / PROXIMITY_RADIUS) ** 3;

      return {
        fx: cursor.vx * PUSH_FORCE * weight,
        fy: cursor.vy * PUSH_FORCE * weight,
      };
    }

    function applyNeighborInfluence(forces, index) {
      let fx = forces[index].fx;
      let fy = forces[index].fy;

      forces.forEach((f, j) => {
        if (j === index) return;
        const falloff = NEIGHBOR_INFLUENCE ** Math.abs(j - index);
        fx += f.fx * falloff;
        fy += f.fy * falloff * 0.6;
      });

      return { fx, fy };
    }

    function tickCards() {
      const forces = cardPhysics.map(calculatePushForce);

      cardPhysics.forEach((card, i) => {
        const { fx, fy } = applyNeighborInfluence(forces, i);

        card.vx =
          (card.vx + (card.restX + fx - card.x) * SPRING_STIFFNESS) *
          BOUNCE_FRICTION;
        card.vy =
          (card.vy + (card.restY + fy - card.y) * SPRING_STIFFNESS) *
          BOUNCE_FRICTION;
        card.vr =
          (card.vr +
            (card.restR + fx * TILT_AMOUNT - card.r) * SPRING_STIFFNESS) *
          BOUNCE_FRICTION;

        card.x += card.vx;
        card.y += card.vy;
        card.r += card.vr;

        card.x = Math.max(-MAX_CARD_SHIFT, Math.min(MAX_CARD_SHIFT, card.x));
        card.y = Math.max(-MAX_CARD_SHIFT, Math.min(MAX_CARD_SHIFT, card.y));
        card.r = Math.max(-MAX_CARD_TILT, Math.min(MAX_CARD_TILT, card.r));

        gsap.set(card.el, { x: card.x, y: card.y, rotation: card.r });
      });
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    gsap.ticker.add(tickCards);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      gsap.ticker.remove(tickCards);
      cards.forEach((card) => gsap.set(card, { clearProps: "transform" }));
    };
  }, []);

  return (
    <section className="cta" ref={ctaRef}>
      <div className="container">
        <div className="cta-layout">
          <div className="cta-left">
            <a
              className="cta-map-link"
              href={CONTACT.maps}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Znajdź nas w Google Maps — ${KENNEL.location}`}
            >
              <Copy splitType="words">
                <h6>Znajdź nas</h6>
              </Copy>

              <div className="cta-compass">
                <svg
                  ref={ctaCompassRef}
                  id="cta-compass-svg"
                  width="600"
                  height="600"
                  viewBox="0 0 600 600"
                  xmlns="http://www.w3.org/2000/svg"
                />
                <span className="cta-map-pin" aria-hidden="true">
                  <FiMapPin />
                </span>
              </div>

              <p className="mono sm cta-map-cta">{KENNEL.location}</p>
            </a>

            <div className="cta-location-panel">
              {LOCATION_NOTES.map((note) => (
                <div className="cta-location-row" key={note.label}>
                  <p className="mono sm">{note.label}</p>
                  <p>{note.value}</p>
                </div>
              ))}

              <p className="cta-legal-note">{LEGAL_NOTE}</p>

              <Button href="/kontakt" theme="dark">
                Zapytaj o szczeniaka
              </Button>
            </div>
          </div>

          <div className="cta-right">
            <Copy splitType="words">
              <h6 className="cta-services-title">Co zapewniamy</h6>
            </Copy>

            <div className="cta-services" ref={ctaServicesRef}>
              {SERVICES.map(({ label, Icon }, id) => (
                <div className="cta-service-card" key={label}>
                  <div className="cta-service-card__top">
                    <p className="mono sm">0{id + 1}</p>
                    <span className="cta-service-card__icon" aria-hidden="true">
                      <Icon />
                    </span>
                  </div>

                  <p className="md">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
