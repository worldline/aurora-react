import { announce } from '@react-aria/live-announcer'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

import { InputField } from '.'

vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
}))

describe('InputField Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should render with placeholder', () => {
    render(<InputField label="Email" placeholder="Enter your email" />)
    const input = screen.getByPlaceholderText('Enter your email')
    expect(input).toBeVisible()
  })

  test('should have correct role', () => {
    render(<InputField label="Email" />)
    const input = screen.getByRole('textbox')
    expect(input).toBeVisible()
  })

  test('should associate label with input', () => {
    render(<InputField label="Email" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveRole('textbox')
  })

  test('should support custom aria-label', () => {
    render(<InputField aria-label="Custom label" />)
    const input = screen.getByLabelText('Custom label')
    expect(input).toHaveRole('textbox')
  })

  describe('Error handling', () => {
    test('should display error message', () => {
      render(<InputField label="Email" error="This field is required" />)
      const errorMessage = getErrorMessage()
      expect(errorMessage).toBeVisible()
      expect(errorMessage).toHaveTextContent('This field is required')
    })

    test('should have aria-invalid when error message is provided', () => {
      render(<InputField label="Email" error="Error" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    test('should have aria-invalid when error is true', () => {
      render(<InputField label="Email" error={true} />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    test('should announce error message to screen readers', () => {
      render(<InputField label="Email" error="This field is required" />)
      expect(announce).toHaveBeenCalledWith('This field is required', 'polite')
    })

    test('should not announce when announceError is false', () => {
      render(
        <InputField
          label="Email"
          error="This field is required"
          announceError={false}
        />,
      )
      expect(announce).not.toHaveBeenCalled()
    })

    test('should announce with assertive priority when specified', () => {
      render(
        <InputField
          label="Email"
          error="Critical error"
          announceError="assertive"
        />,
      )
      expect(announce).toHaveBeenCalledWith('Critical error', 'assertive')
    })
  })

  describe('Uncontrolled usage', () => {
    test('should accept defaultValue', () => {
      render(<InputField label="Email" defaultValue="Initial value" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Initial value')
    })

    test('should update value on user input', () => {
      render(<InputField label="Email" defaultValue="" />)
      const input = screen.getByRole('textbox')

      fireEvent.change(input, { target: { value: 'New value' } })

      expect(input).toHaveValue('New value')
    })

    test('should trigger onChange callback', () => {
      const handleChange = vi.fn()
      render(<InputField label="Email" onChange={handleChange} />)
      const input = screen.getByRole('textbox')

      fireEvent.change(input, { target: { value: 'test' } })

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Controlled usage', () => {
    test('should display controlled value', () => {
      render(<InputField label="Email" value="Controlled value" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Controlled value')
    })

    test('should update value when provided value is changed', () => {
      const ControlledInput = () => {
        const [value, setValue] = useState('')

        return (
          <InputField
            label="Email"
            value={value}
            onChange={(newValue) => {
              setValue(newValue)
            }}
          />
        )
      }

      render(<ControlledInput />)
      const input = screen.getByRole('textbox')

      expect(input).toHaveValue('')

      fireEvent.change(input, { target: { value: 'Updated' } })

      expect(input).toHaveValue('Updated')
    })

    test('should not update value when provided value is unchanged', () => {
      render(<InputField label="Email" value="Fixed" />)
      const input = screen.getByRole('textbox')

      fireEvent.change(input, { target: { value: 'New value' } })

      expect(input).toHaveValue('Fixed')
    })
  })

  describe('Read-only state', () => {
    test('should have readonly attribute when isReadOnly is true', () => {
      render(<InputField label="Email" isReadOnly={true} />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('readonly', '')
    })

    test('should not have readonly attribute when isReadOnly is false', () => {
      render(<InputField label="Email" isReadOnly={false} />)
      const input = screen.getByRole('textbox')
      expect(input).not.toHaveAttribute('readonly')
    })

    test('should display default value in read-only mode', () => {
      render(
        <InputField
          label="Email"
          defaultValue="Read-only content"
          isReadOnly={true}
        />,
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Read-only content')
    })

    test('should display value in read-only mode', () => {
      render(
        <InputField
          label="Email"
          value="Read-only content"
          isReadOnly={true}
        />,
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Read-only content')
    })
  })

  describe('Disabled state', () => {
    test('should have disabled attribute when isDisabled is true', () => {
      render(<InputField label="Email" isDisabled={true} />)
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    test('should not have disabled attribute when isDisabled is false', () => {
      render(<InputField label="Email" isDisabled={false} />)
      const input = screen.getByRole('textbox')
      expect(input).not.toBeDisabled()
    })

    test('should display default value when disabled', () => {
      render(
        <InputField
          label="Email"
          defaultValue="Disabled content"
          isDisabled={true}
        />,
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Disabled content')
    })

    test('should display value when disabled', () => {
      render(
        <InputField label="Email" value="Disabled content" isDisabled={true} />,
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Disabled content')
    })
  })

  test('should default to text type attribute', () => {
    render(<InputField label="Field" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'text')
  })

  test('should accept type attribute', () => {
    render(<InputField label="Email" type="email" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })

  test('should accept inputMode attribute', () => {
    render(<InputField label="Amount" inputMode="numeric" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('inputmode', 'numeric')
  })

  test('should accept autoComplete attribute', () => {
    render(<InputField label="Email" autoComplete="email" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })

  test('should accept maxLength attribute', () => {
    render(<InputField label="Username" maxLength={20} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('maxlength', '20')
  })

  test('should accept minLength attribute', () => {
    render(<InputField label="Password" minLength={8} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('minlength', '8')
  })

  test('should accept pattern attribute', () => {
    render(<InputField label="Code" pattern="[0-9]{4}" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('pattern', '[0-9]{4}')
  })

  const getErrorMessage = () => {
    const input = screen.getByRole('textbox')
    const errorId = input.getAttribute('aria-describedby')
    if (!errorId) {
      throw new Error(
        'Input should have aria-describedby attribute when error message is provided',
      )
    }
    return document.getElementById(errorId)
  }
})
