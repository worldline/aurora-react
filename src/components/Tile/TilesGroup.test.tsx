import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { TileItem } from './TileItem'
import { TilesGroup } from './TilesGroup'

const trailingArrow = <span aria-hidden="true">→</span>

const items = [
  { id: '1', title: 'Tile 1' },
  { id: '2', title: 'Tile 2' },
  { id: '3', title: 'Tile 3' },
]

const renderTiles = (
  groupProps: Omit<
    Partial<React.ComponentProps<typeof TilesGroup>>,
    'aria-label' | 'aria-labelledby' | 'items' | 'children'
  > = {},
  itemProps: Omit<Partial<React.ComponentProps<typeof TileItem>>, 'id'> = {},
) => {
  const user = userEvent.setup()
  const onSelectionChange = vi.fn()

  const renderOutput = render(
    <TilesGroup
      aria-label="Actions"
      items={items}
      onSelectionChange={onSelectionChange}
      {...groupProps}
    >
      {(item) => <TileItem {...item} {...itemProps} trailing={trailingArrow} />}
    </TilesGroup>,
  )

  return {
    ...renderOutput,
    user,
    onSelectionChange,
    rows: screen.getAllByRole('row'),
  }
}

describe('TilesGroup', () => {
  describe('rendering', () => {
    test('should render with accessible grid roles', () => {
      renderTiles()
      expect(screen.getByRole('grid', { name: 'Actions' })).toBeInTheDocument()
      expect(screen.getAllByRole('row')).toHaveLength(3)
    })
  })

  describe('selection', () => {
    describe.each(['mouse', 'keyboard'])('%s', (interaction) => {
      test('should support single selection', async () => {
        const { user, rows, onSelectionChange } = renderTiles({
          selectionMode: 'single',
        })

        const [row1, row2] = rows

        if (interaction === 'mouse') {
          await user.click(row1)
        } else {
          await user.tab()
          await user.keyboard('{Enter}')
        }

        expect(row1).toHaveAttribute('aria-selected', 'true')
        expect(row1.querySelector('[data-selected]')).toBeInTheDocument()
        expect(onSelectionChange).toHaveBeenCalledTimes(1)

        if (interaction === 'mouse') {
          await user.click(row2)
        } else {
          await user.keyboard('{ArrowDown}')
          await user.keyboard('{Enter}')
        }

        expect(row1).toHaveAttribute('aria-selected', 'false')
        expect(row1.querySelector('[data-selected]')).not.toBeInTheDocument()
        expect(row2).toHaveAttribute('aria-selected', 'true')
        expect(row2.querySelector('[data-selected]')).toBeInTheDocument()
        expect(onSelectionChange).toHaveBeenCalledTimes(2)
      })

      test('should support multiple selection', async () => {
        const { user, rows, onSelectionChange } = renderTiles({
          selectionMode: 'multiple',
        })
        const [row1, row2] = rows

        if (interaction === 'mouse') {
          await user.click(row1)
          await user.click(row2)
        } else {
          await user.tab()
          await user.keyboard('{Enter}')
          await user.keyboard('{ArrowDown}')
          await user.keyboard('{Enter}')
        }

        expect(row1).toHaveAttribute('aria-selected', 'true')
        expect(row1.querySelector('[data-selected]')).toBeInTheDocument()
        expect(row2).toHaveAttribute('aria-selected', 'true')
        expect(row2.querySelector('[data-selected]')).toBeInTheDocument()
        expect(onSelectionChange).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('actions', () => {
    test('should call onClick when a tile is clicked', async () => {
      const onClick = vi.fn()
      const { user, rows } = renderTiles({}, { onClick })

      await user.click(rows[0])

      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('disabled state', () => {
    test('should not allow selection or action on a disabled item', async () => {
      const onClick = vi.fn()
      const { user, rows, onSelectionChange } = renderTiles(
        { selectionMode: 'single', disabledKeys: ['1'] },
        { onClick },
      )
      const [row1] = rows

      expect(row1).toHaveAttribute('aria-disabled', 'true')
      expect(row1.querySelector('[data-disabled]')).toBeInTheDocument()

      await user.click(row1)
      expect(onSelectionChange).not.toHaveBeenCalled()
      expect(onClick).not.toHaveBeenCalled()
    })
  })
})
