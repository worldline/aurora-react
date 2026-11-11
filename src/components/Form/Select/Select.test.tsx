import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { Select, SelectItem } from '.'

vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
}))

const renderSelect = (props: Record<string, unknown> = {}) =>
  render(
    <Select aria-label="Test select" {...props}>
      <SelectItem id="opt-1">Option 1</SelectItem>
      <SelectItem id="opt-2">Option 2</SelectItem>
      <SelectItem id="opt-3">Option 3</SelectItem>
    </Select>,
  )

describe('Select', () => {
  test('should render with placeholder', () => {
    renderSelect()

    expect(screen.getByRole('button')).toHaveTextContent('Select an option')
  })

  test('should render with custom placeholder', () => {
    renderSelect({ placeholder: 'Pick one' })

    expect(screen.getByRole('button')).toHaveTextContent('Pick one')
  })

  test('should not render required indicator when only isRequired is true', () => {
    renderSelect({ label: 'Country', isRequired: true })

    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.queryByText('*', { exact: true })).not.toBeInTheDocument()
  })

  test('should render label without required indicator', () => {
    renderSelect({ label: 'Country' })

    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.queryByText('*', { exact: true })).not.toBeInTheDocument()
  })

  test('should append the optional label to the label', () => {
    renderSelect({
      'aria-label': undefined,
      label: 'Country',
      optionalLabel: 'optional',
    })

    expect(
      screen.getByRole('button', {
        name: 'Select an option Country (optional)',
      }),
    ).toBeVisible()
  })

  test('should open listbox on click', async () => {
    const user = userEvent.setup()
    renderSelect()

    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
  })

  test('should select an option', async () => {
    const user = userEvent.setup()
    const handleSelectionChange = vi.fn()
    renderSelect({ onSelectionChange: handleSelectionChange })

    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('option', { name: 'Option 2' }))

    expect(handleSelectionChange).toHaveBeenCalledWith('opt-2')
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Option 2')
    })
  })

  test('should render error message', () => {
    renderSelect({ error: 'Required field' })

    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  test('should render helper text', () => {
    renderSelect({ helperText: 'Choose your country' })

    expect(screen.getByText('Choose your country')).toBeInTheDocument()
  })

  test('should render leading content', () => {
    renderSelect({ leading: <span data-testid="leading-icon">icon</span> })

    expect(screen.getByTestId('leading-icon')).toBeInTheDocument()
  })

  test('should display summary when multiple options are selected from top', async () => {
    const user = userEvent.setup()
    render(
      <Select aria-label="Test select" selectionMode="multiple">
        <SelectItem id="opt-1">Option 1</SelectItem>
        <SelectItem id="opt-2">Option 2</SelectItem>
        <SelectItem id="opt-3">Option 3</SelectItem>
      </Select>,
    )

    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('option', { name: 'Option 1' }))
    await user.click(screen.getByRole('option', { name: 'Option 3' }))
    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Option 1, +1')
    })
  })
  test('should display summary when multiple options are selected from bottom', async () => {
    const user = userEvent.setup()
    render(
      <Select aria-label="Test select" selectionMode="multiple">
        <SelectItem id="opt-1">Option 1</SelectItem>
        <SelectItem id="opt-2">Option 2</SelectItem>
        <SelectItem id="opt-3">Option 3</SelectItem>
      </Select>,
    )

    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('option', { name: 'Option 3' }))
    await user.click(screen.getByRole('option', { name: 'Option 1' }))
    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Option 3, +1')
    })
  })

  test('should be disabled', async () => {
    const user = userEvent.setup()
    renderSelect({ isDisabled: true })

    const trigger = screen.getByRole('button')
    expect(trigger).toBeDisabled()

    await user.click(trigger)

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  describe('Tooltip', () => {
    test('renders tooltip trigger when tooltip is provided', () => {
      renderSelect({
        label: 'Country',
        tooltip: 'Pick your country of residence',
        tooltipTriggerAriaLabel: 'More information',
      })

      expect(
        screen.getByRole('button', { name: 'More information' }),
      ).toBeVisible()
    })

    test('does not render tooltip trigger when tooltip is not provided', () => {
      renderSelect({ label: 'Country' })

      expect(
        screen.queryByRole('button', { name: 'More information' }),
      ).not.toBeInTheDocument()
    })

    test('throws when tooltip is provided without label', () => {
      expect(() => {
        renderSelect({
          tooltip: 'Pick your country of residence',
          tooltipTriggerAriaLabel: 'More information',
        })
      }).toThrow('Select: tooltip requires label to be provided.')
    })

    test('throws when tooltip is provided without tooltipTriggerAriaLabel', () => {
      expect(() => {
        renderSelect({
          label: 'Country',
          tooltip: 'Pick your country of residence',
        })
      }).toThrow(
        'Select: tooltip requires tooltipTriggerAriaLabel to be provided.',
      )
    })

    test('should render required indicator when isRequired and showRequiredMark are true', () => {
      renderSelect({
        label: 'Country',
        isRequired: true,
        showRequiredMark: true,
      })

      expect(screen.getByText('Country')).toBeVisible()
      expect(screen.queryByText('*', { exact: true })).toBeInTheDocument()
    })
  })
})
