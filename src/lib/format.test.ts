import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, formatNumber, formatTime } from './format'

describe('formatCurrency', () => {
  it('formats cents as US dollars', () => {
    expect(formatCurrency(123450)).toBe('$1,234.50')
    expect(formatCurrency(5)).toBe('$0.05')
    expect(formatCurrency(0)).toBe('$0.00')
  })
})

describe('formatNumber', () => {
  it('groups thousands', () => {
    expect(formatNumber(12500)).toBe('12,500')
  })
})

describe('formatDate', () => {
  it('formats a date and a local date-time on the same calendar day', () => {
    expect(formatDate('2026-10-22')).toBe('Oct 22, 2026')
    expect(formatDate('2026-10-22T23:59:00')).toBe('Oct 22, 2026')
    expect(formatDate('2026-10-22T00:00:00')).toBe('Oct 22, 2026')
  })
})

describe('formatTime', () => {
  it('formats the time of a local date-time on a 12-hour clock', () => {
    expect(formatTime('2026-10-22T09:41:00')).toMatch(/^9:41\sAM$/)
    expect(formatTime('2026-10-22T16:05:00')).toMatch(/^4:05\sPM$/)
  })
})
