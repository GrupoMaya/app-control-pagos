const DateIntlForma = ({ date, locale = 'es-MX', type = 'all' }) => {

  /**
 * Hook de formato de fecha
 * @constructor
 * @param {string} type - numeric, month, day, hour,
 * @param {string} date - fecha en formato string
 */

  const dataInteOptions = () => {
    switch (type) {
      case 'numeric':
        return {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }
      case 'month':
        return {
          month: 'long'
        } // 'numeric',
      case 'day':
        return {
          day: 'numeric'
        }
      case 'hour':
        return {
          hour: 'numeric',
          minute: 'numeric'
        }
      default:
        return {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
    }
  }

  const dateIntl = new Date(date)
  return new Intl.DateTimeFormat(locale, { ...dataInteOptions(), timeZone: 'UTC' }).format(dateIntl)

}

export default DateIntlForma
