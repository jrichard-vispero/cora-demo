import type { ReactNode } from 'react'
import './StatusBadge.css'

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export interface StatusBadgeProps {
  tone: StatusTone
  children: ReactNode
}

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${tone}`}>{children}</span>
}
