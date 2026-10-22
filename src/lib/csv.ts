/** Serializes rows as RFC 4180 CSV, quoting any field that holds a comma, a quote or a line break. */
export function toCsv(rows: readonly (readonly (string | number)[])[]): string {
  return rows.map((row) => row.map(field).join(',')).join('\r\n')
}

function field(value: string | number): string {
  const text = String(value)
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}
