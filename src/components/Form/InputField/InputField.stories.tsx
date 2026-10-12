import type { Meta, StoryObj } from '@storybook/react-vite'

import { SearchIcon, WarningIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

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
      options: ['small', 'medium', 'large'],
      description: 'Size of the input field',
      table: {
        defaultValue: { summary: 'small' },
        type: { summary: "'small' | 'medium' | 'large'" },
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
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    maxLength: {
      control: 'number',
      description:
        'Maximum character length. When set, displays a character count below the input.',
      table: {
        type: { summary: 'number' },
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
    isRequired: {
      control: 'boolean',
      description:
        'Whether the input is required. Displays a * indicator next to the label.',
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

export const Large: Story = {
  args: {
    size: 'large',
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

export const Required: Story = {
  args: {
    label: 'Label',
    isRequired: true,
  },
}

export const WithLeadingIcon: Story = {
  args: {
    label: 'Search',
    leading: <SearchIcon aria-hidden size={24} />,
  },
}

export const WithTrailingIcon: Story = {
  args: {
    label: 'Search',
    trailing: <WarningIcon aria-hidden size={24} />,
  },
}

export const WithLeadingAndTrailing: Story = {
  args: {
    label: 'Label',
    leading: <SearchIcon aria-hidden size={24} />,
    trailing: <WarningIcon aria-hidden size={24} />,
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Label',
    helperText: 'This is a hint text to help user.',
  },
}

export const WithCharacterCount: Story = {
  args: {
    label: 'Label',
    maxLength: 20,
  },
}

export const WithHelperTextAndCharacterCount: Story = {
  args: {
    label: 'Label',
    helperText: 'This is a hint text to help user.',
    maxLength: 20,
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

export const WithErrorAndCharacterCount: Story = {
  args: {
    label: 'Label',
    error: 'This is an error message.',
    maxLength: 20,
    defaultValue: 'Some text',
  },
}

export const Currency: Story = {
  args: {
    type: 'currency',
    label: 'Amount',
    defaultValue: 1000,
    leading: (
      <Typography element="span" textStyle="bodyMd">
        EUR
      </Typography>
    ),
    formatOptions: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
}

export const CurrencyRequired: Story = {
  args: {
    type: 'currency',
    label: 'Amount',
    isRequired: true,
    defaultValue: 1000,
    leading: (
      <Typography element="span" textStyle="bodyMd">
        EUR
      </Typography>
    ),
    formatOptions: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
}

export const CurrencyWithHelperText: Story = {
  args: {
    type: 'currency',
    label: 'Amount',
    helperText: 'This is a hint text to help user.',
    defaultValue: 1000,
    leading: (
      <Typography element="span" textStyle="bodyMd">
        EUR
      </Typography>
    ),
    formatOptions: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
}

export const CurrencyWithTrailingIcon: Story = {
  args: {
    type: 'currency',
    label: 'Amount',
    defaultValue: 1000,
    leading: (
      <Typography element="span" textStyle="bodyMd">
        EUR
      </Typography>
    ),
    trailing: <SearchIcon aria-hidden size={24} />,
    formatOptions: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
}

export const CurrencyWithError: Story = {
  args: {
    type: 'currency',
    label: 'Amount',
    error: 'Amount is required',
    leading: (
      <Typography element="span" textStyle="bodyMd">
        EUR
      </Typography>
    ),
    formatOptions: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
}

export const CurrencyDisabled: Story = {
  args: {
    type: 'currency',
    label: 'Amount',
    isDisabled: true,
    defaultValue: 500,
    leading: (
      <Typography element="span" textStyle="bodyMd">
        EUR
      </Typography>
    ),
    formatOptions: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
}

export const CurrencyReadOnly: Story = {
  args: {
    type: 'currency',
    label: 'Amount',
    isReadOnly: true,
    defaultValue: 500,
    leading: (
      <Typography element="span" textStyle="bodyMd">
        EUR
      </Typography>
    ),
    formatOptions: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
}

export const CurrencyMedium: Story = {
  args: {
    type: 'currency',
    label: 'Amount',
    size: 'medium',
    defaultValue: 1000,
    leading: (
      <Typography element="span" textStyle="bodyMd">
        EUR
      </Typography>
    ),
    formatOptions: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
}

export const CurrencyLarge: Story = {
  args: {
    type: 'currency',
    label: 'Amount',
    size: 'large',
    defaultValue: 1000,
    leading: (
      <Typography element="span" textStyle="bodyMd">
        EUR
      </Typography>
    ),
    formatOptions: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
}
