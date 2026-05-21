import { parseDate } from '@internationalized/date'
import { announce } from '@react-aria/live-announcer'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { DateRangePicker } from '.'

vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
}))

const LABEL = 'Date range'
const MOCK_START_DATE = parseDate('2026-03-16')
const MOCK_END_DATE = parseDate('2026-05-10')
const MOCK_DATA_INVALID = 'data-invalid'

describe('DateRangePicker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
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
    test('should display required indicator when isRequired is true', () => {
      render(<DateRangePicker label="Date range" isRequired />)
      expect(screen.getByText('*')).toBeVisible()
    })

    test('should not display required indicator when isRequired is false', () => {
      render(<DateRangePicker label="Date range" />)
      expect(screen.queryByText('*')).not.toBeInTheDocument()
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
})
