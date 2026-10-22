import { getProduct } from './products'
import type { Channel, Order, OrderStatus, Warehouse } from './types'

/** The day the sample data runs up to. The dashboard's windows count back from it. */
export const DATA_AS_OF = '2026-10-22'

type LineSpec = [sku: string, quantity: number]

interface OrderSpec {
  number: string
  customerId: string
  placedAt: string
  status: OrderStatus
  channel: Channel
  warehouse: Warehouse
  lines: LineSpec[]
  poNumber?: string
}

function order({ lines, ...spec }: OrderSpec): Order {
  return {
    ...spec,
    lines: lines.map(([sku, quantity]) => {
      const product = getProduct(sku)
      return { sku, name: product.name, quantity, unitPrice: product.unitPrice }
    }),
  }
}

export const seedOrders: Order[] = [
  order({ number: 'WM-10482', customerId: 'cus_juniper', placedAt: '2026-10-22T09:41:00', status: 'processing', channel: 'portal', warehouse: 'reno', poNumber: 'JSC-2291', lines: [['CUP-12', 6], ['LID-12', 6], ['SLV-01', 2], ['OAT-12', 4]] }),
  order({ number: 'WM-10481', customerId: 'cus_brightwater', placedAt: '2026-10-22T08:15:00', status: 'pending', channel: 'edi', warehouse: 'columbus', poNumber: '448812', lines: [['NAP-01', 10], ['GLV-M', 6], ['SAN-05', 8]] }),
  order({ number: 'WM-10480', customerId: 'cus_saltmarsh', placedAt: '2026-10-21T16:52:00', status: 'pending', channel: 'sales-rep', warehouse: 'savannah', lines: [['TWL-01', 4], ['SAN-05', 3], ['GLV-M', 2]] }),
  order({ number: 'WM-10479', customerId: 'cus_littlefern', placedAt: '2026-10-21T11:03:00', status: 'processing', channel: 'portal', warehouse: 'columbus', lines: [['PRC-01', 5], ['BOX-08', 8]] }),
  order({ number: 'WM-10478', customerId: 'cus_pinecrest', placedAt: '2026-10-21T07:30:00', status: 'processing', channel: 'edi', warehouse: 'reno', poNumber: 'PHG-77310', lines: [['NAP-01', 12], ['CUP-16', 10], ['LID-12', 10], ['TWL-01', 6]] }),
  order({ number: 'WM-10477', customerId: 'cus_ninefold', placedAt: '2026-10-20T14:26:00', status: 'shipped', channel: 'portal', warehouse: 'reno', lines: [['CUP-16', 4], ['LID-12', 4], ['CBF-01', 6]] }),
  order({ number: 'WM-10476', customerId: 'cus_meadowlark', placedAt: '2026-10-20T10:12:00', status: 'processing', channel: 'edi', warehouse: 'columbus', poNumber: 'MGC-1187', lines: [['BOX-08', 6], ['PRC-01', 4], ['GLV-M', 3]] }),
  order({ number: 'WM-10475', customerId: 'cus_copperstove', placedAt: '2026-10-19T15:44:00', status: 'shipped', channel: 'sales-rep', warehouse: 'reno', lines: [['NAP-01', 4], ['TWL-01', 2], ['SAN-05', 2]] }),
  order({ number: 'WM-10474', customerId: 'cus_quillkettle', placedAt: '2026-10-18T09:05:00', status: 'processing', channel: 'portal', warehouse: 'savannah', lines: [['CUP-12', 3], ['LID-12', 3], ['CBF-01', 4]] }),
  order({ number: 'WM-10473', customerId: 'cus_harborlane', placedAt: '2026-10-17T13:37:00', status: 'shipped', channel: 'portal', warehouse: 'columbus', lines: [['GLV-M', 4], ['NAP-01', 3], ['PRC-01', 2]] }),
  order({ number: 'WM-10472', customerId: 'cus_brightwater', placedAt: '2026-10-16T08:48:00', status: 'pending', channel: 'edi', warehouse: 'columbus', poNumber: '448790', lines: [['CUP-16', 20], ['LID-12', 20], ['SLV-01', 8]] }),
  order({ number: 'WM-10471', customerId: 'cus_juniper', placedAt: '2026-10-15T10:20:00', status: 'delivered', channel: 'portal', warehouse: 'reno', lines: [['OAT-12', 6], ['CBF-01', 3]] }),
  order({ number: 'WM-10470', customerId: 'cus_saltmarsh', placedAt: '2026-10-14T17:05:00', status: 'delivered', channel: 'sales-rep', warehouse: 'savannah', lines: [['CUP-12', 4], ['LID-12', 4], ['NAP-01', 2]] }),
  order({ number: 'WM-10469', customerId: 'cus_littlefern', placedAt: '2026-10-13T09:31:00', status: 'cancelled', channel: 'portal', warehouse: 'columbus', lines: [['BOX-08', 2]] }),
  order({ number: 'WM-10468', customerId: 'cus_pinecrest', placedAt: '2026-10-12T07:55:00', status: 'delivered', channel: 'edi', warehouse: 'reno', poNumber: 'PHG-77251', lines: [['GLV-M', 8], ['SAN-05', 6], ['TWL-01', 10]] }),
  order({ number: 'WM-10467', customerId: 'cus_ninefold', placedAt: '2026-10-10T12:40:00', status: 'delivered', channel: 'portal', warehouse: 'reno', lines: [['NAP-01', 5], ['GLV-M', 2]] }),
  order({ number: 'WM-10466', customerId: 'cus_copperstove', placedAt: '2026-10-09T15:18:00', status: 'delivered', channel: 'sales-rep', warehouse: 'reno', lines: [['CUP-16', 6], ['LID-12', 6]] }),
  order({ number: 'WM-10465', customerId: 'cus_meadowlark', placedAt: '2026-10-08T10:02:00', status: 'delivered', channel: 'edi', warehouse: 'columbus', poNumber: 'MGC-1172', lines: [['PRC-01', 6], ['BOX-08', 10], ['SAN-05', 2]] }),
  order({ number: 'WM-10464', customerId: 'cus_harborlane', placedAt: '2026-10-06T14:11:00', status: 'delivered', channel: 'portal', warehouse: 'columbus', lines: [['CUP-12', 5], ['LID-12', 5], ['SLV-01', 3]] }),
  order({ number: 'WM-10463', customerId: 'cus_quillkettle', placedAt: '2026-10-04T11:47:00', status: 'delivered', channel: 'portal', warehouse: 'savannah', lines: [['CBF-01', 5], ['OAT-12', 3]] }),
  order({ number: 'WM-10462', customerId: 'cus_brightwater', placedAt: '2026-10-02T08:30:00', status: 'delivered', channel: 'edi', warehouse: 'columbus', poNumber: '448733', lines: [['NAP-01', 15], ['TWL-01', 8], ['GLV-M', 10]] }),
  order({ number: 'WM-10461', customerId: 'cus_juniper', placedAt: '2026-09-30T09:58:00', status: 'delivered', channel: 'portal', warehouse: 'reno', poNumber: 'JSC-2240', lines: [['CUP-12', 6], ['LID-12', 6], ['SLV-01', 2]] }),
  order({ number: 'WM-10460', customerId: 'cus_saltmarsh', placedAt: '2026-09-28T16:20:00', status: 'cancelled', channel: 'sales-rep', warehouse: 'savannah', lines: [['GLV-M', 3], ['SAN-05', 2]] }),
  order({ number: 'WM-10459', customerId: 'cus_pinecrest', placedAt: '2026-09-26T07:42:00', status: 'delivered', channel: 'edi', warehouse: 'reno', poNumber: 'PHG-77188', lines: [['CUP-16', 12], ['LID-12', 12], ['NAP-01', 8]] }),
  order({ number: 'WM-10458', customerId: 'cus_littlefern', placedAt: '2026-09-24T10:15:00', status: 'delivered', channel: 'portal', warehouse: 'columbus', lines: [['PRC-01', 4], ['BOX-08', 6]] }),
  order({ number: 'WM-10457', customerId: 'cus_copperstove', placedAt: '2026-09-22T13:33:00', status: 'delivered', channel: 'sales-rep', warehouse: 'reno', lines: [['TWL-01', 3], ['SAN-05', 4]] }),
  order({ number: 'WM-10456', customerId: 'cus_ninefold', placedAt: '2026-09-19T12:05:00', status: 'delivered', channel: 'portal', warehouse: 'reno', lines: [['CBF-01', 8], ['OAT-12', 5]] }),
  order({ number: 'WM-10455', customerId: 'cus_meadowlark', placedAt: '2026-09-16T09:49:00', status: 'delivered', channel: 'edi', warehouse: 'columbus', poNumber: 'MGC-1149', lines: [['GLV-M', 5], ['NAP-01', 6]] }),
  order({ number: 'WM-10454', customerId: 'cus_harborlane', placedAt: '2026-09-12T15:26:00', status: 'delivered', channel: 'portal', warehouse: 'columbus', lines: [['PRC-01', 3], ['NAP-01', 2]] }),
  order({ number: 'WM-10453', customerId: 'cus_quillkettle', placedAt: '2026-09-09T10:38:00', status: 'delivered', channel: 'portal', warehouse: 'savannah', lines: [['CUP-12', 2], ['LID-12', 2], ['SLV-01', 1]] }),
]
