import type { Meta, StoryObj } from '@storybook/react-vite'

import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs', 'stable'],
  parameters: {
    layout: 'centered',

    a11y: { test: 'error' },
  },

  args: {
    variant: 'info',
    children: 'Our support team is available 24/7 to assist you',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      table: {
        category: 'Appearance',
      },
    },

    title: {
      control: 'text',
      table: {
        category: 'Content',
      },
    },

    children: { control: 'text', table: { category: 'Content' } },

    onClose: {
      action: 'closed',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  args: {
    title: 'Need help?',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Need help?',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Need help?',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Need help?',
  },
}

export const Closable: Story = {
  args: {
    title: 'Need help?',
    onClose: () => ({}),
  },
}

export const WithoutTitle: Story = {
  args: {
    title: undefined,
  },
}

export const LongContent: Story = {
  args: {
    title: 'Need help?',
    children:
      'Our support team is available 24/7 to assist you. Please reach out to us anytime for support.',
  },
}

export const Playground: Story = {
  args: {
    variant: 'info',
    title: 'Need help?',
    children: 'Our support team is available 24/7 to assist you',
    onClose: () => ({}),
  },
}
