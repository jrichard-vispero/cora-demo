import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import './Checkbox.css'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  label: string
  description?: string
}

export function Checkbox({ label, description, className, ...rest }: CheckboxProps) {
  const id = useId()
  const descriptionId = description ? `${id}-description` : undefined
  return (
    <div className={['checkbox', className].filter(Boolean).join(' ')}>
      <input id={id} type="checkbox" className="checkbox__input" aria-describedby={descriptionId} {...rest} />
      <div>
        <label className="checkbox__label" htmlFor={id}>
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="checkbox__description">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
