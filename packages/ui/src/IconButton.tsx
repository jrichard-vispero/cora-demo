import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './IconButton.css'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: ReactNode
  /** Shown as a tooltip. */
  label?: string
  size?: 'sm' | 'md'
}

export function IconButton({ icon, label, size = 'md', className, type = 'button', ...rest }: IconButtonProps) {
  const classes = ['icon-button', `icon-button--${size}`, className].filter(Boolean).join(' ')
  return (
    <button type={type} className={classes} aria-label={label} title={label} {...rest}>
      {icon}
    </button>
  )
}
