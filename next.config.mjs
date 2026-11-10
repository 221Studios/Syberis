import path from "node:path";
import { fileURLToPath } from "node:url";

import { SITE_URL } from "./src/data/site.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  turbopack: {
    rules: {
      // Next zawsze wkleja polyfill-module.js do paczki dla nowoczesnych
      // przeglądarek. Chrome 111+ i Safari 16.4+ mają te metody natywnie.
      "polyfill-module.js": {
        loaders: [path.join(root, "scripts/baseline-polyfill-loader.cjs")],
        as: "*.js",
      },
    },
  },
  experimental: {
    // Pierwsze malowanie czeka na kilka chunków CSS.
    // Wklejenie ich w HTML zdejmuje te żądania ze ścieżki krytycznej.
    inlineCss: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www\\.syberis\\.pl" }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
      { source: "/mioty/a", destination: "/mioty/kaja-a", permanent: true },
      { source: "/mioty/b", destination: "/mioty/mia-b", permanent: true },
    ];
  },
};

export default nextConfig;
