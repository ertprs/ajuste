export function prettyNumber (number) {
  return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number)
  // return parseFloat(number).toLocaleString('pt-BR', {
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2
  // })
}
