import type { Meta, StoryObj } from '@storybook/react-vite'

import { BlockIcon, MailIcon, SettingsIcon } from '../icons'
import { Menu } from './Menu'

const meta: Meta<typeof Menu.Section> = {
  title: 'Components/Menu/Menu.Section',
  component: Menu.Section,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Menu.Section represents a group of related menu items within a [Menu](./?path=/docs/components-menu-menu--docs).',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional section title displayed above the items',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    children: {
      control: false,
      description: 'Menu.Item(s) and Menu.Divider(s) within the section',
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
    id: {
      control: 'text',
      description: 'Unique identifier for the section',
      table: {
        type: { summary: 'Key' },
      },
    },
    items: {
      control: false,
      description:
        'An array of items for dynamic menus within this section. Pass a render function as children to iterate over them.',
      table: {
        type: { summary: 'Iterable<T>' },
        category: 'Dynamic Menu',
      },
    },
    dependencies: {
      control: false,
      description:
        'Values that invalidate the item cache when using dynamic menus.',
      table: {
        type: { summary: 'ReadonlyArray<any>' },
        category: 'Dynamic Menu',
      },
    },
  },
  decorators: [
    (Story) => (
      <Menu aria-label="Example menu">
        <Story />
      </Menu>
    ),
  ],
} satisfies Meta<typeof Menu.Section>

export default meta
type Story = StoryObj<typeof Menu.Section>

export const Single: Story = {
  args: {
    title: 'Account',
    children: (
      <>
        <Menu.Item leadingIcon={<BlockIcon />} title="Option 1" />
        <Menu.Item leadingIcon={<SettingsIcon />} title="Option 2" />
      </>
    ),
  },
}

export const Multiple: Story = {
  render: () => (
    <>
      <Menu.Section title="Account">
        <Menu.Item leadingIcon={<BlockIcon />} title="Option 1" />
        <Menu.Item leadingIcon={<SettingsIcon />} title="Option 2" />
      </Menu.Section>
      <Menu.Section title="Actions">
        <Menu.Item leadingIcon={<MailIcon />} title="Option 3" />
        <Menu.Item leadingIcon={<BlockIcon />} title="Option 4" />
      </Menu.Section>
    </>
  ),
}
