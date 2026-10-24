/**
 * Single source of truth for kennel content.
 *
 * Photos live in /public and were exported by scripts/export-photos.py.
 * All current frames come from the May 2025 shoot of one litter, so parent
 * portraits still show young dogs — swap those files when adult photos exist.
 */

export const KENNEL = {
  name: "Syberis",
  tagline: "Białe husky o niebieskich oczach",
  claim: "Hodowla domowa, poza FCI",
  location: "Radom, Mazowieckie",
  since: 2023,
};

export const CONTACT = {
  phonePrimary: "512 974 084",
  email: "hodowlasyberis@gmail.com",
  olx: "https://www.olx.pl/oferty/uzytkownik/18Del/",
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/@hodowla.syberis.w",
  maps: "https://www.google.com/maps/search/?api=1&query=Radom%2C%20Mazowieckie",
};

const WHITE_COAT = "Białe";
const CINNAMON_COAT = "Biało-cynamonowe";
const BLUE_EYES = "Niebieskie";
const BROWN_EYES = "Brązowe";

export const STATUS_LABEL = {
  free: "Wolny",
  reserved: "Zarezerwowany",
  sold: "W nowym domu",
};

export const SEX_LABEL = {
  male: "Piesek",
  female: "Suczka",
};

export const PARENTS = [
  {
    slug: "ozzie",
    name: "Ozzie",
    role: "Ojciec",
    sex: "male",
    born: "2023-12-14",
    coat: WHITE_COAT,
    eyes: BLUE_EYES,
    photo: "/parents/ozzie.jpg",
    photoPosition: "50% 58%",
    homePhoto: "/parents/ozzie-home.jpg",
    homePhotoPosition: "50% 86%",
    homePhotoScale: 1.8,
    homePhotoOffsetX: "12%",
    homePhotoOffsetY: "-24%",
    wide: "/parents/ozzie-wide.jpg",
    tagline: "Spokojny szef stada",
    facts: [
      { label: "Rola w hodowli", value: "Ojciec wszystkich miotów" },
      { label: "Waga", value: "ok. 27 kg" },
      { label: "Umaszczenie", value: "Białe, bez odmian" },
      { label: "Oczy", value: "Niebieskie" },
    ],
    photos: [
      "/parents/ozzie-wide.jpg",
      "/gallery/img7.jpg",
      "/gallery/img6.jpg",
      "/gallery/img9.jpg",
    ],
  },
  {
    slug: "kaja",
    name: "Kaja",
    role: "Matka miotu A",
    sex: "female",
    born: "2023-05-22",
    coat: WHITE_COAT,
    eyes: BROWN_EYES,
    photo: "/parents/kaja-forest.jpg",
    homePhoto: "/parents/kaja.jpg",
    photoPosition: "52% 76%",
    photoScale: 1.35,
    wide: "/parents/kaja-wide.jpg",
    tagline: "Matka miotu A",
    facts: [
      { label: "Rola w hodowli", value: "Matka miotu A" },
      { label: "Waga", value: "ok. 27 kg" },
      { label: "Umaszczenie", value: "Białe, bez odmian" },
      { label: "Oczy", value: "Brązowe" },
    ],
    photos: [
      "/parents/kaja-wide.jpg",
      "/gallery/img10.jpg",
      "/gallery/img8.jpg",
      "/gallery/img5.jpg",
    ],
  },
  {
    slug: "mia",
    name: "Mia",
    role: "Matka miotów A i B",
    sex: "female",
    born: "2020-04-29",
    coat: WHITE_COAT,
    eyes: BLUE_EYES,
    photo: "/parents/mia.jpg",
    wide: "/parents/mia-wide.jpg",
    tagline: "Matka miotów A i B",
    facts: [
      { label: "Rola w hodowli", value: "Matka miotów A i B" },
      { label: "Waga", value: "ok. 26 kg" },
      { label: "Umaszczenie", value: "Białe, bez odmian" },
      { label: "Oczy", value: "Niebieskie" },
    ],
    photos: [
      "/parents/mia-wide.jpg",
      "/gallery/img8.jpg",
      "/gallery/img3.jpg",
      "/gallery/img1.jpg",
    ],
  },
  {
    slug: "cynamon",
    name: "Cynamon",
    role: "Najmłodszy w stadzie",
    sex: "male",
    born: "2025-11",
    coat: CINNAMON_COAT,
    eyes: BLUE_EYES,
    photo: "/parents/cynamon.jpg",
    homePhoto: "/parents/cynamon-home.jpg",
    homePhotoPosition: "45% 68%",
    wide: "/parents/cynamon-wide.jpg",
    tagline: "Najmłodszy w stadzie",
    facts: [
      { label: "Rola w hodowli", value: "Jeszcze bez miotu" },
      { label: "Waga", value: "ok. 24 kg" },
      { label: "Umaszczenie", value: "Biało-cynamonowe" },
      { label: "Oczy", value: "Niebieskie" },
    ],
    photos: [
      "/parents/cynamon-wide.jpg",
      "/gallery/img9.jpg",
      "/gallery/img4.jpg",
      "/gallery/img2.jpg",
    ],
  },
];

export const LITTERS = [
  {
    letter: "A",
    slug: "kaja-a",
    status: "current",
    sireSlug: "ozzie",
    damSlug: "kaja",
    born: "2026-07-15",
    handoverFrom: "2026-09-15",
    photo: "/litters/kaja-a/cover.jpg",
    intro:
      "Cztery białe szczenięta po Ozziem i Kai: trzy suczki i jeden piesek. Trzy są jeszcze wolne — rezerwacje przyjmujemy telefonicznie i mailowo. Pieski wyjadą do domów pomiędzy 2. a 4. miesiącem życia.",
    grownGallery: [],
    puppies: [
      {
        slug: "aki",
        name: "Aki",
        sex: "male",
        status: "sold",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/kaja-a/aki.jpg",
        traits: ["W nowym domu"],
        description:
          "Aki ma już nowy dom. Zostawiamy jego zdjęcie w miocie na pamiątkę.",
      },
      {
        slug: "aria",
        name: "Aria",
        sex: "female",
        status: "free",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/kaja-a/aria.jpg",
        traits: ["Suczka", "W hodowli"],
        description:
          "Aria jest jeszcze wolna. Rezerwacje przyjmujemy telefonicznie i mailowo.",
      },
      {
        slug: "ayla",
        name: "Ayla",
        sex: "female",
        status: "free",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/kaja-a/ayla.jpg",
        traits: ["Suczka", "W hodowli"],
        description:
          "Ayla jest jeszcze wolna. Rezerwacje przyjmujemy telefonicznie i mailowo.",
      },
      {
        slug: "abi",
        name: "Abi",
        sex: "female",
        status: "free",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/kaja-a/abi.jpg",
        traits: ["Suczka", "W hodowli"],
        description:
          "Abi jest jeszcze wolna. Rezerwacje przyjmujemy telefonicznie i mailowo.",
      },
    ],
  },
  {
    letter: "B",
    slug: "mia-b",
    status: "finished",
    sireSlug: "ozzie",
    damSlug: "mia",
    born: "2024-09-05",
    photo: "/litters/b/cover.jpg",
    intro:
      "Miot B po Ozziem i Mii. Wszystkie pieski są już w swoich domach — zostawiamy je tutaj na pamiątkę i pokazujemy, jak urosły.",
    grownGallery: ["/litters/b/grown-1.jpg", "/litters/b/grown-2.jpg"],
    puppies: [
      {
        slug: "balto",
        name: "Balto",
        sex: "male",
        status: "sold",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/b/balto.jpg",
        photoPosition: "50% 18%",
        traits: ["Największy z miotu", "Wytrzymały"],
        description:
          "Największy z miotu B, dziś pies do biegania z właścicielem po górach.",
      },
      {
        slug: "bella",
        name: "Bella",
        sex: "female",
        status: "sold",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/b/bella.jpg",
        traits: ["Przytulaśna", "Dobra przy dzieciach"],
        description:
          "Najbardziej przytulaśna z rodzeństwa. Trafiła do domu z dwójką dzieci.",
      },
      {
        slug: "bruno",
        name: "Bruno",
        sex: "male",
        status: "sold",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/b/bruno.jpg",
        traits: ["Spokojny", "Uparty"],
        description:
          "Spokojny i uparty. Mieszka pod lasem i codziennie robi swoje kilometry.",
      },
      {
        slug: "bianka",
        name: "Bianka",
        sex: "female",
        status: "sold",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/b/bianka.jpg",
        traits: ["Drobna", "Bardzo szybka"],
        description:
          "Drobna, bardzo szybka. Nauczyła się chodzić przy nodze szybciej niż reszta miotu.",
      },
      {
        slug: "blue",
        name: "Blue",
        sex: "male",
        status: "sold",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/b/blue.jpg",
        traits: ["Gadatliwy", "Charakterny"],
        description:
          "Najbardziej gadatliwy z miotu B — po nim wiemy, czego oczekiwać po Ciastku.",
      },
    ],
  },
  {
    letter: "A",
    slug: "mia-a",
    status: "finished",
    sireSlug: "ozzie",
    damSlug: "mia",
    born: "2023-04-18",
    photo: "/litters/a/cover.jpg",
    intro:
      "Nasz pierwszy miot. Cztery pieski po Ozziem i Mii, wszystkie od dawna w swoich rodzinach.",
    grownGallery: ["/litters/a/grown-1.jpg", "/litters/a/grown-2.jpg"],
    puppies: [
      {
        slug: "aki",
        name: "Aki",
        sex: "male",
        status: "sold",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/a/aki.jpg",
        traits: ["Pierwszy szczeniak Syberis", "Zaprzęgowy"],
        description:
          "Pierwszy szczeniak, jaki urodził się w Syberis. Dziś pies do zaprzęgu rekreacyjnego.",
      },
      {
        slug: "alma",
        name: "Alma",
        sex: "female",
        status: "sold",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/a/alma.jpg",
        traits: ["Najłagodniejsza", "Zgodna z innymi zwierzętami"],
        description:
          "Najłagodniejsza z miotu A, mieszka z drugim husky i kotem.",
      },
      {
        slug: "argo",
        name: "Argo",
        sex: "male",
        status: "sold",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/a/argo.jpg",
        traits: ["Zawsze w ruchu", "Wytrzymały"],
        description:
          "Zawsze w ruchu. Właściciele mówią, że nauczył ich biegać.",
      },
      {
        slug: "ayla",
        name: "Ayla",
        sex: "female",
        status: "sold",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/a/ayla.jpg",
        traits: ["Cicha", "Czujna"],
        description: "Cicha i czujna. Pilnuje domu bez jednego szczeknięcia.",
      },
    ],
  },
];

export function getParent(slug) {
  return PARENTS.find((parent) => parent.slug === slug) ?? null;
}

export function litterSlug(litter) {
  return litter.slug ?? litter.letter.toLowerCase();
}

export function getLitter(slug) {
  const target = String(slug).toLowerCase();
  return (
    LITTERS.find((litter) => litterSlug(litter) === target) ??
    LITTERS.find((litter) => litter.letter.toLowerCase() === target) ??
    null
  );
}

export function getCurrentLitter() {
  return LITTERS.find((litter) => litter.status === "current") ?? null;
}

export function littersOfParent(slug) {
  return LITTERS.filter(
    (litter) => litter.sireSlug === slug || litter.damSlug === slug,
  );
}

export function countByStatus(puppies, status) {
  return puppies.filter((puppy) => puppy.status === status).length;
}

/** Pre-baked B&W asset — avoids live CSS `filter: grayscale()` on large photos. */
export function mutedPhoto(src) {
  if (!src || typeof src !== "string") return src;
  if (src.includes("-muted.")) return src;
  return src.replace(/(\.[a-z0-9]+)$/i, "-muted$1");
}

const MONTHS_PL = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień",
];

const MONTHS_PL_GENITIVE = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];

export function formatDate(iso) {
  const [year, month, day] = iso.split("-");
  const monthIndex = Number(month) - 1;
  if (!day) return `${MONTHS_PL[monthIndex]} ${year}`;
  return `${Number(day)} ${MONTHS_PL_GENITIVE[monthIndex]} ${year}`;
}

export function litterTitle(letter) {
  return `Miot ${letter}`;
}
