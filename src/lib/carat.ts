// Display precision approved for the catalogue. Keep exact weights in product data.
const caratNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  useGrouping: false,
});

export function formatCarat(weight: number) {
  return caratNumber.format(Math.trunc(weight * 10) / 10);
}

// Format each listed weight without interpreting or adding compound expressions.
export function formatCaratExpression(weights: string) {
  return weights.replace(/\d+(?:[.,]\d+)?/g,
    weight => formatCarat(Number(weight.replace(',', '.'))));
}

export function formatCaratText(text: string) {
  return text.replace(/(?:≈\s*)?(\d+(?:[.,]\d+)?)\s*(ct\b|кар\.)/g,
    (_match, weight: string, unit: string) => `${formatCarat(Number(weight.replace(',', '.')))} ${unit}`);
}

export function formatStoneWeights(weights: string) {
  return weights.split('+').map(weight => formatCarat(Number(weight.trim().replace(',', '.')))).join(' + ');
}
