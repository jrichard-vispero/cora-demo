import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './Select'

const OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
] as const

describe('Select', () => {
  it('shows its label and the selected option', () => {
    render(<Select label="Status" value="all" options={OPTIONS} onChange={() => {}} />)
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('All statuses')).toBeInTheDocument()
    expect(screen.queryByText('Shipped')).not.toBeInTheDocument()
  })

  it('opens its options and reports the one chosen', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select label="Status" value="all" options={OPTIONS} onChange={onChange} />)

    await user.click(screen.getByText('All statuses'))
    await user.click(screen.getByText('Shipped'))

    expect(onChange).toHaveBeenCalledWith('shipped')
    expect(screen.queryByText('Delivered')).not.toBeInTheDocument()
  })

  it('closes when the user clicks elsewhere', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Select label="Status" value="all" options={OPTIONS} onChange={() => {}} />
        <p>Elsewhere</p>
      </>,
    )

    await user.click(screen.getByText('All statuses'))
    expect(screen.getByText('Delivered')).toBeInTheDocument()

    await user.click(screen.getByText('Elsewhere'))
    expect(screen.queryByText('Delivered')).not.toBeInTheDocument()
  })
})
