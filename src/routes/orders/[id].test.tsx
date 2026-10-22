import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '../../test/render-route'

describe('Order detail page', () => {
  it('shows the order, its items and its totals', async () => {
    renderRoute('/orders/WM-10482')

    expect(await screen.findByRole('heading', { level: 1, name: 'Order WM-10482' })).toBeInTheDocument()
    expect(screen.getByText('Processing')).toBeInTheDocument()

    const items = within(screen.getByRole('table'))
    expect(items.getByRole('row', { name: /CUP-12 .* 6 \$64\.50 \$387\.00/ })).toBeInTheDocument()
    expect(items.getByRole('row', { name: 'Subtotal $861.20' })).toBeInTheDocument()
    expect(items.getByRole('row', { name: 'Shipping Free' })).toBeInTheDocument()
    expect(items.getByRole('row', { name: 'Total $861.20' })).toBeInTheDocument()
  })

  it('keeps the order when the user backs out of cancelling it', async () => {
    const { user } = renderRoute('/orders/WM-10482')

    await user.click(await screen.findByRole('button', { name: 'Cancel order' }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Cancel order WM-10482?')

    await user.click(within(dialog).getByRole('button', { name: 'Keep order' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Processing')).toBeInTheDocument()
  })

  it('cancels the order once the user confirms', async () => {
    const { user } = renderRoute('/orders/WM-10482')

    await user.click(await screen.findByRole('button', { name: 'Cancel order' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel order' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Cancelled')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Order WM-10482 was cancelled.')
    expect(screen.queryByRole('button', { name: 'Cancel order' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Order WM-10482' })).toHaveFocus()
  })

  it('offers no cancellation once an order has shipped', async () => {
    renderRoute('/orders/WM-10477')

    expect(await screen.findByRole('heading', { level: 1, name: 'Order WM-10477' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel order' })).not.toBeInTheDocument()
  })

  it('says so when the order does not exist', async () => {
    renderRoute('/orders/WM-99999')

    expect(await screen.findByRole('heading', { level: 1, name: 'Order not found' })).toBeInTheDocument()
  })
})
