export const formatHijriDate = (hijri) => {
  if (!hijri) return ''
  const month = hijri.month?.en || ''
  const day = hijri.day || ''
  const year = hijri.year || ''
  return `${day} ${month} ${year} AH`
}

export const formatGregorianDate = (gregorian) => {
  if (!gregorian) return ''
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  if (gregorian.weekday?.en) {
    return `${gregorian.weekday.en}, ${gregorian.day} ${gregorian.month?.en || months[gregorian.month?.number - 1]} ${gregorian.year}`
  }

  const parts = gregorian.date?.split('-') || []
  if (parts.length === 3) {
    const [day, month, year] = parts
    return `${weekdays[new Date(`${year}-${month}-${day}`).getDay()]}, ${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`
  }

  return `${gregorian.day} ${gregorian.month?.en} ${gregorian.year}`
}
