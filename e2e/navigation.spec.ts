import { expect, test } from '@playwright/test'

test('moves between sections from the sidebar', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible()
  await expect(page).toHaveTitle('Dashboard · Wrenmoor Orders')

  const nav = page.getByRole('navigation', { name: 'Primary' })
  for (const section of ['Orders', 'Customers', 'Settings']) {
    await nav.getByRole('link', { name: section }).click()
    await expect(page.getByRole('heading', { level: 1, name: section })).toBeVisible()
    await expect(page).toHaveTitle(`${section} · Wrenmoor Orders`)
    await expect(nav.getByRole('link', { name: section })).toHaveAttribute('aria-current', 'page')
  }
})

test('opens an order that needs attention from the dashboard', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'WM-10474' }).first().click()

  await expect(page).toHaveURL('/orders/WM-10474')
  await expect(page.getByRole('heading', { level: 1, name: 'Order WM-10474' })).toBeVisible()
})
