// TIN confirmado por Flexemcar: 7,9% fijo. TAE sigue siendo el valor de
// ejemplo del boceto original de la agencia, pendiente de confirmar con el
// cliente. Cuando se confirme, este es el único sitio a tocar.
export const financingConfig = {
  tin: 7.9,
  tae: 8.25,
  minTermMonths: 12,
  maxTermMonths: 96,
  termStepMonths: 12,
};

// Cuota mensual por amortizacion francesa (cuota constante).
export function calculateMonthlyPayment(
  amountToFinance: number,
  termMonths: number,
  tinPercent: number
): number {
  if (amountToFinance <= 0 || termMonths <= 0) return 0;
  const monthlyRate = tinPercent / 100 / 12;
  if (monthlyRate === 0) return amountToFinance / termMonths;
  return (
    (amountToFinance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths))
  );
}
