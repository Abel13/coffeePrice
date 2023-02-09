const currencies = {
  BRL: {
    symbol: "R$",
  },
  USD: {
    symbol: "$",
  },
  EUR: {
    symbol: "€",
  },
};
export function getCurrencyValue(
  value: number,
  currency: "BRL" | "USD" | "EUR" = "BRL"
) {
  const symbol = currencies[currency].symbol;
  return `${symbol} ${Number(value)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`;
}
