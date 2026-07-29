"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTACT, KENNEL } from "@/data/kennel";
import { mailHref, telHref } from "@/lib/contact";

import "./Footer.css";

const FOOTER_ARC_TEXT = "Białe husky o niebieskich oczach  · ";
const FOOTER_ARC_REPEAT = 14;
const FOOTER_ARC_PATH =
  "M 0,280 C 300,280 450,40 700,40 C 950,40 1100,280 1400,280";

const FOOTER_NAV_LEFT = [
  { label: "Mioty", href: "/mioty" },
  { label: "Rodzice", href: "/rodzice" },
];

const FOOTER_NAV_RIGHT = [
  { label: "Galeria", href: "/galeria" },
  { label: "Kontakt", href: "/kontakt" },
];

const FOOTER_CONTACT_LINKS = [
  { label: CONTACT.phonePrimary, href: telHref(CONTACT.phonePrimary) },
  { label: CONTACT.phoneBackup, href: telHref(CONTACT.phoneBackup) },
  { label: "OLX", href: CONTACT.olx },
];

function arcProgress(footerEl) {
  if (!footerEl) return 0;
  const rect = footerEl.getBoundingClientRect();
  const view = window.innerHeight || 1;
  // 0 when the footer's top meets the viewport bottom; 1 when its bottom leaves the top.
  return Math.min(1, Math.max(0, (view - rect.top) / (view + rect.height)));
}

export default function Footer() {
  const footerRef = useRef(null);
  const footerTextPathRef = useRef(null);
  const pathname = usePathname();
  const lenis = useLenis();
  const pathId = useId().replace(/:/g, "");
  const arcPathId = `footer-arc-path-${pathId}`;

  useEffect(() => {
    const footerEl = footerRef.current;
    const textPath = footerTextPathRef.current;
    if (!footerEl || !textPath) return;

    const apply = () => {
      const offset = -30 + arcProgress(footerEl) * 60;
      textPath.setAttribute("startOffset", `${offset}%`);
    };

    apply();

    // Prefer Lenis scroll frames (same as the rest of the site); fall back to window.
    let detach = () => {};
    if (lenis) {
      lenis.on("scroll", apply);
      detach = () => lenis.off("scroll", apply);
    } else {
      window.addEventListener("scroll", apply, { passive: true });
      detach = () => window.removeEventListener("scroll", apply);
    }

    // Route / layout changes leave ScrollTrigger (and page height) stale — refresh
    // so other sections stay correct, then re-apply the arc offset.
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      apply();
    }, 80);

    window.addEventListener("resize", apply);

    return () => {
      detach();
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", apply);
    };
  }, [lenis, pathname]);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-wrapper">
        <div className="footer-arc">
          <svg
            viewBox="0 0 1400 300"
            xmlns="http://www.w3.org/2000/svg"
            className="footer-arc-svg"
          >
            <defs>
              <path id={arcPathId} d={FOOTER_ARC_PATH} fill="none" />
            </defs>
            <text className="footer-arc-text">
              <textPath
                ref={footerTextPathRef}
                href={`#${arcPathId}`}
                startOffset="-30%"
              >
                {FOOTER_ARC_TEXT.repeat(FOOTER_ARC_REPEAT)}
              </textPath>
            </text>
          </svg>
        </div>

        <div className="footer-content">
          <div className="footer-center">
            <div className="footer-brand">
              <h1 className="subheader">Hodowla</h1>
              <h1>{KENNEL.name}</h1>
            </div>

            <a
              className="footer-newsletter"
              href={mailHref(CONTACT.email)}
              aria-label={`Napisz na ${CONTACT.email}`}
            >
              <span className="footer-newsletter-input">
                <p>Zapytaj o szczeniaka</p>
              </span>
              <span className="footer-newsletter-btn">
                <p className="mono sm">Napisz</p>
              </span>
            </a>
          </div>

          <div className="footer-nav-row">
            <div className="footer-nav footer-nav-left">
              {FOOTER_NAV_LEFT.map(({ label, href }) => (
                <Link href={href} key={label} className="footer-nav-link">
                  <p className="mono sm">{label}</p>
                </Link>
              ))}
            </div>

            <div className="footer-nav footer-nav-right">
              {FOOTER_NAV_RIGHT.map(({ label, href }) => (
                <Link href={href} key={label} className="footer-nav-link">
                  <p className="mono sm">{label}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-contact">
            <div className="footer-socials">
              {FOOTER_CONTACT_LINKS.map(({ label, href }) => (
                <a href={href} key={label} className="footer-social-link">
                  <p className="mono sm selectable">{label}</p>
                </a>
              ))}
            </div>
            <a
              className="sm selectable"
              id="footer-contact-email"
              href={mailHref(CONTACT.email)}
            >
              <p className="sm">{CONTACT.email}</p>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="sm">&copy; Hodowla {KENNEL.name}</p>
          <p className="sm">{KENNEL.claim}</p>
        </div>
      </div>
    </footer>
  );
}
