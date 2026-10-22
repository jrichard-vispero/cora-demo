import { useState } from 'react'
import { Link } from 'react-router'
import { Button, Card, DownloadIcon, IconButton, SearchIcon, Select, TextField } from '@wrenmoor/ui'
import type { SelectOption } from '@wrenmoor/ui'
import { OrderStatusBadge } from '../../components/OrderStatusBadge'
import { PageHeader } from '../../components/PageHeader'
import { getCustomer } from '../../data/customers'
import { CHANNEL_LABELS, ORDER_STATUSES, STATUS_LABELS, WAREHOUSES, WAREHOUSE_LABELS } from '../../data/types'
import type { Order, OrderStatus, Warehouse } from '../../data/types'
import { downloadFile } from '../../lib/download'
import { formatCurrency, formatDate } from '../../lib/format'
import { invoiceText } from '../../lib/invoice'
import { NO_FILTERS, byNewest, filterOrders, orderTotals, ordersToCsv } from '../../lib/orders'
import type { OrderFilters } from '../../lib/orders'
import { useOrders } from '../../state/orders-context'
import './orders.css'

const STATUS_OPTIONS: SelectOption<OrderStatus | 'all'>[] = [
  { value: 'all', label: 'All statuses' },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
]

const WAREHOUSE_OPTIONS: SelectOption<Warehouse | 'all'>[] = [
  { value: 'all', label: 'All warehouses' },
  ...WAREHOUSES.map((warehouse) => ({ value: warehouse, label: WAREHOUSE_LABELS[warehouse] })),
]

const customerName = (customerId: string) => getCustomer(customerId).name

function downloadInvoice(order: Order) {
  downloadFile(`${order.number}-invoice.txt`, invoiceText(order, getCustomer(order.customerId)), 'text/plain')
}

export default function OrdersPage() {
  const { orders } = useOrders()
  const [filters, setFilters] = useState<OrderFilters>(NO_FILTERS)
  const visible = filterOrders(orders, filters, customerName).sort(byNewest)
  const filtered = filters.status !== 'all' || filters.warehouse !== 'all' || filters.query.trim() !== ''

  const update = (patch: Partial<OrderFilters>) => setFilters((current) => ({ ...current, ...patch }))

  return (
    <>
      <title>Orders · Wrenmoor Orders</title>
      <PageHeader
        title="Orders"
        description="Every wholesale order across warehouses and sales channels."
        actions={
          <Button
            icon={<DownloadIcon size={18} />}
            onClick={() => downloadFile('wrenmoor-orders.csv', ordersToCsv(visible, getCustomer), 'text/csv')}
          >
            Export CSV
          </Button>
        }
      />

      <div className="orders-toolbar">
        <TextField
          label="Search"
          type="search"
          placeholder="Order number, PO or customer"
          icon={<SearchIcon size={16} />}
          value={filters.query}
          onChange={(event) => update({ query: event.target.value })}
          className="orders-toolbar__search"
        />
        <Select label="Status" value={filters.status} options={STATUS_OPTIONS} onChange={(status) => update({ status })} />
        <Select
          label="Warehouse"
          value={filters.warehouse}
          options={WAREHOUSE_OPTIONS}
          onChange={(warehouse) => update({ warehouse })}
        />
      </div>

      <p className="orders-count" role="status">
        Showing {visible.length} of {orders.length} orders
      </p>

      <Card flush>
        {visible.length === 0 ? (
          <div className="orders-empty">
            <p>No orders match these filters.</p>
            {filtered && <Button onClick={() => setFilters(NO_FILTERS)}>Clear filters</Button>}
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Placed</th>
                  <th scope="col">Channel</th>
                  <th scope="col">Warehouse</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="numeric">
                    Total
                  </th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => {
                  const customer = getCustomer(order.customerId)
                  return (
                    <tr key={order.number}>
                      <td>
                        <Link to={`/orders/${order.number}`} className="mono">
                          {order.number}
                        </Link>
                      </td>
                      <td>
                        <div className="cell-primary">{customer.name}</div>
                        <div className="cell-secondary">{customer.email}</div>
                      </td>
                      <td className="nowrap">{formatDate(order.placedAt)}</td>
                      <td>{CHANNEL_LABELS[order.channel]}</td>
                      <td>{WAREHOUSE_LABELS[order.warehouse]}</td>
                      <td>
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="numeric">{formatCurrency(orderTotals(order).total)}</td>
                      <td className="orders-table__actions">
                        <IconButton icon={<DownloadIcon size={18} />} size="sm" onClick={() => downloadInvoice(order)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
