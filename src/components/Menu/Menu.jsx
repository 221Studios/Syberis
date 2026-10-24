"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { FiChevronUp, FiChevronDown, FiPhone } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa6";
import { CONTACT } from "@/data/kennel";
import { mailHref, telHref } from "@/lib/contact";

import "./Menu.css";

const MENU_PRIMARY_LINKS = [
  { href: "/", label: "Start" },
  { href: "/mioty", label: "Mioty" },
  { href: "/rodzice", label: "Rodzice" },
  { href: "/galeria", label: "Galeria" },
  { href: "/kontakt", label: "Kontakt" },
];

const MENU_CONTACT_PRIMARY = [
  {
    href: telHref(CONTACT.phonePrimary),
    label: CONTACT.phonePrimary,
    Icon: FiPhone,
    external: false,
  },
  {
    href: CONTACT.olx,
    label: "OLX",
    external: true,
  },
];

const MENU_CONTACT_SECONDARY = [
  {
    href: CONTACT.tiktok,
    label: "TikTok",
    Icon: FaTiktok,
    external: true,
  },
  {
    href: mailHref(CONTACT.email),
    label: "E-mail",
    external: false,
  },
];

function isSpecialHref(href) {
  return /^(https?:|tel:|mailto:)/i.test(href);
}

function MenuLineLink({
  href,
  label,
  className = "",
  onClick,
  Icon,
  external,
}) {
  const content = (
    <span className="menu-line-mask">
      <span className="menu-line">
        {Icon ? <Icon className="menu-line-icon" aria-hidden="true" /> : null}
        {label}
      </span>
    </span>
  );

  if (external || isSpecialHref(href)) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {content}
    </Link>
  );
}

export default function Menu() {
  const [openPath, setOpenPath] = useState(null);
  const [railExpanded, setRailExpanded] = useState(false);
  const toggleWordRef = useRef(null);
  const closeWordRef = useRef(null);
  const lenis = useLenis();
  const pathname = usePathname();
  const isOpen = openPath === pathname;

  useEffect(() => {
    if (closeWordRef.current) {
      gsap.set(closeWordRef.current, { yPercent: 140 });
    }
  }, []);

  useEffect(() => {
    const toggleWord = toggleWordRef.current;
    const closeWord = closeWordRef.current;
    if (!toggleWord || !closeWord) return;

    gsap.to(toggleWord, {
      yPercent: isOpen ? -140 : 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: true,
    });
    gsap.to(closeWord, {
      yPercent: isOpen ? 0 : 140,
      duration: 0.4,
      ease: "power3.out",
      overwrite: true,
    });
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) lenis?.stop();
    else lenis?.start();
  }, [isOpen, lenis]);

  const handleClose = () => {
    if (isOpen) setOpenPath(null);
  };

  const handleLinkClick = (href) => {
    if (isSpecialHref(href) || href === pathname) {
      handleClose();
    }
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
        className={`menu${railExpanded ? " menu--rail-expanded" : " menu--rail-collapsed"}${isOpen ? " menu--open" : ""}`}
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
              onClick={() => setOpenPath(isOpen ? null : pathname)}
              aria-expanded={isOpen}
              aria-controls="main-menu-panel"
            >
              <span className="menu-toggle-mask">
                <p className="mono sm menu-toggle-word" ref={toggleWordRef}>
                  Menu
                </p>
                <p className="mono sm menu-close-word" ref={closeWordRef}>
                  Close
                </p>
              </span>
            </button>

            <button
              type="button"
              className="menu-box menu-rail-arrow"
              onClick={() => setRailExpanded((prev) => !prev)}
              aria-label={railExpanded ? "Zwiń pasek logo" : "Rozwiń logo"}
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

        <aside
          id="main-menu-panel"
          className="menu-panel"
          aria-hidden={!isOpen}
        >
          <div className="menu-panel-top">
            <p className="mono sm">
              Syberis — hobbystyczna hodowla psów rasy Siberian Husky
            </p>
          </div>

          <nav className="menu-panel-nav" aria-label="Strony">
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
            <nav className="menu-panel-contact" aria-label="Kontakt">
              <div className="menu-panel-contact-primary">
                {MENU_CONTACT_PRIMARY.map((link) => (
                  <MenuLineLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                    Icon={link.Icon}
                    external={link.external}
                    className="menu-link menu-link-footer menu-link-contact-primary"
                    onClick={() => handleLinkClick(link.href)}
                  />
                ))}
              </div>
              <div className="menu-panel-contact-secondary">
                {MENU_CONTACT_SECONDARY.map((link) => (
                  <MenuLineLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                    Icon={link.Icon}
                    external={link.external}
                    className="menu-link menu-link-footer"
                    onClick={() => handleLinkClick(link.href)}
                  />
                ))}
              </div>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
