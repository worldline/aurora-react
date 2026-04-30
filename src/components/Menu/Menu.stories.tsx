import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/Button'
import { SettingsIcon, MailIcon, BlockIcon } from '@/components/icons'
import { Popover } from '@/components/Popover'
import { Typography } from '@/components/Typography'

import { Menu } from './index'

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    header: {
      control: false,
      description: 'Optional header content displayed at the top of the menu.',
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
    children: {
      control: false,
      description:
        'Menu items, sections, and dividers. Use [Menu.Item](./?path=/docs/components-menu-menu-item--docs), [Menu.Section](./?path=/docs/components-menu-menu-section--docs), and Menu.Divider components.',
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
    items: {
      control: false,
      description:
        'An array of items for dynamic menus. Pass a render function as children to iterate over them.',
      table: {
        type: { summary: 'Iterable<T>' },
        category: 'Dynamic Menu',
      },
    },
    dependencies: {
      control: false,
      description:
        'Values that invalidate the item cache when using a dynamic menu.',
      table: {
        type: { summary: 'ReadonlyArray<any>' },
        category: 'Dynamic Menu',
      },
    },
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
      description: 'The type of selection that is allowed in the menu.',
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: "'none' | 'single' | 'multiple'" },
        category: 'Selection',
      },
    },
    onAction: {
      action: 'action',
      description:
        'Handler called when a menu item is selected. Receives the item id.',
      table: {
        type: { summary: '(key: Key) => void' },
        category: 'Selection',
      },
    },
    defaultSelectedKeys: {
      control: 'object',
      description:
        'The initial selected keys (uncontrolled). Items must have an id prop and selectionMode must be set.',
      table: {
        type: { summary: 'Iterable<Key>' },
        category: 'Selection',
      },
    },
    selectedKeys: {
      control: 'object',
      description:
        'The currently selected keys (controlled). Use with onSelectionChange.',
      table: {
        type: { summary: 'Iterable<Key>' },
        category: 'Selection',
      },
    },
    onSelectionChange: {
      action: 'selectionChange',
      description:
        'Handler called when the selection changes. Receives a Set of selected keys.',
      table: {
        type: { summary: '(keys: Selection) => void' },
        category: 'Selection',
      },
    },
    shouldCloseOnSelect: {
      control: 'boolean',
      description:
        'Whether the menu should close when an item is selected. Defaults to false for selection menus.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Selection',
      },
    },
    disallowEmptySelection: {
      control: 'boolean',
      description:
        'Whether the menu should prevent the user from deselecting all items.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Selection',
      },
    },
    disabledKeys: {
      control: 'object',
      description:
        'A set of keys for items that are disabled. These items cannot be selected or pressed.',
      table: {
        type: { summary: 'Iterable<Key>' },
        category: 'Behaviour',
      },
    },
    'aria-label': {
      control: 'text',
      table: {
        category: 'Accessibility',
      },
    },
    shouldFocusWrap: {
      control: 'boolean',
      description:
        'Whether keyboard focus should wrap around when navigating with arrow keys.',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
        category: 'Accessibility',
      },
    },
  },
  args: {
    'aria-label': 'Menu',
  },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof Menu>

export const ActionMenu: Story = {
  args: {
    children: (
      <>
        <Menu.Item leadingIcon={<BlockIcon />} title="Option 1" />
        <Menu.Item leadingIcon={<SettingsIcon />} title="Option 2" />
        <Menu.Item leadingIcon={<MailIcon />} title="Option 3" />
        <Menu.Divider />
        <Menu.Item leadingIcon={<BlockIcon />} title="Option 4" />
      </>
    ),
  },
}

export const ActionMenuWithDescriptions: Story = {
  args: {
    children: (
      <>
        <Menu.Item
          leadingIcon={<BlockIcon />}
          title="Option 1"
          description="Description for option 1"
        />
        <Menu.Item
          leadingIcon={<SettingsIcon />}
          title="Option 2"
          description="Description for option 2"
        />
        <Menu.Item
          leadingIcon={<MailIcon />}
          title="Option 3"
          description="Description for option 3"
        />
      </>
    ),
  },
}

export const ActionMenuWithHeader: Story = {
  args: {
    header: (
      <>
        <Typography element="p" textStyle="titleSm">
          Firstname Lastname
        </Typography>
        <Typography
          element="p"
          textStyle="captionMd"
          textColor="contentTertiary"
        >
          email@address.com
        </Typography>
      </>
    ),
    children: (
      <>
        <Menu.Item leadingIcon={<BlockIcon />} title="Option 1" />
        <Menu.Item leadingIcon={<SettingsIcon />} title="Option 2" />
        <Menu.Item leadingIcon={<MailIcon />} title="Option 3" />
        <Menu.Divider />
        <Menu.Item leadingIcon={<BlockIcon />} title="Option 4" />
      </>
    ),
  },
}

export const ActionMenuWithSections: Story = {
  args: {
    children: (
      <>
        <Menu.Section title="Section 1">
          <Menu.Item leadingIcon={<BlockIcon />} title="Option 1" />
          <Menu.Item leadingIcon={<SettingsIcon />} title="Option 2" />
        </Menu.Section>
        <Menu.Section title="Section 2">
          <Menu.Item leadingIcon={<MailIcon />} title="Option 3" />
          <Menu.Item leadingIcon={<BlockIcon />} title="Option 4" />
        </Menu.Section>
      </>
    ),
  },
}

export const ActionMenuWithHeaderAndSections: Story = {
  args: {
    header: (
      <>
        <Typography element="p" textStyle="titleSm">
          Firstname Lastname
        </Typography>
        <Typography
          element="p"
          textStyle="captionMd"
          textColor="contentTertiary"
        >
          email@address.com
        </Typography>
      </>
    ),
    children: (
      <>
        <Menu.Section title="Section 1">
          <Menu.Item leadingIcon={<BlockIcon />} title="Option 1" />
          <Menu.Item leadingIcon={<SettingsIcon />} title="Option 2" />
        </Menu.Section>
        <Menu.Section title="Section 2">
          <Menu.Item leadingIcon={<MailIcon />} title="Option 3" />
          <Menu.Item leadingIcon={<BlockIcon />} title="Option 4" />
        </Menu.Section>
      </>
    ),
  },
}

export const SelectionMenu: Story = {
  args: {
    selectionMode: 'single',
    children: (
      <>
        <Menu.Item title="Option 1" />
        <Menu.Item title="Option 2" />
        <Menu.Item title="Option 3" />
        <Menu.Item title="Option 4" />
        <Menu.Item title="Option 5" />
      </>
    ),
  },
}

export const SelectionMenuWithDefaults: Story = {
  args: {
    selectionMode: 'single',
    defaultSelectedKeys: ['2', '4'],
    children: (
      <>
        <Menu.Item title="Option 1" />
        <Menu.Item id="2" title="Option 2" />
        <Menu.Item title="Option 3" />
        <Menu.Item id="4" title="Option 4" />
        <Menu.Item title="Option 5" />
      </>
    ),
  },
}

export const SelectionMenuWithSections: Story = {
  args: {
    selectionMode: 'single',
    children: (
      <>
        <Menu.Section title="Section 1">
          <Menu.Item title="Option 1" />
          <Menu.Item title="Option 2" />
        </Menu.Section>
        <Menu.Section title="Section 2">
          <Menu.Item title="Option 3" />
          <Menu.Item title="Option 4" />
          <Menu.Item title="Option 5" />
        </Menu.Section>
      </>
    ),
  },
}

export const SelectionMenuWithDisallowEmptySelection: Story = {
  name: 'Selection Menu (disallow empty selection)',
  args: {
    selectionMode: 'single',
    defaultSelectedKeys: ['option2'],
    disallowEmptySelection: true,
    children: (
      <>
        <Menu.Item id="option1" title="Option 1" />
        <Menu.Item id="option2" title="Option 2" />
        <Menu.Item id="option3" title="Option 3" />
      </>
    ),
  },
}

export const LinksMenu: Story = {
  args: {
    'aria-label': 'Navigation menu',
    children: (
      <>
        <Menu.Item
          href="/option-1"
          leadingIcon={<BlockIcon />}
          title="Option 1"
        />
        <Menu.Item
          href="/option-2"
          leadingIcon={<SettingsIcon />}
          title="Option 2"
        />
        <Menu.Item
          href="/option-3"
          target="_blank"
          leadingIcon={<MailIcon />}
          title="Option 3 (in new tab)"
        />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Menu items can act as links by providing an `href` prop. This renders them as anchor elements with proper navigation behavior.',
      },
    },
  },
}

export const DynamicMenu: Story = {
  render: () => (
    <Menu
      aria-label="Dynamic menu"
      items={[
        {
          id: 'option1',
          leadingIcon: <BlockIcon />,
          title: 'Option 1',
          description: 'Description for option 1',
        },
        {
          id: 'option2',
          leadingIcon: <BlockIcon />,
          title: 'Option 2',
          description: 'Description for option 2',
        },
        {
          id: 'option3',
          leadingIcon: <BlockIcon />,
          title: 'Option 3',
          description: 'Description for option 3',
        },
      ]}
    >
      {(item) => (
        <Menu.Item
          key={item.id}
          leadingIcon={item.leadingIcon}
          title={item.title}
          description={item.description}
        />
      )}
    </Menu>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A dynamic menu should be used when you need to load external data (e.g. from an API) for the items or sections. Pass an array of items and a render function as children to render them.',
      },
    },
  },
}

export const DisabledItems: Story = {
  args: {
    children: (
      <>
        <Menu.Item leadingIcon={<BlockIcon />} title="Option 1" />
        <Menu.Item leadingIcon={<SettingsIcon />} title="Option 2" isDisabled />
        <Menu.Item leadingIcon={<MailIcon />} title="Option 3" />
      </>
    ),
  },
}

export const DisabledKeys: Story = {
  args: {
    disabledKeys: ['option2', 'option3'],
    children: (
      <>
        <Menu.Item id="option1" leadingIcon={<BlockIcon />} title="Option 1" />
        <Menu.Item
          id="option2"
          leadingIcon={<SettingsIcon />}
          title="Option 2"
        />
        <Menu.Item id="option3" leadingIcon={<MailIcon />} title="Option 3" />
      </>
    ),
  },
}

export const LongText: Story = {
  args: {
    header: (
      <>
        <Typography element="p" textStyle="titleSm">
          A very long title that should be truncated with ellipsis
        </Typography>
        <Typography
          element="p"
          textStyle="captionMd"
          textColor="contentTertiary"
        >
          A very long subtitle that should be truncated with ellipsis
        </Typography>
      </>
    ),
    children: (
      <>
        <Menu.Item
          leadingIcon={<BlockIcon />}
          title="Very long option 1 text that should truncate with ellipsis"
          description="A very long description for option 1 that should be truncated with ellipsis"
        />
        <Menu.Item
          leadingIcon={<SettingsIcon />}
          title="Another extremely long option 2 label that exceeds the container width"
        />
        <Menu.Item leadingIcon={<MailIcon />} title="Option 3" />
      </>
    ),
  },
}

export const InPopover: Story = {
  render: () => (
    <>
      <Menu.Trigger>
        <Button variant="primary">Open menu</Button>
        <Popover placement="bottom end">
          <Menu aria-label="Menu">
            <Menu.Item leadingIcon={<BlockIcon />} title="Option 1" />
            <Menu.Item leadingIcon={<SettingsIcon />} title="Option 2" />
            <Menu.Item leadingIcon={<MailIcon />} title="Option 3" />
            <Menu.Divider />
            <Menu.Item leadingIcon={<BlockIcon />} title="Option 4" />
          </Menu>
        </Popover>
      </Menu.Trigger>
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Menu can be used inside a Popover for positioning. See the [Popover documentation](./?path=/docs/components-popover--docs) for more examples on different trigger patterns and positioning options.',
      },
    },
  },
}
