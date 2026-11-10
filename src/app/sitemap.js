import { LITTERS, litterSlug } from "@/data/kennel";
import { SITE_URL } from "@/data/site.mjs";

export default function sitemap() {
  const paths = [
    "/",
    "/mioty",
    "/rodzice",
    "/galeria",
    "/kontakt",
    "/husky-syberyjski",
    ...LITTERS.map((litter) => `/mioty/${litterSlug(litter)}`),
  ];

  return paths.map((path) => ({ url: new URL(path, SITE_URL).href }));
}
