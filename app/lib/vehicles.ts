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
  photos: VehiclePhoto[];
};

export const fuelOptions = ["Diésel", "Gasolina", "Híbrido", "Eléctrico"];

export const transmissionOptions = ["Manual", "Automático"];

export const ecoLabelOptions = ["", "0", "ECO", "C", "B"];

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
