import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../router'
import { OrdersProvider } from '../state/OrdersProvider'

/** Renders the app at a path, with the sample data, the way the browser would. */
export function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const user = userEvent.setup()
  const result = render(
    <OrdersProvider>
      <RouterProvider router={router} />
    </OrdersProvider>,
  )
  return { ...result, router, user }
}
