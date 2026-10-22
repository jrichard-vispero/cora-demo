import { screen, within } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '../../test/render-route'

async function chooseOption(user: UserEvent, current: string, option: string) {
  const trigger = await screen.findByText(current)
  const select = trigger.closest<HTMLElement>('.select')!
  await user.click(trigger)
  await user.click(within(select).getByText(option))
}

function orderNumbersInTable() {
  const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1)
  return rows.map((row) => within(row).getByRole('link').textContent)
}

describe('Orders page', () => {
  it('lists every order, newest first', async () => {
    renderRoute('/orders')

    expect(await screen.findByRole('heading', { level: 1, name: 'Orders' })).toBeInTheDocument()
    expect(screen.getByText('Showing 30 of 30 orders')).toBeInTheDocument()
    expect(orderNumbersInTable().slice(0, 3)).toEqual(['WM-10482', 'WM-10481', 'WM-10480'])
  })

  it('searches by customer name', async () => {
    const { user } = renderRoute('/orders')

    await user.type(await screen.findByRole('searchbox', { name: 'Search' }), 'saltmarsh')

    expect(screen.getByText('Showing 3 of 30 orders')).toBeInTheDocument()
    expect(orderNumbersInTable()).toEqual(['WM-10480', 'WM-10470', 'WM-10460'])
  })

  it('filters by status', async () => {
    const { user } = renderRoute('/orders')

    await chooseOption(user, 'All statuses', 'Cancelled')

    expect(screen.getByText('Showing 2 of 30 orders')).toBeInTheDocument()
    expect(orderNumbersInTable()).toEqual(['WM-10469', 'WM-10460'])
  })

  it('offers to clear filters that match nothing', async () => {
    const { user } = renderRoute('/orders')

    await user.type(await screen.findByRole('searchbox', { name: 'Search' }), 'no such order')
    expect(screen.getByText('No orders match these filters.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('Showing 30 of 30 orders')).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('')
  })
})
