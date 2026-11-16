"use client";

import { CONTACT } from "@/data/kennel";
import { telHref } from "@/lib/contact";
import Button from "@/shared/ui/Button/Button";
import Copy from "@/shared/ui/Copy/Copy";
import PageTitle from "@/shared/ui/PageTitle/PageTitle";

import "./seo.css";

const NEED_TO_KNOW = [
  {
    title: "Zmęczony husky to spokojny husky",
    body: (
      <>
        <p>
          Husky pochodzi od psów, które ciągnęły sanie na długich trasach.
          Codziennie potrzebuje ruchu, który go naprawdę zmęczy:
        </p>
        <ul>
          <li>biegu przy rowerze albo canicrossu,</li>
          <li>długiego spaceru z węszeniem,</li>
          <li>zaprzęgu rekreacyjnego lub dogtrekkingu.</li>
        </ul>
        <p>
          Znudzony husky sam znajdzie sobie zajęcie, na przykład kopanie dołów w
          ogrodzie. Argo z naszego pierwszego miotu tak domagał się ruchu, że
          według właścicieli nauczył ich biegać.
        </p>
      </>
    ),
  },
  {
    title: "Luzem tylko w zamkniętym ogrodzie",
    body: (
      <p>
        Husky ma silny instynkt pogoni i chętnie oddala się sam.{" "}
        <strong>Na spacerze trzymaj go na smyczy albo długiej lince.</strong> W
        ogrodzie zabezpiecz płot przed przeskoczeniem i podkopaniem.
      </p>
    ),
  },
  {
    title: "Rzadko szczeka, za to wyje i „gada”",
    body: (
      <>
        <p>
          Husky zwykle wita obcych przyjaźnie, więc nie będzie stróżem. Za to
          wyje i pomrukuje do domowników. Blue z naszego miotu B był najbardziej
          gadatliwy z rodzeństwa.
        </p>
        <p>
          Mieszkasz w bloku? Od pierwszych tygodni ucz szczeniaka zostawania
          samemu. Oszczędzisz sobie skarg sąsiadów.
        </p>
      </>
    ),
  },
];

const CARE = [
  {
    title: "Co najmniej raz w roku sierść będzie wszędzie",
    body: (
      <>
        <p>
          Husky ma gęsty podszerstek. Na co dzień wystarczy szczotkowanie raz w
          tygodniu. W czasie linienia podszerstek wychodzi garściami, więc{" "}
          <strong>czesz psa codziennie, aż linienie minie</strong>.
        </p>
        <p>Husky z natury dba o czystość i prawie nie pachnie psem.</p>
      </>
    ),
  },
  {
    title: "Oszczędzisz na groomerze i karmie",
    body: (
      <p>
        <strong>Husky nie wymaga strzyżenia ani trymowania.</strong> Je też
        stosunkowo mało jak na swoją wielkość. Jego przodkowie ciągnęli sanie na
        skromnych racjach.
      </p>
    ),
  },
  {
    title: "Upał męczy go bardziej niż mróz",
    body: (
      <p>
        <strong>Latem wychodź z psem rano i wieczorem.</strong> W ciągu dnia
        zapewnij mu cień i stały dostęp do wody.
      </p>
    ),
  },
  {
    title: "Kocha dzieci, a w kocie może widzieć zdobycz",
    body: (
      <>
        <p>
          Wzorzec rasy FCI opisuje husky jako psa przyjaznego i łagodnego. Bella
          z naszego miotu B mieszka z dwójką dzieci.
        </p>
        <p>
          Kot, królik czy chomik może jednak obudzić w husky myśliwego. Alma z
          pierwszego miotu mieszka z kotem. Jeśli masz małe zwierzęta, poznawaj
          je ze szczeniakiem od pierwszych dni i{" "}
          <strong>pilnuj ich wspólnego czasu</strong>.
        </p>
      </>
    ),
  },
];

export default function BreedSeo() {
  return (
    <main className="seo-page">
      <PageTitle
        subheader="Zanim weźmiesz szczeniaka"
        title="Husky syberyjski"
      />

      <section className="seo-band">
        <div className="seo-intro">
          <Copy variant="flicker">
            <p className="mono seo-label">[ Rasa ]</p>
          </Copy>
          <Copy splitType="words">
            <h2 className="v2 seo-lead">
              Husky będzie z Tobą biegać, linieć i wyć przez kilkanaście lat.
            </h2>
          </Copy>
        </div>
      </section>

      <div className="seo-shell">
        <Copy variant="slide">
          <p>Sprawdź w kilka minut, czy ta rasa pasuje do Twojego tygodnia.</p>
        </Copy>
      </div>

      <section className="seo-services">
        <aside className="seo-services-aside">
          <Copy variant="flicker">
            <p className="mono seo-label">[ Charakter ]</p>
          </Copy>
          <Copy splitType="words">
            <h2>Co musisz wiedzieć o husky</h2>
          </Copy>
          <div className="seo-parents-copy">
            <Copy variant="slide">
              <p>
                Te trzy rzeczy decydują, czy rasa pasuje do Twojego domu. Reszta
                to pielęgnacja i szczegóły dnia.
              </p>
            </Copy>
          </div>
        </aside>

        <div className="seo-services-main">
          <div className="seo-story-list">
            {NEED_TO_KNOW.map((section) => (
              <article className="seo-story" key={section.title}>
                <Copy splitType="words">
                  <h3>{section.title}</h3>
                </Copy>
                <Copy variant="slide">
                  <div>{section.body}</div>
                </Copy>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="seo-shell">
        <Copy variant="flicker">
          <p className="mono seo-label">[ Opieka ]</p>
        </Copy>
        {CARE.map((section) => (
          <section key={section.title}>
            <Copy splitType="words">
              <h2>{section.title}</h2>
            </Copy>
            <Copy variant="slide">
              <div>{section.body}</div>
            </Copy>
          </section>
        ))}

        <section className="seo-panel seo-panel--dark">
          <Copy splitType="words">
            <h2>Sprawdź, czy husky pasuje do Ciebie</h2>
          </Copy>
          <Copy variant="slide">
            <ul>
              <li>Masz codziennie czas na ruch, który zmęczy psa.</li>
              <li>
                Możesz zapewnić ogrodzony teren albo zawsze chodzić na smyczy.
              </li>
              <li>Akceptujesz sierść na ubraniach w czasie linienia.</li>
              <li>Wiesz, kto zajmie się psem, gdy wyjedziesz na urlop.</li>
            </ul>
          </Copy>
          <Copy variant="slide">
            <p>
              Odhaczasz wszystkie cztery punkty? Husky ma u Ciebie dobre
              warunki.
            </p>
          </Copy>
        </section>
      </div>

      <p className="seo-sources">
        Źródła:{" "}
        <a href="https://www.fci.be/en/nomenclature/SIBERIAN-HUSKY-270.html">
          wzorzec rasy FCI
        </a>
        {" · "}
        <a href="https://www.shca.org/the-siberian-husky">
          Siberian Husky Club of America
        </a>
      </p>

      <section className="seo-split">
        <div className="seo-split-main">
          <Copy splitType="words">
            <h2>Poznaj dorosłe husky, zanim wybierzesz szczeniaka</h2>
          </Copy>
          <Copy variant="slide">
            <p>
              Przyjedź do hodowli Syberis pod Radomiem. Zobaczysz rodziców
              szczeniąt i ocenisz ich temperament na żywo.
            </p>
          </Copy>
        </div>
        <aside className="seo-split-aside">
          <Copy splitType="words">
            <h5 className="v2">Gotowy na kolejny krok?</h5>
          </Copy>
          <div className="seo-actions seo-actions--stack">
            <Button href="/hodowla-husky">Sprawdź wolne szczenięta</Button>
            <Button
              href={telHref(CONTACT.phonePrimary)}
              variant="no-icon"
              theme="dark"
            >
              Zadzwoń: {CONTACT.phonePrimary}
            </Button>
          </div>
        </aside>
      </section>
    </main>
  );
}
