import { StatusBadge } from '@wrenmoor/ui'
import type { StatusTone } from '@wrenmoor/ui'
import { STATUS_LABELS } from '../data/types'
import type { OrderStatus } from '../data/types'

const STATUS_TONES: Record<OrderStatus, StatusTone> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'success',
  delivered: 'neutral',
  cancelled: 'danger',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <StatusBadge tone={STATUS_TONES[status]}>{STATUS_LABELS[status]}</StatusBadge>
}
