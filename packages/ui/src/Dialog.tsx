import { useEffect, useEffectEvent, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from './IconButton'
import { CloseIcon } from './icons'
import './Dialog.css'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function keepFocusWithin(panel: HTMLElement, event: KeyboardEvent) {
  const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)]
  const first = focusable[0]
  const last = focusable.at(-1)
  if (!first || !last) {
    event.preventDefault()
    return
  }
  const active = document.activeElement
  if (event.shiftKey && (active === first || active === panel)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

export interface DialogProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  /** Actions shown at the bottom of the dialog, such as Cancel and Confirm buttons. */
  footer?: ReactNode
  /**
   * Receives focus when the dialog closes and the control that opened it is no longer on the page,
   * such as a button the confirmed action removed. Defaults to the page's `main` element.
   */
  fallbackFocusRef?: RefObject<HTMLElement | null>
}

export function Dialog({ open, title, onClose, children, footer, fallbackFocusRef }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const close = useEffectEvent(onClose)
  const fallbackFocus = useEffectEvent(
    () => fallbackFocusRef?.current ?? document.querySelector<HTMLElement>('main, [role="main"]'),
  )

  useEffect(() => {
    if (!open) return
    const returnFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : null
    panelRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      else if (event.key === 'Tab' && panelRef.current) keepFocusWithin(panelRef.current, event)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      const target = returnFocusTo?.isConnected ? returnFocusTo : fallbackFocus()
      target?.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="dialog" role="dialog" aria-modal="true" tabIndex={-1} ref={panelRef}>
        <div className="dialog__header">
          <h2 className="dialog__title">{title}</h2>
          <IconButton icon={<CloseIcon size={18} />} label="Close" size="sm" onClick={onClose} />
        </div>
        <div className="dialog__body">{children}</div>
        {footer && <div className="dialog__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
