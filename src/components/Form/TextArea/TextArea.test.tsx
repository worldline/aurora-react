import { announce } from '@react-aria/live-announcer'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { TextArea } from '.'

vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
}))

describe('TextArea Component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  test('should render with placeholder', () => {
    render(<TextArea label="Comment" placeholder="Write content here ..." />)
    const textarea = screen.getByPlaceholderText('Write content here ...')
    expect(textarea).toBeVisible()
  })

  test('should have correct role', () => {
    render(<TextArea label="Comment" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeVisible()
  })

  test('should associate label with textarea', () => {
    render(<TextArea label="Comment" />)
    const textarea = screen.getByLabelText('Comment')
    expect(textarea).toHaveRole('textbox')
  })

  test('should support custom aria-label', () => {
    render(<TextArea aria-label="Custom label" />)
    const textarea = screen.getByLabelText('Custom label')
    expect(textarea).toHaveRole('textbox')
  })

  describe('Size variants', () => {
    test('should render small size by default', () => {
      const { container } = render(<TextArea label="Field" />)
      const textField = container.firstElementChild
      expect(textField?.className).toContain('small')
    })

    test('should render medium size', () => {
      const { container } = render(<TextArea label="Field" size="medium" />)
      const textField = container.firstElementChild
      expect(textField?.className).toContain('medium')
    })
  })

  describe('Required state', () => {
    test('should display required indicator when isRequired is true', () => {
      render(<TextArea label="Comment" isRequired />)
      expect(screen.getByText('*')).toBeVisible()
    })

    test('should not display required indicator when isRequired is false', () => {
      render(<TextArea label="Comment" />)
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    test('should mark the textarea as required', () => {
      render(<TextArea label="Comment" isRequired />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeRequired()
    })
  })

  describe('Helper text', () => {
    test('should display helper text', () => {
      render(
        <TextArea
          label="Comment"
          helperText="This is a hint text to help user."
        />,
      )
      expect(
        screen.getByText('This is a hint text to help user.'),
      ).toBeVisible()
    })

    test('should replace helper text with error message when error is set', () => {
      render(
        <TextArea
          label="Comment"
          helperText="This is a hint text to help user."
          error="This is an error message."
        />,
      )
      expect(
        screen.queryByText('This is a hint text to help user.'),
      ).not.toBeInTheDocument()
      expect(screen.getByText('This is an error message.')).toBeVisible()
    })

    test('should keep helper text when error is boolean true', () => {
      render(
        <TextArea
          label="Comment"
          helperText="This is a hint text to help user."
          error={true}
        />,
      )
      expect(
        screen.getByText('This is a hint text to help user.'),
      ).toBeVisible()
    })
  })

  describe('Character count', () => {
    test('should display character count when maxLength is set', () => {
      render(<TextArea label="Comment" maxLength={20} />)
      expect(screen.getByText('0/20')).toBeVisible()
    })

    test('should update character count on user input', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<TextArea label="Comment" maxLength={20} />)
      const textarea = screen.getByRole('textbox')

      await user.type(textarea, 'hello')

      expect(screen.getByText('5/20')).toBeVisible()
    })

    test('should display character count with defaultValue', () => {
      render(<TextArea label="Comment" maxLength={20} defaultValue="test" />)
      expect(screen.getByText('4/20')).toBeVisible()
    })

    test('should display character count with controlled value', () => {
      render(<TextArea label="Comment" maxLength={20} value="controlled" />)
      expect(screen.getByText('10/20')).toBeVisible()
    })

    test('should set maxlength attribute on textarea', () => {
      render(<TextArea label="Comment" maxLength={20} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('maxlength', '20')
    })

    test('should display alongside helper text', () => {
      render(
        <TextArea
          label="Comment"
          maxLength={20}
          helperText="This is a hint text to help user."
        />,
      )
      expect(screen.getByText('0/20')).toBeVisible()
      expect(
        screen.getByText('This is a hint text to help user.'),
      ).toBeVisible()
    })

    test('should hide the count without removing the maxlength constraint', () => {
      render(<TextArea label="Comment" maxLength={20} characterCount={false} />)

      expect(screen.queryByText('0/20')).not.toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '20')
    })

    test('should expose support text hooks for textarea state styling', () => {
      render(
        <TextArea
          label="Comment"
          helperText="Helper text"
          maxLength={20}
          isDisabled
        />,
      )

      expect(screen.getByText('Helper text')).toHaveAttribute(
        'data-helper-text',
      )
      expect(screen.getByText('0/20')).toHaveAttribute('data-character-count')
      expect(
        screen.getByText('Helper text').parentElement?.parentElement,
      ).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Error handling', () => {
    test('should display error message', () => {
      render(<TextArea label="Comment" error="This is an error message." />)
      const errorMessage = getErrorMessage()
      expect(errorMessage).toBeVisible()
      expect(errorMessage).toHaveTextContent('This is an error message.')
    })

    test('should have aria-invalid when error message is provided', () => {
      render(<TextArea label="Comment" error="Error" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })

    test('should have aria-invalid when error is true', () => {
      render(<TextArea label="Comment" error={true} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })

    test('should announce error message to screen readers', () => {
      render(<TextArea label="Comment" error="This is an error message." />)
      expect(announce).toHaveBeenCalledWith(
        'This is an error message.',
        'polite',
      )
    })

    test('should not announce when announceError is false', () => {
      render(
        <TextArea
          label="Comment"
          error="This is an error message."
          announceError={false}
        />,
      )
      expect(announce).not.toHaveBeenCalled()
    })

    test('should support assertive error announcements', () => {
      render(
        <TextArea
          label="Comment"
          error="This is an error message."
          announceError="assertive"
        />,
      )

      expect(announce).toHaveBeenCalledWith(
        'This is an error message.',
        'assertive',
      )
    })
  })

  test('should set the requested number of rows', () => {
    render(<TextArea label="Comment" rows={7} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '7')
  })

  describe('Uncontrolled usage', () => {
    test('should accept defaultValue', () => {
      render(<TextArea label="Comment" defaultValue="Initial value" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveValue('Initial value')
    })

    test('should update value on user input', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<TextArea label="Comment" defaultValue="" />)
      const textarea = screen.getByRole('textbox')

      await user.type(textarea, 'New value')

      expect(textarea).toHaveValue('New value')
    })

    test('should trigger onChange callback', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const handleChange = vi.fn()
      render(<TextArea label="Comment" onChange={handleChange} />)
      const textarea = screen.getByRole('textbox')

      await user.type(textarea, 't')

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Controlled usage', () => {
    test('should display controlled value', () => {
      render(<TextArea label="Comment" value="Controlled value" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveValue('Controlled value')
    })

    test('should update value when provided value is changed', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      const ControlledTextArea = () => {
        const [controlledValue, setControlledValue] = useState('')

        return (
          <TextArea
            label="Comment"
            value={controlledValue}
            onChange={(newValue) => {
              setControlledValue(newValue)
            }}
          />
        )
      }

      render(<ControlledTextArea />)
      const textarea = screen.getByRole('textbox')

      expect(textarea).toHaveValue('')

      await user.type(textarea, 'Updated')

      expect(textarea).toHaveValue('Updated')
    })

    test('should not update value when provided value is unchanged', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<TextArea label="Comment" value="Fixed" />)
      const textarea = screen.getByRole('textbox')

      await user.type(textarea, 'New value')

      expect(textarea).toHaveValue('Fixed')
    })
  })

  describe('Read-only state', () => {
    test('should have readonly attribute when isReadOnly is true', () => {
      render(<TextArea label="Comment" isReadOnly={true} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('readonly', '')
    })

    test('should display default value in read-only mode', () => {
      render(
        <TextArea
          label="Comment"
          defaultValue="Read-only content"
          isReadOnly={true}
        />,
      )
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveValue('Read-only content')
    })
  })

  describe('Disabled state', () => {
    test('should have disabled attribute when isDisabled is true', () => {
      render(<TextArea label="Comment" isDisabled={true} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    test('should display default value when disabled', () => {
      render(
        <TextArea
          label="Comment"
          defaultValue="Disabled content"
          isDisabled={true}
        />,
      )
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveValue('Disabled content')
    })
  })

  describe('Tooltip', () => {
    test('renders tooltip trigger when tooltip is provided', () => {
      render(
        <TextArea
          label="Comment"
          tooltip="Describe what happened"
          tooltipTriggerAriaLabel="More information"
        />,
      )
      expect(
        screen.getByRole('button', { name: 'More information' }),
      ).toBeVisible()
    })

    test('does not render tooltip trigger when tooltip is not provided', () => {
      render(<TextArea label="Comment" />)
      expect(
        screen.queryByRole('button', { name: 'More information' }),
      ).not.toBeInTheDocument()
    })

    test('throws when tooltip is provided without label', () => {
      expect(() => {
        render(
          <TextArea
            tooltip="Describe what happened"
            tooltipTriggerAriaLabel="More information"
          />,
        )
      }).toThrow('TextArea: tooltip requires label to be provided.')
    })

    test('throws when tooltip is provided without tooltipTriggerAriaLabel', () => {
      expect(() => {
        render(<TextArea label="Comment" tooltip="Describe what happened" />)
      }).toThrow(
        'TextArea: tooltip requires tooltipTriggerAriaLabel to be provided.',
      )
    })
  })

  const getErrorMessage = () => {
    const textarea = screen.getByRole('textbox')
    const errorId = textarea.getAttribute('aria-describedby')
    if (!errorId) {
      throw new Error(
        'Textarea should have aria-describedby attribute when error message is provided',
      )
    }
    return document.getElementById(errorId)
  }
})
