const DateIntlForma = ({ date, dateStyle }) => {

  const dateIntl = new Date(date)
  return new Intl.DateTimeFormat('es-MX', { dateStyle }).format(dateIntl)

}

export default DateIntlForma
