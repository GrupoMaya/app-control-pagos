
const NumberFormat = ({ number } = {}) => {
  const precioStyled = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(number)

  return precioStyled
}

export default NumberFormat
