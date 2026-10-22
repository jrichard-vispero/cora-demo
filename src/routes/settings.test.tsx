import { screen, within } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderRoute } from '../test/render-route'

async function goTo(user: UserEvent, section: string) {
  await user.click(within(screen.getByRole('navigation', { name: 'Primary' })).getByRole('link', { name: section }))
  await screen.findByRole('heading', { level: 1, name: section })
}

async function changePreferences(user: UserEvent) {
  await user.click(await screen.findByRole('checkbox', { name: 'An order is placed' }))
  await user.click(screen.getByRole('checkbox', { name: 'An order ships' }))
  await user.click(screen.getByText('Reno, NV'))
  await user.click(screen.getByText('Columbus, OH'))
}

describe('Settings page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('keeps saved preferences when the user comes back', async () => {
    const { user } = renderRoute('/settings')

    await changePreferences(user)
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(screen.getByRole('status')).toHaveTextContent('Settings saved.')

    await goTo(user, 'Orders')
    await goTo(user, 'Settings')

    expect(screen.getByRole('checkbox', { name: 'An order is placed' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'An order ships' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Daily summary' })).toBeChecked()
    expect(screen.getByText('Columbus, OH')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('drops changes that were not saved', async () => {
    const { user } = renderRoute('/settings')

    await changePreferences(user)
    await goTo(user, 'Orders')
    await goTo(user, 'Settings')

    expect(screen.getByRole('checkbox', { name: 'An order is placed' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'An order ships' })).not.toBeChecked()
    expect(screen.getByText('Reno, NV')).toBeInTheDocument()
  })
})
