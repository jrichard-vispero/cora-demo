import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import './TextField.css'

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  icon?: ReactNode
}

export function TextField({ label, icon, className, ...rest }: TextFieldProps) {
  const id = useId()
  return (
    <div className={['text-field', icon && 'text-field--with-icon', className].filter(Boolean).join(' ')}>
      <label className="text-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="text-field__control">
        {icon}
        <input id={id} className="text-field__input" {...rest} />
      </div>
    </div>
  )
}
