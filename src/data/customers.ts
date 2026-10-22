import type { Customer } from './types'

export const customers: Customer[] = [
  {
    id: 'cus_juniper',
    name: 'Juniper Street Café',
    contact: 'Maya Ortiz',
    email: 'maya@juniperstreet.example',
    phone: '(503) 555-0142',
    address: { line1: '1180 SE Juniper St', city: 'Portland', region: 'OR', postalCode: '97214' },
  },
  {
    id: 'cus_saltmarsh',
    name: 'Saltmarsh Kitchen',
    contact: 'Daniel Okafor',
    email: 'orders@saltmarsh.example',
    phone: '(843) 555-0187',
    address: { line1: '42 Tradd Wharf', city: 'Charleston', region: 'SC', postalCode: '29401' },
  },
  {
    id: 'cus_littlefern',
    name: 'Little Fern Bakery',
    contact: 'Hannah Lindqvist',
    email: 'hannah@littlefern.example',
    phone: '(608) 555-0119',
    address: { line1: '310 Willow Ave', city: 'Madison', region: 'WI', postalCode: '53703' },
  },
  {
    id: 'cus_harborlane',
    name: 'Harbor Lane Deli',
    contact: 'Marco Bellini',
    email: 'marco@harborlane.example',
    phone: '(401) 555-0164',
    address: { line1: '9 Harbor Ln', line2: 'Unit B', city: 'Providence', region: 'RI', postalCode: '02903' },
  },
  {
    id: 'cus_quillkettle',
    name: 'Quill & Kettle Tea Room',
    contact: 'Aisha Rahman',
    email: 'aisha@quillkettle.example',
    phone: '(828) 555-0136',
    address: { line1: '77 Lexington Row', city: 'Asheville', region: 'NC', postalCode: '28801' },
  },
  {
    id: 'cus_brightwater',
    name: 'Brightwater Campus Dining',
    contact: 'Owen Fletcher',
    email: 'purchasing@brightwater.example',
    phone: '(614) 555-0108',
    address: { line1: '2200 College Rd', line2: 'Receiving Dock 3', city: 'Columbus', region: 'OH', postalCode: '43210' },
  },
  {
    id: 'cus_ninefold',
    name: 'Ninefold Noodle Bar',
    contact: 'Grace Liu',
    email: 'grace@ninefold.example',
    phone: '(206) 555-0171',
    address: { line1: '512 Pike Terrace', city: 'Seattle', region: 'WA', postalCode: '98101' },
  },
  {
    id: 'cus_copperstove',
    name: 'Copper Stove Diner',
    contact: 'Luis Navarro',
    email: 'luis@copperstove.example',
    phone: '(520) 555-0153',
    address: { line1: '1400 E Speedway Blvd', city: 'Tucson', region: 'AZ', postalCode: '85719' },
  },
  {
    id: 'cus_meadowlark',
    name: 'Meadowlark Grocery Co-op',
    contact: 'Ruth Adeyemi',
    email: 'buying@meadowlark.example',
    phone: '(802) 555-0124',
    address: { line1: '64 Pine St', city: 'Burlington', region: 'VT', postalCode: '05401' },
  },
  {
    id: 'cus_pinecrest',
    name: 'Pinecrest Hotel Group',
    contact: 'Sofia Marchetti',
    email: 'procurement@pinecrest.example',
    phone: '(775) 555-0195',
    address: { line1: '88 Sierra Vista Pkwy', city: 'Reno', region: 'NV', postalCode: '89501' },
  },
]

const customersById = new Map(customers.map((customer) => [customer.id, customer]))

export function getCustomer(id: string): Customer {
  const customer = customersById.get(id)
  if (!customer) throw new Error(`Unknown customer: ${id}`)
  return customer
}
