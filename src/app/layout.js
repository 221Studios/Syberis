import { headers } from "next/headers";
import ClientLayout from "@/client-layout";

import "./globals.css";

export const metadata = {
  title: "Syberis | Hodowla białych husky",
  description:
    "Syberis — domowa hodowla białych husky syberyjskich o niebieskich oczach. Aktualne mioty, rodzice, kontakt.",
};

const CRITICAL_INTRO_CSS = `
html.is-intro {
  overflow: hidden;
}
html.is-intro body {
  background-color: #102f4f;
  transition: background-color 0.9s ease;
}
html.is-intro .menu-container,
html.is-intro .music-toggle-container,
html.is-intro .page-wrapper > *:not(.preloader) {
  visibility: hidden;
}
.preloader-logo,
.preloader-title-wrap,
.preloader-tagline {
  opacity: 0;
  transform: translateY(40%);
}
`;

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isHome = pathname === "/" || pathname === "";

  return (
    <html lang="pl" className={isHome ? "is-intro" : undefined}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_INTRO_CSS }} />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
