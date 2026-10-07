import Reveal from "@/app/components/Reveal";
import BuenaGenteVideo from "@/app/components/BuenaGenteVideo";

// Sección del vídeo de marca "Buena gente": texto a la izquierda y vídeo vertical
// a la derecha en escritorio; apilado y centrado en móvil. Va justo antes de
// las opiniones para enlazar el equipo con lo que dicen los clientes.
export default function BuenaGenteSection() {
  return (
    <section id="buena-gente" className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="pointer-events-none absolute -right-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-brand-orange/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1fr_auto] md:gap-16 lg:gap-24">
        <Reveal className="text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Quiénes somos
          </p>
          <h2 className="mt-2 font-heading text-5xl font-extrabold uppercase leading-[0.95] text-brand-ink sm:text-6xl lg:text-8xl">
            Buena <span className="text-brand-orange">gente</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-brand-ink/70 md:mx-0">
            Detrás de cada furgoneta hay un equipo que da la cara. Así somos en Flexemcar.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <a
              href="#stock-disponible"
              className="inline-flex items-center rounded-full bg-brand-orange px-8 py-[15px] text-[17px] font-bold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(245,130,31,0.35)] active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Ver stock disponible
            </a>
            <a
              href="#opiniones"
              className="text-[15px] font-bold text-brand-ink underline decoration-brand-orange decoration-2 underline-offset-4 transition hover:text-brand-orange"
            >
              Lo que dicen nuestros clientes
            </a>
          </div>
        </Reveal>

        <Reveal className="mx-auto w-full max-w-[280px] sm:max-w-[320px] md:max-w-none md:w-[min(340px,calc((100svh-10rem)*0.5625))]">
          <BuenaGenteVideo />
        </Reveal>
      </div>
    </section>
  );
}
