export default function formatNumber(number: number) {
  return new Intl.NumberFormat("id-ID").format(number);
}
