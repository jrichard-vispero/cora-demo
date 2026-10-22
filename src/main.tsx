import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { routes } from './router'
import { OrdersProvider } from './state/OrdersProvider'
import '@wrenmoor/ui/styles.css'
import './styles/global.css'

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrdersProvider>
      <RouterProvider router={router} />
    </OrdersProvider>
  </StrictMode>,
)
