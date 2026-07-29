"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Menu from "./components/Menu/Menu";
import Footer from "./components/Footer/Footer";
import MusicToggle from "./components/MusicToggle/MusicToggle";
import TransitionProvider from "./providers/TransitionProvider";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = 1000;
// Full-screen decks and the 3D wall own the whole viewport; skip footer there.
// Litter detail pages (`/mioty/c`) are normal scroll pages and keep the footer.
const FOOTER_EXCLUDED_EXACT = ["/mioty"];
const FOOTER_EXCLUDED_PREFIXES = ["/galeria"];

const LENIS_EASING = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

const LENIS_SHARED = {
  easing: LENIS_EASING,
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  infinite: false,
  wheelMultiplier: 1,
  orientation: "vertical",
  smoothWheel: true,
  syncTouch: true,
};

const LENIS_MOBILE = {
  ...LENIS_SHARED,
  duration: 0.8,
  smoothTouch: true,
  touchMultiplier: 1.5,
  lerp: 0.09,
};

const LENIS_DESKTOP = {
  ...LENIS_SHARED,
  duration: 1.2,
  smoothTouch: false,
  touchMultiplier: 2,
  lerp: 0.1,
};

/** Keep GSAP ScrollTrigger in sync with Lenis and refresh after route changes. */
function LenisScrollSync() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  useEffect(() => {
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}

export default function ClientLayout({ children }) {
  const pageRef = useRef(null);
  const pageWrapperRef = useRef(null);
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const lenisOptions = isMobile ? LENIS_MOBILE : LENIS_DESKTOP;
  const showFooter =
    !FOOTER_EXCLUDED_EXACT.includes(pathname) &&
    !FOOTER_EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  return (
    <TransitionProvider>
      <ReactLenis root options={lenisOptions}>
        <LenisScrollSync />
        <div className="page" ref={pageRef}>
          <Menu />
          <MusicToggle />
          <div className="page-wrapper" ref={pageWrapperRef}>
            {children}
            {showFooter && <Footer />}
          </div>
        </div>
      </ReactLenis>
    </TransitionProvider>
  );
}
