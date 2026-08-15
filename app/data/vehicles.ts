export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  fuel: string;
  price: number;
  image: string | null;
};

// Inventario de ejemplo: sustituir por el stock real cuando esté disponible.
export const vehicles: Vehicle[] = [
  {
    id: "v1",
    brand: "Opel",
    model: "Vivaro Mixta",
    year: 2019,
    km: 165000,
    fuel: "Diésel",
    price: 15900,
    image: null,
  },
  {
    id: "v2",
    brand: "Opel",
    model: "Vivaro L2H1",
    year: 2020,
    km: 140000,
    fuel: "Diésel",
    price: 16900,
    image: null,
  },
  {
    id: "v3",
    brand: "Opel",
    model: "Movano L2H2",
    year: 2018,
    km: 180000,
    fuel: "Diésel",
    price: 17900,
    image: null,
  },
  {
    id: "v4",
    brand: "Citroën",
    model: "Jumper L2H3",
    year: 2021,
    km: 95000,
    fuel: "Diésel",
    price: 21900,
    image: null,
  },
  {
    id: "v5",
    brand: "Ford",
    model: "Transit Carrozado",
    year: 2019,
    km: 120000,
    fuel: "Diésel",
    price: 19900,
    image: null,
  },
];

// Total real en stock (marketing) — actualizar cuando se conecte el inventario real.
export const totalStock = 48;
