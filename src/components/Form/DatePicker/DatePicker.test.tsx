import { parseDate } from '@internationalized/date'
import { announce } from '@react-aria/live-announcer'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { DatePicker } from '.'

vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
}))

const ROOT_TESTID = 'datepicker-root'

const MOCK_START_DATE = '2026-03-16'

const ERROR_REQUIRED = 'This field is required'
const ATTR_INVALID = 'data-invalid'

describe('DatePicker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should render with label', () => {
    render(<DatePicker label="Date" />)
    expect(screen.getByText('Date')).toBeVisible()
  })

  test('should render the date picker group', () => {
    render(<DatePicker label="Date" />)
    expect(screen.getByRole('group')).toBeVisible()
  })

  test('should associate label with the date picker', () => {
    render(<DatePicker label="Date" />)
    expect(screen.getByRole('group', { name: 'Date' })).toBeVisible()
  })

  test('should support custom aria-label', () => {
    render(<DatePicker aria-label="Pick a date" />)
    expect(screen.getByLabelText('Pick a date')).toBeVisible()
  })

  describe('Required state', () => {
    test('should display required indicator when isRequired is true', () => {
      render(<DatePicker label="Date" isRequired />)
      expect(screen.getByText('*')).toBeVisible()
    })

    test('should not display required indicator when isRequired is false', () => {
      render(<DatePicker label="Date" />)
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })
  })

  describe('Disabled state', () => {
    test('should render disabled state', () => {
      render(<DatePicker label="Date" isDisabled />)
      const datePicker = screen.getByRole('group', { name: 'Date' })
      expect(datePicker).toHaveAttribute('data-disabled')
    })

    test('should render disabled state with value', () => {
      render(
        <DatePicker
          label="Date"
          isDisabled
          defaultValue={parseDate(MOCK_START_DATE)}
          data-testid={ROOT_TESTID}
        />,
      )
      const datePickerRoot = screen.getByTestId(ROOT_TESTID)
      expect(datePickerRoot).toHaveAttribute('data-disabled')
    })
  })

  describe('Read-only state', () => {
    test('should render read-only state', () => {
      render(
        <DatePicker
          label="Date"
          isReadOnly
          defaultValue={parseDate(MOCK_START_DATE)}
          data-testid={ROOT_TESTID}
        />,
      )
      const datePickerRoot = screen.getByTestId(ROOT_TESTID)
      expect(datePickerRoot).toHaveAttribute('data-readonly')
    })
  })

  describe('Error handling', () => {
    test('should display error message', () => {
      render(<DatePicker label="Date" error="This field is required" />)
      expect(screen.getByText(ERROR_REQUIRED)).toBeVisible()
    })

    test('should set invalid state when error message is provided', () => {
      render(<DatePicker label="Date" error="Error" />)
      const datePicker = screen.getByRole('group', { name: 'Date' })
      expect(datePicker).toHaveAttribute(ATTR_INVALID)
    })

    test('should announce error message to screen readers', async () => {
      render(<DatePicker label="Date" error="This field is required" />)
      await waitFor(() => {
        expect(announce).toHaveBeenCalledWith(ERROR_REQUIRED, 'polite')
      })
    })

    test('should not announce when announceError is false', async () => {
      render(
        <DatePicker
          label="Date"
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
        <DatePicker
          label="Date"
          error="Critical error"
          announceError="assertive"
        />,
      )
      await waitFor(() => {
        expect(announce).toHaveBeenCalledWith('Critical error', 'assertive')
      })
    })

    test('should remove invalid state when error is cleared', () => {
      const { rerender } = render(
        <DatePicker
          label="Date"
          error="Invalid date"
          data-testid={ROOT_TESTID}
        />,
      )
      const datePickerRoot = screen.getByTestId(ROOT_TESTID)
      expect(datePickerRoot).toHaveAttribute(ATTR_INVALID)

      rerender(
        <DatePicker label="Date" error={undefined} data-testid={ROOT_TESTID} />,
      )
      expect(datePickerRoot).not.toHaveAttribute(ATTR_INVALID)
    })

    test('should re-announce the same error message when triggered repeatedly', async () => {
      const { rerender } = render(
        <DatePicker label="Date" error="This field is required" />,
      )
      await waitFor(() => {
        expect(announce).toHaveBeenCalledTimes(1)
      })

      rerender(<DatePicker label="Date" error={undefined} />)
      rerender(<DatePicker label="Date" error="This field is required" />)
      await waitFor(() => {
        expect(announce).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Value handling', () => {
    test('should display default value', () => {
      render(
        <DatePicker label="Date" defaultValue={parseDate(MOCK_START_DATE)} />,
      )
      expect(screen.getByText('3')).toBeVisible()
      expect(screen.getByText('16')).toBeVisible()
      expect(screen.getByText('2026')).toBeVisible()
    })

    test('should display controlled value', () => {
      render(<DatePicker label="Date" value={parseDate('2026-05-01')} />)
      expect(screen.getByText('5')).toBeVisible()
      expect(screen.getByText('1')).toBeVisible()
      expect(screen.getByText('2026')).toBeVisible()
    })

    test('should call onChange when value changes', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(
        <DatePicker
          label="Date"
          defaultValue={parseDate(MOCK_START_DATE)}
          onChange={handleChange}
        />,
      )

      const daySpinButton = screen.getByRole('spinbutton', { name: /day/i })
      await user.click(daySpinButton)
      await user.keyboard('{ArrowUp}')

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Calendar popup', () => {
    test('should open calendar when button is clicked', async () => {
      const user = userEvent.setup()
      render(<DatePicker label="Date" />)

      await user.click(screen.getByRole('button', { name: /calendar/i }))

      expect(screen.getByRole('dialog')).toBeVisible()
    })

    test('should show calendar grid when opened', async () => {
      const user = userEvent.setup()
      render(<DatePicker label="Date" />)

      await user.click(screen.getByRole('button', { name: /calendar/i }))

      expect(screen.getByRole('grid')).toBeVisible()
    })

    test('should show navigation buttons in calendar', async () => {
      const user = userEvent.setup()
      render(<DatePicker label="Date" />)

      await user.click(screen.getByRole('button', { name: /calendar/i }))

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Tooltip', () => {
    test('renders tooltip trigger when tooltip is provided', () => {
      render(
        <DatePicker
          label="Date"
          tooltip="Use the format DD/MM/YYYY"
          tooltipTriggerAriaLabel="More information"
        />,
      )
      expect(
        screen.getByRole('button', { name: 'More information' }),
      ).toBeVisible()
    })

    test('does not render tooltip trigger when tooltip is not provided', () => {
      render(<DatePicker label="Date" />)
      expect(
        screen.queryByRole('button', { name: 'More information' }),
      ).not.toBeInTheDocument()
    })

    test('throws when tooltip is provided without label', () => {
      expect(() => {
        render(
          <DatePicker
            tooltip="Use the format DD/MM/YYYY"
            tooltipTriggerAriaLabel="More information"
          />,
        )
      }).toThrow('DatePicker: tooltip requires label to be provided.')
    })

    test('throws when tooltip is provided without tooltipTriggerAriaLabel', () => {
      expect(() => {
        render(<DatePicker label="Date" tooltip="Use the format DD/MM/YYYY" />)
      }).toThrow(
        'DatePicker: tooltip requires tooltipTriggerAriaLabel to be provided.',
      )
    })
  })
})
