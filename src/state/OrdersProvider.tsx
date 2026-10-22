import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { seedOrders } from '../data/orders'
import { OrdersContext } from './orders-context'

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState(seedOrders)

  const cancelOrder = useCallback((orderNumber: string) => {
    setOrders((current) =>
      current.map((order) => (order.number === orderNumber ? { ...order, status: 'cancelled' } : order)),
    )
  }, [])

  const value = useMemo(() => ({ orders, cancelOrder }), [orders, cancelOrder])

  return <OrdersContext value={value}>{children}</OrdersContext>
}
