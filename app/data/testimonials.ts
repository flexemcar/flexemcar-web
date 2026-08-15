export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  city: string;
};

// Reseñas de ejemplo: sustituir por reseñas reales de Google cuando estén disponibles.
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Vendí mi furgoneta sin ningún lío ni proceso de rastrear. También pagué de inmediato y se encargaron de todo el papeleo. Cero complicaciones, tal y como prometen.",
    name: "Laura Sánchez",
    city: "Elche",
  },
  {
    id: "t2",
    quote:
      "Compré una Opel Vivaro revisada y con garantía. Todo tal y como me la enseñaron, sin sorpresas. Muy recomendable.",
    name: "Carlos García",
    city: "Alicante",
  },
  {
    id: "t3",
    quote:
      "Trato cercano y muy profesional. La financiación se adaptó perfectamente a lo que necesitaba mi negocio.",
    name: "Miguel Ángel Torres",
    city: "Crevillente",
  },
];
