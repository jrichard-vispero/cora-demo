import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button, Card, CopyIcon, Dialog, IconButton, PrinterIcon } from '@wrenmoor/ui'
import { OrderStatusBadge } from '../../components/OrderStatusBadge'
import { getCustomer } from '../../data/customers'
import { CHANNEL_LABELS, WAREHOUSE_LABELS } from '../../data/types'
import { formatCurrency, formatDate, formatTime } from '../../lib/format'
import { isOpen, orderTotals } from '../../lib/orders'
import { useOrders } from '../../state/orders-context'
import './order-detail.css'

export default function OrderDetailPage() {
  const { id } = useParams()
  const { orders, cancelOrder } = useOrders()
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [message, setMessage] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const order = orders.find((candidate) => candidate.number === id)

  if (!order) {
    return (
      <>
        <title>Order not found · Wrenmoor Orders</title>
        <h1 className="order-header__title">Order not found</h1>
        <p className="order-missing">
          There is no order {id}. <Link to="/orders">Back to orders</Link>
        </p>
      </>
    )
  }

  const customer = getCustomer(order.customerId)
  const totals = orderTotals(order)

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.number)
      setMessage(`Copied ${order.number} to the clipboard.`)
    } catch {
      setMessage(`Couldn’t copy ${order.number}. Select it in the heading and copy it instead.`)
    }
  }

  const confirmCancel = () => {
    cancelOrder(order.number)
    setConfirmingCancel(false)
    setMessage(`Order ${order.number} was cancelled.`)
  }

  return (
    <>
      <title>{`${order.number} · Wrenmoor Orders`}</title>
      <nav aria-label="Breadcrumb" className="breadcrumb no-print">
        <ol>
          <li>
            <Link to="/orders">Orders</Link>
          </li>
          <li>
            <span aria-current="page">{order.number}</span>
          </li>
        </ol>
      </nav>

      <div className="order-header">
        <div>
          <div className="order-header__heading">
            <h1 className="order-header__title" tabIndex={-1} ref={headingRef}>
              Order {order.number}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="order-header__meta">
            Placed {formatDate(order.placedAt)} at {formatTime(order.placedAt)} via {CHANNEL_LABELS[order.channel]}
          </p>
        </div>
        <div className="order-header__actions no-print">
          <button type="button" className="icon-button icon-button--md" onClick={copyOrderNumber}>
            <CopyIcon size={18} />
          </button>
          <IconButton icon={<PrinterIcon size={18} />} onClick={() => window.print()} />
          {isOpen(order) && (
            <Button variant="danger" onClick={() => setConfirmingCancel(true)}>
              Cancel order
            </Button>
          )}
        </div>
      </div>

      <p className="status-message" role="status">
        {message}
      </p>

      <div className="order-layout">
        <Card title="Items" flush>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">SKU</th>
                  <th scope="col">Item</th>
                  <th scope="col" className="numeric">
                    Qty
                  </th>
                  <th scope="col" className="numeric">
                    Unit price
                  </th>
                  <th scope="col" className="numeric">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.sku}>
                    <td className="mono">{line.sku}</td>
                    <td>{line.name}</td>
                    <td className="numeric">{line.quantity}</td>
                    <td className="numeric">{formatCurrency(line.unitPrice)}</td>
                    <td className="numeric">{formatCurrency(line.quantity * line.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={4}>
                    Subtotal
                  </th>
                  <td className="numeric">{formatCurrency(totals.subtotal)}</td>
                </tr>
                <tr>
                  <th scope="row" colSpan={4}>
                    Shipping
                  </th>
                  <td className="numeric">{totals.shipping ? formatCurrency(totals.shipping) : 'Free'}</td>
                </tr>
                <tr className="order-total">
                  <th scope="row" colSpan={4}>
                    Total
                  </th>
                  <td className="numeric">{formatCurrency(totals.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        <div className="order-aside">
          <Card title="Customer">
            <p className="order-customer__name">{customer.name}</p>
            <p>{customer.contact}</p>
            <p>
              <a href={`mailto:${customer.email}`}>{customer.email}</a>
            </p>
            <p>{customer.phone}</p>
          </Card>

          <Card title="Shipping">
            <address className="order-address">
              {customer.name}
              <br />
              {customer.address.line1}
              <br />
              {customer.address.line2 && (
                <>
                  {customer.address.line2}
                  <br />
                </>
              )}
              {customer.address.city}, {customer.address.region} {customer.address.postalCode}
            </address>
          </Card>

          <Card title="Details">
            <dl className="order-details">
              <div>
                <dt>PO number</dt>
                <dd>{order.poNumber ?? 'None'}</dd>
              </div>
              <div>
                <dt>Channel</dt>
                <dd>{CHANNEL_LABELS[order.channel]}</dd>
              </div>
              <div>
                <dt>Ships from</dt>
                <dd>{WAREHOUSE_LABELS[order.warehouse]}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>

      <Dialog
        open={confirmingCancel}
        title={`Cancel order ${order.number}?`}
        onClose={() => setConfirmingCancel(false)}
        fallbackFocusRef={headingRef}
        footer={
          <>
            <Button onClick={() => setConfirmingCancel(false)}>Keep order</Button>
            <Button variant="danger" onClick={confirmCancel}>
              Cancel order
            </Button>
          </>
        }
      >
        <p>
          {`${customer.name} is emailed that the order was cancelled, and its reserved stock returns to ${WAREHOUSE_LABELS[order.warehouse]}.`}
        </p>
        <p>This can’t be undone.</p>
      </Dialog>
    </>
  )
}
