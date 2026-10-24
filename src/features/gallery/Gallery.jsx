"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Copy from "@/shared/ui/Copy/Copy";
import {
  buildCatalogGrid,
  CATALOG_LAYOUT,
  createImagePlane,
  DRAG_SENSITIVITY,
  MOBILE_BREAKPOINT,
} from "./catalog-scene";

import "./gallery.css";

export default function CatalogPage() {
  const catalogCanvasRef = useRef(null);
  const catalogHeaderRef = useRef(null);

  useEffect(() => {
    const catalogCanvas = catalogCanvasRef.current;
    const catalogHeader = catalogHeaderRef.current;
    if (!catalogCanvas) return;

    const catalogScene = new THREE.Scene();
    const catalogCamera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    catalogCamera.position.set(0, 0, 40);

    const catalogRenderer = new THREE.WebGLRenderer({
      canvas: catalogCanvas,
      antialias: true,
      alpha: true,
    });
    catalogRenderer.setSize(window.innerWidth, window.innerHeight);
    catalogRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    catalogRenderer.setClearColor(0x000000, 0);
    catalogRenderer.outputColorSpace = THREE.SRGBColorSpace;

    const catalogLoader = new THREE.TextureLoader();
    const catalogAnisotropy = catalogRenderer.capabilities.getMaxAnisotropy();

    const catalogGrid = buildCatalogGrid(
      CATALOG_LAYOUT.rows,
      CATALOG_LAYOUT.columns,
    );
    const catalogPlanes = [];

    for (let row = 0; row < CATALOG_LAYOUT.rows; row++) {
      for (let col = 0; col < CATALOG_LAYOUT.columns; col++) {
        const plane = createImagePlane(
          row,
          col,
          catalogLoader,
          catalogGrid[row][col],
          catalogAnisotropy,
        );
        catalogPlanes.push(plane);
        catalogScene.add(plane);
      }
    }

    let catalogMouseX = 0;
    let catalogMouseY = 0;
    let catalogTargetX = 0;
    let catalogTargetY = 0;
    const catalogLookAt = new THREE.Vector3(0, 0, 0);

    let catalogHeaderRotX = 0;
    let catalogHeaderRotY = 0;
    let catalogHeaderTransZ = 0;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragBaseX = 0;
    let dragBaseY = 0;

    function isMobile() {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }

    function updateFromNormalized(nx, ny) {
      catalogMouseX = Math.max(-1, Math.min(1, nx));
      catalogMouseY = Math.max(-1, Math.min(1, ny));

      catalogHeaderRotX = -catalogMouseY * 30;
      catalogHeaderRotY = catalogMouseX * 30;
      catalogHeaderTransZ = Math.abs(catalogMouseX * catalogMouseY) * 50;
    }

    function catalogOnMouseMove(e) {
      if (isMobile()) return;

      const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ny =
        (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      updateFromNormalized(nx, ny);
    }

    function onTouchStart(e) {
      if (!isMobile()) return;
      const touch = e.touches[0];
      isDragging = true;
      dragStartX = touch.clientX;
      dragStartY = touch.clientY;
      dragBaseX = catalogMouseX;
      dragBaseY = catalogMouseY;
    }

    function onTouchMove(e) {
      if (!isMobile() || !isDragging) return;
      e.preventDefault();

      const touch = e.touches[0];
      const dx = (touch.clientX - dragStartX) / (window.innerWidth / 2);
      const dy = (touch.clientY - dragStartY) / (window.innerHeight / 2);

      updateFromNormalized(
        dragBaseX + dx * DRAG_SENSITIVITY,
        dragBaseY + dy * DRAG_SENSITIVITY,
      );
    }

    function onTouchEnd() {
      isDragging = false;
    }

    function catalogOnResize() {
      catalogCamera.aspect = window.innerWidth / window.innerHeight;
      catalogCamera.updateProjectionMatrix();
      catalogRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("mousemove", catalogOnMouseMove);
    window.addEventListener("resize", catalogOnResize);
    catalogCanvas.addEventListener("touchstart", onTouchStart, {
      passive: true,
    });
    catalogCanvas.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    catalogCanvas.addEventListener("touchend", onTouchEnd);

    let catalogRafId;

    function catalogAnimate() {
      catalogRafId = requestAnimationFrame(catalogAnimate);

      if (catalogHeader) {
        catalogHeader.style.transform = `
          translate(-50%, -50%)
          perspective(1000px)
          rotateX(${catalogHeaderRotX}deg)
          rotateY(${catalogHeaderRotY}deg)
          translateZ(${catalogHeaderTransZ}px)
        `;
      }

      catalogTargetX += (catalogMouseX - catalogTargetX) * 0.05;
      catalogTargetY += (catalogMouseY - catalogTargetY) * 0.05;

      catalogLookAt.x = catalogTargetX * CATALOG_LAYOUT.lookAtRange;
      catalogLookAt.y = -catalogTargetY * CATALOG_LAYOUT.lookAtRange;
      catalogLookAt.z =
        (catalogLookAt.x * catalogLookAt.x) /
        (CATALOG_LAYOUT.depth * CATALOG_LAYOUT.curvature);

      const catalogTime = performance.now() * 0.001;

      catalogPlanes.forEach((plane) => {
        const {
          basePosition,
          baseRotation,
          parallaxFactor,
          randomOffset,
          rotationModifier,
          phaseOffset,
        } = plane.userData;

        const mouseDistance = Math.sqrt(
          catalogTargetX * catalogTargetX + catalogTargetY * catalogTargetY,
        );
        const parallaxX = catalogTargetX * parallaxFactor * 3 * randomOffset.x;
        const parallaxY = catalogTargetY * parallaxFactor * 3 * randomOffset.y;
        const oscillation =
          Math.sin(catalogTime + phaseOffset) * mouseDistance * 0.1;

        plane.position.x =
          basePosition.x + parallaxX + oscillation * randomOffset.x;
        plane.position.y =
          basePosition.y + parallaxY + oscillation * randomOffset.y;
        plane.position.z =
          basePosition.z + oscillation * randomOffset.z * parallaxFactor;

        plane.rotation.x =
          baseRotation.x +
          catalogTargetY * rotationModifier.x * mouseDistance +
          oscillation * rotationModifier.x * 0.2;

        plane.rotation.y =
          baseRotation.y +
          catalogTargetX * rotationModifier.y * mouseDistance +
          oscillation * rotationModifier.y * 0.2;

        plane.rotation.z =
          baseRotation.z +
          catalogTargetX * catalogTargetY * rotationModifier.z * 2 +
          oscillation * rotationModifier.z * 0.3;
      });

      catalogCamera.lookAt(catalogLookAt);
      catalogRenderer.render(catalogScene, catalogCamera);
    }

    catalogAnimate();

    return () => {
      cancelAnimationFrame(catalogRafId);
      window.removeEventListener("mousemove", catalogOnMouseMove);
      window.removeEventListener("resize", catalogOnResize);
      catalogCanvas.removeEventListener("touchstart", onTouchStart);
      catalogCanvas.removeEventListener("touchmove", onTouchMove);
      catalogCanvas.removeEventListener("touchend", onTouchEnd);

      catalogPlanes.forEach((plane) => {
        plane.geometry.dispose();
        plane.material.map?.dispose();
        plane.material.dispose();
      });
      catalogRenderer.dispose();
    };
  }, []);

  return (
    <section className="catalog">
      <canvas ref={catalogCanvasRef} className="catalog-canvas" />

      <nav className="catalog-nav">
        <Copy variant="flicker" delay={0.85} animateOnScroll={false}>
          <p className="mono sm">Galeria hodowli</p>
        </Copy>
        <Copy variant="flicker" delay={0.85} animateOnScroll={false}>
          <p className="mono sm">Zdjęcia naszych psów</p>
        </Copy>
      </nav>

      <div ref={catalogHeaderRef} className="catalog-header">
        <Copy animateOnScroll={false} delay={0.65}>
          <h1 className="subheader">Nasze</h1>
        </Copy>
        <Copy animateOnScroll={false} delay={0.65}>
          <h1>Husky</h1>
        </Copy>
      </div>
    </section>
  );
}
