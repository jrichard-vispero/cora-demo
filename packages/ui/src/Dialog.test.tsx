import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Dialog } from './Dialog'

function DialogHarness({ onClose = () => {} }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false)
  const close = () => {
    onClose()
    setOpen(false)
  }
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Dialog open={open} title="Archive order?" onClose={close} footer={<button type="button">Archive</button>}>
        <p>Archived orders leave the list.</p>
      </Dialog>
    </>
  )
}

function RemovingHarness({ withFallback = false }: { withFallback?: boolean }) {
  const [open, setOpen] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  return (
    <main tabIndex={-1}>
      <h1 ref={headingRef} tabIndex={-1}>
        Draft order
      </h1>
      {!deleted && (
        <button type="button" onClick={() => setOpen(true)}>
          Delete
        </button>
      )}
      <Dialog
        open={open}
        title="Delete draft?"
        onClose={() => setOpen(false)}
        fallbackFocusRef={withFallback ? headingRef : undefined}
        footer={
          <button
            type="button"
            onClick={() => {
              setDeleted(true)
              setOpen(false)
            }}
          >
            Delete for good
          </button>
        }
      >
        <p>The draft is gone for good.</p>
      </Dialog>
    </main>
  )
}

describe('Dialog', () => {
  it('renders nothing while closed', () => {
    render(<DialogHarness />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows its title, content and footer, and takes focus when opened', async () => {
    const user = userEvent.setup()
    render(<DialogHarness />)

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Archive order?')
    expect(dialog).toHaveTextContent('Archived orders leave the list.')
    expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument()
    expect(dialog).toHaveFocus()
  })

  it('closes on Escape and returns focus to the control that opened it', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<DialogHarness onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus()
  })

  it('keeps keyboard focus inside while open', async () => {
    const user = userEvent.setup()
    render(<DialogHarness />)

    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Archive' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Archive' })).toHaveFocus()
  })

  it('focuses the fallback when the control that opened it is gone', async () => {
    const user = userEvent.setup()
    render(<RemovingHarness withFallback />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Delete for good' }))

    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Draft order' })).toHaveFocus()
  })

  it('focuses the main landmark by default when the control that opened it is gone', async () => {
    const user = userEvent.setup()
    render(<RemovingHarness />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Delete for good' }))

    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('closes from its close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<DialogHarness onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledOnce()
  })
})
