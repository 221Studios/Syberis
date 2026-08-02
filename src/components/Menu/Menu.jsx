"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { CONTACT } from "@/data/kennel";
import { mailHref, telHref } from "@/lib/contact";

import "./Menu.css";

gsap.registerPlugin(useGSAP);

const MENU_PRIMARY_LINKS = [
  { href: "/", label: "Start" },
  { href: "/mioty", label: "Mioty" },
  { href: "/rodzice", label: "Rodzice" },
  { href: "/galeria", label: "Galeria" },
  { href: "/kontakt", label: "Kontakt" },
];

const MENU_FOOTER_LINKS_LEFT = [
  { href: telHref(CONTACT.phonePrimary), label: CONTACT.phonePrimary },
];

const MENU_FOOTER_LINKS_RIGHT = [
  { href: mailHref(CONTACT.email), label: "E-mail" },
  { href: CONTACT.olx, label: "Ogłoszenie OLX" },
];

function MenuLineLink({ href, label, className = "", onClick }) {
  return (
    <Link href={href} className={className} onClick={onClick}>
      <span className="menu-line-mask">
        <span className="menu-line">{label}</span>
      </span>
    </Link>
  );
}

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [railExpanded, setRailExpanded] = useState(false);
  const menuRef = useRef(null);
  const menuOpenTlRef = useRef(null);
  const menuCloseTlRef = useRef(null);
  const lenis = useLenis();
  const pathname = usePathname();

  useGSAP(
    () => {
      gsap.set(".menu-panel", {
        clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
        pointerEvents: "none",
        visibility: "hidden",
      });
      gsap.set(".menu-toggle-word", { yPercent: 0 });
      gsap.set(".menu-close-word", { yPercent: 140 });
      gsap.set(".menu-line", { yPercent: 100 });

      menuOpenTlRef.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .set(".menu-panel", { visibility: "visible", pointerEvents: "all" }, 0)
        .to(".menu-toggle-word", { yPercent: -140, duration: 0.5 }, 0)
        .to(".menu-close-word", { yPercent: 0, duration: 0.5 }, 0)
        .to(
          ".menu-panel",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.7,
          },
          0,
        )
        .to(".menu-line", { yPercent: 5, duration: 0.65, stagger: 0.04 }, 0.1);

      menuCloseTlRef.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .set(".menu-panel", { pointerEvents: "none" }, 0)
        .to(".menu-toggle-word", { yPercent: 0, duration: 0.6 }, 0)
        .to(".menu-close-word", { yPercent: 140, duration: 0.6 }, 0)
        .to(
          ".menu-panel",
          {
            clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
            duration: 0.65,
          },
          0.06,
        )
        .set(".menu-panel", { visibility: "hidden" }, 0.71)
        .set(".menu-line", { yPercent: 100 }, 0.75);
    },
    { scope: menuRef },
  );

  useEffect(() => {
    if (!isOpen) return;

    menuOpenTlRef.current?.pause();
    menuCloseTlRef.current?.pause(0);

    gsap.set(".menu-panel", {
      clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
      pointerEvents: "none",
      visibility: "hidden",
    });
    gsap.set(".menu-toggle-word", { yPercent: 0 });
    gsap.set(".menu-close-word", { yPercent: 140 });
    gsap.set(".menu-line", { yPercent: 100 });

    lenis?.start();
    setIsOpen(false);
  }, [pathname]);

  const handleClose = () => {
    if (isOpen) {
      lenis?.start();
      menuOpenTlRef.current?.pause();
      menuCloseTlRef.current?.play(0);
      setIsOpen(false);
    }
  };

  const handleLinkClick = (href) => {
    if (href === pathname) {
      handleClose();
    }
  };

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;

      if (next) {
        lenis?.stop();
        menuCloseTlRef.current?.pause(0);
        gsap.set(".menu-line", { yPercent: 100 });
        menuOpenTlRef.current?.play(0);
      } else {
        lenis?.start();
        menuOpenTlRef.current?.pause();
        menuCloseTlRef.current?.play(0);
      }

      return next;
    });
  };

  return (
    <div className="menu-container">
      <button
        type="button"
        className={`menu-backdrop${isOpen ? " menu-backdrop--open" : ""}`}
        onClick={handleClose}
        aria-label="Zamknij menu"
        tabIndex={isOpen ? 0 : -1}
      />

      <div
        className={`menu${railExpanded ? " menu--rail-expanded" : " menu--rail-collapsed"}`}
        ref={menuRef}
      >
        <div className="menu-rail">
          {railExpanded ? (
            <Link
              href="/"
              className="menu-box menu-logo"
              onClick={() => handleLinkClick("/")}
            >
              <img src="/logo.png" alt="Syberis — strona główna" />
            </Link>
          ) : null}

          <div className="menu-rail-controls">
            <button
              type="button"
              className="menu-box menu-toggle"
              onClick={handleToggle}
              aria-expanded={isOpen}
              aria-controls="main-menu-panel"
            >
              <span className="menu-toggle-mask">
                <p className="mono sm menu-toggle-word">Menu</p>
                <p className="mono sm menu-close-word">Close</p>
              </span>
            </button>

            <button
              type="button"
              className="menu-box menu-rail-arrow"
              onClick={() => setRailExpanded((prev) => !prev)}
              aria-label={
                railExpanded ? "Zwiń menu" : "Rozwiń logo i pasek menu"
              }
              aria-expanded={railExpanded}
            >
              {railExpanded ? (
                <FiChevronUp aria-hidden="true" />
              ) : (
                <FiChevronDown aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <aside id="main-menu-panel" className="menu-panel">
          <div className="menu-panel-top">
            <p className="mono sm">
              Syberis — hobbystyczna hodowla psów rasy Siberian Husky
            </p>
          </div>

          <nav className="menu-panel-nav" aria-label="Main pages">
            {MENU_PRIMARY_LINKS.map((link) => (
              <MenuLineLink
                key={link.href}
                href={link.href}
                label={link.label}
                className="menu-link menu-link-main"
                onClick={() => handleLinkClick(link.href)}
              />
            ))}
          </nav>

          <div className="menu-panel-footer">
            <div className="menu-panel-footer-col">
              {MENU_FOOTER_LINKS_LEFT.map((link) => (
                <MenuLineLink
                  key={link.label}
                  href={link.href}
                  label={link.label}
                  className="menu-link menu-link-footer"
                  onClick={() => handleLinkClick(link.href)}
                />
              ))}
            </div>

            <div className="menu-panel-footer-col">
              {MENU_FOOTER_LINKS_RIGHT.map((link) => (
                <MenuLineLink
                  key={link.label}
                  href={link.href}
                  label={link.label}
                  className="menu-link menu-link-footer"
                  onClick={() => handleLinkClick(link.href)}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
