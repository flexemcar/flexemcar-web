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
  price: number;
  status: VehicleStatus;
  description: string | null;
  photos: VehiclePhoto[];
};

export const fuelOptions = ["Diésel", "Gasolina", "Híbrido", "Eléctrico"];

export const statusLabels: Record<VehicleStatus, string> = {
  available: "Disponible",
  reserved: "Reservado",
  sold: "Vendido",
};
