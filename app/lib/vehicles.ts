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
  price: number;
  cashPrice: number | null;
  warrantyMonths: number;
  equipment: string[];
  status: VehicleStatus;
  description: string | null;
  photos: VehiclePhoto[];
};

export const fuelOptions = ["Diésel", "Gasolina", "Híbrido", "Eléctrico"];

export const transmissionOptions = ["Manual", "Automático"];

export const equipmentOptions = [
  "Aire acondicionado",
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
];

export const statusLabels: Record<VehicleStatus, string> = {
  available: "Disponible",
  reserved: "Reservado",
  sold: "Vendido",
};
