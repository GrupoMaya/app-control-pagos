const DateIntlForma = ({ date, dateStyle }) => {

  const dateIntl = new Date(date)
  return new Intl.DateTimeFormat('en-US', { dateStyle }).format(dateIntl)

}

export default DateIntlForma
