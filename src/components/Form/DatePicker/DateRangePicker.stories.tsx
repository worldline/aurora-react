import { getLocalTimeZone, parseDate } from '@internationalized/date'
import type { RangeValue } from '@react-types/shared'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { DateValue } from 'react-aria-components'

import { DateRangePicker, type DateRangePreset } from '.'

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
        'Whether the date range picker is required. Only affects accessibility and validation; use showRequiredMark to display the asterisk.',
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
    showDateField: {
      control: 'boolean',
      description:
        'Whether to display the date field inputs inside the calendar popover. Only applies to the composite variant.',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
        category: 'Composite',
      },
    },
    presets: {
      description:
        'Array of preset date range options. When provided, renders the composite variant with a preset list (desktop) or filter chips (mobile).',
      table: {
        type: { summary: 'ReadonlyArray<DateRangePreset>' },
        category: 'Composite',
      },
    },
    actions: {
      description:
        'Action button configuration for the composite variant. When provided, renders primary and secondary action buttons. Requires defaultPreset.',
      table: {
        type: { summary: 'DateRangePickerActions' },
        category: 'Composite',
      },
    },
    defaultPreset: {
      description:
        'The preset applied when the secondary action (reset to default) is triggered. Required when actions are provided.',
      table: {
        type: { summary: 'DateRangePreset' },
        category: 'Composite',
      },
    },
    triggerAriaLabel: {
      control: 'text',
      description: 'Accessible label for the trigger button in composite mode.',
      table: {
        type: { summary: 'string' },
        category: 'Composite',
      },
    },
    formatRange: {
      description:
        'Custom formatter for the trigger button display text. Receives a RangeValue<DateValue> and returns a string. Defaults to "From DD/MM/YYYY to DD/MM/YYYY". Use this to apply locale-aware formatting via date-fns or Intl.DateTimeFormat.',
      table: {
        type: { summary: '(range: RangeValue<DateValue>) => string' },
        category: 'Composite',
      },
    },
    triggerText: {
      control: 'text',
      description:
        'The text displayed on the trigger button in composite mode.',
      table: {
        type: { summary: 'string' },
        category: 'Composite',
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

const PRESETS: Array<DateRangePreset> = [
  { id: 'last-week', label: 'Last week', duration: { weeks: 1 } },
  { id: 'last-2-weeks', label: 'Last 2 weeks', duration: { weeks: 2 } },
  { id: 'last-month', label: 'Last month', duration: { months: 1 } },
  { id: 'last-3-months', label: 'Last 3 months', duration: { months: 3 } },
  { id: 'last-year', label: 'Last year', duration: { years: 1 } },
]

const CompositeTemplate = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(
    'last-month',
  )

  return (
    <DateRangePicker
      aria-label="Date range"
      calendarGridProps={{ weekdayStyle: 'short' }}
      presets={PRESETS}
      selectedPresetId={selectedPresetId}
      onPresetSelect={setSelectedPresetId}
      triggerAriaLabel="Select date range"
      sheetTitle="Select date range"
      closeLabel="Close"
      defaultValue={{
        start: parseDate('2026-08-01'),
        end: parseDate('2026-08-30'),
      }}
      defaultPreset={{
        id: 'last-month',
        label: 'Last month',
        duration: { months: 1 },
      }}
      actions={{
        primaryAction: {
          label: 'Apply',
          onAction: () => undefined,
        },
        secondaryAction: {
          label: 'Reset to default',
          onAction: () => undefined,
        },
      }}
    />
  )
}

export const Composite: Story = {
  render: () => <CompositeTemplate />,
}

const CompositeDisabledTemplate = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(
    'last-month',
  )

  return (
    <DateRangePicker
      aria-label="Date range"
      calendarGridProps={{ weekdayStyle: 'short' }}
      presets={PRESETS}
      selectedPresetId={selectedPresetId}
      onPresetSelect={setSelectedPresetId}
      triggerAriaLabel="Select date range"
      sheetTitle="Select date range"
      closeLabel="Close"
      isDisabled
      defaultValue={{
        start: parseDate('2026-08-01'),
        end: parseDate('2026-08-30'),
      }}
      defaultPreset={{
        id: 'last-month',
        label: 'Last month',
        duration: { months: 1 },
      }}
      actions={{
        primaryAction: {
          label: 'Apply',
          onAction: () => undefined,
        },
        secondaryAction: {
          label: 'Reset to default',
          onAction: () => undefined,
        },
      }}
    />
  )
}

export const CompositeDisabled: Story = {
  render: () => <CompositeDisabledTemplate />,
}

const CompositeReadOnlyTemplate = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(
    'last-month',
  )

  return (
    <DateRangePicker
      aria-label="Date range"
      calendarGridProps={{ weekdayStyle: 'short' }}
      presets={PRESETS}
      selectedPresetId={selectedPresetId}
      onPresetSelect={setSelectedPresetId}
      triggerAriaLabel="Select date range"
      sheetTitle="Select date range"
      closeLabel="Close"
      isReadOnly
      defaultValue={{
        start: parseDate('2026-08-01'),
        end: parseDate('2026-08-30'),
      }}
      defaultPreset={{
        id: 'last-month',
        label: 'Last month',
        duration: { months: 1 },
      }}
      actions={{
        primaryAction: {
          label: 'Apply',
          onAction: () => undefined,
        },
        secondaryAction: {
          label: 'Reset to default',
          onAction: () => undefined,
        },
      }}
    />
  )
}

export const CompositeReadOnly: Story = {
  render: () => <CompositeReadOnlyTemplate />,
}

const CompositeWithoutDateFieldTemplate = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(
    'last-month',
  )

  return (
    <DateRangePicker
      aria-label="Date range"
      calendarGridProps={{ weekdayStyle: 'short' }}
      showDateField={false}
      presets={PRESETS}
      selectedPresetId={selectedPresetId}
      onPresetSelect={setSelectedPresetId}
      triggerAriaLabel="Select date range"
      sheetTitle="Select date range"
      closeLabel="Close"
      defaultValue={{
        start: parseDate('2026-08-01'),
        end: parseDate('2026-08-30'),
      }}
      defaultPreset={{
        id: 'last-month',
        label: 'Last month',
        duration: { months: 1 },
      }}
      actions={{
        primaryAction: {
          label: 'Apply',
          onAction: () => undefined,
        },
        secondaryAction: {
          label: 'Reset to default',
          onAction: () => undefined,
        },
      }}
    />
  )
}

export const CompositeWithoutDateField: Story = {
  render: () => <CompositeWithoutDateFieldTemplate />,
}

const CompositeWithoutActionsTemplate = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(
    'last-month',
  )

  return (
    <DateRangePicker
      aria-label="Date range"
      calendarGridProps={{ weekdayStyle: 'short' }}
      presets={PRESETS}
      selectedPresetId={selectedPresetId}
      onPresetSelect={setSelectedPresetId}
      triggerAriaLabel="Select date range"
      sheetTitle="Select date range"
      closeLabel="Close"
      defaultValue={{
        start: parseDate('2026-08-01'),
        end: parseDate('2026-08-30'),
      }}
    />
  )
}

export const CompositeWithoutActions: Story = {
  render: () => <CompositeWithoutActionsTemplate />,
}

const CompositeWithoutPresetsTemplate = () => (
  <DateRangePicker
    aria-label="Date range"
    calendarGridProps={{ weekdayStyle: 'short' }}
    triggerAriaLabel="Select date range"
    sheetTitle="Select date range"
    closeLabel="Close"
    defaultValue={{
      start: parseDate('2026-08-01'),
      end: parseDate('2026-08-30'),
    }}
    defaultPreset={{
      id: 'last-month',
      label: 'Last month',
      duration: { months: 1 },
    }}
    actions={{
      primaryAction: {
        label: 'Apply',
        onAction: () => undefined,
      },
      secondaryAction: {
        label: 'Reset to default',
        onAction: () => undefined,
      },
    }}
  />
)

export const CompositeWithoutPresets: Story = {
  render: () => <CompositeWithoutPresetsTemplate />,
}

const toJsDate = (dateValue: DateValue): Date =>
  dateValue.toDate(getLocalTimeZone())

const localeFormatRange =
  (locale: string) =>
  (range: RangeValue<DateValue>): string => {
    const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
    const from = formatter.format(toJsDate(range.start))
    const to = formatter.format(toJsDate(range.end))
    return `${from} – ${to}`
  }

const CompositeWithCustomFormatTemplate = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(
    'last-month',
  )

  return (
    <DateRangePicker
      aria-label="Date range"
      calendarGridProps={{ weekdayStyle: 'short' }}
      presets={PRESETS}
      selectedPresetId={selectedPresetId}
      onPresetSelect={setSelectedPresetId}
      formatRange={localeFormatRange('en-GB')}
      triggerAriaLabel="Select date range"
      sheetTitle="Select date range"
      closeLabel="Close"
      defaultValue={{
        start: parseDate('2026-08-01'),
        end: parseDate('2026-08-30'),
      }}
      defaultPreset={{
        id: 'last-month',
        label: 'Last month',
        duration: { months: 1 },
      }}
      actions={{
        primaryAction: {
          label: 'Apply',
          onAction: () => undefined,
        },
        secondaryAction: {
          label: 'Reset to default',
          onAction: () => undefined,
        },
      }}
    />
  )
}

/**
 * Demonstrates locale-aware date formatting via the `formatRange` prop.
 * The consuming app provides its own formatter — here using
 * `Intl.DateTimeFormat` with `en-GB` locale — keeping the component
 * library free of any date formatting dependency.
 */
export const CompositeWithCustomFormat: Story = {
  render: () => <CompositeWithCustomFormatTemplate />,
}
