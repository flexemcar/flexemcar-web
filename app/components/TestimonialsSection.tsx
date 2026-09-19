import { getGoogleReviews } from "@/app/lib/googleReviews";
import { manualReviews } from "@/app/data/reviews";
import { links } from "@/app/lib/links";
import Reveal from "@/app/components/Reveal";
import GoogleReviewIcon from "@/app/components/GoogleReviewIcon";
import GoogleReviewsCarousel, {
  type ReviewCardData,
} from "@/app/components/GoogleReviewsCarousel";

// Reseñas reales de Google copiadas a mano (app/data/reviews.ts): todas de 5
// estrellas y con comentario. Son las que se muestran siempre; las que traiga
// la API de Google (si algún día se activa) solo se añaden detrás, sin repetir
// autor.
const manualCards: ReviewCardData[] = manualReviews.map((r) => ({
  id: r.id,
  name: r.name,
  text: r.text,
  rating: 5,
  isGoogle: true,
  photoUrl: r.photo ?? null,
  avatarColor: r.avatarColor,
  date: r.date,
}));

export default async function TestimonialsSection() {
  const googleData = await getGoogleReviews();

  // Google solo devuelve como máximo 5 reseñas (las que su algoritmo elige
  // como más relevantes), no "todas las que tiene el negocio". De esas, aquí
  // nos quedamos solo con las de 5 estrellas y que además traigan comentario
  // escrito (Google permite valorar solo con estrellas, sin texto), a
  // petición explícita.
  const fiveStarGoogleReviews: ReviewCardData[] =
    googleData?.reviews
      .filter((r) => r.rating === 5 && r.text.trim().length > 0)
      .map((r) => ({
        id: r.id,
        name: r.authorName,
        text: r.text,
        rating: r.rating,
        isGoogle: true,
        photoUrl: r.authorPhotoUrl,
        profileUrl: r.authorProfileUrl,
        relativeTime: r.relativeTime,
      })) ?? [];

  const known = new Set(manualCards.map((c) => c.name.trim().toLowerCase()));
  const reviews = [
    ...manualCards,
    ...fiveStarGoogleReviews.filter((r) => !known.has(r.name.trim().toLowerCase())),
  ];

  const aggregateRating = googleData?.rating ?? 4.8;
  const totalReviews = googleData?.totalReviews;

  return (
    <section id="opiniones" className="bg-dark-950 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Tu opinión, lo único que nos falta
          </p>
          <h2 className="mt-2 font-heading uppercase font-extrabold text-3xl sm:text-4xl text-warm-50">
            Opiniones reales
          </h2>
        </Reveal>

        <a
          href={links.googleReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-warm-50/80 hover:text-brand-orange transition"
        >
          <GoogleReviewIcon className="size-4" />
          <span className="flex text-[#FBBC04]" aria-hidden="true">
            {"★★★★★"}
          </span>
          <span className="text-sm font-semibold">
            {aggregateRating.toFixed(1).replace(".", ",")} sobre 5
            {totalReviews ? ` · ${totalReviews} reseñas de Google` : " · Reseñas de Google"}
          </span>
        </a>

        <GoogleReviewsCarousel reviews={reviews} />
      </div>
    </section>
  );
}
