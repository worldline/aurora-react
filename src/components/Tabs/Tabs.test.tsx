import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { Tabs } from '.'

describe('Tabs Component', () => {
  test('should render tab labels correctly', () => {
    render(
      <Tabs>
        <Tabs.List aria-label="Navigation tabs">
          <Tabs.Tab id="overview" label="Overview" />
          <Tabs.Tab id="details" label="Details" />
        </Tabs.List>
        <Tabs.Panel id="overview">Overview content</Tabs.Panel>
        <Tabs.Panel id="details">Details content</Tabs.Panel>
      </Tabs>,
    )

    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Details' })).toBeInTheDocument()
  })

  describe('Tab selection', () => {
    test('should have first tab selected by default', () => {
      render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const firstTab = screen.getByRole('tab', { name: 'Tab 1' })
      expect(firstTab).toHaveAttribute('aria-selected', 'true')
    })

    test('should display panel content for selected tab', () => {
      render(
        <Tabs defaultSelectedKey="overview">
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="overview" label="Overview" />
            <Tabs.Tab id="details" label="Details" />
          </Tabs.List>
          <Tabs.Panel id="overview">Overview content here</Tabs.Panel>
          <Tabs.Panel id="details">Details content here</Tabs.Panel>
        </Tabs>,
      )

      expect(screen.getByText('Overview content here')).toBeVisible()
      expect(screen.queryByText('Details content here')).not.toBeInTheDocument()
    })
  })

  describe('User interactions', () => {
    test('should switch tabs on click', async () => {
      const user = userEvent.setup()
      render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
      await user.click(tab2)

      expect(tab2).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByText('Content 2')).toBeVisible()
    })
  })

  describe('Controlled usage', () => {
    test('should display controlled selected tab', () => {
      render(
        <Tabs selectedKey="tab2">
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
      expect(tab2).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByText('Content 2')).toBeVisible()
    })
  })

  describe('Disabled state', () => {
    test('should have disabled attribute when isDisabled is true', () => {
      render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" isDisabled />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
      expect(tab2).toHaveAttribute('aria-disabled', 'true')
    })

    test('should disable all tabs with isDisabled prop on Tabs', () => {
      render(
        <Tabs isDisabled>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const tabs = screen.getAllByRole('tab')
      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute('aria-disabled', 'true')
      })
    })
  })

  describe('Behaviour prop', () => {
    test('should render with fill behaviour by default', () => {
      render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('data-behaviour', 'fill')
    })

    test('should render with left behaviour when specified', () => {
      render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs" behaviour="left">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('data-behaviour', 'left')
    })
  })

  describe('Accessibility', () => {
    test('should have accessible name from aria-label', () => {
      render(
        <Tabs>
          <Tabs.List aria-label="Main navigation">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const tablist = screen.getByRole('tablist', { name: 'Main navigation' })
      expect(tablist).toBeInTheDocument()
    })

    test('should support keyboard navigation with arrow keys', async () => {
      const user = userEvent.setup()
      render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' })

      await user.click(tab1)
      expect(tab1).toHaveFocus()

      await user.keyboard('{ArrowRight}')
      expect(tab2).toHaveFocus()
      expect(tab2).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('Custom props', () => {
    test('should accept className on Tab', () => {
      render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Tab 1" className="custom-tab" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
        </Tabs>,
      )

      const tab = screen.getByRole('tab', { name: 'Tab 1' })
      expect(tab).toHaveClass('custom-tab')
    })
  })

  describe('Text color states', () => {
    test('should apply primary color when tab is hovered', async () => {
      const user = userEvent.setup()
      render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
      const tabLabel = tab2.querySelector('span')

      await user.hover(tab2)

      expect(tabLabel).toHaveClass('content-primary')
    })

    test('should apply secondary color in default state (not selected, not hovered)', () => {
      render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
      const tabLabel = tab2.querySelector('span')

      expect(tabLabel).toHaveClass('content-secondary')
    })

    test('should apply disabled color when tab is disabled', () => {
      render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Tab 1" />
            <Tabs.Tab id="tab2" label="Tab 2" isDisabled />
          </Tabs.List>
          <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
          <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        </Tabs>,
      )

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
      const tabLabel = tab2.querySelector('span')

      expect(tabLabel).toHaveClass('content-disabled')
    })
  })
})
