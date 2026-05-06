import type { Meta, StoryObj } from '@storybook/react-vite'

import { BlockIcon, MailIcon, SettingsIcon } from '../icons'
import { Menu } from './Menu'

const meta: Meta<typeof Menu.Item> = {
  title: 'Components/Menu/Menu.Item',
  component: Menu.Item,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Menu.Item represents an individual actionable item within a [Menu](./?path=/docs/components-menu-menu--docs).',
      },
    },
  },
  argTypes: {
    isDisabled: {
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    onAction: {
      action: 'action',
      table: {
        type: { summary: '() => void' },
        category: 'Behaviour',
      },
    },
    title: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    leadingIcon: {
      control: false,
      table: {
        type: { summary: 'ReactElement' },
        category: 'Content',
      },
    },
    description: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    id: {
      control: 'text',
      table: {
        type: { summary: 'Key' },
      },
    },
    href: {
      control: 'text',
      description: 'An href attribute to render the item as a link.',
      table: {
        type: { summary: 'string' },
        category: 'Link',
      },
    },
    target: {
      control: 'text',
      description:
        'An href target attribute when the item is rendered as a link (e.g. "_blank")',
      table: {
        type: { summary: 'string' },
        category: 'Link',
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
  args: {
    title: 'Menu Item',
  },
} satisfies Meta<typeof Menu.Item>

export default meta
type Story = StoryObj<typeof Menu.Item>

export const Default: Story = {
  args: {
    title: 'Menu Item',
  },
}

export const WithIcon: Story = {
  args: {
    leadingIcon: <BlockIcon />,
    title: 'Profile',
  },
}

export const WithDescription: Story = {
  args: {
    leadingIcon: <SettingsIcon />,
    description: 'View and edit your profile',
    title: 'Profile',
  },
}

export const Disabled: Story = {
  args: {
    leadingIcon: <MailIcon />,
    description: 'Read your messages',
    title: 'Messages',
    isDisabled: true,
  },
}

export const AsLink: Story = {
  args: {
    leadingIcon: <BlockIcon />,
    title: 'Profile',
    href: '/profile',
  },
}
