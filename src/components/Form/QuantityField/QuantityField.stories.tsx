import type { Meta, StoryObj } from '@storybook/react-vite'

import { QuantityField } from '.'

const meta: Meta<typeof QuantityField> = {
  title: 'Components/Form/QuantityField',
  component: QuantityField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    'aria-label': 'Quantity',
    decrementAriaLabel: 'Decrease quantity',
    defaultValue: 2,
    incrementAriaLabel: 'Increase quantity',
    minValue: 1,
    maxValue: 99,
  },
  argTypes: {
    minValue: {
      control: 'number',
      table: { category: 'Behaviour' },
    },
    maxValue: {
      control: 'number',
      table: { category: 'Behaviour' },
    },
    step: {
      control: 'number',
      table: { category: 'Behaviour' },
    },
    error: {
      control: 'text',
      table: { category: 'Validation' },
    },
    isDisabled: {
      control: 'boolean',
      table: { category: 'States' },
    },
    isReadOnly: {
      control: 'boolean',
      table: { category: 'States' },
    },
    isRequired: {
      control: 'boolean',
      table: { category: 'Behaviour' },
    },
    showRequiredMark: {
      control: 'boolean',
      description:
        'Shows an asterisk after the label. Only applies when isRequired is set.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    optionalLabel: {
      control: 'text',
      description:
        'Text appended in parentheses after the label, e.g. "optional" renders "Label (optional)". Not allowed together with isRequired.',
      table: {
        type: { summary: 'string' },
        category: 'Behaviour',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof QuantityField>

export const Filled: Story = {}

export const WithLabel: Story = {
  args: {
    label: 'Number of terminals',
  },
}

export const Required: Story = {
  args: {
    label: 'Number of terminals',
    isRequired: true,
    showRequiredMark: true,
  },
}

export const WithOptionalLabel: Story = {
  args: {
    label: 'Number of terminals',
    optionalLabel: 'optional',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Number of terminals',
    helperText: 'Enter the number of terminals you need.',
  },
}

export const Focused: Story = {
  args: {
    autoFocus: true,
  },
}

export const ReadOnly: Story = {
  args: {
    isReadOnly: true,
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
}

export const Error: Story = {
  args: {
    label: 'Number of terminals',
    error: 'Could not update quantity',
    helperText: 'Enter the number of terminals you need.',
  },
}

export const Minimum: Story = {
  args: {
    defaultValue: 1,
  },
}

export const Maximum: Story = {
  args: {
    defaultValue: 99,
  },
}

export const FourDigitMaximum: Story = {
  args: {
    defaultValue: 9999,
    maxValue: 9999,
  },
}

export const NegativeFourDigitMinimum: Story = {
  args: {
    defaultValue: -9999,
    minValue: -9999,
  },
}
