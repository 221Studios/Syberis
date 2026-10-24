"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Copy from "@/shared/ui/Copy/Copy";

import "./gallery.css";

const images = [
  { src: "/contact/card-1.jpg", width: 1000, height: 1250 },
  { src: "/contact/card-2.jpg", width: 1000, height: 1250 },
  { src: "/gallery/img1.jpg", width: 1100, height: 733 },
  { src: "/gallery/img2.jpg", width: 1100, height: 733 },
  { src: "/gallery/img3.jpg", width: 1100, height: 733 },
  { src: "/gallery/img4.jpg", width: 1100, height: 733 },
  { src: "/gallery/img5.jpg", width: 1100, height: 733 },
  { src: "/gallery/img8.jpg", width: 1100, height: 733 },
  { src: "/gallery/img9.jpg", width: 1100, height: 733 },
  { src: "/gallery/img10.jpg", width: 1100, height: 733 },
  { src: "/images/about.jpg", width: 1200, height: 1500 },
  { src: "/images/featured-1.jpg", width: 1200, height: 1500 },
  { src: "/images/featured-2.jpg", width: 1200, height: 1500 },
  { src: "/images/featured-3.jpg", width: 1200, height: 1500 },
  { src: "/images/featured-4.jpg", width: 1200, height: 1500 },
  { src: "/images/featured-5.jpg", width: 1200, height: 1500 },
  { src: "/images/showreel.jpg", width: 1800, height: 1012 },
  { src: "/litters/a/cover.jpg", width: 1800, height: 1012 },
  { src: "/litters/a/grown-2.jpg", width: 1100, height: 733 },
  { src: "/litters/a/aki.jpg", width: 1200, height: 2133 },
  { src: "/litters/a/alma.jpg", width: 1200, height: 2133 },
  { src: "/litters/a/argo.jpg", width: 1200, height: 2133 },
  { src: "/litters/a/ayla.jpg", width: 1200, height: 2133 },
  { src: "/litters/b/cover.jpg", width: 1800, height: 1012 },
  { src: "/litters/b/grown-1.jpg", width: 1100, height: 733 },
  { src: "/litters/b/grown-2.jpg", width: 1100, height: 733 },
  { src: "/litters/b/balto.jpg", width: 1200, height: 2133 },
  { src: "/litters/b/bianka.jpg", width: 1200, height: 2133 },
  { src: "/litters/b/blue.jpg", width: 1200, height: 2133 },
  { src: "/litters/b/bruno.jpg", width: 1200, height: 2133 },
  { src: "/litters/c/cover.jpg", width: 1800, height: 1012 },
  { src: "/litters/c/celeste.jpg", width: 1200, height: 2133 },
  { src: "/litters/c/cleo.jpg", width: 1200, height: 2133 },
  { src: "/litters/c/cyan.jpg", width: 1200, height: 2133 },
];

const catalogParams = {
  rows: 7,
  columns: 7,
  curvature: 5,
  spacing: 10,
  imageWidth: 7,
  imageHeight: 5.2,
  depth: 7.5,
  elevation: 0,
  lookAtRange: 20,
  verticalCurvature: 0.5,
};

const MOBILE_BREAKPOINT = 1000;
const DRAG_SENSITIVITY = 2.5;

function calculateRotations(x, y) {
  const a = 1 / (catalogParams.depth * catalogParams.curvature);
  const slopeY = -2 * a * x;
  const rotationY = Math.atan(slopeY);

  const maxYDistance = (catalogParams.rows * catalogParams.spacing) / 2;
  const normalizedY = y / maxYDistance;
  const rotationX = normalizedY * catalogParams.verticalCurvature;

  return { rotationX, rotationY };
}

function calculatePosition(row, col) {
  let x = (col - catalogParams.columns / 2) * catalogParams.spacing;
  let y = (row - catalogParams.rows / 2) * catalogParams.spacing;
  let z = (x * x) / (catalogParams.depth * catalogParams.curvature);

  const normalizedY = y / ((catalogParams.rows * catalogParams.spacing) / 2);
  z +=
    Math.abs(normalizedY) * normalizedY * catalogParams.verticalCurvature * 5;

  y += catalogParams.elevation;

  const { rotationX, rotationY } = calculateRotations(x, y);

  return { x, y, z, rotationX, rotationY };
}

function createRoundedRectShape(w, h, r) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, h / 2 - r);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  shape.lineTo(-w / 2 + r, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  shape.lineTo(-w / 2, -h / 2 + r);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return shape;
}

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function stableShuffle(items, seed = 20260801) {
  const random = seededRandom(seed);
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function buildCatalogGrid(rows, cols) {
  const shuffled = stableShuffle(images.map((_, i) => i));
  const grid = [];
  const usedCounts = new Map();

  for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let col = 0; col < cols; col++) {
      const excluded = new Set();
      if (col > 0) excluded.add(grid[row][col - 1]);
      if (row > 0) excluded.add(grid[row - 1][col]);

      const leastUsed = Math.min(
        ...shuffled
          .filter((i) => !excluded.has(i))
          .map((i) => usedCounts.get(i) ?? 0),
      );
      const available = shuffled.filter(
        (i) => !excluded.has(i) && (usedCounts.get(i) ?? 0) === leastUsed,
      );
      const picked = available[0];

      usedCounts.set(picked, (usedCounts.get(picked) ?? 0) + 1);
      grid[row][col] = picked;
    }
  }

  return grid;
}

function getPlaneSize(image) {
  const aspect = image.width / image.height;
  const maxWidth = catalogParams.imageWidth;
  const maxHeight = catalogParams.imageHeight;

  if (aspect >= 1) {
    return {
      width: maxWidth,
      height: maxWidth / aspect,
    };
  }

  return {
    width: maxHeight * aspect,
    height: maxHeight,
  };
}

function createImagePlane(row, col, loader, imageIndex, anisotropy) {
  const image = images[imageIndex];
  const { width, height } = getPlaneSize(image);

  const catalogRadius = 0.15;
  const shape = createRoundedRectShape(width, height, catalogRadius);
  const geometry = new THREE.ShapeGeometry(shape);

  const catalogUvAttr = geometry.attributes.uv;
  for (let i = 0; i < catalogUvAttr.count; i++) {
    const u = (catalogUvAttr.getX(i) + width / 2) / width;
    const v = (catalogUvAttr.getY(i) + height / 2) / height;
    catalogUvAttr.setXY(i, u, v);
  }

  const texture = loader.load(image.src);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = anisotropy;
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(geometry, material);
  const { x, y, z, rotationX, rotationY } = calculatePosition(row, col);

  plane.position.set(x, y, z);
  plane.rotation.x = rotationX;
  plane.rotation.y = rotationY;

  plane.userData.basePosition = { x, y, z };
  plane.userData.baseRotation = { x: rotationX, y: rotationY, z: 0 };
  plane.userData.parallaxFactor = Math.random() * 0.5 + 0.5;
  plane.userData.randomOffset = {
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random() * 2 - 1,
  };
  plane.userData.rotationModifier = {
    x: Math.random() * 0.15 - 0.075,
    y: Math.random() * 0.15 - 0.075,
    z: Math.random() * 0.2 - 0.1,
  };
  plane.userData.phaseOffset = Math.random() * Math.PI * 2;

  return plane;
}

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
      catalogParams.rows,
      catalogParams.columns,
    );
    const catalogPlanes = [];

    for (let row = 0; row < catalogParams.rows; row++) {
      for (let col = 0; col < catalogParams.columns; col++) {
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

      catalogLookAt.x = catalogTargetX * catalogParams.lookAtRange;
      catalogLookAt.y = -catalogTargetY * catalogParams.lookAtRange;
      catalogLookAt.z =
        (catalogLookAt.x * catalogLookAt.x) /
        (catalogParams.depth * catalogParams.curvature);

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
