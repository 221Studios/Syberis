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
  location: "Polska",
  since: 2023,
};

export const CONTACT = {
  phonePrimary: "512 974 084",
  email: "hodowlasyberis@gmail.com",
  // TODO: point at the real listing once it is published.
  olx: "https://www.olx.pl/",
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/",
};

const WHITE_COAT = "Białe";
const BLUE_EYES = "Niebieskie";

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
    born: "2019-05-14",
    coat: WHITE_COAT,
    eyes: BLUE_EYES,
    photo: "/parents/ozzie.jpg",
    wide: "/parents/ozzie-wide.jpg",
    tagline: "Spokojny szef stada",
    traits: ["Łagodny", "Wytrzymały", "Ufny wobec ludzi"],
    facts: [
      { label: "Rola w hodowli", value: "Ojciec wszystkich miotów" },
      { label: "Waga", value: "ok. 27 kg" },
      { label: "Umaszczenie", value: "Białe, bez odmian" },
      { label: "Oczy", value: "Niebieskie" },
      { label: "Charakter", value: "Spokojny, nie wchodzi w konflikty" },
    ],
    bio: [
      "Ozzie jest ojcem wszystkich naszych miotów. Duży, biały, z bardzo spokojną głową — nie wchodzi w konflikty i pierwszy podchodzi do gości.",
      "W domu jest cieniem, w lesie silnikiem. Potrafi ciągnąć rowerzystę pół dnia i wrócić po więcej. Ten spokój przechodzi na szczeniaki: po Ozziem rodzą się psy, które da się wszędzie zabrać.",
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
    role: "Matka miotu C",
    sex: "female",
    born: "2021-03-02",
    coat: WHITE_COAT,
    eyes: BLUE_EYES,
    photo: "/parents/kaja.jpg",
    wide: "/parents/kaja-wide.jpg",
    tagline: "Matka miotu C",
    traits: ["Opiekuńcza", "Wesoła", "Charakterna"],
    facts: [
      { label: "Rola w hodowli", value: "Matka miotu C" },
      { label: "Waga", value: "ok. 22 kg" },
      { label: "Umaszczenie", value: "Białe, bez odmian" },
      { label: "Oczy", value: "Niebieskie" },
      { label: "Charakter", value: "Opiekuńcza, ma swoje zdanie" },
    ],
    bio: [
      "Kaja jest matką aktualnego miotu C. Bardzo opiekuńcza, przy szczeniakach cierpliwa do granic — pozwala im na wszystko i sama pilnuje, żeby nikt nie został z tyłu.",
      "Wobec ludzi otwarta i wesoła, ale ma swoje zdanie. Jak jej się coś nie podoba, mówi to bardzo wyraźnie. Szczeniaki po Kai są śmiałe i szybko przywiązują się do człowieka.",
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
    born: "2020-06-21",
    coat: WHITE_COAT,
    eyes: BLUE_EYES,
    photo: "/parents/mia.jpg",
    wide: "/parents/mia-wide.jpg",
    tagline: "Matka miotów A i B",
    traits: ["Niezależna", "Szybka", "Spokojna przy dzieciach"],
    facts: [
      { label: "Rola w hodowli", value: "Matka miotów A i B" },
      { label: "Waga", value: "ok. 21 kg" },
      { label: "Umaszczenie", value: "Białe, bez odmian" },
      { label: "Oczy", value: "Niebieskie" },
      { label: "Charakter", value: "Niezależna, bardzo dobra przy dzieciach" },
    ],
    bio: [
      "Mia dała nam mioty A i B. Drobniejsza od Kai, szybsza i bardziej niezależna — potrafi przez godzinę patrzeć w las, zamiast biegać za piłką.",
      "Świetnie znosi dzieci i hałas. Szczeniaki po niej wychodzą wyjątkowo pewne siebie i bardzo dobrze radzą sobie w domach z małymi dziećmi.",
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
    born: "2023-01-08",
    coat: WHITE_COAT,
    eyes: BLUE_EYES,
    photo: "/parents/cynamon.jpg",
    wide: "/parents/cynamon-wide.jpg",
    tagline: "Najmłodszy w stadzie",
    traits: ["Energiczny", "Towarzyski", "Ciekawski"],
    facts: [
      { label: "Rola w hodowli", value: "Jeszcze bez miotu" },
      { label: "Waga", value: "ok. 24 kg" },
      { label: "Umaszczenie", value: "Białe, bez odmian" },
      { label: "Oczy", value: "Niebieskie" },
      { label: "Charakter", value: "Energiczny, cień Ozziego" },
    ],
    bio: [
      "Cynamon jest najmłodszy i najbardziej rozbrykany z naszej czwórki. Jeszcze nie ma miotu — na razie po prostu rośnie i uczy się bycia psem.",
      "Cień Ozziego. Robi wszystko to, co starszy pies, tylko dwa razy głośniej. Jeśli szukasz psa, który nigdy nie ma dość, to jest jego typ charakteru.",
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
    letter: "C",
    status: "current",
    sireSlug: "ozzie",
    damSlug: "kaja",
    born: "2026-07-28",
    handoverFrom: "2026-10-01",
    photo: "/litters/c/cover.jpg",
    intro:
      "Cztery białe szczenięta po Ozziem i Kai: trzy suczki i jeden piesek. Wszystkie są jeszcze wolne — rezerwacje przyjmujemy telefonicznie i mailowo. Pieski wyjadą do domów pomiędzy 3. a 4. miesiącem życia.",
    grownGallery: [],
    puppies: [
      {
        slug: "ciri",
        name: "Ciri",
        sex: "female",
        status: "free",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/c/ciri.jpg",
        traits: ["Odważna", "Pierwsza do ludzi", "Szybko się uczy"],
        description:
          "Najodważniejsza z całej czwórki. Pierwsza wychodzi do obcych, pierwsza sprawdza każdy nowy kąt i pierwsza zasypia po zabawie.",
      },
      {
        slug: "celeste",
        name: "Celeste",
        sex: "female",
        status: "free",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/c/celeste.jpg",
        traits: ["Spokojna", "Uważna", "Przywiązana do człowieka"],
        description:
          "Cicha obserwatorka. Zanim wejdzie w zabawę, przygląda się z boku, a potem nie odpuszcza do końca. Bardzo mocno trzyma się ludzi.",
      },
      {
        slug: "cleo",
        name: "Cleo",
        sex: "female",
        status: "free",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/c/cleo.jpg",
        traits: ["Wesoła", "Towarzyska", "Ciekawska"],
        description:
          "Wesoła i bardzo kontaktowa suczka. Szybko łapie nowe rzeczy, chętnie podchodzi do ludzi i trzyma się blisko rodzeństwa.",
      },
      {
        slug: "coco",
        name: "Coco",
        sex: "male",
        status: "free",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/c/coco.jpg",
        traits: ["Spokojny", "Wyważony", "Podobny do Ozziego"],
        description:
          "Najspokojniejszy z rodzeństwa, bardzo podobny charakterem do Ozziego. Lubi leżeć przy nogach i patrzeć, co się dzieje.",
      },
    ],
  },
  {
    letter: "B",
    status: "finished",
    sireSlug: "ozzie",
    damSlug: "mia",
    born: "2024-09-05",
    photo: "/litters/b/cover.jpg",
    intro:
      "Miot B po Ozziem i Mii. Wszystkie pieski są już w swoich domach — zostawiamy je tutaj na pamiątkę i pokazujemy, jak urosły.",
    grownGallery: [
      "/litters/b/grown-1.jpg",
      "/litters/b/grown-2.jpg",
    ],
    puppies: [
      {
        slug: "balto",
        name: "Balto",
        sex: "male",
        status: "sold",
        coat: WHITE_COAT,
        eyes: BLUE_EYES,
        photo: "/litters/b/balto.jpg",
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
        description: "Zawsze w ruchu. Właściciele mówią, że nauczył ich biegać.",
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

export function getLitter(letter) {
  const target = String(letter).toUpperCase();
  return LITTERS.find((litter) => litter.letter === target) ?? null;
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

export function formatDate(iso) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

export function litterTitle(letter) {
  return `Miot ${letter}`;
}
