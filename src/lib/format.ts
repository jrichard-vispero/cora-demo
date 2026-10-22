const LOCALE = 'en-US'

const currency = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD' })
const integer = new Intl.NumberFormat(LOCALE)
const date = new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric', year: 'numeric' })
const time = new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' })

/** Formats an amount in cents as US dollars, such as `$1,234.50`. */
export function formatCurrency(cents: number): string {
  return currency.format(cents / 100)
}

export function formatNumber(value: number): string {
  return integer.format(value)
}

/** Formats a local ISO 8601 date or date-time, such as `Oct 22, 2026`. */
export function formatDate(iso: string): string {
  return date.format(parseLocal(iso))
}

/** Formats the time of a local ISO 8601 date-time, such as `9:41 AM`. */
export function formatTime(iso: string): string {
  return time.format(parseLocal(iso))
}

function parseLocal(iso: string): Date {
  // A date without a time parses as UTC midnight; a date-time without an offset parses as local time.
  return new Date(iso.length === 10 ? `${iso}T00:00:00` : iso)
}
