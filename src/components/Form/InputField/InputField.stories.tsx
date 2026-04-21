import type { Meta, StoryObj } from '@storybook/react-vite'

import { InputField } from '.'

const meta: Meta<typeof InputField> = {
  title: 'Components/Form/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    announceError: {
      table: {
        category: 'Accessibility',
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size of the input field',
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: "'small' | 'medium'" },
        category: 'Appearance',
      },
    },
    style: {
      table: {
        category: 'Appearance',
      },
    },
    className: {
      table: {
        category: 'Appearance',
      },
    },
    label: {
      control: 'text',
      description: 'Label text for the input field',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    error: {
      control: 'text',
      description: 'Error message to display',
      table: {
        type: { summary: 'string | boolean' },
        category: 'Content',
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Whether the input is read-only',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
  },
  args: {
    placeholder: 'Placeholder...',
    style: {
      maxWidth: '300px',
    },
  },
}

export default meta
type Story = StoryObj<typeof InputField>

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Label',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    label: 'Label',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Input value',
  },
}

export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Without visible label',
  },
}

export const ReadOnly: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Input value',
    isReadOnly: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Input value',
    isDisabled: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Label',
    error: true,
  },
}

export const WithErrorMessage: Story = {
  args: {
    label: 'Label',
    error: 'Error message',
  },
}
