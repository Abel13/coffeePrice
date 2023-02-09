export function getCurrencyValue(value: number) {
  return `R$ ${Number(value)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`;
}
