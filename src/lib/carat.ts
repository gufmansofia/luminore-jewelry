// Display precision approved for the catalogue. Keep exact weights in product data.
const caratNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  useGrouping: false,
});

export function formatCarat(weight: number) {
  return caratNumber.format(weight);
}

export function formatCaratText(text: string) {
  return text.replace(/(?:≈\s*)?(\d+(?:[.,]\d+)?)\s*(ct\b|кар\.)/g,
    (_match, weight: string, unit: string) => `${formatCarat(Number(weight.replace(',', '.')))} ${unit}`);
}

export function formatStoneWeights(weights: string) {
  return weights.split('+').map(weight => formatCarat(Number(weight.trim()))).join(' + ');
}
