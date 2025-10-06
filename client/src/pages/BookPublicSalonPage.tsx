import SalonPagePublic from "./SalonPagePublic";

// Route publique : /book/:public_slug
// Affiche la page publique du salon en lecture seule + réservation
export default function BookPublicSalonPage(props: { public_slug: string }) {
  // On peut passer le slug en props ou le récupérer via le routeur si besoin
  return <SalonPagePublic public_slug={props.public_slug} />;
}
