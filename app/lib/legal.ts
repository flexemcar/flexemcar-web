import { links } from "@/app/lib/links";

// Datos del responsable que aparecen en las páginas legales.
// Si algún dato queda vacío se muestra como "[COMPLETAR: ...]": no publicar así.
export const legal = {
  tradeName: "Flexemcar",
  legalName: "FLEXEM CAR 2020, S.L.", // Facilitada por el cliente (2026-09-19)
  cif: "B02732014", // Facilitado por el cliente (2026-09-19)
  address: "PD Altabix 9075 Suelo 0001, 03207 Elche (Alicante)",
  email: links.email,
  phone: links.phone,
  updated: "19 de septiembre de 2026",
};

export function orPending(value: string, label: string) {
  return value.trim() ? value : `[COMPLETAR: ${label}]`;
}

// Enlaces oficiales de Meta usados en las políticas.
export const metaLinks = {
  privacy: "https://www.facebook.com/privacy/policy",
  cookies: "https://www.facebook.com/privacy/policies/cookies",
  adPreferences: "https://www.facebook.com/adpreferences",
  businessTools: "https://www.facebook.com/legal/terms/businesstools",
  controllerAddendum: "https://www.facebook.com/legal/controller_addendum",
};
