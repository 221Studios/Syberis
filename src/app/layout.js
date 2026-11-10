import ClientLayout from "@/client-layout";
import { SITE_URL } from "@/data/site.mjs";

import "./globals.css";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Syberis | Hodowla białych husky",
  description:
    "Syberis — domowa hodowla białych husky syberyjskich o niebieskich oczach. Aktualne mioty, rodzice, kontakt.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
