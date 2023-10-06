module.exports = (number) => {
  return new Intl.NumberFormat("id-ID").format(number)
}
