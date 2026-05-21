import { parseDate } from '@internationalized/date'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { DateRangePicker } from '.'

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/Form/DateRangePicker',
  component: DateRangePicker,
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
      description: 'Size of the date range picker',
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
      description: 'Label text for the date range picker',
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
      description: 'Whether the date range picker is disabled',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Whether the date range picker is read-only',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    isRequired: {
      control: 'boolean',
      description:
        'Whether the date range picker is required. Displays a * indicator next to the label.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
  },
  args: {
    label: 'Pick a date',
    calendarGridProps: { weekdayStyle: 'short' },
  },
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

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
    defaultValue: {
      start: parseDate('2026-03-16'),
      end: parseDate('2026-03-20'),
    },
  },
}

export const Required: Story = {
  args: {
    isRequired: true,
  },
}

export const ReadOnly: Story = {
  args: {
    defaultValue: {
      start: parseDate('2026-03-16'),
      end: parseDate('2026-03-20'),
    },
    isReadOnly: true,
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: {
      start: parseDate('2026-03-16'),
      end: parseDate('2026-03-20'),
    },
    isDisabled: true,
  },
}

export const WithErrorMessage: Story = {
  args: {
    error: 'This is an error message.',
  },
}

export const WithErrorAndValue: Story = {
  args: {
    defaultValue: {
      start: parseDate('2026-03-16'),
      end: parseDate('2026-03-20'),
    },
    error: 'This is an error message.',
  },
}

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    'aria-label': 'Pick a date range',
  },
}
