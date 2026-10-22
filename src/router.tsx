import type { RouteObject } from 'react-router'
import { AppShell } from './components/AppShell'
import CustomersPage from './routes/customers'
import DashboardPage from './routes/index'
import NotFoundPage from './routes/not-found'
import OrderDetailPage from './routes/orders/[id]'
import OrdersPage from './routes/orders/index'
import SettingsPage from './routes/settings'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
