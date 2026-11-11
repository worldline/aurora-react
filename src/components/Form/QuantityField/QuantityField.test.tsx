import { announce } from '@react-aria/live-announcer'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, test, vi } from 'vitest'

import { QuantityField, type QuantityFieldProps } from '.'

vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
}))

const quantityFieldLabels = {
  decrementAriaLabel: 'Decrease quantity',
  incrementAriaLabel: 'Increase quantity',
}

describe('QuantityField', () => {
  test('requires translated button labels in its public props', () => {
    // @ts-expect-error Both button labels must be supplied by the consumer.
    const quantityFieldWithoutButtonLabels: QuantityFieldProps = {
      'aria-label': 'Quantity',
    }

    expect(quantityFieldWithoutButtonLabels).toBeDefined()
  })

  test('renders an editable labelled spinbutton with its value', () => {
    render(
      <QuantityField
        aria-label="Quantity"
        defaultValue={2}
        {...quantityFieldLabels}
      />,
    )

    const quantityInput = screen.getByRole('spinbutton', { name: 'Quantity' })

    expect(quantityInput).toHaveValue('2')
    expect(quantityInput).toHaveAttribute('aria-valuenow', '2')
  })

  test('associates the label and required state with the spinbutton without showing the required mark', () => {
    render(
      <QuantityField
        label="Number of terminals"
        isRequired
        defaultValue={2}
        {...quantityFieldLabels}
      />,
    )

    expect(
      screen.getByRole('spinbutton', { name: 'Number of terminals' }),
    ).toBeRequired()
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  test('shows the required mark when showRequiredMark is set on a required field', () => {
    render(
      <QuantityField
        label="Number of terminals"
        isRequired
        showRequiredMark
        defaultValue={2}
        {...quantityFieldLabels}
      />,
    )

    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })

  test('appends the optional label to the spinbutton accessible name', () => {
    render(
      <QuantityField
        label="Number of terminals"
        optionalLabel="optional"
        defaultValue={2}
        {...quantityFieldLabels}
      />,
    )

    expect(
      screen.getByRole('spinbutton', {
        name: 'Number of terminals (optional)',
      }),
    ).not.toBeRequired()
  })

  test('uses helper text as the spinbutton description', () => {
    render(
      <QuantityField
        aria-label="Quantity"
        helperText="Enter the number of terminals you need"
        {...quantityFieldLabels}
      />,
    )

    expect(
      screen.getByRole('spinbutton', {
        name: 'Quantity',
        description: 'Enter the number of terminals you need',
      }),
    ).toBeVisible()
  })

  test('announces and displays a supplied error message', () => {
    render(
      <QuantityField
        aria-label="Quantity"
        defaultValue={2}
        error="Could not update quantity"
        helperText="Enter the number of terminals you need"
        {...quantityFieldLabels}
      />,
    )

    expect(
      screen.getByRole('spinbutton', {
        name: 'Quantity',
        description: 'Could not update quantity',
      }),
    ).toHaveAttribute('aria-invalid', 'true')
    expect(
      screen.queryByText('Enter the number of terminals you need'),
    ).not.toBeInTheDocument()
    expect(announce).toHaveBeenCalledWith('Could not update quantity', 'polite')
  })

  test('increments and decrements with its buttons and arrow keys', async () => {
    const user = userEvent.setup()
    render(
      <QuantityField
        aria-label="Quantity"
        defaultValue={2}
        {...quantityFieldLabels}
      />,
    )

    const quantityInput = screen.getByRole('spinbutton', { name: 'Quantity' })
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }))
    await user.click(quantityInput)
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowDown}')

    expect(quantityInput).toHaveValue('3')
    expect(quantityInput).toHaveAttribute('aria-valuenow', '3')
  })

  test('accepts a manually typed quantity', async () => {
    const user = userEvent.setup()
    render(
      <QuantityField
        aria-label="Quantity"
        defaultValue={2}
        {...quantityFieldLabels}
      />,
    )

    const quantityInput = screen.getByRole('spinbutton', { name: 'Quantity' })
    await user.clear(quantityInput)
    await user.type(quantityInput, '12')
    await user.tab()

    expect(quantityInput).toHaveValue('12')
    expect(quantityInput).toHaveAttribute('aria-valuenow', '12')
  })

  test.each([
    { expectedQuantity: 1, minValue: 1, scenario: 'a positive minimum' },
    { expectedQuantity: 0, minValue: 0, scenario: 'a zero minimum' },
    { expectedQuantity: 0, minValue: -1, scenario: 'a negative minimum' },
    { expectedQuantity: 0, scenario: 'no minimum' },
  ])(
    'normalizes an empty quantity after blur to $expectedQuantity with $scenario',
    async ({ expectedQuantity, minValue }) => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <QuantityField
          aria-label="Quantity"
          defaultValue={2}
          minValue={minValue}
          onChange={onChange}
          {...quantityFieldLabels}
        />,
      )

      const quantityInput = screen.getByRole('spinbutton', { name: 'Quantity' })
      await user.clear(quantityInput)
      await user.tab()

      expect(quantityInput).toHaveValue(String(expectedQuantity))
      expect(quantityInput).toHaveAttribute(
        'aria-valuenow',
        String(expectedQuantity),
      )
      expect(onChange).toHaveBeenLastCalledWith(expectedQuantity)
    },
  )

  test('normalizes an empty controlled quantity after blur', async () => {
    const user = userEvent.setup()
    const ControlledQuantityField = () => {
      const [quantity, setQuantity] = useState<number>(2)

      return (
        <QuantityField
          aria-label="Quantity"
          minValue={1}
          onChange={setQuantity}
          value={quantity}
          {...quantityFieldLabels}
        />
      )
    }

    render(<ControlledQuantityField />)

    const quantityInput = screen.getByRole('spinbutton', { name: 'Quantity' })
    await user.clear(quantityInput)
    await user.tab()

    expect(quantityInput).toHaveValue('1')
    expect(quantityInput).toHaveAttribute('aria-valuenow', '1')
  })

  test('uses consumer-provided labels for quantity buttons', () => {
    render(
      <QuantityField
        aria-label="Quantity"
        {...{
          decrementAriaLabel: 'Decrease number of terminals',
          incrementAriaLabel: 'Increase number of terminals',
        }}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Decrease number of terminals' }),
    ).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Increase number of terminals' }),
    ).toBeVisible()
  })

  test('disables the matching action at the configured bounds', () => {
    const { rerender } = render(
      <QuantityField
        aria-label="Quantity"
        value={1}
        minValue={1}
        maxValue={3}
        {...quantityFieldLabels}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Decrease quantity' }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Increase quantity' }),
    ).toBeEnabled()

    rerender(
      <QuantityField
        aria-label="Quantity"
        value={3}
        minValue={1}
        maxValue={3}
        {...quantityFieldLabels}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Increase quantity' }),
    ).toBeDisabled()
  })

  test('widens the control for every formatted maximum-quantity character beyond two', () => {
    render(
      <QuantityField
        aria-label="Quantity"
        defaultValue={1}
        minValue={1}
        maxValue={9999}
        {...quantityFieldLabels}
      />,
    )

    const quantityInput = screen.getByRole('spinbutton', { name: 'Quantity' })
    const quantityControl = quantityInput.parentElement

    expect(quantityControl).toHaveStyle('--quantity-field-character-count: 5')
    expect(quantityControl).toHaveStyle(
      '--quantity-field-extra-inline-size: 3ch',
    )
  })

  test('widens the control for the additional minus character in a negative minimum quantity', () => {
    render(
      <QuantityField
        aria-label="Quantity"
        defaultValue={0}
        minValue={-99}
        maxValue={99}
        {...quantityFieldLabels}
      />,
    )

    const quantityInput = screen.getByRole('spinbutton', { name: 'Quantity' })
    const quantityControl = quantityInput.parentElement

    expect(quantityControl).toHaveStyle('--quantity-field-character-count: 3')
    expect(quantityControl).toHaveStyle(
      '--quantity-field-extra-inline-size: 1ch',
    )
  })

  test('supports controlled quantity updates', async () => {
    const ControlledQuantityField = () => {
      const [quantity, setQuantity] = useState<number>(2)

      return (
        <QuantityField
          aria-label="Quantity"
          value={quantity}
          onChange={setQuantity}
          {...quantityFieldLabels}
        />
      )
    }
    const user = userEvent.setup()
    render(<ControlledQuantityField />)

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(
      '3',
    )
  })

  test('prevents edits when read-only or disabled', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <QuantityField
        aria-label="Quantity"
        defaultValue={2}
        isReadOnly
        {...quantityFieldLabels}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(
      '2',
    )

    rerender(
      <QuantityField
        aria-label="Quantity"
        defaultValue={2}
        isDisabled
        {...quantityFieldLabels}
      />,
    )

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Increase quantity' }),
    ).toBeDisabled()
  })
})
