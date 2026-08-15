type CtaBannerProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref: string;
  rounded?: boolean;
};

export default function CtaBanner({
  id,
  eyebrow,
  title,
  subtitle,
  buttonText,
  buttonHref,
  rounded = false,
}: CtaBannerProps) {
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
          className={`bg-brand-orange px-6 sm:px-16 py-14 sm:py-20 text-center ${
            rounded ? "rounded-3xl" : ""
          }`}
        >
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-2 font-heading uppercase font-extrabold text-3xl sm:text-5xl text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 max-w-xl mx-auto text-white/90">{subtitle}</p>
          )}
          <a
            href={buttonHref}
            className="mt-8 inline-block rounded-full bg-white px-8 py-[15px] font-bold text-[17px] text-brand-orange hover:brightness-95 transition"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}
