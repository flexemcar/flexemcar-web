// Etiqueta relativa en español al estilo de Google ("hace 8 meses") a partir
// de un mes aproximado (AAAA-MM). Se calcula al mostrarla para que no se quede
// vieja con el paso del tiempo.
export function relativeMonthsEs(yearMonth: string, now: Date): string {
  const [y, m] = yearMonth.split("-").map(Number);
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  if (months <= 1) return "hace un mes";
  if (months < 12) return `hace ${months} meses`;
  const years = Math.floor(months / 12);
  return years === 1 ? "hace un año" : `hace ${years} años`;
}
