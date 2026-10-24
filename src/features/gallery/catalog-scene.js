import * as THREE from "three";

const catalogImages = [
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

export const CATALOG_LAYOUT = {
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

export const MOBILE_BREAKPOINT = 1000;
export const DRAG_SENSITIVITY = 2.5;

function calculateRotations(horizontalPosition, verticalPosition) {
  const a = 1 / (CATALOG_LAYOUT.depth * CATALOG_LAYOUT.curvature);
  const slopeY = -2 * a * horizontalPosition;
  const rotationY = Math.atan(slopeY);

  const maxYDistance = (CATALOG_LAYOUT.rows * CATALOG_LAYOUT.spacing) / 2;
  const normalizedY = verticalPosition / maxYDistance;
  const rotationX = normalizedY * CATALOG_LAYOUT.verticalCurvature;

  return { rotationX, rotationY };
}

function calculatePosition(row, column) {
  let x = (column - CATALOG_LAYOUT.columns / 2) * CATALOG_LAYOUT.spacing;
  let y = (row - CATALOG_LAYOUT.rows / 2) * CATALOG_LAYOUT.spacing;
  let z = (x * x) / (CATALOG_LAYOUT.depth * CATALOG_LAYOUT.curvature);

  const normalizedY = y / ((CATALOG_LAYOUT.rows * CATALOG_LAYOUT.spacing) / 2);
  z +=
    Math.abs(normalizedY) * normalizedY * CATALOG_LAYOUT.verticalCurvature * 5;

  y += CATALOG_LAYOUT.elevation;

  const { rotationX, rotationY } = calculateRotations(x, y);

  return { x, y, z, rotationX, rotationY };
}

function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2 + radius, -height / 2);
  shape.lineTo(width / 2 - radius, -height / 2);
  shape.quadraticCurveTo(
    width / 2,
    -height / 2,
    width / 2,
    -height / 2 + radius,
  );
  shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
  shape.lineTo(-width / 2 + radius, height / 2);
  shape.quadraticCurveTo(
    -width / 2,
    height / 2,
    -width / 2,
    height / 2 - radius,
  );
  shape.lineTo(-width / 2, -height / 2 + radius);
  shape.quadraticCurveTo(
    -width / 2,
    -height / 2,
    -width / 2 + radius,
    -height / 2,
  );
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

export function buildCatalogGrid(rows, columns) {
  const shuffled = stableShuffle(catalogImages.map((_, i) => i));
  const grid = [];
  const usedCounts = new Map();

  for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let column = 0; column < columns; column++) {
      const excluded = new Set();
      if (column > 0) excluded.add(grid[row][column - 1]);
      if (row > 0) excluded.add(grid[row - 1][column]);

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
      grid[row][column] = picked;
    }
  }

  return grid;
}

function getPlaneSize(imageMetadata) {
  const aspectRatio = imageMetadata.width / imageMetadata.height;
  const maxWidth = CATALOG_LAYOUT.imageWidth;
  const maxHeight = CATALOG_LAYOUT.imageHeight;

  if (aspectRatio >= 1) {
    return {
      width: maxWidth,
      height: maxWidth / aspectRatio,
    };
  }

  return {
    width: maxHeight * aspectRatio,
    height: maxHeight,
  };
}

export function createImagePlane(
  row,
  column,
  textureLoader,
  imageIndex,
  anisotropy,
) {
  const image = catalogImages[imageIndex];
  const { width, height } = getPlaneSize(image);

  const cornerRadius = 0.15;
  const shape = createRoundedRectShape(width, height, cornerRadius);
  const geometry = new THREE.ShapeGeometry(shape);

  const catalogUvAttr = geometry.attributes.uv;
  for (let i = 0; i < catalogUvAttr.count; i++) {
    const u = (catalogUvAttr.getX(i) + width / 2) / width;
    const v = (catalogUvAttr.getY(i) + height / 2) / height;
    catalogUvAttr.setXY(i, u, v);
  }

  const texture = textureLoader.load(image.src);
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
  const { x, y, z, rotationX, rotationY } = calculatePosition(row, column);

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
