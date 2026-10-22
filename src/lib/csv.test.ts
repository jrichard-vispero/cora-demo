import { describe, expect, it } from 'vitest'
import { toCsv } from './csv'

describe('toCsv', () => {
  it('joins fields with commas and rows with CRLF', () => {
    expect(
      toCsv([
        ['Order', 'Total'],
        ['WM-1', 12.5],
      ]),
    ).toBe('Order,Total\r\nWM-1,12.5')
  })

  it('quotes fields that hold a comma, a quote or a line break', () => {
    expect(toCsv([['Hollis, Grey & Co.', 'The "big" order', 'line one\nline two']])).toBe(
      '"Hollis, Grey & Co.","The ""big"" order","line one\nline two"',
    )
  })
})
