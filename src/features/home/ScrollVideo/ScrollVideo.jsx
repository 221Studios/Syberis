"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import "./ScrollVideo.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Draws an image sequence to a canvas as the page scrolls.
 * Frames only advance while this element is actually visible on screen —
 * from the moment it appears until it leaves the viewport.
 */
export default function ScrollVideo({
  framesPath = "/media/bieg-frames",
  frameCount = 100,
  className = "",
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;

      const context = canvas.getContext("2d");
      const state = { frame: 0 };
      const images = [];
      let loaded = 0;
      let triggerInstance = null;

      const frameUrl = (index) =>
        `${framesPath}/frame_${String(index + 1).padStart(4, "0")}.jpg`;

      const isOnScreen = () => {
        const rect = wrap.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
      };

      const setCanvasSize = () => {
        const rect = wrap.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const w = Math.max(1, Math.round(rect.width));
        const h = Math.max(1, Math.round(rect.height));
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const render = () => {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        context.clearRect(0, 0, w, h);

        const img = images[state.frame];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const imageAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = w / h;

        let drawWidth;
        let drawHeight;
        let drawX;
        let drawY;

        if (imageAspect > canvasAspect) {
          drawHeight = h;
          drawWidth = drawHeight * imageAspect;
          drawX = (w - drawWidth) / 2;
          drawY = 0;
        } else {
          drawWidth = w;
          drawHeight = drawWidth / imageAspect;
          drawX = 0;
          drawY = (h - drawHeight) / 2;
        }

        context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      };

      const setupScroll = () => {
        if (triggerInstance) triggerInstance.kill();

        // Progress = how far this element itself has travelled through the
        // viewport (enter at bottom → exit at top). When sticky keeps it
        // on screen longer, getBoundingClientRect still drives the scrub
        // only while it intersects the screen.
        triggerInstance = ScrollTrigger.create({
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            if (!isOnScreen()) return;

            const target = Math.round(self.progress * (frameCount - 1));
            if (target !== state.frame) {
              state.frame = target;
              render();
            }
          },
        });
      };

      setCanvasSize();

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.onload = img.onerror = () => {
          loaded += 1;
          if (loaded === frameCount) {
            render();
            setupScroll();
          }
        };
        img.src = frameUrl(i);
        images.push(img);
      }

      const handleResize = () => {
        setCanvasSize();
        render();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        triggerInstance?.kill();
      };
    },
    { scope: wrapRef, dependencies: [framesPath, frameCount] },
  );

  return (
    <div className={`scroll-video ${className}`} ref={wrapRef}>
      <canvas ref={canvasRef} aria-hidden />
    </div>
  );
}
