import Reveal from "@/app/components/Reveal";
import BannerSlides, { type BannerSlide } from "@/app/components/BannerSlides";

type CtaBannerProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref: string;
  rounded?: boolean;
  // Fotos de fondo que se cruzan bajo un degradado naranja. Con fotos, el
  // texto va alineado a la izquierda.
  images?: BannerSlide[];
};

export default function CtaBanner({
  id,
  eyebrow,
  title,
  subtitle,
  buttonText,
  buttonHref,
  rounded = false,
  images,
}: CtaBannerProps) {
  const hasImages = !!images && images.length > 0;

  return (
    <section id={id} className={rounded ? "bg-warm-50 py-16 sm:py-24" : ""}>
      <div
        className={
          rounded
            ? "mx-auto max-w-7xl px-4 sm:px-6"
            : "px-0"
        }
      >
        <div
          className={`relative isolate overflow-hidden bg-brand-orange px-6 sm:px-16 py-14 sm:py-20 ${
            hasImages
              ? "flex flex-col justify-center text-left shadow-[0_24px_60px_rgba(28,28,34,0.25)] sm:min-h-[26rem]"
              : "text-center"
          } ${rounded ? "rounded-3xl" : ""}`}
        >
          {hasImages && (
            <>
              <BannerSlides slides={images} />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(214,102,6,0.9),rgba(245,130,31,0.72))] sm:bg-[linear-gradient(95deg,rgba(214,102,6,0.95)_15%,rgba(245,130,31,0.82)_45%,rgba(245,130,31,0.15))]"
              />
            </>
          )}

          <div className="relative">
            <Reveal>
              {eyebrow && (
                <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                  {eyebrow}
                </p>
              )}
              <h2 className="mt-2 font-heading uppercase font-extrabold text-3xl sm:text-5xl text-white">
                {title}
              </h2>
            </Reveal>
            {subtitle && (
              <p className={`mt-4 max-w-xl text-white/90 ${hasImages ? "" : "mx-auto"}`}>
                {subtitle}
              </p>
            )}
            <a
              href={buttonHref}
              className="mt-8 inline-block rounded-full bg-white px-8 py-[15px] font-bold text-[17px] text-brand-orange hover:brightness-95 transition"
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
