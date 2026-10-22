import { Card } from '@wrenmoor/ui'
import { PageHeader } from '../components/PageHeader'
import { customers } from '../data/customers'
import { formatCurrency, formatDate, formatNumber } from '../lib/format'
import { byNewest, orderTotals } from '../lib/orders'
import { useOrders } from '../state/orders-context'

export default function CustomersPage() {
  const { orders } = useOrders()

  const rows = customers
    .map((customer) => {
      const placed = orders.filter((order) => order.customerId === customer.id).sort(byNewest)
      const billed = placed.filter((order) => order.status !== 'cancelled')
      return {
        customer,
        orderCount: placed.length,
        lifetimeValue: billed.reduce((sum, order) => sum + orderTotals(order).total, 0),
        lastOrder: placed[0],
      }
    })
    .sort((a, b) => b.lifetimeValue - a.lifetimeValue)

  return (
    <>
      <title>Customers · Wrenmoor Orders</title>
      <PageHeader title="Customers" description="Wholesale accounts, ranked by what they have ordered." />
      <Card flush>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Customer</th>
                <th scope="col">Contact</th>
                <th scope="col">Location</th>
                <th scope="col" className="numeric">
                  Orders
                </th>
                <th scope="col" className="numeric">
                  Lifetime value
                </th>
                <th scope="col">Last order</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ customer, orderCount, lifetimeValue, lastOrder }) => (
                <tr key={customer.id}>
                  <td className="cell-primary">{customer.name}</td>
                  <td>
                    <a href={`mailto:${customer.email}`}>{customer.contact}</a>
                  </td>
                  <td>
                    {customer.address.city}, {customer.address.region}
                  </td>
                  <td className="numeric">{formatNumber(orderCount)}</td>
                  <td className="numeric">{formatCurrency(lifetimeValue)}</td>
                  <td className="nowrap">{lastOrder ? formatDate(lastOrder.placedAt) : 'None yet'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
