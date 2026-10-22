import { useEffect, useId, useRef, useState } from 'react'
import { CheckIcon, ChevronDownIcon } from './icons'
import './Select.css'

export interface SelectOption<T extends string> {
  value: T
  label: string
}

export interface SelectProps<T extends string> {
  label: string
  value: T
  options: readonly SelectOption<T>[]
  onChange: (value: T) => void
  className?: string
}

export function Select<T extends string>({ label, value, options, onChange, className }: SelectProps<T>) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [open])

  const choose = (option: SelectOption<T>) => {
    onChange(option.value)
    setOpen(false)
  }

  return (
    <div className={['select', className].filter(Boolean).join(' ')} ref={rootRef}>
      <label className="select__label" htmlFor={id}>
        {label}
      </label>
      <div
        id={id}
        className={open ? 'select__trigger select__trigger--open' : 'select__trigger'}
        role="combobox"
        onClick={() => setOpen(!open)}
      >
        <span className="select__value">{selected?.label}</span>
        <ChevronDownIcon size={16} />
      </div>
      {open && (
        <div className="select__menu">
          {options.map((option) => (
            <div
              key={option.value}
              className={option.value === value ? 'select__option select__option--selected' : 'select__option'}
              onClick={() => choose(option)}
            >
              {option.label}
              {option.value === value && <CheckIcon size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
