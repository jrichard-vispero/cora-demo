export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const WAREHOUSES = ['reno', 'columbus', 'savannah'] as const
export type Warehouse = (typeof WAREHOUSES)[number]

export const WAREHOUSE_LABELS: Record<Warehouse, string> = {
  reno: 'Reno, NV',
  columbus: 'Columbus, OH',
  savannah: 'Savannah, GA',
}

export type Channel = 'portal' | 'edi' | 'sales-rep'

export const CHANNEL_LABELS: Record<Channel, string> = {
  portal: 'Wholesale portal',
  edi: 'EDI',
  'sales-rep': 'Sales rep',
}

export interface Address {
  line1: string
  line2?: string
  city: string
  region: string
  postalCode: string
}

export interface Customer {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: Address
}

export interface Product {
  sku: string
  name: string
  /** Price per unit, in cents. */
  unitPrice: number
}

export interface OrderLine {
  sku: string
  name: string
  quantity: number
  /** Price per unit when the order was placed, in cents. */
  unitPrice: number
}

export interface Order {
  number: string
  customerId: string
  /** Local date and time the order was placed, as an ISO 8601 string without an offset. */
  placedAt: string
  status: OrderStatus
  channel: Channel
  warehouse: Warehouse
  poNumber?: string
  lines: OrderLine[]
}
