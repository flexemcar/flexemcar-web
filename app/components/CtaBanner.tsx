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
  // Fotos que se cruzan. Con fotos, el texto va a la izquierda: en escritorio
  // la foto entera queda centrada en el banner y en móvil va encima del texto.
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
          className={`relative isolate overflow-hidden bg-brand-orange ${
            hasImages
              ? "flex flex-col text-left shadow-[0_24px_60px_rgba(28,28,34,0.25)] sm:min-h-[30rem] sm:justify-center"
              : "px-6 sm:px-16 py-14 sm:py-20 text-center"
          } ${rounded ? "rounded-3xl" : ""}`}
        >
          {hasImages && (
            <>
              <div className="relative h-72 shrink-0 sm:absolute sm:inset-0 sm:h-auto">
                <BannerSlides slides={images} />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-[calc(4rem+1px)] bg-gradient-to-b from-transparent to-brand-orange sm:hidden"
                />
              </div>
              <div
                aria-hidden="true"
                className="hidden sm:block absolute inset-0 bg-[linear-gradient(95deg,rgba(214,102,6,0.95)_0%,rgba(245,130,31,0.88)_28%,rgba(245,130,31,0)_44%)]"
              />
            </>
          )}

          <div
            className={`relative ${
              hasImages ? "px-6 sm:px-16 pb-10 pt-2 sm:py-20 sm:max-w-sm" : ""
            }`}
          >
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
