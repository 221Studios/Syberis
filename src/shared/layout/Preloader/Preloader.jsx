"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { KENNEL } from "@/data/kennel";

import "./Preloader.css";

gsap.registerPlugin(useGSAP);

export let isInitialLoad = true;

function clearIntroGuard() {
  document.documentElement.classList.remove("is-intro");
}

const BLOCK_SIZE_DESKTOP = 120;
const BLOCK_SIZE_MOBILE = 80;
const MOBILE_BREAKPOINT = 1000;

/**
 * The base draws first; the gold layer fills over it with the same stroke dash.
 */
const HUSKY_PATHS = [
  "M247.0,799.0 L245.0,798.0 L245.0,789.0 L266.0,525.0 L331.0,377.0 L335.0,232.0 L401.0,89.0 L422.0,83.0 L428.0,83.0 L479.0,197.0 L505.0,219.0 L512.0,228.0 L418.0,279.0 L404.0,290.0 L362.0,350.0 L350.0,410.0 L355.0,410.0 L406.0,371.0 L447.0,367.0 L483.0,351.0 L507.0,349.0 L526.0,381.0 L500.0,390.0 L469.0,378.0 L463.0,372.0 L460.0,364.0 L456.0,363.0",
  "M541.0,222.0 L588.0,221.0 L626.0,134.0 L647.0,114.0 L662.0,118.0 L667.0,128.0 L691.0,223.0 L699.0,331.0 L698.0,342.0 L693.0,340.0 L656.0,273.0 L592.0,225.0 L589.0,220.0",
  "M999.0,706.0 L997.0,704.0 L922.0,726.0 L811.0,688.0 L701.0,604.0 L685.0,551.0 L681.0,546.0 L681.0,539.0",
  "M480.0,510.0 L564.0,585.0 L629.0,576.0 L629.0,571.0 L620.0,554.0 L614.0,550.0 L606.0,537.0 L601.0,525.0 L594.0,516.0 L594.0,511.0 L646.0,489.0 L640.0,439.0",
  "M672.0,375.0 L664.0,372.0 L661.0,384.0 L645.0,400.0 L629.0,385.0 L629.0,360.0 L632.0,357.0 L663.0,359.0 L663.0,354.0 L645.0,312.0 L636.0,303.0 L629.0,298.0 L604.0,300.0 L603.0,311.0 L610.0,371.0 L621.0,407.0",
  "M535.0,424.0 L544.0,411.0 L541.0,406.0 L556.0,368.0 L547.0,305.0 L544.0,297.0 L517.0,298.0 L497.0,311.0 L452.0,351.0 L457.0,363.0",
  "M557.0,251.0 L561.0,261.0 L567.0,265.0 L585.0,295.0 L595.0,382.0 L609.0,399.0 L621.0,409.0 L624.0,415.0",
  "M699.0,384.0 L703.0,388.0 L705.0,416.0 L682.0,506.0 L679.0,510.0",
  "M570.0,386.0 L568.0,299.0 L561.0,270.0 L561.0,260.0",
  "M668.0,493.0 L674.0,506.0 L679.0,510.0 L679.0,514.0 L675.0,517.0 L658.0,497.0 L653.0,497.0 L600.0,524.0",
  "M672.0,375.0 L691.0,394.0 L695.0,395.0 L696.0,388.0 L701.0,381.0 L701.0,357.0 L697.0,342.0",
  "M678.0,522.0 L679.0,528.0 L650.0,557.0 L619.0,553.0",
  "M668.0,493.0 L648.0,454.0 L642.0,449.0",
  "M670.0,571.0 L657.0,581.0 L629.0,576.0",
  "M570.0,386.0 L546.0,412.0 L541.0,409.0",
  "M670.0,571.0 L678.0,563.0 L681.0,546.0 L680.0,548.0",
];

const DELAY = 0.4;
const BASE_IN = 0.9;
const GAP_AFTER_BASE = 0.15;
const FILL_IN = 1.9;
const GAP_AFTER_FILL = 0.25;
const BOTH_OUT = 0.9;
const GAP_BEFORE_BLOCKS = 0;
const BLOCKS_OUT = 0.5;
const BLOCK_STAGGER = 0.05;

/** Roughly when the curtain is gone, so the page underneath can time its own reveal. */
export const INTRO_DURATION =
  DELAY +
  BASE_IN +
  GAP_AFTER_BASE +
  FILL_IN +
  GAP_AFTER_FILL +
  BOTH_OUT +
  BLOCKS_OUT;

function prepareStrokes(paths) {
  paths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.dataset.length = String(length);
  });
}

export default function Preloader() {
  const wrapperRef = useRef(null);
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);
  const [loaderAnimating, setLoaderAnimating] = useState(isInitialLoad);
  const lenis = useLenis();

  useEffect(() => {
    return () => {
      isInitialLoad = false;
      clearIntroGuard();
    };
  }, []);

  useEffect(() => {
    if (loaderAnimating) {
      if (lenis) lenis.stop();
    } else {
      if (lenis) lenis.start();
    }
  }, [lenis, loaderAnimating]);

  useGSAP(
    () => {
      if (!showPreloader) return;

      const root = wrapperRef.current;
      const blocksEl = root.querySelector(".preloader-blocks");
      const svgEl = root.querySelector(".preloader-svg");
      const basePaths = [
        ...root.querySelectorAll(".preloader-strokes-base path"),
      ];
      const fillPaths = [
        ...root.querySelectorAll(".preloader-strokes-fill path"),
      ];
      const brand = root.querySelector(".preloader-brand");
      const titleWrap = root.querySelector(".preloader-title-wrap");
      const titleFill = root.querySelector(".preloader-title-fill");
      const logo = root.querySelector(".preloader-logo");
      const tagline = root.querySelector(".preloader-tagline");
      if (
        !blocksEl ||
        !svgEl ||
        !basePaths.length ||
        !fillPaths.length ||
        !brand ||
        !titleWrap ||
        !titleFill
      )
        return;

      // Fade and slide the brand elements together while the gold title layer expands.
      const brandParts = [logo, titleWrap, tagline].filter(Boolean);

      const blockSize =
        window.innerWidth < MOBILE_BREAKPOINT
          ? BLOCK_SIZE_MOBILE
          : BLOCK_SIZE_DESKTOP;

      const cols = Math.ceil(window.innerWidth / blockSize);
      const rows = Math.ceil(window.innerHeight / blockSize);

      blocksEl.innerHTML = "";
      blocksEl.style.setProperty("--preloader-columns", String(cols));
      blocksEl.style.setProperty("--preloader-block-size", `${blockSize}px`);

      const cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = document.createElement("div");
          cell.className = "preloader-cell";
          blocksEl.appendChild(cell);
          cells.push(cell);
        }
      }

      gsap.set(cells, { scale: 1.05, transformOrigin: "50% 50%" });
      gsap.set(brandParts, { yPercent: 40, opacity: 0 });
      gsap.set(titleFill, { width: "0%" });

      prepareStrokes(basePaths);
      prepareStrokes(fillPaths);
      gsap.set(fillPaths, { opacity: 0 });
      gsap.set(svgEl, { visibility: "visible" });

      // A backgrounded tab throttles requestAnimationFrame, which stalls the
      // GSAP timeline; without this the curtain could stay up indefinitely.
      const failsafe = setTimeout(
        () => {
          clearIntroGuard();
          setLoaderAnimating(false);
          setShowPreloader(false);
        },
        (INTRO_DURATION + 1.5) * 1000,
      );

      const tl = gsap.timeline({
        delay: DELAY,
        onComplete: () => {
          clearTimeout(failsafe);
          setLoaderAnimating(false);
          setTimeout(() => setShowPreloader(false), 100);
        },
      });

      tl.to(basePaths, {
        strokeDashoffset: 0,
        duration: BASE_IN,
        ease: "power1.inOut",
        stagger: 0.02,
        onComplete: () => {
          gsap.set(fillPaths, { opacity: 1 });
        },
      })
        .to(
          brandParts,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
          },
          0,
        )
        // Reveal the gold husky stroke and title fill together.
        .to(
          fillPaths,
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: FILL_IN,
            ease: "power2.inOut",
            stagger: 0.025,
          },
          `+=${GAP_AFTER_BASE}`,
        )
        .to(
          titleFill,
          {
            width: "100%",
            duration: FILL_IN,
            ease: "power2.inOut",
          },
          "<",
        )
        .to(
          basePaths,
          {
            strokeDashoffset: (i, target) => -Number(target.dataset.length),
            duration: BOTH_OUT,
            ease: "power2.inOut",
          },
          `+=${GAP_AFTER_FILL}`,
        )
        .to(
          fillPaths,
          {
            strokeDashoffset: (i, target) => -Number(target.dataset.length),
            duration: BOTH_OUT,
            ease: "power2.inOut",
          },
          "<",
        )
        .to(
          brandParts,
          {
            yPercent: -20,
            opacity: 0,
            duration: 0.45,
            ease: "power2.in",
            stagger: 0.06,
          },
          "<",
        )
        .set(svgEl, { visibility: "hidden" })
        .fromTo(
          cells,
          { scale: 1.05 },
          {
            scale: 0,
            duration: BLOCKS_OUT,
            ease: "power2.inOut",
            onStart: clearIntroGuard,
            stagger: {
              grid: [rows, cols],
              from: "center",
              each: BLOCK_STAGGER,
            },
          },
          `+=${GAP_BEFORE_BLOCKS}`,
        );

      return () => clearTimeout(failsafe);
    },
    { scope: wrapperRef, dependencies: [showPreloader] },
  );

  if (!showPreloader) return null;

  return (
    <div className="preloader" ref={wrapperRef}>
      <div className="preloader-blocks" aria-hidden />

      <div className="preloader-inner">
        <svg
          className="preloader-svg"
          viewBox="0 0 1000 800"
          preserveAspectRatio="xMinYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <g className="preloader-strokes-base">
            {HUSKY_PATHS.map((d, i) => (
              <path key={`base-${i}`} d={d} fill="none" />
            ))}
          </g>
          <g className="preloader-strokes-fill">
            {HUSKY_PATHS.map((d, i) => (
              <path key={`fill-${i}`} d={d} fill="none" />
            ))}
          </g>
        </svg>

        <div className="preloader-brand">
          <img
            className="preloader-logo"
            src="/logo-white.png"
            alt=""
            aria-hidden
          />

          {/* The gold title layer grows over its dimmed base. */}
          <div className="preloader-title-wrap" aria-label={KENNEL.name}>
            <h2 className="preloader-title preloader-title-base" aria-hidden>
              {KENNEL.name}
            </h2>
            <h2 className="preloader-title preloader-title-fill" aria-hidden>
              {KENNEL.name}
            </h2>
          </div>

          <p className="preloader-tagline mono sm">
            <span className="preloader-tagline-white">Białe </span>
            <span className="preloader-tagline-gold">husky o </span>
            <span className="preloader-tagline-blue">niebieskich </span>
            <span className="preloader-tagline-gold">oczach</span>
          </p>
        </div>
      </div>
    </div>
  );
}
