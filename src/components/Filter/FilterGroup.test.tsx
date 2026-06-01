import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { Selection } from 'react-aria-components'
import { describe, expect, test, vi } from 'vitest'

import { FilterGroup } from './FilterGroup'
import { FilterItem } from './FilterItem'

describe('FilterGroup Component', () => {
  test('should render filter group with accessible role', () => {
    render(
      <FilterGroup aria-label="Topics">
        <FilterItem id="tech">Technology</FilterItem>
      </FilterGroup>,
    )

    const group = screen.getByRole('grid', { name: 'Topics' })
    expect(group).toBeInTheDocument()
  })

  test('should render with leading icon inside item', () => {
    const SampleIcon = <span data-testid="lead-ico" />
    render(
      <FilterGroup aria-label="Filters">
        <FilterItem id="i1" leadingIcon={SampleIcon}>
          Icon Item
        </FilterItem>
      </FilterGroup>,
    )

    expect(screen.getByTestId('lead-ico')).toBeInTheDocument()
  })

  describe('States', () => {
    test('should be unselected by default', () => {
      render(
        <FilterGroup aria-label="Filters" selectionMode="multiple">
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      const row = screen.getByRole('row', { name: 'News' })
      expect(row).not.toHaveAttribute('aria-selected', 'true')
    })

    test('should be selected when defaultSelectedKeys is matched', () => {
      render(
        <FilterGroup
          aria-label="Filters"
          selectionMode="multiple"
          defaultSelectedKeys={['news']}
        >
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      const row = screen.getByRole('row', { name: 'News' })
      expect(row).toHaveAttribute('aria-selected', 'true')
    })

    test('should be selected when selectedKeys is matched', () => {
      render(
        <FilterGroup
          aria-label="Filters"
          selectionMode="multiple"
          selectedKeys={['news']}
        >
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      const row = screen.getByRole('row', { name: 'News' })
      expect(row).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('User interactions', () => {
    test('should toggle selected state on click', async () => {
      const user = userEvent.setup()
      render(
        <FilterGroup aria-label="Filters" selectionMode="multiple">
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      const item = screen.getByRole('gridcell', { name: 'News' })
      const row = screen.getByRole('row', { name: 'News' })
      expect(row).not.toHaveAttribute('aria-selected', 'true')

      await user.click(item)
      expect(row).toHaveAttribute('aria-selected', 'true')

      await user.click(item)
      expect(row).not.toHaveAttribute('aria-selected', 'true')
    })

    test('should fire onRemove when close button is clicked', async () => {
      const handleRemove = vi.fn()
      const user = userEvent.setup()
      render(
        <FilterGroup aria-label="Filters" onRemove={handleRemove}>
          <FilterItem id="news" closeLabel="Remove News">
            News
          </FilterItem>
        </FilterGroup>,
      )

      const closeButton = screen.getByRole('button', { name: /Remove News/ })
      await user.click(closeButton)

      expect(handleRemove).toHaveBeenCalledTimes(1)
    })

    test('should call onSelectionChange when state changes', async () => {
      const handleSelectionChange = vi.fn()
      const user = userEvent.setup()
      render(
        <FilterGroup
          aria-label="Filters"
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
        >
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      const item = screen.getByRole('gridcell', { name: 'News' })
      await user.click(item)

      expect(handleSelectionChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('Controlled usage', () => {
    test('should display controlled selected state', () => {
      render(
        <FilterGroup
          aria-label="Filters"
          selectionMode="multiple"
          selectedKeys={['news']}
        >
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      const row = screen.getByRole('row', { name: 'News' })
      expect(row).toHaveAttribute('aria-selected', 'true')
    })

    test('should update when controlled value changes', async () => {
      const ControlledFilterGroup = () => {
        const [selectedKeys, setSelectedKeys] = useState<Selection>(
          () => new Set([]),
        )

        return (
          <FilterGroup
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            aria-label="Toggle"
          >
            <FilterItem id="news">News</FilterItem>
          </FilterGroup>
        )
      }
      const user = userEvent.setup()
      render(<ControlledFilterGroup />)

      const item = screen.getByRole('gridcell', { name: 'News' })
      const row = screen.getByRole('row', { name: 'News' })

      expect(row).not.toHaveAttribute('aria-selected', 'true')

      await user.click(item)

      expect(row).toHaveAttribute('aria-selected', 'true')
    })

    test('should not update when controlled value is unchanged', async () => {
      const user = userEvent.setup()
      render(
        <FilterGroup
          aria-label="Filters"
          selectionMode="multiple"
          selectedKeys={new Set([])}
        >
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      const item = screen.getByRole('gridcell', { name: 'News' })
      const row = screen.getByRole('row', { name: 'News' })

      await user.click(item)

      expect(row).not.toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('Disabled state', () => {
    test('should have disabled attribute when disabledKeys matches', () => {
      render(
        <FilterGroup aria-label="Filters" disabledKeys={['news']}>
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      const row = screen.getByRole('row', { name: 'News' })
      expect(row).toHaveAttribute('aria-disabled', 'true')
    })

    test('should not respond to clicks when disabled', async () => {
      const handleSelectionChange = vi.fn()
      const user = userEvent.setup()
      render(
        <FilterGroup
          aria-label="Filters"
          selectionMode="multiple"
          disabledKeys={['news']}
          onSelectionChange={handleSelectionChange}
        >
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      const item = screen.getByRole('gridcell', { name: 'News' })
      const row = screen.getByRole('row', { name: 'News' })

      await user.click(item)

      expect(handleSelectionChange).not.toHaveBeenCalled()
      expect(row).not.toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('Removal rules', () => {
    test('should not display remove button when item is selected', () => {
      render(
        <FilterGroup
          aria-label="Filters"
          selectionMode="multiple"
          defaultSelectedKeys={['news']}
          onRemove={vi.fn()}
        >
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    test('should display remove button when item is not selected', () => {
      render(
        <FilterGroup aria-label="Filters" onRemove={vi.fn()}>
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have accessible name from aria-label', () => {
      render(
        <FilterGroup aria-label="Search Criteria">
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      const group = screen.getByRole('grid', { name: 'Search Criteria' })
      expect(group).toBeInTheDocument()
    })

    test('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(
        <FilterGroup aria-label="Filters">
          <FilterItem id="news">News</FilterItem>
        </FilterGroup>,
      )

      const row = screen.getByRole('row', { name: 'News' })

      await user.tab()
      expect(row).toHaveFocus()
    })
  })
  describe('Selection Mode Single', () => {
    test('should only allow one item to be selected at a time', async () => {
      const user = userEvent.setup()
      render(
        <FilterGroup aria-label="Filters" selectionMode="single">
          <FilterItem id="news">News</FilterItem>
          <FilterItem id="tech">Tech</FilterItem>
        </FilterGroup>,
      )

      const newsRow = screen.getByRole('row', { name: 'News' })
      const techRow = screen.getByRole('row', { name: 'Tech' })
      const newsCell = screen.getByRole('gridcell', { name: 'News' })
      const techCell = screen.getByRole('gridcell', { name: 'Tech' })

      expect(newsRow).not.toHaveAttribute('aria-selected', 'true')
      expect(techRow).not.toHaveAttribute('aria-selected', 'true')

      await user.click(newsCell)
      expect(newsRow).toHaveAttribute('aria-selected', 'true')
      expect(techRow).not.toHaveAttribute('aria-selected', 'true')

      await user.click(techCell)
      expect(newsRow).not.toHaveAttribute('aria-selected', 'true')
      expect(techRow).toHaveAttribute('aria-selected', 'true')
    })
  })
})
