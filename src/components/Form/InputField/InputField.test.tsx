import { announce } from '@react-aria/live-announcer'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { SearchIcon } from '@/components/icons'

import { InputField } from '.'

vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
}))

describe('InputField Component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
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

  describe('Size variants', () => {
    test('should render small size by default', () => {
      const { container } = render(<InputField label="Field" />)
      const textField = container.firstElementChild
      expect(textField?.className).toContain('small')
    })

    test('should render medium size', () => {
      const { container } = render(<InputField label="Field" size="medium" />)
      const textField = container.firstElementChild
      expect(textField?.className).toContain('medium')
    })

    test('should render large size', () => {
      const { container } = render(<InputField label="Field" size="large" />)
      const textField = container.firstElementChild
      expect(textField?.className).toContain('large')
    })
  })

  describe('Required state', () => {
    test('should display required indicator when isRequired is true', () => {
      render(<InputField label="Email" isRequired />)
      expect(screen.getByText('*')).toBeVisible()
    })

    test('should not display required indicator when isRequired is false', () => {
      render(<InputField label="Email" />)
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    test('should mark the input as required', () => {
      render(<InputField label="Email" isRequired />)
      const input = screen.getByRole('textbox')
      expect(input).toBeRequired()
    })
  })

  describe('Leading and trailing content', () => {
    test('should render leading content', () => {
      render(
        <InputField
          label="Search"
          leading={<SearchIcon aria-hidden data-testid="leading-icon" />}
        />,
      )
      expect(screen.getByTestId('leading-icon')).toBeVisible()
    })

    test('should render trailing content', () => {
      render(
        <InputField
          label="Search"
          trailing={<SearchIcon aria-hidden data-testid="trailing-icon" />}
        />,
      )
      expect(screen.getByTestId('trailing-icon')).toBeVisible()
    })

    test('should render both leading and trailing content', () => {
      render(
        <InputField
          label="Search"
          leading={<SearchIcon aria-hidden data-testid="leading" />}
          trailing={<SearchIcon aria-hidden data-testid="trailing" />}
        />,
      )
      expect(screen.getByTestId('leading')).toBeVisible()
      expect(screen.getByTestId('trailing')).toBeVisible()
    })
  })

  describe('Helper text', () => {
    test('should display helper text', () => {
      render(<InputField label="Email" helperText="Enter a valid email" />)
      expect(screen.getByText('Enter a valid email')).toBeVisible()
    })

    test('should replace helper text with error message when error is set', () => {
      render(
        <InputField
          label="Email"
          helperText="Enter a valid email"
          error="This field is required"
        />,
      )
      expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument()
      expect(screen.getByText('This field is required')).toBeVisible()
    })

    test('should keep helper text when error is boolean true', () => {
      render(
        <InputField
          label="Email"
          helperText="Enter a valid email"
          error={true}
        />,
      )
      expect(screen.getByText('Enter a valid email')).toBeVisible()
    })
  })

  describe('Character count', () => {
    test('should display character count when maxLength is set', () => {
      render(<InputField label="Username" maxLength={20} />)
      expect(screen.getByText('0/20')).toBeVisible()
    })

    test('should update character count on user input', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<InputField label="Username" maxLength={20} />)
      const input = screen.getByRole('textbox')

      await user.type(input, 'hello')

      expect(screen.getByText('5/20')).toBeVisible()
    })

    test('should display character count with defaultValue', () => {
      render(<InputField label="Username" maxLength={20} defaultValue="test" />)
      expect(screen.getByText('4/20')).toBeVisible()
    })

    test('should display character count with controlled value', () => {
      render(<InputField label="Username" maxLength={20} value="controlled" />)
      expect(screen.getByText('10/20')).toBeVisible()
    })

    test('should set maxlength attribute on input', () => {
      render(<InputField label="Username" maxLength={20} />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('maxlength', '20')
    })

    test('should display alongside helper text', () => {
      render(
        <InputField
          label="Username"
          maxLength={20}
          helperText="Choose a username"
        />,
      )
      expect(screen.getByText('0/20')).toBeVisible()
      expect(screen.getByText('Choose a username')).toBeVisible()
    })
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

    test('should update value on user input', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<InputField label="Email" defaultValue="" />)
      const input = screen.getByRole('textbox')

      await user.type(input, 'New value')

      expect(input).toHaveValue('New value')
    })

    test('should trigger onChange callback', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const handleChange = vi.fn()
      render(<InputField label="Email" onChange={handleChange} />)
      const input = screen.getByRole('textbox')

      await user.type(input, 't')

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Controlled usage', () => {
    test('should display controlled value', () => {
      render(<InputField label="Email" value="Controlled value" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Controlled value')
    })

    test('should update value when provided value is changed', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

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

      await user.type(input, 'Updated')

      expect(input).toHaveValue('Updated')
    })

    test('should not update value when provided value is unchanged', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<InputField label="Email" value="Fixed" />)
      const input = screen.getByRole('textbox')

      await user.type(input, 'New value')

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
  test('should re-announce the same error message when triggered repeatedly', () => {
    const { rerender } = render(
      <InputField label="Email" error="This field is required" />,
    )

    expect(announce).toHaveBeenCalledTimes(1)
    expect(announce).toHaveBeenLastCalledWith(
      'This field is required',
      'polite',
    )

    rerender(<InputField label="Email" error={undefined} />)

    rerender(<InputField label="Email" error="This field is required" />)

    expect(announce).toHaveBeenCalledTimes(2)
    expect(announce).toHaveBeenLastCalledWith(
      'This field is required',
      'polite',
    )
  })
  test('should remove error state and attributes when error is cleared', () => {
    const { rerender } = render(
      <InputField label="Email" error="Invalid email" />,
    )

    const input = screen.getByRole('textbox')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Invalid email')).toBeInTheDocument()

    rerender(<InputField label="Email" error={undefined} />)

    expect(input).not.toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByText('Invalid email')).not.toBeInTheDocument()
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
