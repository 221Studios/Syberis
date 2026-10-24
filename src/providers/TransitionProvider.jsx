"use client";

import { useRef, useEffect, useCallback } from "react";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";

const BLOCK_SIZE_DESKTOP = 120;
const BLOCK_SIZE_MOBILE = 80;
const MOBILE_BREAKPOINT = 1000;

export default function TransitionProvider({ children }) {
  const overlayRef = useRef(null);
  const cellsRef = useRef([]);
  const gridRef = useRef({ rows: 0, cols: 0 });

  const buildGrid = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.innerHTML = "";
    cellsRef.current = [];

    const blockSize =
      window.innerWidth < MOBILE_BREAKPOINT
        ? BLOCK_SIZE_MOBILE
        : BLOCK_SIZE_DESKTOP;
    const cols = Math.ceil(window.innerWidth / blockSize);
    const rows = Math.ceil(window.innerHeight / blockSize);

    gridRef.current = { rows, cols };
    overlay.style.setProperty("--transition-columns", cols);
    overlay.style.setProperty("--transition-block-size", `${blockSize}px`);

    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement("div");
      cell.className = "transition-cell";
      overlay.appendChild(cell);
      cellsRef.current.push(cell);
    }

    gsap.set(cellsRef.current, { scale: 0, willChange: "transform" });
  }, []);

  useEffect(() => {
    buildGrid();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildGrid, 250);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [buildGrid]);

  const animateCells = (from, to, onComplete) => {
    const { rows, cols } = gridRef.current;
    const timeline = gsap.timeline({ onComplete });

    timeline.fromTo(
      cellsRef.current,
      { scale: from },
      {
        scale: to,
        duration: 0.45,
        ease: "power2.inOut",
        stagger: { grid: [rows, cols], from: "center", each: 0.04 },
      },
    );

    return timeline;
  };

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        gsap.set(overlayRef.current, { visibility: "visible" });
        const timeline = animateCells(0, 1.05, next);
        return () => timeline.kill();
      }}
      enter={(next) => {
        const timeline = animateCells(1.05, 0, () => {
          gsap.set(overlayRef.current, { visibility: "hidden" });
          next();
        });
        return () => timeline.kill();
      }}
    >
      <div ref={overlayRef} className="transition-overlay" aria-hidden />
      {children}
    </TransitionRouter>
  );
}
