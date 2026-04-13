import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, test, vi } from 'vitest'

import { Checkbox } from '.'

describe('Checkbox Component', () => {
  test('should render checkbox with accessible role', () => {
    render(<Checkbox aria-label="Accept terms" />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  test('should render with title and helper text', () => {
    render(
      <Checkbox
        title="Accept terms"
        helperText="You must accept to continue"
      />,
    )

    expect(screen.getByText('Accept terms')).toBeInTheDocument()
    expect(screen.getByText('You must accept to continue')).toBeInTheDocument()
  })

  test('should render with children', () => {
    render(<Checkbox>Custom label</Checkbox>)

    expect(screen.getByText('Custom label')).toBeInTheDocument()
  })

  describe('States', () => {
    test('should be unchecked by default', () => {
      render(<Checkbox aria-label="Checkbox" />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })

    test('should be checked when defaultSelected is true', () => {
      render(<Checkbox defaultSelected aria-label="Checkbox" />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    test('should be checked when isSelected is true', () => {
      render(<Checkbox isSelected aria-label="Checkbox" />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })
  })

  describe('User interactions', () => {
    test('should toggle checked state on click', async () => {
      const user = userEvent.setup()
      render(<Checkbox aria-label="Toggle checkbox" />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()

      await user.click(checkbox)
      expect(checkbox).toBeChecked()

      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })
    test('should toggle checked state on click of title and helper text', async () => {
      const user = userEvent.setup()
      render(<Checkbox title="Title" helperText="Helper Text" />)

      const checkbox = screen.getByRole('checkbox')
      const title = screen.getByText('Title')
      const helper = screen.getByText('Helper Text')

      expect(checkbox).not.toBeChecked()

      await user.click(title)
      expect(checkbox).toBeChecked()

      await user.click(helper)
      expect(checkbox).not.toBeChecked()
    })
    test('should toggle checked state on click of error ', async () => {
      const user = userEvent.setup()
      render(
        <Checkbox title="Title" helperText="Helper Text" error="Error Text" />,
      )

      const checkbox = screen.getByRole('checkbox')
      const error = screen.getByText('Error Text')

      expect(checkbox).not.toBeChecked()

      await user.click(error)
      expect(checkbox).toBeChecked()
    })
    test('should call onChange when state changes', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(<Checkbox onChange={handleChange} aria-label="Checkbox" />)

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(true)
    })

    test('should call onChange with false when unchecking', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(
        <Checkbox
          defaultSelected
          onChange={handleChange}
          aria-label="Checkbox"
        />,
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(handleChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Controlled usage', () => {
    test('should display controlled selected state', () => {
      render(<Checkbox isSelected aria-label="Controlled checkbox" />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    test('should update when controlled value changes', async () => {
      const ControlledCheckbox = () => {
        const [isSelected, setIsSelected] = useState(false)

        return (
          <Checkbox
            isSelected={isSelected}
            onChange={setIsSelected}
            aria-label="Toggle"
          />
        )
      }
      const user = userEvent.setup()
      render(<ControlledCheckbox />)
      const checkbox = screen.getByRole('checkbox')

      expect(checkbox).not.toBeChecked()

      await user.click(checkbox)

      expect(checkbox).toBeChecked()
    })

    test('should not update when controlled value is unchanged', async () => {
      const user = userEvent.setup()
      render(<Checkbox isSelected={false} aria-label="Fixed checkbox" />)

      const checkbox = screen.getByRole('checkbox')

      await user.click(checkbox)

      expect(checkbox).not.toBeChecked()
    })
  })

  describe('Disabled state', () => {
    test('should have disabled attribute when isDisabled is true', () => {
      render(<Checkbox isDisabled aria-label="Disabled checkbox" />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
    })

    test('should not respond to clicks when disabled', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(
        <Checkbox
          isDisabled
          onChange={handleChange}
          aria-label="Disabled checkbox"
        />,
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(handleChange).not.toHaveBeenCalled()
      expect(checkbox).not.toBeChecked()
    })

    test('should be checked and disabled', () => {
      render(
        <Checkbox
          isDisabled
          defaultSelected
          aria-label="Disabled checked checkbox"
        />,
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
      expect(checkbox).toBeChecked()
    })
  })

  describe('Error state', () => {
    test('should render error state with caption text', () => {
      render(
        <Checkbox
          title="Accept terms"
          helperText="Read the terms"
          error="You must accept the terms to continue"
          aria-label="Error checkbox"
        />,
      )

      expect(screen.getByText('Accept terms')).toBeInTheDocument()
      expect(screen.getByText('Read the terms')).toBeInTheDocument()
      expect(
        screen.getByText('You must accept the terms to continue'),
      ).toBeInTheDocument()
    })

    test('should not render caption text when error is present', () => {
      render(
        <Checkbox
          title="Accept terms"
          error="Error message"
          aria-label="Checkbox"
        />,
      )

      expect(screen.queryByText('Error message')).toBeInTheDocument()
    })

    test('should not render caption text when error is not provided', () => {
      render(<Checkbox title="Accept terms" aria-label="Error checkbox" />)

      expect(screen.getByText('Accept terms')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have accessible name from aria-label', () => {
      render(<Checkbox aria-label="Accept privacy policy" />)

      const checkbox = screen.getByRole('checkbox', {
        name: 'Accept privacy policy',
      })
      expect(checkbox).toBeInTheDocument()
    })

    test('should have accessible name from title', () => {
      render(<Checkbox title="Accept terms and conditions" />)

      expect(
        screen.getByText('Accept terms and conditions'),
      ).toBeInTheDocument()
    })

    test('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Checkbox aria-label="Keyboard checkbox" />)

      const checkbox = screen.getByRole('checkbox')

      await user.tab()
      expect(checkbox).toHaveFocus()

      await user.keyboard(' ')
      expect(checkbox).toBeChecked()

      await user.keyboard(' ')
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('Label rendering', () => {
    test('should render only title when helperText is not provided', () => {
      render(<Checkbox title="Only title" />)

      expect(screen.getByText('Only title')).toBeInTheDocument()
    })

    test('should render title and helperText together with indeterminate', () => {
      render(
        <Checkbox title="Title" helperText="Helper text" isIndeterminate />,
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Helper text')).toBeInTheDocument()
    })

    test('should prioritize helperText over children', () => {
      render(<Checkbox helperText="Helper">Children content</Checkbox>)

      expect(screen.getByText('Helper')).toBeInTheDocument()
      expect(screen.queryByText('Children content')).not.toBeInTheDocument()
    })

    test('should render children when title and helperText are not provided', () => {
      render(<Checkbox>Children label</Checkbox>)

      expect(screen.getByText('Children label')).toBeInTheDocument()
    })
  })

  describe('Custom props', () => {
    test('should accept data attributes', () => {
      render(
        <Checkbox data-testid="custom-checkbox" aria-label="Test checkbox" />,
      )

      const checkbox = screen.getByTestId('custom-checkbox')
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('Combined states', () => {
    test('should handle disabled and checked state together', () => {
      render(
        <Checkbox
          isDisabled
          defaultSelected
          title="Title"
          helperText="Helper Text"
          aria-label="Disabled checked checkbox"
        />,
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
      expect(checkbox).toBeChecked()
    })
  })
})
