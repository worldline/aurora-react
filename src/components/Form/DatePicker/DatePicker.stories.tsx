import { parseDate } from '@internationalized/date'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { DatePicker } from '.'

const meta: Meta<typeof DatePicker> = {
  title: 'Components/Form/DatePicker',
  component: DatePicker,
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
      description: 'Size of the date picker',
      table: {
        defaultValue: { summary: 'small' },
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
      description: 'Label text for the date picker',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    tooltip: {
      control: 'text',
      description: 'Text content for the tooltip shown next to the label',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    error: {
      control: 'text',
      description: 'Error message to display',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the date picker is disabled',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Whether the date picker is read-only',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    isRequired: {
      control: 'boolean',
      description:
        'Whether the date picker is required. Only affects accessibility and validation; use showRequiredMark to display the asterisk.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
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
  args: {
    label: 'Date',
    calendarGridProps: { weekdayStyle: 'short' },
    style: {
      minWidth: '200px',
    },
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Small: Story = {
  args: {
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: parseDate('2026-03-16'),
  },
}

export const Required: Story = {
  args: {
    isRequired: true,
    showRequiredMark: true,
  },
}

export const WithOptionalLabel: Story = {
  args: {
    optionalLabel: 'optional',
  },
}

export const ReadOnly: Story = {
  args: {
    defaultValue: parseDate('2026-03-16'),
    isReadOnly: true,
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: parseDate('2026-03-16'),
    isDisabled: true,
  },
}

export const WithTooltip: Story = {
  args: {
    tooltip: 'This is some additional information.',
    tooltipTriggerAriaLabel: 'More information',
  },
}

export const WithErrorMessage: Story = {
  args: {
    error: 'This is an error message.',
  },
}

export const WithErrorAndValue: Story = {
  args: {
    defaultValue: parseDate('2026-03-16'),
    error: 'This is an error message.',
  },
}

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    'aria-label': 'Pick a date',
  },
}
