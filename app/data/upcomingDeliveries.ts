export type UpcomingDelivery = {
  id: string;
  brand: string;
  model: string;
  eta: string;
  image: string | null;
};

// Furgonetas en camino, aún sin ficha completa: generan expectación antes de
// llegar al stock. Sustituir por las entregas reales cuando se conecte el
// inventario (ver app/data/vehicles.ts).
export const upcomingDeliveries: UpcomingDelivery[] = [
  {
    id: "u1",
    brand: "Renault",
    model: "Trafic L2H1",
    eta: "Llega en 2 semanas",
    image: null,
  },
  {
    id: "u2",
    brand: "Mercedes-Benz",
    model: "Vito Mixto",
    eta: "Llega en 3 semanas",
    image: null,
  },
  {
    id: "u3",
    brand: "Volkswagen",
    model: "Crafter L3H3",
    eta: "Llega en 1 mes",
    image: null,
  },
];
