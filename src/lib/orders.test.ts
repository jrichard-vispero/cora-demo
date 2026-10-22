import { describe, expect, it } from 'vitest'
import type { Customer, Order } from '../data/types'
import { NO_FILTERS, filterOrders, isOpen, orderTotals, ordersToCsv, summarizeOrders } from './orders'

function makeOrder(overrides: Partial<Order> & Pick<Order, 'number'>): Order {
  return {
    customerId: 'cus_a',
    placedAt: '2026-10-01T10:00:00',
    status: 'pending',
    channel: 'portal',
    warehouse: 'reno',
    lines: [{ sku: 'SKU-1', name: 'Widget', quantity: 1, unitPrice: 50_000 }],
    ...overrides,
  }
}

const names: Record<string, string> = { cus_a: 'Harbor Lane Deli', cus_b: 'Little Fern Bakery' }
const customerName = (id: string) => names[id] ?? ''

describe('orderTotals', () => {
  it('adds a flat shipping fee below $500', () => {
    const order = makeOrder({
      number: 'WM-1',
      lines: [
        { sku: 'A', name: 'A', quantity: 2, unitPrice: 1_000 },
        { sku: 'B', name: 'B', quantity: 1, unitPrice: 500 },
      ],
    })
    expect(orderTotals(order)).toEqual({ subtotal: 2_500, shipping: 4_500, total: 7_000 })
  })

  it('ships free at $500 and above', () => {
    expect(orderTotals(makeOrder({ number: 'WM-1' }))).toEqual({ subtotal: 50_000, shipping: 0, total: 50_000 })
  })
})

describe('isOpen', () => {
  it('counts pending and processing orders as open', () => {
    expect(isOpen(makeOrder({ number: 'WM-1', status: 'pending' }))).toBe(true)
    expect(isOpen(makeOrder({ number: 'WM-1', status: 'processing' }))).toBe(true)
    expect(isOpen(makeOrder({ number: 'WM-1', status: 'shipped' }))).toBe(false)
    expect(isOpen(makeOrder({ number: 'WM-1', status: 'cancelled' }))).toBe(false)
  })
})

describe('filterOrders', () => {
  const orders = [
    makeOrder({ number: 'WM-100', status: 'pending', warehouse: 'reno', poNumber: 'PO-77' }),
    makeOrder({ number: 'WM-101', status: 'shipped', warehouse: 'columbus', customerId: 'cus_b' }),
    makeOrder({ number: 'WM-102', status: 'shipped', warehouse: 'reno' }),
  ]
  const numbers = (filtered: Order[]) => filtered.map((order) => order.number)

  it('keeps every order without filters', () => {
    expect(numbers(filterOrders(orders, NO_FILTERS, customerName))).toEqual(['WM-100', 'WM-101', 'WM-102'])
  })

  it('filters by status and warehouse together', () => {
    expect(numbers(filterOrders(orders, { ...NO_FILTERS, status: 'shipped' }, customerName))).toEqual([
      'WM-101',
      'WM-102',
    ])
    expect(
      numbers(filterOrders(orders, { ...NO_FILTERS, status: 'shipped', warehouse: 'reno' }, customerName)),
    ).toEqual(['WM-102'])
  })

  it('matches the query against the order number, PO number and customer name, ignoring case', () => {
    expect(numbers(filterOrders(orders, { ...NO_FILTERS, query: 'wm-101' }, customerName))).toEqual(['WM-101'])
    expect(numbers(filterOrders(orders, { ...NO_FILTERS, query: 'po-77' }, customerName))).toEqual(['WM-100'])
    expect(numbers(filterOrders(orders, { ...NO_FILTERS, query: '  fern ' }, customerName))).toEqual(['WM-101'])
  })
})

describe('summarizeOrders', () => {
  const orders = [
    makeOrder({ number: 'A', placedAt: '2026-10-22T09:00:00', status: 'processing' }),
    makeOrder({ number: 'B', placedAt: '2026-09-23T09:00:00', status: 'delivered' }),
    makeOrder({ number: 'C', placedAt: '2026-09-22T23:00:00', status: 'delivered' }),
    makeOrder({ number: 'D', placedAt: '2026-10-19T17:00:00', status: 'pending' }),
    makeOrder({ number: 'E', placedAt: '2026-10-20T08:00:00', status: 'processing' }),
    makeOrder({ number: 'F', placedAt: '2026-10-10T12:00:00', status: 'cancelled' }),
  ]

  it('counts revenue from the last 30 days, without cancelled orders', () => {
    const summary = summarizeOrders(orders, '2026-10-22')
    expect(summary.revenue).toBe(200_000)
    expect(summary.averageOrderValue).toBe(50_000)
  })

  it('counts open orders and flags those open for more than two days', () => {
    const summary = summarizeOrders(orders, '2026-10-22')
    expect(summary.openOrders).toBe(3)
    expect(summary.needsAttention.map((order) => order.number)).toEqual(['D'])
  })

  it('counts every status, including those with no orders', () => {
    expect(summarizeOrders(orders, '2026-10-22').countsByStatus).toEqual({
      pending: 1,
      processing: 2,
      shipped: 0,
      delivered: 2,
      cancelled: 1,
    })
  })

  it('reports no average when no order falls in the window', () => {
    expect(summarizeOrders([], '2026-10-22')).toMatchObject({ revenue: 0, averageOrderValue: 0, openOrders: 0 })
  })
})

describe('ordersToCsv', () => {
  it('writes a header and one row per order', () => {
    const customer: Customer = {
      id: 'cus_a',
      name: 'Hollis, Grey & Co.',
      contact: 'Ada Hollis',
      email: 'ada@hollisgrey.example',
      phone: '(555) 555-0100',
      address: { line1: '1 Main St', city: 'Reno', region: 'NV', postalCode: '89501' },
    }
    const csv = ordersToCsv([makeOrder({ number: 'WM-100', poNumber: 'PO-77', status: 'shipped' })], () => customer)
    expect(csv.split('\r\n')).toEqual([
      'Order,Placed,Customer,PO number,Channel,Warehouse,Status,Total',
      'WM-100,2026-10-01,"Hollis, Grey & Co.",PO-77,Wholesale portal,"Reno, NV",Shipped,500.00',
    ])
  })
})
