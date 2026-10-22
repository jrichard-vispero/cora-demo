import { expect, test } from '@playwright/test'

test('finds an order by search and status, then opens it', async ({ page }) => {
  await page.goto('/orders')
  await expect(page.getByText('Showing 30 of 30 orders')).toBeVisible()

  await page.getByRole('searchbox', { name: 'Search' }).fill('brightwater')
  await expect(page.getByText('Showing 3 of 30 orders')).toBeVisible()

  await page.getByText('All statuses').click()
  await page.locator('.select__menu').getByText('Pending').click()
  await expect(page.getByText('Showing 2 of 30 orders')).toBeVisible()

  await page.getByRole('link', { name: 'WM-10472' }).click()
  await expect(page).toHaveURL('/orders/WM-10472')
  await expect(page.getByRole('heading', { level: 1, name: 'Order WM-10472' })).toBeVisible()
})

test('cancels an open order after confirming', async ({ page }) => {
  await page.goto('/orders/WM-10482')

  await page.getByRole('button', { name: 'Cancel order' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('Cancel order WM-10482?')

  await dialog.getByRole('button', { name: 'Cancel order' }).click()

  await expect(dialog).toBeHidden()
  await expect(page.getByRole('status')).toHaveText('Order WM-10482 was cancelled.')
  await expect(page.getByRole('button', { name: 'Cancel order' })).toBeHidden()
  await expect(page.getByRole('heading', { level: 1, name: 'Order WM-10482' })).toBeFocused()

  await page.getByRole('link', { name: 'Orders', exact: true }).first().click()
  const row = page.getByRole('row').filter({ has: page.getByRole('link', { name: 'WM-10482' }) })
  await expect(row).toContainText('Cancelled')
})

test('reaches the dialog actions on a short screen', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 160 })
  await page.goto('/orders/WM-10482')

  await page.getByRole('button', { name: 'Cancel order' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Keep order' }).click()

  await expect(dialog).toBeHidden()
  await expect(page.getByRole('button', { name: 'Cancel order' })).toBeFocused()
})

test('exports the filtered orders as CSV', async ({ page }) => {
  await page.goto('/orders')
  await page.getByRole('searchbox', { name: 'Search' }).fill('saltmarsh')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export CSV' }).click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toBe('wrenmoor-orders.csv')
  const stream = await download.createReadStream()
  let csv = ''
  for await (const chunk of stream) csv += chunk
  expect(csv.split('\r\n')).toEqual([
    'Order,Placed,Customer,PO number,Channel,Warehouse,Status,Total',
    'WM-10480,2026-10-21,Saltmarsh Kitchen,,Sales rep,"Savannah, GA",Pending,454.50',
    'WM-10470,2026-10-14,Saltmarsh Kitchen,,Sales rep,"Savannah, GA",Delivered,508.80',
    'WM-10460,2026-09-28,Saltmarsh Kitchen,,Sales rep,"Savannah, GA",Cancelled,377.70',
  ])
})
