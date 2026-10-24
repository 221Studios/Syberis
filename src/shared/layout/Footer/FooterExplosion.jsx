"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  PiBalloonFill,
  PiBoneFill,
  PiBowlFoodFill,
  PiCookieFill,
  PiDogFill,
  PiHeartFill,
  PiHouseFill,
  PiPawPrintFill,
  PiSnowflakeFill,
  PiStarFill,
} from "react-icons/pi";

import "./FooterExplosion.css";

gsap.registerPlugin(ScrollTrigger);

const EXPLOSION_ICONS = [
  PiDogFill,
  PiPawPrintFill,
  PiHeartFill,
  PiBoneFill,
  PiBalloonFill,
  PiBowlFoodFill,
  PiHouseFill,
  PiSnowflakeFill,
  PiCookieFill,
  PiStarFill,
];

const EXPLOSION_CONFIG = {
  gravity: 0.25,
  friction: 0.99,
  particleSize: 120,
  horizontalForce: 20,
  verticalForce: 15,
  rotationSpeed: 10,
};
const EXPLOSION_TRIGGER_OFFSET = 80;

class Particle {
  constructor(element, config) {
    this.element = element;
    this.x = 0;
    this.y = 0;
    this.vx = (Math.random() - 0.5) * config.horizontalForce;
    this.vy = -config.verticalForce - Math.random() * 10;
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
    this.config = config;
  }

  update() {
    this.vy += this.config.gravity;
    this.vx *= this.config.friction;
    this.vy *= this.config.friction;
    this.rotationSpeed *= this.config.friction;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
  }
}

function getParticleSize() {
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1200;
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 800;
  const baseOnWidth = Math.floor(viewportWidth * 0.1);
  const baseOnHeight = Math.floor(viewportHeight * 0.12);
  return Math.max(
    72,
    Math.min(EXPLOSION_CONFIG.particleSize, baseOnWidth, baseOnHeight),
  );
}

export default function FooterExplosion({ footerRef, lenis }) {
  const explosionContainerRef = useRef(null);
  const particleRefs = useRef([]);
  const pathname = usePathname();
  const [exploded, setExploded] = useState(false);

  useGSAP(
    () => {
      let hasExploded = false;
      let checkTimeout;

      const explode = () => {
        const footerEl = footerRef.current;
        if (!footerEl) return;

        if (hasExploded) return;
        hasExploded = true;
        const size = getParticleSize();
        explosionContainerRef.current?.style.setProperty(
          "--particle-size",
          `${size}px`,
        );
        setExploded(true);
      };

      const resetExplosion = () => {
        hasExploded = false;
        setExploded(false);
        particleRefs.current = [];
      };

      const checkFooterPosition = () => {
        const footerEl = footerRef.current;
        if (!footerEl) return;

        const footerRect = footerEl.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (footerRect.top > viewportHeight - EXPLOSION_TRIGGER_OFFSET) {
          resetExplosion();
        } else {
          explode();
        }
      };

      const initialCheckTimer = window.setTimeout(checkFooterPosition, 500);
      const trigger = ScrollTrigger.create({
        trigger: footerRef.current,
        start: `top bottom-=${EXPLOSION_TRIGGER_OFFSET}`,
        end: "bottom top",
        onEnter: explode,
        onEnterBack: explode,
        onUpdate: checkFooterPosition,
        onLeave: resetExplosion,
        onLeaveBack: resetExplosion,
      });

      const scrollHandler = () => {
        clearTimeout(checkTimeout);
        checkTimeout = setTimeout(checkFooterPosition, 5);
      };

      const resizeHandler = () => {
        const size = getParticleSize();
        explosionContainerRef.current?.style.setProperty(
          "--particle-size",
          `${size}px`,
        );
        resetExplosion();
        ScrollTrigger.refresh();
      };

      let detachScroll = () => {};
      if (lenis) {
        lenis.on("scroll", scrollHandler);
        detachScroll = () => lenis.off("scroll", scrollHandler);
      } else {
        window.addEventListener("scroll", scrollHandler, { passive: true });
        detachScroll = () =>
          window.removeEventListener("scroll", scrollHandler);
      }

      window.addEventListener("resize", resizeHandler);

      return () => {
        detachScroll();
        trigger.kill();
        window.removeEventListener("resize", resizeHandler);
        window.clearTimeout(initialCheckTimer);
        clearTimeout(checkTimeout);
        resetExplosion();
      };
    },
    { scope: footerRef, dependencies: [lenis, pathname] },
  );

  useGSAP(
    () => {
      if (!exploded) return;

      const container = explosionContainerRef.current;
      const elements = particleRefs.current.filter(Boolean);
      if (!container || !elements.length) return;

      const particles = elements.map(
        (element) => new Particle(element, EXPLOSION_CONFIG),
      );

      let animationId;
      const animate = () => {
        particles.forEach((particle) => particle.update());
        animationId = requestAnimationFrame(animate);

        if (
          particles.every((particle) => particle.y > container.offsetHeight / 2)
        ) {
          cancelAnimationFrame(animationId);
          setExploded(false);
          particleRefs.current = [];
        }
      };

      animate();

      return () => cancelAnimationFrame(animationId);
    },
    { dependencies: [exploded], scope: explosionContainerRef },
  );

  return (
    <div
      className="footer-explosion-container"
      ref={explosionContainerRef}
      aria-hidden="true"
    >
      {exploded &&
        EXPLOSION_ICONS.map((Icon, index) => (
          <span
            key={index}
            className="footer-explosion-particle"
            ref={(element) => {
              particleRefs.current[index] = element;
            }}
          >
            <Icon />
          </span>
        ))}
    </div>
  );
}
