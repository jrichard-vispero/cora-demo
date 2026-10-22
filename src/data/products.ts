import type { Product } from './types'

const products: Product[] = [
  { sku: 'CUP-12', name: 'Compostable hot cups, 12 oz (case of 500)', unitPrice: 6450 },
  { sku: 'CUP-16', name: 'Compostable hot cups, 16 oz (case of 500)', unitPrice: 7275 },
  { sku: 'LID-12', name: 'Sip lids for 12 and 16 oz cups (case of 500)', unitPrice: 3890 },
  { sku: 'SLV-01', name: 'Kraft cup sleeves (case of 1,000)', unitPrice: 4120 },
  { sku: 'PRC-01', name: 'Unbleached parchment, half sheet (pack of 1,000)', unitPrice: 5480 },
  { sku: 'BOX-08', name: 'Bakery boxes, 8 × 8 × 4 in (case of 200)', unitPrice: 6890 },
  { sku: 'NAP-01', name: 'Recycled dinner napkins (case of 3,000)', unitPrice: 4760 },
  { sku: 'GLV-M', name: 'Nitrile gloves, medium (case of 1,000)', unitPrice: 8990 },
  { sku: 'OAT-12', name: 'Barista oat milk (12 × 1 L)', unitPrice: 3960 },
  { sku: 'CBF-01', name: 'Cold brew filter bags (pack of 100)', unitPrice: 2475 },
  { sku: 'SAN-05', name: 'Food-safe sanitizer concentrate, 5 L', unitPrice: 3150 },
  { sku: 'TWL-01', name: 'Cotton bar towels (pack of 50)', unitPrice: 3380 },
]

const productsBySku = new Map(products.map((product) => [product.sku, product]))

export function getProduct(sku: string): Product {
  const product = productsBySku.get(sku)
  if (!product) throw new Error(`Unknown SKU: ${sku}`)
  return product
}
