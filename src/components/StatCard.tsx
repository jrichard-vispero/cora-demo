import type { ReactNode } from 'react'
import './StatCard.css'

export interface StatCardProps {
  label: string
  value: string
  caption?: string
  icon?: ReactNode
  tone?: 'default' | 'warning'
}

export function StatCard({ label, value, caption, icon, tone = 'default' }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        <p className="stat-card__label">{label}</p>
        {icon && <span className="stat-card__icon">{icon}</span>}
      </div>
      <p className="stat-card__value">{value}</p>
      {caption && <p className="stat-card__caption">{caption}</p>}
    </div>
  )
}
