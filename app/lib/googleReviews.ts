export type GoogleReview = {
  id: string;
  authorName: string;
  authorPhotoUrl: string | null;
  authorProfileUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
};

export type GoogleReviewsData = {
  reviews: GoogleReview[];
  rating: number;
  totalReviews: number;
};

type PlacesApiReview = {
  name?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
    uri?: string;
  };
};

// Reseñas reales de la ficha de Google Business de Flexemcar, vía Places API
// (New). Google solo devuelve como máximo las 5 reseñas que su algoritmo
// considera más relevantes (no se puede pedir "todas" ni filtrar por
// puntuación en la propia petición) — el filtrado (p.ej. quedarse solo con
// las de 5 estrellas) se hace después, sobre esas 5, en quien consuma esta
// función.
//
// Requiere GOOGLE_PLACES_API_KEY y GOOGLE_PLACE_ID en las variables de
// entorno (ver .env.local.example). Si faltan o la petición falla, devuelve
// null para que el componente pueda caer en el respaldo de ejemplo en vez de
// romper la home.
//
// La clave se usa solo en servidor (esta función corre en un Server
// Component/Route Handler), nunca se manda al navegador: no hace falta el
// prefijo NEXT_PUBLIC_ ni exponerla como variable pública.
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=es`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews",
        },
        // 24h: de sobra dentro del límite de cacheo que permite Google (30
        // días) y mantiene el gasto de la API en el mínimo posible.
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      console.warn(`No se pudo traer reseñas de Google Places (${res.status})`);
      return null;
    }

    const data = await res.json();
    const rawReviews: PlacesApiReview[] = data.reviews ?? [];

    const reviews: GoogleReview[] = rawReviews.map((r, i) => ({
      id: r.name ?? `google-review-${i}`,
      authorName: r.authorAttribution?.displayName ?? "Cliente de Google",
      authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
      authorProfileUrl: r.authorAttribution?.uri ?? null,
      rating: r.rating ?? 5,
      text: r.text?.text ?? r.originalText?.text ?? "",
      relativeTime: r.relativePublishTimeDescription ?? "",
    }));

    return {
      reviews,
      rating: data.rating ?? 0,
      totalReviews: data.userRatingCount ?? 0,
    };
  } catch (err) {
    console.warn("No se pudo traer reseñas de Google Places", err);
    return null;
  }
}
