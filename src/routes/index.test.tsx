import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '../test/render-route'

describe('Dashboard', () => {
  it('summarizes the open orders', async () => {
    renderRoute('/')

    const figures = within(await screen.findByRole('region', { name: 'Key figures' }))
    expect(figures.getByText('Open orders').closest('.stat-card')).toHaveTextContent('8')
    expect(figures.getByText('Needs attention').closest('.stat-card')).toHaveTextContent('2')
  })

  it('links the orders that need attention', async () => {
    renderRoute('/')

    const card = (await screen.findByRole('heading', { name: 'Needs attention' })).closest('section')
    expect(card).not.toBeNull()
    const links = within(card!).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['WM-10474', 'WM-10472'])
    expect(links[0]).toHaveAttribute('href', '/orders/WM-10474')
  })
})
