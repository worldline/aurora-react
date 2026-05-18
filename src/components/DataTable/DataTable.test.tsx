import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { Selection } from 'react-aria-components'
import { beforeAll, describe, expect, test, vi } from 'vitest'

import { shortProducts } from './DataTable.fixtures'

import { DataTable } from '.'

const useRefMockControl = vi.hoisted(() => ({ nullifyNext: false }))

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  const originalUseRef = actual.useRef
  return {
    ...actual,
    useRef: ((initialValue: unknown) => {
      const ref = originalUseRef(initialValue)
      if (useRefMockControl.nullifyNext) {
        useRefMockControl.nullifyNext = false
        return new Proxy(ref, {
          get(target, prop) {
            if (prop === 'current') {
              return null
            }
            return Reflect.get(target, prop) as unknown
          },
          set(target, prop, value) {
            if (prop === 'current') {
              return true
            }
            return Reflect.set(target, prop, value)
          },
        })
      }
      return ref
    }) as typeof actual.useRef,
  }
})

const noopRowAction = (): void => undefined

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
})

describe('DataTable Component', () => {
  describe('Rendering', () => {
    test('should render a table with aria-label', () => {
      render(
        <DataTable aria-label="Test table">
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      expect(
        screen.getByRole('grid', { name: 'Test table' }),
      ).toBeInTheDocument()
    })

    test('should render column headers', () => {
      render(
        <DataTable aria-label="Test table">
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
            <DataTable.Column id="quantity">Quantity</DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
                <DataTable.Cell>{currentProduct.quantity}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      expect(
        screen.getByRole('columnheader', { name: 'Name' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: 'Quantity' }),
      ).toBeInTheDocument()
    })

    test('should render rows and cells with correct content', () => {
      render(
        <DataTable aria-label="Test table">
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(4)

      expect(screen.getByText('Widget')).toBeInTheDocument()
      expect(screen.getByText('Gadget')).toBeInTheDocument()
      expect(screen.getByText('Sprocket')).toBeInTheDocument()
    })
  })

  describe('Cell typography', () => {
    test('should wrap string children in Typography', () => {
      render(
        <DataTable aria-label="Test table">
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      const cell = screen.getByRole('rowheader', { name: 'Widget' })
      const span = cell.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span).toHaveTextContent('Widget')
    })

    test('should render non-string children directly', () => {
      render(
        <DataTable aria-label="Test table">
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body>
            <DataTable.Row id="1">
              <DataTable.Cell>
                <strong data-testid="custom-content">Bold text</strong>
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
        </DataTable>,
      )

      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })
  })

  describe('Selection', () => {
    test('should render checkbox column when showCheckbox is true', () => {
      render(
        <DataTable
          aria-label="Test table"
          selectionMode="multiple"
          onRowAction={noopRowAction}
          showCheckbox
        >
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThan(0)
    })

    test('should support row selection', async () => {
      const user = userEvent.setup()

      const SelectionWrapper = () => {
        const [selectedKeys, setSelectedKeys] = useState<Selection>(
          () => new Set(),
        )

        return (
          <DataTable
            aria-label="Test table"
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
            </DataTable.Header>
            <DataTable.Body items={shortProducts}>
              {(currentProduct) => (
                <DataTable.Row id={currentProduct.id}>
                  <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
                </DataTable.Row>
              )}
            </DataTable.Body>
          </DataTable>
        )
      }

      render(<SelectionWrapper />)

      const firstRowCheckbox = screen.getAllByRole('checkbox')[1]
      await user.click(firstRowCheckbox)

      expect(firstRowCheckbox).toBeChecked()
    })
  })

  describe('Sorting', () => {
    test('should render sort indicators on sortable columns', () => {
      render(
        <DataTable
          aria-label="Test table"
          sortDescriptor={{ column: 'name', direction: 'ascending' }}
          onSortChange={() => undefined}
        >
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader allowsSorting>
              Name
            </DataTable.Column>
            <DataTable.Column id="quantity">Quantity</DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
                <DataTable.Cell>{currentProduct.quantity}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      const sortableColumn = screen.getByRole('columnheader', {
        name: 'Name',
      })
      const sortIcon = sortableColumn.querySelector('svg')
      expect(sortIcon).toBeInTheDocument()
    })

    test('should call onSortChange when sortable column is clicked', async () => {
      const user = userEvent.setup()
      const handleSortChange = vi.fn()

      render(
        <DataTable
          aria-label="Test table"
          sortDescriptor={{ column: 'name', direction: 'ascending' }}
          onSortChange={handleSortChange}
        >
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader allowsSorting>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      const sortableColumn = screen.getByRole('columnheader', {
        name: 'Name',
      })
      await user.click(sortableColumn)

      expect(handleSortChange).toHaveBeenCalled()
    })

    test('should display ascending sort indicator', () => {
      render(
        <DataTable
          aria-label="Test table"
          sortDescriptor={{ column: 'name', direction: 'ascending' }}
          onSortChange={() => undefined}
        >
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader allowsSorting>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      const column = screen.getByRole('columnheader', { name: 'Name' })
      expect(column).toHaveAttribute('aria-sort', 'ascending')
    })

    test('should display descending sort indicator', () => {
      render(
        <DataTable
          aria-label="Test table"
          sortDescriptor={{ column: 'name', direction: 'descending' }}
          onSortChange={() => undefined}
        >
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader allowsSorting>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      const column = screen.getByRole('columnheader', { name: 'Name' })
      expect(column).toHaveAttribute('aria-sort', 'descending')
    })
  })

  describe('Loading state', () => {
    test('should render loading spinner when loading is true', () => {
      render(
        <DataTable aria-label="Test table" loading>
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    test('should not render loading spinner when loading is false', () => {
      render(
        <DataTable aria-label="Test table">
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    test('should render footer content', () => {
      render(
        <DataTable
          aria-label="Test table"
          footer={<button type="button">Load more</button>}
        >
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      expect(
        screen.getByRole('button', { name: 'Load more' }),
      ).toBeInTheDocument()
    })

    test('should hide footer content when loading', () => {
      render(
        <DataTable
          aria-label="Test table"
          loading
          footer={<button type="button">Load more</button>}
        >
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      expect(
        screen.queryByRole('button', { name: 'Load more' }),
      ).not.toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('Action column', () => {
    test('should render action column when showAction is true', () => {
      render(
        <DataTable
          aria-label="Test table"
          selectionMode="multiple"
          onRowAction={noopRowAction}
          showAction
        >
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      const rows = screen.getAllByRole('row')
      const dataRow = rows[1]
      const actionIcons = within(dataRow).getAllByRole('img', { hidden: true })
      expect(actionIcons.length).toBeGreaterThan(0)
    })
  })

  describe('Fixed columns', () => {
    test('should apply fixed left style to column', () => {
      render(
        <DataTable aria-label="Test table">
          <DataTable.Header>
            <DataTable.Column
              id="name"
              isRowHeader
              fixed="left"
              fixedOffset={0}
            >
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell fixed="left" fixedOffset={0}>
                  {currentProduct.name}
                </DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      const column = screen.getByRole('columnheader', { name: 'Name' })
      expect(column).toHaveStyle({ left: '0' })
    })

    test('should apply fixed right style to cell', () => {
      render(
        <DataTable aria-label="Test table">
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
            <DataTable.Column id="action" fixed="right" fixedOffset={0}>
              Action
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body>
            <DataTable.Row id="1">
              <DataTable.Cell>Widget</DataTable.Cell>
              <DataTable.Cell fixed="right" fixedOffset={0}>
                Edit
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
        </DataTable>,
      )

      const actionColumn = screen.getByRole('columnheader', { name: 'Action' })
      expect(actionColumn).toHaveStyle({ right: '0' })
    })
  })

  describe('Section headers', () => {
    test('should render section header text', () => {
      render(
        <DataTable aria-label="Test table">
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
            <DataTable.Column id="quantity">Quantity</DataTable.Column>
          </DataTable.Header>
          <DataTable.Body>
            <DataTable.SectionHeader id="section-1">
              January 2025
            </DataTable.SectionHeader>
            <DataTable.Row id="1">
              <DataTable.Cell>Widget</DataTable.Cell>
              <DataTable.Cell>150</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
        </DataTable>,
      )

      expect(screen.getByText('January 2025')).toBeInTheDocument()
    })
  })

  describe('Max height', () => {
    test('should apply maxHeight style to wrapper', () => {
      const { container } = render(
        <DataTable aria-label="Test table" style={{ maxHeight: 400 }}>
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper).toHaveStyle({ maxHeight: '400px' })
    })
  })

  describe('Scroll observers', () => {
    test('should not set up scroll observers when wrapper ref is null', () => {
      const observeSpy = vi.fn()
      global.ResizeObserver = class ResizeObserver {
        observe = observeSpy
        unobserve = vi.fn()
        disconnect = vi.fn()
      }

      useRefMockControl.nullifyNext = true

      render(
        <DataTable aria-label="Test table">
          <DataTable.Header>
            <DataTable.Column id="name" isRowHeader>
              Name
            </DataTable.Column>
          </DataTable.Header>
          <DataTable.Body items={shortProducts}>
            {(currentProduct) => (
              <DataTable.Row id={currentProduct.id}>
                <DataTable.Cell>{currentProduct.name}</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable>,
      )

      expect(observeSpy).not.toHaveBeenCalled()
    })
  })

  describe('Compound pattern', () => {
    test('should expose sub-components via dot notation', () => {
      expect(DataTable.Header).toBeDefined()
      expect(DataTable.Column).toBeDefined()
      expect(DataTable.Body).toBeDefined()
      expect(DataTable.Row).toBeDefined()
      expect(DataTable.Cell).toBeDefined()
      expect(DataTable.SectionHeader).toBeDefined()
    })
  })
})
