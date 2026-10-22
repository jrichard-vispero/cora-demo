import { createContext, useContext } from 'react'
import type { Order } from '../data/types'

export interface OrdersContextValue {
  orders: Order[]
  cancelOrder: (orderNumber: string) => void
}

export const OrdersContext = createContext<OrdersContextValue | null>(null)

export function useOrders(): OrdersContextValue {
  const value = useContext(OrdersContext)
  if (!value) throw new Error('useOrders must be used inside an OrdersProvider')
  return value
}
