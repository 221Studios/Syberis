"use client";

import Link from "next/link";
import {
  CONTACT,
  KENNEL,
  LITTERS,
  PARENTS,
  SEX_LABEL,
  countByStatus,
  getCurrentLitter,
  getParent,
  litterCountLabel,
  litterSlug,
  litterTitle,
} from "@/data/kennel";
import { mailHref, smsHref, telHref } from "@/lib/contact";
import Button from "@/shared/ui/Button/Button";
import Copy from "@/shared/ui/Copy/Copy";
import PageTitle from "@/shared/ui/PageTitle/PageTitle";

import "./seo.css";

const PRICE = `${KENNEL.puppyPrice} zł`;
const SEX_PLURAL = { male: "pieski", female: "suczki" };

function parentWeight(parent) {
  return parent.facts.find(({ label }) => label === "Waga")?.value;
}

function puppiesCount(count) {
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (count === 1) return "1 szczenię";
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return `${count} szczenięta`;
  }
  return `${count} szczeniąt`;
}

function joinWithAnd(items) {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} i ${items.at(-1)}`;
}

function freePuppiesLabel(litter) {
  const free = litter.puppies.filter(({ status }) => status === "free");
  if (!free.length) return "";
  const [{ sex }] = free;
  if (free.length > 1 && free.every((puppy) => puppy.sex === sex)) {
    return `${joinWithAnd(free.map(({ name }) => name))} (${SEX_PLURAL[sex]})`;
  }
  return joinWithAnd(
    free.map(({ name, sex }) => `${name} (${SEX_LABEL[sex].toLowerCase()})`),
  );
}

function currentLitterHeading(litter) {
  const free = countByStatus(litter.puppies, "free");
  if (!free) return `Miot ${litter.letter} ma już komplet domów`;
  const label = puppiesCount(free);
  const verb = label.endsWith("szczenięta") ? "czekają" : "czeka";
  return `W miocie ${litter.letter} ${verb} na dom ${label}`;
}

function buildFaq(currentLitter, homedPuppies) {
  const freeLabel = currentLitter ? freePuppiesLabel(currentLitter) : "";
  const allBlueEyed = homedPuppies.every(({ eyes }) => eyes === "Niebieskie");

  return [
    {
      question: "Ile kosztuje szczeniak husky z Syberis?",
      answer: `${PRICE}. W cenie dostajesz szczepienia i odrobaczanie odpowiednie do wieku, chip i książeczkę zdrowia.`,
    },
    {
      question: "Czy są teraz wolne szczenięta?",
      answer: currentLitter
        ? freeLabel
          ? `Tak. W miocie ${currentLitter.letter} wolne są: ${freeLabel}.${currentLitter.handoverLabel ? ` ${currentLitter.handoverLabel}.` : ""}`
          : `Wszystkie szczenięta z miotu ${currentLitter.letter} mają już domy. Zadzwoń i zapytaj o kolejny miot.`
        : "Teraz nie mamy szczeniąt. Zadzwoń lub napisz SMS i zapytaj o kolejny miot.",
    },
    {
      question: "Mieszkam daleko od Radomia. Czy mogę kupić szczeniaka?",
      answer:
        "Tak. Przyjmujemy zapytania z całej Polski. Hodowla leży w okolicach Radomia, a dokładny adres dostaniesz po umówieniu wizyty. Na drogę powrotną zabierz transporter, wodę i zaplanuj postoje.",
    },
    {
      question: "Czy zobaczę szczenięta i rodziców przed decyzją?",
      answer:
        "Tak. Na wizycie poznasz szczenięta, ich matkę i ojca. Zobaczysz też, gdzie szczenięta dorastają.",
    },
    {
      question: "Pierwszy raz będę mieć husky. Czy sobie poradzę?",
      answer:
        "Poradzisz sobie, jeśli masz codziennie czas na ruch i naukę z psem. Na wizycie zapytaj nas o karmienie, naukę czystości i pierwsze spacery.",
    },
    {
      question: "Jakiego koloru będzie mój husky?",
      answer: allBlueEyed
        ? `Białego. Każde z ${homedPuppies.length} szczeniąt z naszych wcześniejszych miotów ma białą sierść i niebieskie oczy.`
        : "Białego. Hodujemy wyłącznie białe husky syberyjskie.",
    },
    {
      question: "Jak zarezerwować szczeniaka?",
      answer: `Zadzwoń lub napisz SMS na ${CONTACT.phonePrimary}. Opowiedz o swoim domu i doświadczeniu z psami. Razem ustalimy termin wizyty i warunki rezerwacji.`,
    },
  ];
}

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function KennelSeo() {
  const currentLitter = getCurrentLitter();
  const totalPuppies = LITTERS.reduce(
    (sum, litter) => sum + litter.puppies.length,
    0,
  );
  const homedPuppies = LITTERS.filter(
    ({ status }) => status === "finished",
  ).flatMap(({ puppies }) => puppies);
  const faq = buildFaq(currentLitter, homedPuppies);

  return (
    <main className="seo-page">
      <PageTitle
        subheader="Białe husky o niebieskich oczach"
        title="Hodowla husky"
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }}
      />

      <section className="seo-band">
        <div className="seo-intro">
          <Copy variant="flicker">
            <p className="mono seo-label">[ O hodowli ]</p>
          </Copy>
          <Copy splitType="words">
            <h2 className="v2 seo-lead">
              Zanim zdecydujesz, poznasz matkę i ojca swojego szczeniaka.
            </h2>
          </Copy>
        </div>
      </section>

      <div className="seo-shell">
        <Copy variant="slide">
          <p>
            Zobaczysz, gdzie dorasta i jak dorosły husky zachowuje się w domu.
            Psy Syberis mieszkają z nami jako członkowie rodziny.
          </p>
        </Copy>

        {currentLitter && (
          <section className="seo-panel seo-panel--light">
            <Copy splitType="words">
              <h2>{currentLitterHeading(currentLitter)}</h2>
            </Copy>
            <Copy variant="slide">
              <ul>
                {countByStatus(currentLitter.puppies, "free") > 0 && (
                  <li>Wolne: {freePuppiesLabel(currentLitter)}.</li>
                )}
                <li>
                  Rodzice: {getParent(currentLitter.damSlug).name} i{" "}
                  {getParent(currentLitter.sireSlug).name}. Poznasz oboje na
                  miejscu.
                </li>
                {currentLitter.handoverLabel && (
                  <li>{currentLitter.handoverLabel}.</li>
                )}
              </ul>
            </Copy>
            <Copy variant="slide">
              <p>
                <Link href={`/mioty/${litterSlug(currentLitter)}`}>
                  Zobacz zdjęcia szczeniąt z miotu {currentLitter.letter}
                </Link>
              </p>
            </Copy>
          </section>
        )}

        <section className="seo-panel seo-panel--dark">
          <Copy splitType="words">
            <h2>Za {PRICE} odbierasz szczeniaka gotowego na start</h2>
          </Copy>
          <Copy variant="slide">
            <ul>
              <li>
                <strong>
                  Szczepienia i odrobaczanie odpowiednie do wieku.
                </strong>{" "}
                Weterynarz poda kolejne dawki według kalendarza, bez zaczynania
                od zera.
              </li>
              <li>
                <strong>Chip.</strong> Zarejestruj jego numer w bazie, a
                zgubionego psa łatwiej odnajdziesz.
              </li>
              <li>
                <strong>Książeczka zdrowia.</strong> Twój weterynarz od razu
                widzi, co szczeniak już dostał.
              </li>
            </ul>
          </Copy>
        </section>

        <Copy splitType="words">
          <h2>Na wizycie zobaczysz, jak duży urośnie Twój pies</h2>
        </Copy>
        <Copy variant="slide">
          <p>
            Rodzice najlepiej pokazują, jak będzie wyglądał dorosły szczeniak.
            Sprawdź ich wagę i umaszczenie:
          </p>
        </Copy>
        <Copy variant="slide">
          <ul>
            {PARENTS.map((parent) => (
              <li key={parent.slug}>
                {parent.name} ({parent.role.toLowerCase()},{" "}
                {litterCountLabel(parent.slug).toLowerCase()}): umaszczenie{" "}
                {parent.coat.toLowerCase()}, oczy {parent.eyes.toLowerCase()},
                waga {parentWeight(parent)}.
              </li>
            ))}
          </ul>
        </Copy>
        <Copy variant="slide">
          <p>
            <Link href="/rodzice">Zobacz zdjęcia rodziców</Link>
          </p>
        </Copy>

        <Copy splitType="words">
          <h2>Gdzie dziś mieszkają szczenięta z Syberis</h2>
        </Copy>
        <Copy variant="slide">
          <p>
            Od {KENNEL.since} roku urodziło się u nas{" "}
            {puppiesCount(totalPuppies)}. Kilka z nich:
          </p>
        </Copy>
        <Copy variant="slide">
          <ul>
            <li>Balto z miotu B biega z właścicielem po górach.</li>
            <li>Bella z miotu B mieszka z dwójką dzieci.</li>
            <li>Alma z pierwszego miotu dzieli dom z drugim husky i kotem.</li>
            <li>Aki z pierwszego miotu ciągnie zaprzęg rekreacyjny.</li>
          </ul>
        </Copy>
        <Copy variant="slide">
          <p>Wszystkie mioty:</p>
        </Copy>
        <Copy variant="slide">
          <ul>
            {LITTERS.map((litter) => {
              const sire = getParent(litter.sireSlug);
              const dam = getParent(litter.damSlug);
              return (
                <li key={litterSlug(litter)}>
                  <Link href={`/mioty/${litterSlug(litter)}`}>
                    {litterTitle(litter.letter)} ({dam.name} × {sire.name})
                  </Link>
                  : {puppiesCount(litter.puppies.length)},{" "}
                  {litter.status === "current"
                    ? `wolne: ${countByStatus(litter.puppies, "free")}`
                    : "wszystkie w nowych domach"}
                  .
                </li>
              );
            })}
          </ul>
        </Copy>

        <Copy splitType="words">
          <h2>Kupisz szczeniaka w 4 krokach</h2>
        </Copy>
        <Copy variant="slide">
          <ol>
            <li>
              Obejrzyj <Link href="/mioty">aktualny miot</Link> i{" "}
              <Link href="/rodzice">rodziców</Link>.
            </li>
            <li>
              Zadzwoń lub napisz SMS. Powiedz, jak wygląda Twój dzień i gdzie
              mieszkasz.
            </li>
            <li>Przyjedź pod Radom. Poznasz szczenięta, matkę i ojca.</li>
            <li>Zarezerwuj szczeniaka i odbierz go w ustalonym terminie.</li>
          </ol>
        </Copy>
        <Copy variant="slide">
          <p>
            Nie masz jeszcze husky?{" "}
            <Link href="/husky-syberyjski">
              Sprawdź, czy ta rasa pasuje do Twojego tygodnia
            </Link>
            .
          </p>
        </Copy>

        <Copy variant="flicker">
          <p className="mono seo-label">[ FAQ ]</p>
        </Copy>
        <Copy splitType="words">
          <h2>Odpowiedzi na pytania, które słyszymy najczęściej</h2>
        </Copy>
        <div className="seo-faq">
          {faq.map(({ question, answer }) => (
            <section key={question}>
              <Copy splitType="words">
                <h3>{question}</h3>
              </Copy>
              <Copy variant="slide">
                <p>{answer}</p>
              </Copy>
            </section>
          ))}
        </div>
      </div>

      <section className="seo-split">
        <div className="seo-split-main">
          <Copy splitType="words">
            <h2>Umów wizytę i poznaj szczenięta na żywo</h2>
          </Copy>
          <Copy variant="slide">
            <p>
              Wolisz e-mail? Napisz na{" "}
              <a href={mailHref(CONTACT.email)}>{CONTACT.email}</a>.
            </p>
          </Copy>
        </div>
        <aside className="seo-split-aside">
          <Copy splitType="words">
            <h5 className="v2">Zainteresowany szczeniakiem?</h5>
          </Copy>
          <Copy variant="slide">
            <p>
              Zadzwoń lub napisz SMS. Opowiedz o swoim domu i ustalimy termin
              wizyty.
            </p>
          </Copy>
          <div className="seo-actions seo-actions--stack">
            <Button href={telHref(CONTACT.phonePrimary)}>
              Zadzwoń: {CONTACT.phonePrimary}
            </Button>
            <Button
              href={smsHref(CONTACT.phonePrimary)}
              variant="no-icon"
              theme="dark"
            >
              Napisz SMS
            </Button>
          </div>
        </aside>
      </section>
    </main>
  );
}
