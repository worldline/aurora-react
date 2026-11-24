import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { announce } from '@react-aria/live-announcer'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { DateRangePicker, type DateRangePreset } from '.'

vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
}))

/** jsdom ships no `matchMedia`, so the viewport has to be faked outright. */
const stubViewport = ({ isMobile }: { isMobile: boolean }): void => {
  vi.stubGlobal(
    'matchMedia',
    (query: string): MediaQueryList =>
      ({
        matches: isMobile,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  )
}

const LABEL = 'Date range'
const MOCK_START_DATE = parseDate('2026-03-16')
const MOCK_END_DATE = parseDate('2026-05-10')
const MOCK_DATA_INVALID = 'data-invalid'

const MOCK_PRESETS: ReadonlyArray<DateRangePreset> = [
  { id: 'last-week', label: 'Last week', duration: { weeks: 1 } },
  { id: 'last-2-weeks', label: 'Last 2 weeks', duration: { weeks: 2 } },
  { id: 'last-month', label: 'Last month', duration: { months: 1 } },
  { id: 'last-3-months', label: 'Last 3 months', duration: { months: 3 } },
  { id: 'last-year', label: 'Last year', duration: { years: 1 } },
]

const MOCK_ACTIONS = {
  primaryAction: { label: 'Apply', onAction: vi.fn() },
  secondaryAction: { label: 'Reset to default', onAction: vi.fn() },
}

const MOCK_DEFAULT_PRESET: DateRangePreset = {
  id: 'last-month',
  label: 'Last month',
  duration: { months: 1 },
}

describe('DateRangePicker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('should render with label', () => {
    render(<DateRangePicker label="Date range" />)
    expect(screen.getByText(LABEL)).toBeVisible()
  })

  test('should render the date range picker group', () => {
    render(<DateRangePicker label="Date range" />)
    expect(screen.getByRole('group')).toBeVisible()
  })

  test('should associate label with the date range picker', () => {
    render(<DateRangePicker label="Date range" />)
    expect(screen.getByRole('group', { name: LABEL })).toBeVisible()
  })

  test('should support custom aria-label', () => {
    render(<DateRangePicker aria-label="Pick a date range" />)
    expect(screen.getByLabelText('Pick a date range')).toBeVisible()
  })

  describe('Required state', () => {
    test('should not display required indicator when only isRequired is true', () => {
      render(<DateRangePicker label="Date range" isRequired />)
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    test('should display required indicator when showRequiredMark is true and field is required', () => {
      render(
        <DateRangePicker
          label="Date range"
          isRequired
          showRequiredMark={true}
        />,
      )
      expect(screen.queryByText('*')).toBeInTheDocument()
    })

    test('should not display required indicator when isRequired is false', () => {
      render(<DateRangePicker label="Date range" />)
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    test('should append the optional label to the accessible name', () => {
      render(<DateRangePicker label="Date range" optionalLabel="optional" />)
      expect(
        screen.getByRole('group', { name: 'Date range (optional)' }),
      ).toBeVisible()
    })
  })

  describe('Disabled state', () => {
    test('should render disabled state', () => {
      const { container } = render(
        <DateRangePicker label="Date range" isDisabled />,
      )
      const dateRangePicker = container.firstElementChild
      expect(dateRangePicker).toHaveAttribute('data-disabled')
    })

    test('should render disabled state with value', () => {
      const { container } = render(
        <DateRangePicker
          label="Date range"
          isDisabled
          defaultValue={{
            start: MOCK_START_DATE,
            end: MOCK_END_DATE,
          }}
        />,
      )
      const dateRangePicker = container.firstElementChild
      expect(dateRangePicker).toHaveAttribute('data-disabled')
    })
  })

  describe('Read-only state', () => {
    test('should render read-only state', () => {
      const { container } = render(
        <DateRangePicker
          label="Date range"
          isReadOnly
          defaultValue={{
            start: MOCK_START_DATE,
            end: MOCK_END_DATE,
          }}
        />,
      )
      const dateRangePicker = container.firstElementChild
      expect(dateRangePicker).toHaveAttribute('data-readonly')
    })
  })

  describe('Error handling', () => {
    test('should display error message', () => {
      render(
        <DateRangePicker label="Date range" error="This field is required" />,
      )
      expect(screen.getByText('This field is required')).toBeVisible()
    })

    test('should set invalid state when error message is provided', () => {
      const { container } = render(
        <DateRangePicker label="Date range" error="Error" />,
      )
      const dateRangePicker = container.firstElementChild
      expect(dateRangePicker).toHaveAttribute(MOCK_DATA_INVALID)
    })

    test('should announce error message to screen readers', async () => {
      render(
        <DateRangePicker label="Date range" error="This field is required" />,
      )
      await waitFor(() => {
        expect(announce).toHaveBeenCalledWith(
          'This field is required',
          'polite',
        )
      })
    })

    test('should not announce when announceError is false', async () => {
      render(
        <DateRangePicker
          label="Date range"
          error="This field is required"
          announceError={false}
        />,
      )
      await waitFor(() => {
        expect(announce).not.toHaveBeenCalled()
      })
    })

    test('should announce with assertive priority when specified', async () => {
      render(
        <DateRangePicker
          label="Date range"
          error="Critical error"
          announceError="assertive"
        />,
      )
      await waitFor(() => {
        expect(announce).toHaveBeenCalledWith('Critical error', 'assertive')
      })
    })

    test('should remove invalid state when error is cleared', () => {
      const { container, rerender } = render(
        <DateRangePicker label="Date range" error="Invalid range" />,
      )
      const dateRangePicker = container.firstElementChild
      expect(dateRangePicker).toHaveAttribute(MOCK_DATA_INVALID)

      rerender(<DateRangePicker label="Date range" error={undefined} />)
      expect(dateRangePicker).not.toHaveAttribute(MOCK_DATA_INVALID)
    })

    test('should re-announce the same error message when triggered repeatedly', async () => {
      const { rerender } = render(
        <DateRangePicker label="Date range" error="This field is required" />,
      )
      await waitFor(() => {
        expect(announce).toHaveBeenCalledTimes(1)
      })

      rerender(<DateRangePicker label="Date range" error={undefined} />)
      rerender(
        <DateRangePicker label="Date range" error="This field is required" />,
      )
      await waitFor(() => {
        expect(announce).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Value handling', () => {
    test('should display default value', () => {
      render(
        <DateRangePicker
          label="Date range"
          defaultValue={{
            start: MOCK_START_DATE,
            end: MOCK_END_DATE,
          }}
        />,
      )
      expect(screen.getByText('16')).toBeVisible()
      expect(screen.getByText('10')).toBeVisible()
    })

    test('should display controlled value', () => {
      render(
        <DateRangePicker
          label="Date range"
          value={{
            start: parseDate('2026-05-01'),
            end: parseDate('2026-05-10'),
          }}
        />,
      )
      expect(screen.getByText('1')).toBeVisible()
      expect(screen.getByText('10')).toBeVisible()
    })

    test('should render two date inputs for start and end', () => {
      const { container } = render(<DateRangePicker label="Date range" />)
      const dateInputs = container.querySelectorAll('[class*="date-input"]')
      expect(dateInputs).toHaveLength(2)
    })

    test('should call onChange when value changes', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(
        <DateRangePicker
          label="Date range"
          defaultValue={{
            start: parseDate('2026-03-16'),
            end: parseDate('2026-03-20'),
          }}
          onChange={handleChange}
        />,
      )

      const daySpinButtons = screen.getAllByRole('spinbutton', { name: /day/i })
      await user.click(daySpinButtons[0])
      await user.keyboard('{ArrowUp}')

      expect(handleChange).toHaveBeenCalled()
    })

    test('should render separator between start and end inputs', () => {
      const { container } = render(<DateRangePicker label="Date range" />)
      const separator = container.querySelector('[class*="separator"]')
      expect(separator).toBeVisible()
    })
  })

  describe('Calendar popup', () => {
    test('should open calendar when button is clicked', async () => {
      const user = userEvent.setup()
      render(<DateRangePicker label="Date range" />)

      await user.click(screen.getByRole('button', { name: /calendar/i }))

      expect(screen.getByRole('dialog')).toBeVisible()
    })

    test('should show calendar grid when opened', async () => {
      const user = userEvent.setup()
      render(<DateRangePicker label="Date range" />)

      await user.click(screen.getByRole('button', { name: /calendar/i }))

      expect(screen.getByRole('grid')).toBeVisible()
    })
  })

  describe('Without label', () => {
    test('should render without label when none provided', () => {
      render(<DateRangePicker aria-label="Pick a date range" />)
      expect(screen.queryByText(LABEL)).not.toBeInTheDocument()
    })
  })

  describe('Tooltip', () => {
    test('renders tooltip trigger when tooltip is provided', () => {
      render(
        <DateRangePicker
          label={LABEL}
          tooltip="Use the format DD/MM/YYYY"
          tooltipTriggerAriaLabel="More information"
        />,
      )
      expect(
        screen.getByRole('button', { name: 'More information' }),
      ).toBeVisible()
    })

    test('does not render tooltip trigger when tooltip is not provided', () => {
      render(<DateRangePicker label={LABEL} />)
      expect(
        screen.queryByRole('button', { name: 'More information' }),
      ).not.toBeInTheDocument()
    })

    test('throws when tooltip is provided without label', () => {
      expect(() => {
        render(
          <DateRangePicker
            tooltip="Use the format DD/MM/YYYY"
            tooltipTriggerAriaLabel="More information"
          />,
        )
      }).toThrow('DateRangePicker: tooltip requires label to be provided.')
    })

    test('throws when tooltip is provided without tooltipTriggerAriaLabel', () => {
      expect(() => {
        render(
          <DateRangePicker label={LABEL} tooltip="Use the format DD/MM/YYYY" />,
        )
      }).toThrow(
        'DateRangePicker: tooltip requires tooltipTriggerAriaLabel to be provided.',
      )
    })

    test('throws when actions are provided without defaultPreset', () => {
      expect(() => {
        render(
          <DateRangePicker
            aria-label={LABEL}
            triggerAriaLabel="Select date range"
            actions={MOCK_ACTIONS}
          />,
        )
      }).toThrow(
        'DateRangePicker: actions requires defaultPreset to be provided.',
      )
    })
  })

  describe('Composite mode (desktop)', () => {
    beforeEach(() => {
      stubViewport({ isMobile: false })
    })

    test('should render trigger button with preset text', () => {
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
        />,
      )
      expect(screen.getByText('Last month')).toBeVisible()
    })

    test('should render up/down arrow icon on trigger', () => {
      const { container } = render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
        />,
      )
      const triggerIcon = container.querySelector('[class*="trigger-icon"]')
      expect(triggerIcon).toBeInTheDocument()
    })

    test('should open popover with presets when trigger is clicked', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )

      expect(
        screen.getByRole('listbox', { name: 'Date range presets' }),
      ).toBeVisible()
    })

    test('should display all preset options', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          triggerText="Select range"
          triggerAriaLabel="Select date range"
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )

      for (const preset of MOCK_PRESETS) {
        expect(screen.getByRole('option', { name: preset.label })).toBeVisible()
      }
    })

    test('should mark selected preset with aria-selected', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )

      expect(
        screen.getByRole('option', { name: 'Last month', selected: true }),
      ).toBeVisible()
      expect(
        screen.getByRole('option', { name: 'Last week', selected: false }),
      ).toBeVisible()
    })

    test('should call onPresetSelect when a preset is clicked', async () => {
      const user = userEvent.setup()
      const handlePresetSelect = vi.fn()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          onPresetSelect={handlePresetSelect}
          triggerText="Last month"
          triggerAriaLabel="Select date range"
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )
      await user.click(screen.getByRole('option', { name: 'Last week' }))

      expect(handlePresetSelect).toHaveBeenCalledWith('last-week')
    })

    test('should render action buttons when actions are provided', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
          actions={MOCK_ACTIONS}
          defaultPreset={MOCK_DEFAULT_PRESET}
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )

      expect(screen.getByRole('button', { name: 'Apply' })).toBeVisible()
      expect(
        screen.getByRole('button', { name: 'Reset to default' }),
      ).toBeVisible()
    })

    test('should call primaryAction.onAction when Apply is clicked', async () => {
      const user = userEvent.setup()
      const primaryOnAction = vi.fn()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
          actions={{
            primaryAction: { label: 'Apply', onAction: primaryOnAction },
            secondaryAction: {
              label: 'Reset to default',
              onAction: vi.fn(),
            },
          }}
          defaultPreset={MOCK_DEFAULT_PRESET}
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )
      await user.click(screen.getByRole('button', { name: 'Apply' }))

      expect(primaryOnAction).toHaveBeenCalledOnce()
    })

    test('should call secondaryAction.onAction when Reset is clicked', async () => {
      const user = userEvent.setup()
      const secondaryOnAction = vi.fn()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
          actions={{
            primaryAction: { label: 'Apply', onAction: vi.fn() },
            secondaryAction: {
              label: 'Reset to default',
              onAction: secondaryOnAction,
            },
          }}
          defaultPreset={MOCK_DEFAULT_PRESET}
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )
      await user.click(screen.getByRole('button', { name: 'Reset to default' }))

      expect(secondaryOnAction).toHaveBeenCalledOnce()
    })

    test('should toggle trigger aria-expanded state', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
        />,
      )

      const triggerButton = screen.getByRole('button', {
        name: 'Select date range',
      })
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false')

      await user.click(triggerButton)
      expect(triggerButton).toHaveAttribute('aria-expanded', 'true')
    })

    test('should show formatted date range on trigger when no triggerText is provided', () => {
      stubViewport({ isMobile: false })
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          triggerAriaLabel="Select date range"
          defaultValue={{
            start: parseDate('2026-08-01'),
            end: parseDate('2026-08-30'),
          }}
        />,
      )

      expect(screen.getByText('From 01/08/2026 to 30/08/2026')).toBeVisible()
    })

    test('should only commit value when Apply is clicked, not on calendar selection', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          triggerAriaLabel="Select date range"
          defaultValue={{
            start: parseDate('2026-08-01'),
            end: parseDate('2026-08-30'),
          }}
          onChange={handleChange}
          actions={{
            primaryAction: { label: 'Apply', onAction: () => undefined },
            secondaryAction: {
              label: 'Reset to default',
              onAction: () => undefined,
            },
          }}
          defaultPreset={MOCK_DEFAULT_PRESET}
        />,
      )

      expect(screen.getByText('From 01/08/2026 to 30/08/2026')).toBeVisible()

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )

      expect(handleChange).not.toHaveBeenCalled()

      await user.click(screen.getByRole('button', { name: 'Apply' }))

      expect(handleChange).toHaveBeenCalledOnce()
    })

    test('should reset to default preset range when Reset is clicked', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          triggerAriaLabel="Select date range"
          defaultValue={{
            start: parseDate('2026-08-01'),
            end: parseDate('2026-08-30'),
          }}
          onChange={handleChange}
          actions={{
            primaryAction: { label: 'Apply', onAction: () => undefined },
            secondaryAction: {
              label: 'Reset to default',
              onAction: () => undefined,
            },
          }}
          defaultPreset={MOCK_DEFAULT_PRESET}
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )

      await user.click(screen.getByRole('button', { name: 'Reset to default' }))

      const end = today(getLocalTimeZone())
      const start = end.subtract({ months: 1 })
      const expectedStart = `${String(start.day).padStart(2, '0')}/${String(start.month).padStart(2, '0')}/${String(start.year)}`
      const expectedEnd = `${String(end.day).padStart(2, '0')}/${String(end.month).padStart(2, '0')}/${String(end.year)}`

      expect(handleChange).toHaveBeenCalledOnce()
      expect(
        screen.getByText(`From ${expectedStart} to ${expectedEnd}`),
      ).toBeVisible()
    })
  })

  describe('Composite mode (mobile)', () => {
    beforeEach(() => {
      stubViewport({ isMobile: true })
    })

    test('should render trigger button on mobile viewport', () => {
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
          sheetTitle="Select date range"
          closeLabel="Close"
        />,
      )
      expect(
        screen.getByRole('button', { name: 'Select date range' }),
      ).toBeVisible()
    })

    test('should open bottom sheet with filter chips when trigger is clicked', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
          sheetTitle="Select date range"
          closeLabel="Close"
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )

      expect(screen.getByText('Select date range')).toBeVisible()
      expect(
        screen.getByRole('grid', { name: 'Date range presets' }),
      ).toBeVisible()
    })

    test('should display all preset labels as filter items in bottom sheet', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          triggerText="Select range"
          triggerAriaLabel="Select date range"
          sheetTitle="Select date range"
          closeLabel="Close"
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )

      for (const preset of MOCK_PRESETS) {
        expect(screen.getByText(preset.label)).toBeVisible()
      }
    })

    test('should render action buttons in bottom sheet', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
          sheetTitle="Select date range"
          closeLabel="Close"
          actions={MOCK_ACTIONS}
          defaultPreset={MOCK_DEFAULT_PRESET}
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )

      expect(screen.getByRole('button', { name: 'Apply' })).toBeVisible()
      expect(
        screen.getByRole('button', { name: 'Reset to default' }),
      ).toBeVisible()
    })

    test('should render calendar inside bottom sheet', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
          sheetTitle="Select date range"
          closeLabel="Close"
          calendarGridProps={{ weekdayStyle: 'short' }}
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )

      const grids = screen.getAllByRole('grid')
      expect(grids.length).toBeGreaterThanOrEqual(2)
    })

    test('should render close button in bottom sheet header', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          aria-label={LABEL}
          presets={MOCK_PRESETS}
          selectedPresetId="last-month"
          triggerText="Last month"
          triggerAriaLabel="Select date range"
          sheetTitle="Select date range"
          closeLabel="Close"
        />,
      )

      await user.click(
        screen.getByRole('button', { name: 'Select date range' }),
      )

      expect(screen.getByRole('button', { name: 'Close' })).toBeVisible()
    })
  })

  describe('Standard mode backward compatibility', () => {
    test('should render standard mode without presets', () => {
      render(<DateRangePicker label={LABEL} />)
      expect(screen.getByRole('group', { name: LABEL })).toBeVisible()
    })

    test('should still render two date inputs in standard mode', () => {
      const { container } = render(<DateRangePicker label={LABEL} />)
      const dateInputs = container.querySelectorAll('[class*="date-input"]')
      expect(dateInputs).toHaveLength(2)
    })

    test('should still render separator in standard mode', () => {
      const { container } = render(<DateRangePicker label={LABEL} />)
      const separator = container.querySelector('[class*="separator"]')
      expect(separator).toBeVisible()
    })
  })
})
