import type { ReactNode } from 'react'
import './Card.css'

export interface CardProps {
  title?: string
  actions?: ReactNode
  children: ReactNode
  /** Lets a table or list run to the card's edges. */
  flush?: boolean
}

export function Card({ title, actions, children, flush = false }: CardProps) {
  const classes = flush ? 'card card--flush' : 'card'
  return (
    <section className={classes}>
      {(title || actions) && (
        <div className="card__header">
          {title && <h2 className="card__title">{title}</h2>}
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      <div className="card__body">{children}</div>
    </section>
  )
}
