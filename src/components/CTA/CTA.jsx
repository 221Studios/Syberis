"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "../Button/Button";
import Copy from "../Copy/Copy";

import "./CTA.css";

gsap.registerPlugin(ScrollTrigger);

const CTA_SVG_NS = "http://www.w3.org/2000/svg";
const CTA_CENTER = 300;
const CTA_CARDINAL_RADIUS = 170;

const CTA_CARDINALS = [
  { label: "N", angle: -90 },
  { label: "E", angle: 0 },
  { label: "S", angle: 90 },
  { label: "W", angle: 180 },
];

const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=Mazowieckie%2C%20Gmina%20Ciepiel%C3%B3w";

const SERVICES = [
  "Odrobaczanie i szczepienia",
  "Książeczka zdrowia",
  "Socjalizacja w domu i kontakt z dziećmi",
  "Zachipowane szczeniaki",
  "Wyprawka na start",
  "Kontakt po odbiorze",
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

      const cards = gsap.utils.toArray(".cta-service-card");
      if (cards.length) {
        gsap.set(cards, { y: 80, opacity: 0 });
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".cta-services",
            start: "top 80%",
            once: true,
          },
        });
      }

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

  return (
    <section className="cta" ref={ctaRef}>
      <div className="container">
        <div className="cta-layout">
          <div className="cta-left">
            <a
              className="cta-map-link"
              href={MAPS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Znajdź nas w Google Maps"
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
            </div>

            </a>

            <Button href="/kontakt" theme="dark">
              Zapytaj o szczeniaka
            </Button>
          </div>

          <div className="cta-right">
            <Copy splitType="words">
              <h6 className="cta-services-title">Co zapewniamy</h6>
            </Copy>

            <div className="cta-services">
              {SERVICES.map((service, id) => (
                <div className="cta-service-card" key={service}>
                  <p className="mono sm">0{id + 1}</p>
                  <p className="md">{service}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cta-footer">
          <p className="mono sm">/Zadzwoń/</p>
          <p className="mono sm">/Napisz/</p>
        </div>
      </div>
    </section>
  );
}
