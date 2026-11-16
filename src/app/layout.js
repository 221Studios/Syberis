import ClientLayout from "@/client-layout";
import { CONTACT, KENNEL } from "@/data/kennel";
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

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#hodowla`,
  name: `Hodowla husky ${KENNEL.name}`,
  alternateName: KENNEL.name,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description:
    "Domowa hodowla białych husky syberyjskich o niebieskich oczach w okolicach Radomia.",
  foundingDate: String(KENNEL.since),
  telephone: `+48 ${CONTACT.phonePrimary}`,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    addressRegion: "mazowieckie",
    addressCountry: "PL",
  },
  areaServed: { "@type": "Country", name: "Polska" },
  sameAs: [CONTACT.tiktok, CONTACT.instagram, CONTACT.olx].filter(Boolean),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
