interface Product {
  id: number
  name: string
  quantity: number
  price: number
  active: boolean
  createdAt: string
  discount: number
}

interface WideProduct extends Product {
  category: string
  supplier: string
  weight: number
  origin: string
  rating: number
}

const defaultProduct: Product = {
  id: 1,
  name: 'Widget',
  quantity: 150,
  price: 29.99,
  active: true,
  createdAt: '2025-01-15',
  discount: 10,
}

const product = (overrides: Partial<Product>): Product => ({
  ...defaultProduct,
  ...overrides,
})

const products: ReadonlyArray<Product> = [
  product({
    id: 1,
    name: 'Widget',
    quantity: 150,
    price: 29.99,
    active: true,
    createdAt: '2025-01-15',
    discount: 10,
  }),
  product({
    id: 2,
    name: 'Gadget',
    quantity: 80,
    price: 49.5,
    active: true,
    createdAt: '2025-01-14',
    discount: 15,
  }),
  product({
    id: 3,
    name: 'Sprocket',
    quantity: 200,
    price: 12.0,
    active: true,
    createdAt: '2025-01-13',
    discount: 5,
  }),
  product({
    id: 4,
    name: 'Gizmo',
    quantity: 45,
    price: 89.75,
    active: false,
    createdAt: '2025-01-12',
    discount: 20,
  }),
  product({
    id: 5,
    name: 'Doohickey',
    quantity: 300,
    price: 5.99,
    active: true,
    createdAt: '2025-01-11',
    discount: 0,
  }),
  product({
    id: 6,
    name: 'Thing',
    quantity: 60,
    price: 34.25,
    active: false,
    createdAt: '2025-01-10',
    discount: 25,
  }),
  product({
    id: 7,
    name: 'Doodad',
    quantity: 90,
    price: 67.0,
    active: true,
    createdAt: '2025-01-09',
    discount: 12,
  }),
  product({
    id: 8,
    name: 'Contraption',
    quantity: 25,
    price: 149.99,
    active: true,
    createdAt: '2025-01-08',
    discount: 8,
  }),
  product({
    id: 9,
    name: 'Apparatus',
    quantity: 110,
    price: 22.5,
    active: false,
    createdAt: '2025-01-07',
    discount: 30,
  }),
  product({
    id: 10,
    name: 'Mechanism',
    quantity: 175,
    price: 41.0,
    active: true,
    createdAt: '2025-01-06',
    discount: 15,
  }),
  product({
    id: 11,
    name: 'Implement',
    quantity: 55,
    price: 73.25,
    active: true,
    createdAt: '2025-01-05',
    discount: 18,
  }),
]

const shortProducts: ReadonlyArray<Product> = products.slice(0, 3)

const categories = ['Electronics', 'Hardware', 'Tools', 'Accessories'] as const
const suppliers = ['Acme Corp', 'GlobalTech', 'FastParts'] as const
const origins = ['France', 'Germany', 'Spain', 'Netherlands'] as const

const wideProducts: ReadonlyArray<WideProduct> = products.map(
  (currentProduct) => ({
    ...currentProduct,
    category: categories[currentProduct.id % categories.length],
    supplier: suppliers[currentProduct.id % suppliers.length],
    weight: Math.round((currentProduct.id * 1.7 + 0.3) * 10) / 10,
    origin: origins[currentProduct.id % origins.length],
    rating: Math.round(((currentProduct.id * 7) % 50) / 10 + 1),
  }),
)

export {
  product,
  products,
  shortProducts,
  wideProducts,
  type Product,
  type WideProduct,
}
