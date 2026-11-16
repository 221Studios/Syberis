import KennelSeo from "@/features/seo/KennelSeo";
import { KENNEL } from "@/data/kennel";

const PRICE = `${KENNEL.puppyPrice} zł`;

export const metadata = {
  title: "Hodowla husky – białe szczenięta z niebieskimi oczami | Syberis",
  description: `Poznasz matkę, ojca i miejsce, w którym dorasta Twój szczeniak. Biały husky syberyjski z hodowli Syberis spod Radomia kosztuje ${PRICE}. Zadzwoń i umów wizytę.`,
  alternates: { canonical: "/hodowla-husky" },
};

export default function KennelPage() {
  return <KennelSeo />;
}
