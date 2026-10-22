import { CHANNEL_LABELS, ORDER_STATUSES, STATUS_LABELS, WAREHOUSE_LABELS } from '../data/types'
import type { Customer, Order, OrderStatus, Warehouse } from '../data/types'
import { toCsv } from './csv'

/** Orders at or above this subtotal, in cents, ship free. */
export const FREE_SHIPPING_THRESHOLD = 50_000
/** The flat shipping fee, in cents, below the free-shipping threshold. */
export const SHIPPING_FEE = 4_500

const OPEN_STATUSES: ReadonlySet<OrderStatus> = new Set(['pending', 'processing'])

export interface OrderTotals {
  subtotal: number
  shipping: number
  total: number
}

export function orderTotals(order: Order): OrderTotals {
  const subtotal = order.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  return { subtotal, shipping, total: subtotal + shipping }
}

export function isOpen(order: Order): boolean {
  return OPEN_STATUSES.has(order.status)
}

export function byNewest(a: Order, b: Order): number {
  return b.placedAt.localeCompare(a.placedAt)
}

export interface OrderFilters {
  status: OrderStatus | 'all'
  warehouse: Warehouse | 'all'
  query: string
}

export const NO_FILTERS: OrderFilters = { status: 'all', warehouse: 'all', query: '' }

/** Keeps the orders that match every filter. The query matches an order's number, PO number or customer name. */
export function filterOrders(
  orders: readonly Order[],
  filters: OrderFilters,
  customerName: (customerId: string) => string,
): Order[] {
  const query = filters.query.trim().toLowerCase()
  return orders.filter((order) => {
    if (filters.status !== 'all' && order.status !== filters.status) return false
    if (filters.warehouse !== 'all' && order.warehouse !== filters.warehouse) return false
    if (!query) return true
    return [order.number, order.poNumber ?? '', customerName(order.customerId)].some((text) =>
      text.toLowerCase().includes(query),
    )
  })
}

export interface OrderSummary {
  openOrders: number
  /** Revenue in cents from orders placed in the window, cancelled orders excluded. */
  revenue: number
  averageOrderValue: number
  needsAttention: Order[]
  countsByStatus: Record<OrderStatus, number>
}

export const REVENUE_WINDOW_DAYS = 30
/** An open order placed more than this many days before the reporting day needs attention. */
export const ATTENTION_AFTER_DAYS = 2

/** Summarizes orders for the dashboard, as of the end of the day `asOf` (YYYY-MM-DD). */
export function summarizeOrders(orders: readonly Order[], asOf: string): OrderSummary {
  const windowStart = addDays(asOf, -(REVENUE_WINDOW_DAYS - 1))
  const attentionBefore = addDays(asOf, -ATTENTION_AFTER_DAYS)

  const inWindow = orders.filter(
    (order) => order.status !== 'cancelled' && placedOn(order) >= windowStart && placedOn(order) <= asOf,
  )
  const revenue = inWindow.reduce((sum, order) => sum + orderTotals(order).total, 0)

  const countsByStatus = Object.fromEntries(ORDER_STATUSES.map((status) => [status, 0])) as Record<OrderStatus, number>
  for (const order of orders) countsByStatus[order.status] += 1

  return {
    openOrders: orders.filter(isOpen).length,
    revenue,
    averageOrderValue: inWindow.length ? Math.round(revenue / inWindow.length) : 0,
    needsAttention: orders.filter((order) => isOpen(order) && placedOn(order) < attentionBefore).sort(byNewest),
    countsByStatus,
  }
}

export function ordersToCsv(orders: readonly Order[], getCustomer: (customerId: string) => Customer): string {
  const header = ['Order', 'Placed', 'Customer', 'PO number', 'Channel', 'Warehouse', 'Status', 'Total']
  const rows = orders.map((order) => [
    order.number,
    placedOn(order),
    getCustomer(order.customerId).name,
    order.poNumber ?? '',
    CHANNEL_LABELS[order.channel],
    WAREHOUSE_LABELS[order.warehouse],
    STATUS_LABELS[order.status],
    (orderTotals(order).total / 100).toFixed(2),
  ])
  return toCsv([header, ...rows])
}

function placedOn(order: Order): string {
  return order.placedAt.slice(0, 10)
}

/** Adds days to a YYYY-MM-DD date, in UTC so no time zone can shift it. */
function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}
