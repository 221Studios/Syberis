import Script from "next/script";
import ClientLayout from "@/client-layout";
import { SITE_URL } from "@/data/site.mjs";

import "./globals.css";

const CRITICAL_FONTS = [
  "/fonts/palace/palace-regular.woff2",
  "/fonts/bellefair/bellefair-regular.woff2",
  "/fonts/dm-mono/dm-mono-regular.woff2",
  "/fonts/dm-mono/dm-mono-medium.woff2",
];

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Syberis | Hodowla białych husky",
  description:
    "Syberis — domowa hodowla białych husky syberyjskich o niebieskich oczach. Aktualne mioty, rodzice, kontakt.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        {CRITICAL_FONTS.map((href) => (
          <link
            key={href}
            rel="preload"
            href={href}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Script src="/cms-public.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
