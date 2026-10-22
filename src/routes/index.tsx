import { Link } from 'react-router'
import { AlertIcon, Card, OrdersIcon } from '@wrenmoor/ui'
import { OrderStatusBadge } from '../components/OrderStatusBadge'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { getCustomer } from '../data/customers'
import { DATA_AS_OF } from '../data/orders'
import { ORDER_STATUSES, STATUS_LABELS } from '../data/types'
import { formatCurrency, formatDate, formatNumber } from '../lib/format'
import { ATTENTION_AFTER_DAYS, REVENUE_WINDOW_DAYS, byNewest, orderTotals, summarizeOrders } from '../lib/orders'
import { useOrders } from '../state/orders-context'
import './dashboard.css'

const RECENT_ORDER_COUNT = 6

export default function DashboardPage() {
  const { orders } = useOrders()
  const summary = summarizeOrders(orders, DATA_AS_OF)
  const recent = [...orders].sort(byNewest).slice(0, RECENT_ORDER_COUNT)
  const largestStatusCount = Math.max(...Object.values(summary.countsByStatus))

  return (
    <>
      <title>Dashboard · Wrenmoor Orders</title>
      <PageHeader title="Dashboard" description={`Order activity across all warehouses, as of ${formatDate(DATA_AS_OF)}.`} />

      <section className="dashboard__stats" aria-label="Key figures">
        <StatCard
          label="Open orders"
          value={formatNumber(summary.openOrders)}
          caption="Pending or processing"
          icon={<OrdersIcon size={18} />}
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(summary.revenue)}
          caption={`Last ${REVENUE_WINDOW_DAYS} days, cancelled orders excluded`}
        />
        <StatCard
          label="Average order value"
          value={formatCurrency(summary.averageOrderValue)}
          caption={`Last ${REVENUE_WINDOW_DAYS} days`}
        />
        <StatCard
          label="Needs attention"
          value={formatNumber(summary.needsAttention.length)}
          caption={`Open for more than ${ATTENTION_AFTER_DAYS} days`}
          icon={<AlertIcon size={18} />}
          tone="warning"
        />
      </section>

      <div className="dashboard__grid">
        <Card title="Recent orders" actions={<Link to="/orders">View all orders</Link>} flush>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Placed</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="numeric">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order.number}>
                    <td>
                      <Link to={`/orders/${order.number}`} className="mono">
                        {order.number}
                      </Link>
                    </td>
                    <td>{getCustomer(order.customerId).name}</td>
                    <td className="nowrap">{formatDate(order.placedAt)}</td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="numeric">{formatCurrency(orderTotals(order).total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="dashboard__side">
          <Card title="Orders by status">
            <ul className="status-breakdown">
              {ORDER_STATUSES.map((status) => (
                <li key={status}>
                  <span className="status-breakdown__label">{STATUS_LABELS[status]}</span>
                  <span className="status-breakdown__count">{summary.countsByStatus[status]}</span>
                  <span className="status-breakdown__track" aria-hidden="true">
                    <span
                      className={`status-breakdown__bar status-breakdown__bar--${status}`}
                      style={{ width: `${(summary.countsByStatus[status] / largestStatusCount) * 100}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Needs attention">
            {summary.needsAttention.length === 0 ? (
              <p>Every open order is on track.</p>
            ) : (
              <ul className="attention-list">
                {summary.needsAttention.map((order) => (
                  <li key={order.number}>
                    <Link to={`/orders/${order.number}`} className="mono">
                      {order.number}
                    </Link>
                    <span>{getCustomer(order.customerId).name}</span>
                    <OrderStatusBadge status={order.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
