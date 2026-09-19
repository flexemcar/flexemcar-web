import Image from "next/image";
import Reveal from "@/app/components/Reveal";

const advantages = [
  {
    title: "Financiación a medida",
    image: "/ventajas/financiacion.jpg",
    description:
      "Estudiamos tu caso y te ofrecemos la mejor fórmula de financiación, ajustada a tu negocio.",
  },
  {
    title: "Vehículos revisados",
    image: "/ventajas/revisados.jpg",
    description:
      "Cada furgoneta pasa una revisión completa antes de entregarla, sin sorpresas.",
  },
  {
    title: "Garantía incluida",
    image: "/ventajas/garantia.jpg",
    description:
      "Todos nuestros vehículos se entregan con garantía y toda la documentación al día.",
  },
  {
    title: "Entrega inmediata",
    image: "/ventajas/entrega.jpg",
    description:
      "Desde que cierras la compra hasta que sales conduciendo, sin esperas eternas.",
  },
];

export default function AdvantagesSection() {
  return (
    <section className="bg-warm-100 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Por qué Flexemcar
          </p>
          <h2 className="mt-2 font-heading uppercase font-extrabold text-3xl sm:text-4xl text-brand-ink">
            Ventajas de comprar con nosotros
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item) => (
            <div key={item.title} className="group text-left">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-ink">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 font-heading uppercase font-extrabold text-lg text-brand-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-brand-ink/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
