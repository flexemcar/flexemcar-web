export type VehicleStatus = "available" | "reserved" | "sold";

export type VehiclePhoto = {
  id: string;
  storagePath: string;
  position: number;
  url: string;
};

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  fuel: string;
  transmission: string;
  price: number | null;
  cashPrice: number | null;
  warrantyMonths: number;
  equipment: string[];
  status: VehicleStatus;
  description: string | null;
  engine: string | null;
  powerCv: number | null;
  bodyConfig: string | null;
  seats: number | null;
  ecoLabel: string | null;
  vehicleType: string | null;
  // Proxima entrega: aun no ha llegado. Sale en "Proximas entregas", no en el stock.
  upcoming: boolean;
  eta: string | null;
  photos: VehiclePhoto[];
};

export const fuelOptions = ["Diésel", "Gasolina", "Híbrido", "Eléctrico"];

export const transmissionOptions = ["Manual", "Automático"];

export const ecoLabelOptions = ["", "0", "ECO", "C", "B"];

// Catalogo de marcas que trabaja la empresa (dado por el cliente). Se usa
// como sugerencias en el alta del admin (datalist, no bloquea escribir otra
// marca) y como opciones del filtro de marca en la web publica.
export const brandOptions = [
  "Peugeot",
  "Citroën",
  "Fiat",
  "Opel",
  "Renault",
  "Nissan",
  "Ford",
  "Volkswagen",
  "Mercedes",
  "Iveco",
];

// Tipo/estilo de carroceria, distinto de `bodyConfig` (que es texto libre
// tipo "L3H2"): esta es una categoria cerrada para poder filtrar por ella.
export const vehicleTypeOptions = [
  "Caja abierta",
  "Carrozado",
  "Mixto",
  "Furgón cerrado",
];

export const equipmentOptions = [
  "Aire acondicionado",
  "Climatizador",
  "Bluetooth",
  "Cierre centralizado",
  "Dirección asistida",
  "ABS",
  "ESP",
  "Airbags",
  "Elevalunas eléctrico",
  "Ordenador de a bordo",
  "Cámara trasera",
  "Sensores de aparcamiento",
  "Navegador GPS",
  "Llantas de aleación",
  "Techo solar",
  "Control de crucero",
  "Asientos calefactables",
  "Volante multifunción",
  "Limitador de velocidad",
  "Ventanas laterales abatibles",
  "Modos de conducción",
  "Baca de carga",
];

// Precio a mostrar: el financiado si existe, si no el al contado (algunos
// anuncios de la empresa solo traen un precio, sin distinguir).
export function getDisplayPrice(vehicle: Pick<Vehicle, "price" | "cashPrice">): {
  amount: number;
  label: string;
} {
  if (vehicle.price !== null) {
    return { amount: vehicle.price, label: "Precio financiado" };
  }
  return { amount: vehicle.cashPrice ?? 0, label: "Precio al contado" };
}

export const statusLabels: Record<VehicleStatus, string> = {
  available: "Disponible",
  reserved: "Reservado",
  sold: "Vendido",
};

// Llegada prevista de una proxima entrega: el panel elige numero + unidad y se
// guarda ya como texto ("Llega en 2 semanas") en `eta`.
export const etaUnits = [
  { value: "dias", singular: "día", plural: "días" },
  { value: "semanas", singular: "semana", plural: "semanas" },
  { value: "meses", singular: "mes", plural: "meses" },
] as const;

export function formatEta(amount: number, unit: string): string | null {
  const u = etaUnits.find((x) => x.value === unit);
  if (!u || !Number.isInteger(amount) || amount < 1) return null;
  return `Llega en ${amount} ${amount === 1 ? u.singular : u.plural}`;
}

// Inverso de formatEta, para rellenar el panel al editar.
export function parseEta(eta: string | null): { amount: number; unit: string } | null {
  const m = eta?.match(/^Llega en (\d+) (\S+)$/);
  if (!m) return null;
  const u = etaUnits.find((x) => x.singular === m[2] || x.plural === m[2]);
  return u ? { amount: Number(m[1]), unit: u.value } : null;
}

// Tamaño de la furgoneta: largo (L1-L4) y alto (H1-H3), sacados del campo
// libre de carroceria ("L3H2", "L3H2 Mixta"...). null si no aparece.
export const lengthOptions = ["L1", "L2", "L3", "L4"];
export const heightOptions = ["H1", "H2", "H3"];

export function parseSize(bodyConfig: string | null): {
  length: string | null;
  height: string | null;
} {
  const text = (bodyConfig ?? "").toUpperCase();
  return {
    length: text.match(/L([1-4])/)?.[0] ?? null,
    height: text.match(/H([1-3])/)?.[0] ?? null,
  };
}

// Tamaño y potencia en una linea corta para tarjetas y cabecera de la ficha.
export function sizeAndPower(v: Pick<Vehicle, "bodyConfig" | "powerCv">): string[] {
  const parts: string[] = [];
  if (v.bodyConfig) parts.push(v.bodyConfig);
  if (v.powerCv) parts.push(`${v.powerCv} CV`);
  return parts;
}
