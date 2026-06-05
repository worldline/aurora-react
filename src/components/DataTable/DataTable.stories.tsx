import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { Selection, SortDescriptor } from 'react-aria-components'

import { Button } from '@/components/Button'
import { Typography } from '@/components/Typography'

import { DataTable } from './DataTable'
import { type Product, products, shortProducts } from './DataTable.fixtures'

const noopRowAction = (): void => undefined

const formatPrice = (price: number): string => `€${price.toFixed(2)}`
const formatDiscount = (discount: number): string => `${String(discount)}%`
const formatActive = (active: boolean): string => (active ? 'Yes' : 'No')

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj<typeof DataTable>

export const Default: Story = {
  render: () => (
    <DataTable aria-label="Products">
      <DataTable.Header>
        <DataTable.Column id="name" isRowHeader>
          Name
        </DataTable.Column>
        <DataTable.Column id="quantity">Quantity</DataTable.Column>
        <DataTable.Column id="price">Price</DataTable.Column>
        <DataTable.Column id="active">Active</DataTable.Column>
        <DataTable.Column id="createdAt">Date</DataTable.Column>
        <DataTable.Column id="discount">Discount</DataTable.Column>
      </DataTable.Header>
      <DataTable.Body items={products}>
        {(currentProduct) => (
          <DataTable.Row id={currentProduct.id}>
            <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
            <DataTable.Cell>{currentProduct.quantity}</DataTable.Cell>
            <DataTable.Cell>{formatPrice(currentProduct.price)}</DataTable.Cell>
            <DataTable.Cell>
              {formatActive(currentProduct.active)}
            </DataTable.Cell>
            <DataTable.Cell>{currentProduct.createdAt}</DataTable.Cell>
            <DataTable.Cell>
              {formatDiscount(currentProduct.discount)}
            </DataTable.Cell>
          </DataTable.Row>
        )}
      </DataTable.Body>
    </DataTable>
  ),
}

const SortableTable = () => {
  const [sortDescriptor, setSortDescriptor] = useState<
    SortDescriptor | undefined
  >(undefined)

  const sortedProducts = [...products].sort((first, second) => {
    const column = sortDescriptor?.column as keyof Product
    const firstValue = first[column]
    const secondValue = second[column]
    const comparison = String(firstValue).localeCompare(String(secondValue))

    return sortDescriptor?.direction === 'descending' ? -comparison : comparison
  })

  return (
    <DataTable
      aria-label="Sortable products"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <DataTable.Header>
        <DataTable.Column id="name" isRowHeader allowsSorting>
          Name
        </DataTable.Column>
        <DataTable.Column id="quantity" allowsSorting>
          Quantity
        </DataTable.Column>
        <DataTable.Column id="price" allowsSorting>
          Price
        </DataTable.Column>
        <DataTable.Column id="active">Active</DataTable.Column>
        <DataTable.Column id="createdAt" allowsSorting>
          Date
        </DataTable.Column>
        <DataTable.Column id="discount">Discount</DataTable.Column>
      </DataTable.Header>
      <DataTable.Body items={sortedProducts}>
        {(currentProduct) => (
          <DataTable.Row id={currentProduct.id}>
            <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
            <DataTable.Cell>{currentProduct.quantity}</DataTable.Cell>
            <DataTable.Cell>{formatPrice(currentProduct.price)}</DataTable.Cell>
            <DataTable.Cell>
              {formatActive(currentProduct.active)}
            </DataTable.Cell>
            <DataTable.Cell>{currentProduct.createdAt}</DataTable.Cell>
            <DataTable.Cell>
              {formatDiscount(currentProduct.discount)}
            </DataTable.Cell>
          </DataTable.Row>
        )}
      </DataTable.Body>
    </DataTable>
  )
}

export const WithSorting: Story = {
  render: () => <SortableTable />,
}

const SelectableTable = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(() => new Set())

  const selectedCount =
    selectedKeys === 'all' ? 'All' : String(selectedKeys.size)

  return (
    <>
      <DataTable
        aria-label="Selectable products"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onRowAction={noopRowAction}
        showCheckbox
      >
        <DataTable.Header>
          <DataTable.Column id="name" isRowHeader>
            Name
          </DataTable.Column>
          <DataTable.Column id="quantity">Quantity</DataTable.Column>
          <DataTable.Column id="price">Price</DataTable.Column>
          <DataTable.Column id="active">Active</DataTable.Column>
          <DataTable.Column id="createdAt">Date</DataTable.Column>
          <DataTable.Column id="discount">Discount</DataTable.Column>
        </DataTable.Header>
        <DataTable.Body items={products}>
          {(currentProduct) => (
            <DataTable.Row id={currentProduct.id}>
              <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              <DataTable.Cell>{currentProduct.quantity}</DataTable.Cell>
              <DataTable.Cell>
                {formatPrice(currentProduct.price)}
              </DataTable.Cell>
              <DataTable.Cell>
                {formatActive(currentProduct.active)}
              </DataTable.Cell>
              <DataTable.Cell>{currentProduct.createdAt}</DataTable.Cell>
              <DataTable.Cell>
                {formatDiscount(currentProduct.discount)}
              </DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable.Body>
      </DataTable>
      <Typography element="p" textStyle="bodySm" textColor="contentSecondary">
        {`${selectedCount} row(s) selected`}
      </Typography>
    </>
  )
}

export const WithSelection: Story = {
  render: () => <SelectableTable />,
}

const FullFeaturedTable = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(() => new Set())
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'descending',
  })
  const [visibleCount, setVisibleCount] = useState(4)

  const sortedProducts = [...products].sort((first, second) => {
    const column = sortDescriptor.column as keyof Product
    const firstValue = first[column]
    const secondValue = second[column]
    const comparison = String(firstValue).localeCompare(String(secondValue))

    return sortDescriptor.direction === 'descending' ? -comparison : comparison
  })

  const visibleProducts = sortedProducts.slice(0, visibleCount)

  const selectedCount =
    selectedKeys === 'all' ? 'All' : String(selectedKeys.size)

  return (
    <>
      <DataTable
        aria-label="Full-featured products table"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        onRowAction={noopRowAction}
        showCheckbox
        footer={
          visibleCount < products.length ? (
            <Button
              variant="secondary"
              size="small"
              onPress={() => {
                setVisibleCount(products.length)
              }}
            >
              Show more
            </Button>
          ) : undefined
        }
      >
        <DataTable.Header>
          <DataTable.Column id="name" isRowHeader allowsSorting>
            Name
          </DataTable.Column>
          <DataTable.Column id="quantity" allowsSorting>
            Quantity
          </DataTable.Column>
          <DataTable.Column id="price" allowsSorting>
            Price
          </DataTable.Column>
          <DataTable.Column id="active">Active</DataTable.Column>
          <DataTable.Column id="createdAt" allowsSorting>
            Date
          </DataTable.Column>
          <DataTable.Column id="discount">Discount</DataTable.Column>
        </DataTable.Header>
        <DataTable.Body items={visibleProducts}>
          {(currentProduct) => (
            <DataTable.Row id={currentProduct.id}>
              <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              <DataTable.Cell>{currentProduct.quantity}</DataTable.Cell>
              <DataTable.Cell>
                {formatPrice(currentProduct.price)}
              </DataTable.Cell>
              <DataTable.Cell>
                {formatActive(currentProduct.active)}
              </DataTable.Cell>
              <DataTable.Cell>{currentProduct.createdAt}</DataTable.Cell>
              <DataTable.Cell>
                {formatDiscount(currentProduct.discount)}
              </DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable.Body>
      </DataTable>
      <Typography element="p" textStyle="bodySm" textColor="contentSecondary">
        {`${selectedCount} row(s) selected`}
      </Typography>
    </>
  )
}

export const SortingAndSelection: Story = {
  render: () => <FullFeaturedTable />,
}

const LoadMoreTable = () => {
  const [visibleCount, setVisibleCount] = useState(3)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = (): void => {
    setIsLoading(true)
    setTimeout(() => {
      setVisibleCount(products.length)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <DataTable
      aria-label="Load more table"
      loading={isLoading}
      loadingLabel={'Loading...'}
      footer={
        visibleCount < products.length ? (
          <Button variant="secondary" size="small" onPress={handleLoadMore}>
            Show more
          </Button>
        ) : undefined
      }
    >
      <DataTable.Header>
        <DataTable.Column id="name" isRowHeader>
          Name
        </DataTable.Column>
        <DataTable.Column id="quantity">Quantity</DataTable.Column>
        <DataTable.Column id="price">Price</DataTable.Column>
        <DataTable.Column id="active">Active</DataTable.Column>
      </DataTable.Header>
      <DataTable.Body items={products.slice(0, visibleCount)}>
        {(currentProduct) => (
          <DataTable.Row id={currentProduct.id}>
            <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
            <DataTable.Cell>{currentProduct.quantity}</DataTable.Cell>
            <DataTable.Cell>{formatPrice(currentProduct.price)}</DataTable.Cell>
            <DataTable.Cell>
              {formatActive(currentProduct.active)}
            </DataTable.Cell>
          </DataTable.Row>
        )}
      </DataTable.Body>
    </DataTable>
  )
}

export const LoadingWithFooter: Story = {
  render: () => <LoadMoreTable />,
}

const StickyHeaderTable = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(() => new Set())

  const selectedCount =
    selectedKeys === 'all' ? 'All' : String(selectedKeys.size)

  return (
    <>
      <DataTable
        aria-label="Sticky header table"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onRowAction={noopRowAction}
        style={{ maxHeight: 400 }}
        showCheckbox
      >
        <DataTable.Header>
          <DataTable.Column id="name" isRowHeader>
            Name
          </DataTable.Column>
          <DataTable.Column id="quantity">Quantity</DataTable.Column>
          <DataTable.Column id="price">Price</DataTable.Column>
          <DataTable.Column id="active">Active</DataTable.Column>
          <DataTable.Column id="createdAt">Date</DataTable.Column>
          <DataTable.Column id="discount">Discount</DataTable.Column>
        </DataTable.Header>
        <DataTable.Body items={products}>
          {(currentProduct) => (
            <DataTable.Row id={currentProduct.id}>
              <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              <DataTable.Cell>{currentProduct.quantity}</DataTable.Cell>
              <DataTable.Cell>
                {formatPrice(currentProduct.price)}
              </DataTable.Cell>
              <DataTable.Cell>
                {formatActive(currentProduct.active)}
              </DataTable.Cell>
              <DataTable.Cell>{currentProduct.createdAt}</DataTable.Cell>
              <DataTable.Cell>
                {formatDiscount(currentProduct.discount)}
              </DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable.Body>
      </DataTable>
      <Typography element="p" textStyle="bodySm" textColor="contentSecondary">
        {`${selectedCount} row(s) selected`}
      </Typography>
    </>
  )
}

export const StickyHeader: Story = {
  render: () => <StickyHeaderTable />,
}

const WithActionsTable = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(() => new Set())

  return (
    <DataTable
      aria-label="Table with action buttons"
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      onRowAction={noopRowAction}
      showCheckbox
      showAction
    >
      <DataTable.Header actionLabel="Actions">
        <DataTable.Column id="name" isRowHeader>
          Name
        </DataTable.Column>
        <DataTable.Column id="quantity">Quantity</DataTable.Column>
        <DataTable.Column id="price">Price</DataTable.Column>
        <DataTable.Column id="active">Active</DataTable.Column>
        <DataTable.Column id="createdAt">Date</DataTable.Column>
        <DataTable.Column id="discount">Discount</DataTable.Column>
      </DataTable.Header>
      <DataTable.Body items={products}>
        {(currentProduct) => (
          <DataTable.Row id={currentProduct.id}>
            <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
            <DataTable.Cell>{currentProduct.quantity}</DataTable.Cell>
            <DataTable.Cell>{formatPrice(currentProduct.price)}</DataTable.Cell>
            <DataTable.Cell>
              {formatActive(currentProduct.active)}
            </DataTable.Cell>
            <DataTable.Cell>{currentProduct.createdAt}</DataTable.Cell>
            <DataTable.Cell>
              {formatDiscount(currentProduct.discount)}
            </DataTable.Cell>
          </DataTable.Row>
        )}
      </DataTable.Body>
    </DataTable>
  )
}

export const WithActions: Story = {
  render: () => <WithActionsTable />,
}

export const MobileWithHeading: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <DataTable
      aria-label="Mobile table with date headings"
      selectionMode="multiple"
      onRowAction={noopRowAction}
      showCheckbox
      showAction
    >
      <DataTable.Header actionLabel="Actions">
        <DataTable.Column id="name" isRowHeader>
          Name
        </DataTable.Column>
        <DataTable.Column id="quantity">Quantity</DataTable.Column>
        <DataTable.Column id="price">Price</DataTable.Column>
        <DataTable.Column id="active">Active</DataTable.Column>
        <DataTable.Column id="createdAt">Date</DataTable.Column>
        <DataTable.Column id="discount">Discount</DataTable.Column>
      </DataTable.Header>
      <DataTable.Body>
        <DataTable.SectionHeader id="heading-jan-15">
          2025-01-15
        </DataTable.SectionHeader>
        {shortProducts.map((currentProduct) => (
          <DataTable.Row key={currentProduct.id} id={currentProduct.id}>
            <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
            <DataTable.Cell>{currentProduct.quantity}</DataTable.Cell>
            <DataTable.Cell>{formatPrice(currentProduct.price)}</DataTable.Cell>
            <DataTable.Cell>
              {formatActive(currentProduct.active)}
            </DataTable.Cell>
            <DataTable.Cell>{currentProduct.createdAt}</DataTable.Cell>
            <DataTable.Cell>
              {formatDiscount(currentProduct.discount)}
            </DataTable.Cell>
          </DataTable.Row>
        ))}
        <DataTable.SectionHeader id="heading-jan-12">
          2025-01-12
        </DataTable.SectionHeader>
        {products.slice(3).map((currentProduct) => (
          <DataTable.Row key={currentProduct.id} id={currentProduct.id}>
            <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
            <DataTable.Cell>{currentProduct.quantity}</DataTable.Cell>
            <DataTable.Cell>{formatPrice(currentProduct.price)}</DataTable.Cell>
            <DataTable.Cell>
              {formatActive(currentProduct.active)}
            </DataTable.Cell>
            <DataTable.Cell>{currentProduct.createdAt}</DataTable.Cell>
            <DataTable.Cell>
              {formatDiscount(currentProduct.discount)}
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable.Body>
    </DataTable>
  ),
}
