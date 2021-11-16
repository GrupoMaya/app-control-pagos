const DateIntlForma = ({ date, dateStyle = 'medium', locale = 'es-MX' }) => {

  const dateIntl = new Date(date)
  return new Intl.DateTimeFormat(locale, { dateStyle, timeZone: 'America/Los_Angeles' }).format(dateIntl)

}

export default DateIntlForma
