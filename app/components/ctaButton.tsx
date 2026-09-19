// Botón blanco de los banners naranjas ("Descubre el stock", "Pide tu tasación
// gratis"). Al pasar el ratón sube con sombra, un destello cruza el botón y
// aparece una flecha. Se respeta "reducir movimiento".
export const ctaButtonClass =
  "group relative mt-8 inline-flex items-center overflow-hidden rounded-full bg-white px-8 py-[15px] font-bold text-[17px] text-brand-orange shadow-md " +
  "transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(0,0,0,0.28)] active:translate-y-0 active:scale-95 " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white " +
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100";

// Destello que barre el botón de izquierda a derecha al pasar el ratón.
export function CtaShine() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-brand-orange/25 to-transparent transition-none group-hover:translate-x-[420%] group-hover:transition-transform group-hover:duration-700 group-hover:ease-out motion-reduce:hidden"
    />
  );
}

// Flecha que aparece deslizándose junto al texto al pasar el ratón.
export function CtaArrow({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`ml-0 h-5 w-0 shrink-0 opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:w-5 group-hover:opacity-100 motion-reduce:transition-none ${
        open ? "ml-2 w-5 opacity-100" : ""
      }`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Chevron del botón que despliega el formulario: apunta abajo y gira al abrir.
export function CtaChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`ml-0 h-5 w-0 shrink-0 opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:w-5 group-hover:opacity-100 motion-reduce:transition-none ${
        open ? "ml-2 w-5 rotate-180 opacity-100" : ""
      }`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
