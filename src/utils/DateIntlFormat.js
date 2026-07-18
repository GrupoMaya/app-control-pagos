export default function DateIntlFormat ({ date, locale = 'es-MX', type = 'all' }) {
  if (!date) return null

  const options = (() => {
    switch (type) {
      case 'numeric':
        return { year: 'numeric', month: 'numeric', day: 'numeric' }
      case 'month':
        return { month: 'long' }
      case 'day':
        return { day: 'numeric' }
      case 'hour':
        return { hour: 'numeric', minute: 'numeric' }
      default:
        return { year: 'numeric', month: 'long', day: 'numeric' }
    }
  })()

  const dateIntl = new Date(date)
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(dateIntl)
}
