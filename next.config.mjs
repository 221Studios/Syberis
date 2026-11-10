import { SITE_URL } from "./src/data/site.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
