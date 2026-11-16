import Home from "./Home";

export const metadata = {
  title: "Syberis – hodowla białych husky syberyjskich",
  description:
    "Domowa hodowla białych husky syberyjskich o niebieskich oczach. Szczenięta dla domów z całej Polski. Poznaj rodziców, zobacz aktualny miot i umów wizytę.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <Home />;
}
