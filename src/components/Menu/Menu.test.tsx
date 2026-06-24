import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Selection } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'

import { BlockIcon, SettingsIcon } from '../icons'
import { Menu } from './index'

describe('Menu', () => {
  describe('rendering static menus', () => {
    it('should render menu items', () => {
      render(
        <Menu aria-label="Actions">
          <Menu.Item title="Option 1" />
          <Menu.Item title="Option 2" />
        </Menu>,
      )

      expect(screen.getByRole('menu')).toBeInTheDocument()
      expect(
        screen.getByRole('menuitem', { name: 'Option 1' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('menuitem', { name: 'Option 2' }),
      ).toBeInTheDocument()
    })

    it('should render menu items with icons', () => {
      render(
        <Menu aria-label="Actions">
          <Menu.Item leadingIcon={<BlockIcon />} title="Option 1" />
          <Menu.Item leadingIcon={<SettingsIcon />} title="Option 2" />
        </Menu>,
      )

      expect(
        screen.getByRole('menuitem', { name: 'Option 1' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('menuitem', { name: 'Option 2' }),
      ).toBeInTheDocument()
    })

    it('should render menu items with descriptions', () => {
      render(
        <Menu aria-label="Actions">
          <Menu.Item description="Description 1" title="Option 1" />
          <Menu.Item description="Description 2" title="Option 2" />
        </Menu>,
      )

      expect(screen.getByText('Description 1')).toBeInTheDocument()
      expect(screen.getByText('Description 2')).toBeInTheDocument()
    })

    it('should render menu header', () => {
      render(
        <Menu
          aria-label="Actions"
          header={
            <>
              <div>John Doe</div>
              <div>john@example.com</div>
            </>
          }
        >
          <Menu.Item title="Option 1" />
        </Menu>,
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    it('should render menu sections', () => {
      render(
        <Menu aria-label="Actions">
          <Menu.Section title="Section 1">
            <Menu.Item title="Option 1" />
            <Menu.Item title="Option 2" />
          </Menu.Section>
          <Menu.Section title="Section 2">
            <Menu.Item title="Option 3" />
          </Menu.Section>
        </Menu>,
      )

      expect(
        screen.getByRole('group', { name: 'Section 1' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('group', { name: 'Section 2' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('menuitem', { name: 'Option 1' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('menuitem', { name: 'Option 2' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('menuitem', { name: 'Option 3' }),
      ).toBeInTheDocument()
    })
  })

  describe('rendering dynamic menus', () => {
    it('should render items from an array', () => {
      const items = [
        { id: 'option1', title: 'Option 1' },
        { id: 'option2', title: 'Option 2' },
      ]

      render(
        <Menu aria-label="Actions" items={items}>
          {(item) => <Menu.Item key={item.id} title={item.title} />}
        </Menu>,
      )

      expect(
        screen.getByRole('menuitem', { name: 'Option 1' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('menuitem', { name: 'Option 2' }),
      ).toBeInTheDocument()
    })

    it('should render menu sections from an array', () => {
      const sections = [
        {
          id: 'section1',
          title: 'Section 1',
          items: [
            { id: 'option1', title: 'Option 1' },
            { id: 'option2', title: 'Option 2' },
          ],
        },
        {
          id: 'section2',
          title: 'Section 2',
          items: [{ id: 'option3', title: 'Option 3' }],
        },
      ]

      render(
        <Menu aria-label="Actions" items={sections}>
          {(section) => (
            <Menu.Section
              key={section.id}
              title={section.title}
              items={section.items}
            >
              {(item) => <Menu.Item key={item.id} title={item.title} />}
            </Menu.Section>
          )}
        </Menu>,
      )

      expect(
        screen.getByRole('group', { name: 'Section 1' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('group', { name: 'Section 2' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('menuitem', { name: 'Option 1' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('menuitem', { name: 'Option 2' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('menuitem', { name: 'Option 3' }),
      ).toBeInTheDocument()
    })
  })

  describe('actions', () => {
    it('should call onAction when menu item is pressed', async () => {
      const user = userEvent.setup()
      const onAction = vi.fn()

      render(
        <Menu aria-label="Actions" onAction={onAction}>
          <Menu.Item id="option1" title="Option 1" />
          <Menu.Item id="option2" title="Option 2" />
        </Menu>,
      )

      await user.click(screen.getByRole('menuitem', { name: 'Option 1' }))
      expect(onAction).toHaveBeenCalledWith('option1', undefined)

      await user.click(screen.getByRole('menuitem', { name: 'Option 2' }))
      expect(onAction).toHaveBeenCalledWith('option2', undefined)
    })
  })

  describe('selection', () => {
    it('should support single selection mode', async () => {
      const user = userEvent.setup()

      render(
        <Menu aria-label="Options" selectionMode="single">
          <Menu.Item id="option1" title="Option 1" />
          <Menu.Item id="option2" title="Option 2" />
          <Menu.Item id="option3" title="Option 3" />
        </Menu>,
      )

      const option1 = screen.getByRole('menuitemradio', { name: 'Option 1' })
      const option2 = screen.getByRole('menuitemradio', { name: 'Option 2' })

      expect(option1).toHaveAttribute('aria-checked', 'false')
      expect(option2).toHaveAttribute('aria-checked', 'false')

      await user.click(option1)
      expect(option1).toHaveAttribute('aria-checked', 'true')

      await user.click(option2)
      expect(option1).toHaveAttribute('aria-checked', 'false')
      expect(option2).toHaveAttribute('aria-checked', 'true')
    })

    it('should support multiple selection mode', async () => {
      const user = userEvent.setup()

      render(
        <Menu aria-label="Options" selectionMode="multiple">
          <Menu.Item id="option1" title="Option 1" />
          <Menu.Item id="option2" title="Option 2" />
        </Menu>,
      )

      const option1 = screen.getByRole('menuitemcheckbox', { name: 'Option 1' })
      const option2 = screen.getByRole('menuitemcheckbox', { name: 'Option 2' })

      expect(option1).toHaveAttribute('aria-checked', 'false')
      expect(option2).toHaveAttribute('aria-checked', 'false')

      await user.click(option1)
      expect(option1).toHaveAttribute('aria-checked', 'true')
      expect(option2).toHaveAttribute('aria-checked', 'false')

      await user.click(option2)
      expect(option1).toHaveAttribute('aria-checked', 'true')
      expect(option2).toHaveAttribute('aria-checked', 'true')
    })

    it('should support uncontrolled selection with defaultSelectedKeys', () => {
      render(
        <Menu
          aria-label="Options"
          defaultSelectedKeys={['option2']}
          selectionMode="single"
        >
          <Menu.Item id="option1" title="Option 1" />
          <Menu.Item id="option2" title="Option 2" />
          <Menu.Item id="option3" title="Option 3" />
        </Menu>,
      )

      expect(
        screen.getByRole('menuitemradio', { name: 'Option 1' }),
      ).toHaveAttribute('aria-checked', 'false')
      expect(
        screen.getByRole('menuitemradio', { name: 'Option 2' }),
      ).toHaveAttribute('aria-checked', 'true')
      expect(
        screen.getByRole('menuitemradio', { name: 'Option 3' }),
      ).toHaveAttribute('aria-checked', 'false')
    })

    it('should support controlled selection with selectedKeys and onSelectionChange', async () => {
      const user = userEvent.setup()
      const onSelectionChange = vi.fn<(keys: Selection) => void>()

      render(
        <Menu
          aria-label="Options"
          selectedKeys={['option1']}
          selectionMode="single"
          onSelectionChange={onSelectionChange}
        >
          <Menu.Item id="option1" title="Option 1" />
          <Menu.Item id="option2" title="Option 2" />
        </Menu>,
      )

      expect(
        screen.getByRole('menuitemradio', { name: 'Option 1' }),
      ).toHaveAttribute('aria-checked', 'true')
      expect(
        screen.getByRole('menuitemradio', { name: 'Option 2' }),
      ).toHaveAttribute('aria-checked', 'false')

      await user.click(screen.getByRole('menuitemradio', { name: 'Option 2' }))
      expect(onSelectionChange).toHaveBeenCalledTimes(1)
      const selectionArg = onSelectionChange.mock.calls[0]?.[0]
      expect(Array.from(selectionArg)).toEqual(['option2'])
    })

    it('should prevent deselecting all items when disallowEmptySelection is true', async () => {
      const user = userEvent.setup()

      render(
        <Menu
          aria-label="Options"
          defaultSelectedKeys={['option1']}
          disallowEmptySelection
          selectionMode="single"
        >
          <Menu.Item id="option1" title="Option 1" />
          <Menu.Item id="option2" title="Option 2" />
        </Menu>,
      )

      const option1 = screen.getByRole('menuitemradio', { name: 'Option 1' })

      expect(option1).toHaveAttribute('aria-checked', 'true')

      await user.click(option1)
      expect(option1).toHaveAttribute('aria-checked', 'true')
    })
  })

  describe('links', () => {
    it('renders menu items as links when href is provided', () => {
      render(
        <Menu aria-label="Navigation">
          <Menu.Item href="/option1" title="Option 1" />
          <Menu.Item href="/option2" title="Option 2" />
        </Menu>,
      )

      const option1Link = screen.getByRole('menuitem', { name: 'Option 1' })
      const option2Link = screen.getByRole('menuitem', { name: 'Option 2' })

      expect(option1Link.tagName).toBe('A')
      expect(option2Link.tagName).toBe('A')
      expect(option1Link).toHaveAttribute('href', '/option1')
      expect(option2Link).toHaveAttribute('href', '/option2')
    })
  })

  describe('disabled items', () => {
    it('should disable individual items with isDisabled prop', () => {
      render(
        <Menu aria-label="Actions">
          <Menu.Item title="Option 1" />
          <Menu.Item isDisabled title="Option 2" />
        </Menu>,
      )

      const option1Item = screen.getByRole('menuitem', { name: 'Option 1' })
      const option2Item = screen.getByRole('menuitem', { name: 'Option 2' })

      expect(option1Item).not.toHaveAttribute('aria-disabled')
      expect(option2Item).toHaveAttribute('aria-disabled', 'true')
    })

    it('should disable items by key with disabledKeys prop', () => {
      render(
        <Menu aria-label="Actions" disabledKeys={['option2', 'option3']}>
          <Menu.Item id="option1" title="Option 1" />
          <Menu.Item id="option2" title="Option 2" />
          <Menu.Item id="option3" title="Option 3" />
        </Menu>,
      )

      expect(
        screen.getByRole('menuitem', { name: 'Option 1' }),
      ).not.toHaveAttribute('aria-disabled')
      expect(
        screen.getByRole('menuitem', { name: 'Option 2' }),
      ).toHaveAttribute('aria-disabled', 'true')
      expect(
        screen.getByRole('menuitem', { name: 'Option 3' }),
      ).toHaveAttribute('aria-disabled', 'true')
    })

    it('should not call onAction for disabled items', async () => {
      const user = userEvent.setup()
      const onAction = vi.fn()

      render(
        <Menu aria-label="Actions" onAction={onAction}>
          <Menu.Item id="option1" title="Option 1" />
          <Menu.Item id="option2" isDisabled title="Option 2" />
        </Menu>,
      )

      await user.click(screen.getByRole('menuitem', { name: 'Option 2' }))
      expect(onAction).not.toHaveBeenCalled()

      await user.click(screen.getByRole('menuitem', { name: 'Option 1' }))
      expect(onAction).toHaveBeenCalledWith('option1', undefined)
    })
  })
})
