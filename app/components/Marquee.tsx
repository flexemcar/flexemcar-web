const words = [
  "VEHÍCULOS REVISADOS",
  "GARANTÍA INCLUIDA",
  "ENTREGA INMEDIATA",
  "FINANCIACIÓN A MEDIDA",
];

function Track() {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {words.map((word) => (
        <span
          key={word}
          className="flex items-center gap-2 font-heading uppercase font-bold text-sm sm:text-base tracking-wide text-brand-ink"
        >
          <span aria-hidden="true">•</span>
          {word}
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="bg-brand-orange overflow-hidden py-3">
      <div className="flex w-max animate-marquee">
        <Track />
        <Track />
      </div>
    </div>
  );
}
