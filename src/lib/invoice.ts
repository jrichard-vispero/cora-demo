import { WAREHOUSE_LABELS } from '../data/types'
import type { Customer, Order } from '../data/types'
import { formatCurrency, formatDate } from './format'
import { orderTotals } from './orders'

/** Renders an order as a plain-text invoice. */
export function invoiceText(order: Order, customer: Customer): string {
  const totals = orderTotals(order)
  const { address } = customer
  const lines = order.lines.map(
    (line) =>
      `${line.sku.padEnd(8)} ${line.name.padEnd(52)} ${String(line.quantity).padStart(4)} × ${formatCurrency(line.unitPrice).padStart(10)}  ${formatCurrency(line.quantity * line.unitPrice).padStart(11)}`,
  )
  return [
    'Wrenmoor Supply Co.',
    `Invoice for order ${order.number}`,
    '',
    `Date:       ${formatDate(order.placedAt)}`,
    `PO number:  ${order.poNumber ?? 'None'}`,
    `Ships from: ${WAREHOUSE_LABELS[order.warehouse]}`,
    '',
    'Bill to:',
    customer.name,
    `Attn: ${customer.contact}`,
    address.line1,
    ...(address.line2 ? [address.line2] : []),
    `${address.city}, ${address.region} ${address.postalCode}`,
    '',
    ...lines,
    '',
    `Subtotal: ${formatCurrency(totals.subtotal)}`,
    `Shipping: ${totals.shipping ? formatCurrency(totals.shipping) : 'Free'}`,
    `Total:    ${formatCurrency(totals.total)}`,
    '',
  ].join('\n')
}
