export default function NumberFormat ({ number }) {
  if (number == null) return null
  const value = typeof number === 'object' && number?.$numberDecimal
    ? Number(number.$numberDecimal)
    : Number(number)

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value)
}
