import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, test, vi } from 'vitest'

import { RadioGroup } from '.'

const ThreeOptions = () => (
  <>
    <RadioGroup.Radio value="option1" label="Option 1" />
    <RadioGroup.Radio value="option2" label="Option 2" />
    <RadioGroup.Radio value="option3" label="Option 3" />
  </>
)

type ThreeOptionsType = 'option1' | 'option2' | 'option3'

describe('RadioGroup Component', () => {
  test('should render radio buttons with accessible role', () => {
    render(
      <RadioGroup<ThreeOptionsType>>
        <ThreeOptions />
      </RadioGroup>,
    )

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
  })

  test('should render group title and description', () => {
    render(
      <RadioGroup<ThreeOptionsType>
        title="Choose an option"
        description="Select one of the options below"
      >
        <ThreeOptions />
      </RadioGroup>,
    )

    expect(screen.getByText('Choose an option')).toBeInTheDocument()
    expect(
      screen.getByText('Select one of the options below'),
    ).toBeInTheDocument()
  })

  describe('States', () => {
    test('should have no option selected by default', () => {
      render(
        <RadioGroup<ThreeOptionsType>>
          <ThreeOptions />
        </RadioGroup>,
      )

      const radios = screen.getAllByRole('radio')
      radios.forEach((radio) => {
        expect(radio).not.toBeChecked()
      })
    })

    test('should pre-select the option matching defaultValue', () => {
      render(
        <RadioGroup<ThreeOptionsType> defaultValue="option2">
          <ThreeOptions />
        </RadioGroup>,
      )

      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Option 1' })).not.toBeChecked()
      expect(screen.getByRole('radio', { name: 'Option 3' })).not.toBeChecked()
    })
  })

  describe('User interactions', () => {
    test('should select an option on click', async () => {
      const user = userEvent.setup()
      render(
        <RadioGroup<ThreeOptionsType>>
          <ThreeOptions />
        </RadioGroup>,
      )

      const option1 = screen.getByRole('radio', { name: 'Option 1' })
      expect(option1).not.toBeChecked()

      await user.click(option1)

      expect(option1).toBeChecked()
    })

    test('should switch selection when clicking another option', async () => {
      const user = userEvent.setup()
      render(
        <RadioGroup<ThreeOptionsType> defaultValue="option1">
          <ThreeOptions />
        </RadioGroup>,
      )

      const option1 = screen.getByRole('radio', { name: 'Option 1' })
      const option2 = screen.getByRole('radio', { name: 'Option 2' })

      expect(option1).toBeChecked()

      await user.click(option2)

      expect(option2).toBeChecked()
      expect(option1).not.toBeChecked()
    })

    test('should call onChange when an option is selected', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(
        <RadioGroup<ThreeOptionsType> onChange={handleChange}>
          <ThreeOptions />
        </RadioGroup>,
      )

      await user.click(screen.getByRole('radio', { name: 'Option 1' }))

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith('option1')
    })

    test('should not call onChange when an option is already selected', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(
        <RadioGroup<ThreeOptionsType>
          aria-label="Options"
          onChange={handleChange}
          defaultValue="option1"
        >
          <ThreeOptions />
        </RadioGroup>,
      )

      await user.click(screen.getByRole('radio', { name: 'Option 1' }))

      expect(handleChange).not.toHaveBeenCalled()
    })

    test('should call onChange with the correct value when switching options', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(
        <RadioGroup<ThreeOptionsType>
          aria-label="Options"
          defaultValue="option1"
          onChange={handleChange}
        >
          <ThreeOptions />
        </RadioGroup>,
      )

      await user.click(screen.getByRole('radio', { name: 'Option 3' }))

      expect(handleChange).toHaveBeenCalledWith('option3')
    })

    test('should select options via label text click', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(
        <RadioGroup<ThreeOptionsType> onChange={handleChange}>
          <RadioGroup.Radio value="option1" label="First option" />
          <RadioGroup.Radio value="option2" label="Second option" />
        </RadioGroup>,
      )

      await user.click(screen.getByText('First option'))

      expect(handleChange).toHaveBeenCalledWith('option1')
      expect(screen.getByRole('radio', { name: 'First option' })).toBeChecked()
    })
  })

  describe('Keyboard navigation', () => {
    test('should navigate between options with arrow keys', async () => {
      const user = userEvent.setup()
      render(
        <RadioGroup<ThreeOptionsType>>
          <ThreeOptions />
        </RadioGroup>,
      )

      const option1 = screen.getByRole('radio', { name: 'Option 1' })

      await user.click(option1)
      expect(option1).toBeChecked()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeChecked()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('radio', { name: 'Option 3' })).toBeChecked()
    })
  })

  describe('Controlled usage', () => {
    test('should reflect controlled value', () => {
      render(
        <RadioGroup<ThreeOptionsType> value="option2">
          <ThreeOptions />
        </RadioGroup>,
      )

      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeChecked()
    })

    test('should update when controlled value changes', async () => {
      const ControlledGroup = () => {
        const [value, setValue] = useState<ThreeOptionsType>('option1')

        return (
          <RadioGroup<ThreeOptionsType> value={value} onChange={setValue}>
            <ThreeOptions />
          </RadioGroup>
        )
      }
      const user = userEvent.setup()
      render(<ControlledGroup />)

      expect(screen.getByRole('radio', { name: 'Option 1' })).toBeChecked()

      await user.click(screen.getByRole('radio', { name: 'Option 2' }))

      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Option 1' })).not.toBeChecked()
    })

    test('should not update when controlled value is unchanged', async () => {
      const user = userEvent.setup()
      render(
        <RadioGroup<ThreeOptionsType> value="option1">
          <ThreeOptions />
        </RadioGroup>,
      )

      await user.click(screen.getByRole('radio', { name: 'Option 2' }))

      expect(screen.getByRole('radio', { name: 'Option 1' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Option 2' })).not.toBeChecked()
    })
  })

  describe('Disabled state', () => {
    test('should disable all options when isDisabled is set on the group', () => {
      render(
        <RadioGroup<ThreeOptionsType> isDisabled>
          <ThreeOptions />
        </RadioGroup>,
      )

      const radios = screen.getAllByRole('radio')
      radios.forEach((radio) => {
        expect(radio).toBeDisabled()
      })
    })

    test('should not call onChange when the group is disabled', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(
        <RadioGroup<ThreeOptionsType> isDisabled onChange={handleChange}>
          <ThreeOptions />
        </RadioGroup>,
      )

      await user.click(screen.getByRole('radio', { name: 'Option 1' }))

      expect(handleChange).not.toHaveBeenCalled()
    })

    test('should disable a single option without affecting the group', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(
        <RadioGroup<ThreeOptionsType> onChange={handleChange}>
          <RadioGroup.Radio value="option1" label="Option 1" isDisabled />
          <RadioGroup.Radio value="option2" label="Option 2" />
        </RadioGroup>,
      )

      const option1 = screen.getByRole('radio', { name: 'Option 1' })
      const option2 = screen.getByRole('radio', { name: 'Option 2' })

      expect(option1).toBeDisabled()
      expect(option2).not.toBeDisabled()

      await user.click(option1)
      expect(handleChange).not.toHaveBeenCalled()

      await user.click(option2)
      expect(handleChange).toHaveBeenCalledWith('option2')
    })
  })

  describe('Error state', () => {
    test('should render error message when error is a string', () => {
      render(
        <RadioGroup<ThreeOptionsType> error="You must select an option">
          <ThreeOptions />
        </RadioGroup>,
      )

      expect(screen.getByText('You must select an option')).toBeInTheDocument()
    })

    test('should not render error message when error is not provided', () => {
      render(
        <RadioGroup<ThreeOptionsType> title="Group">
          <ThreeOptions />
        </RadioGroup>,
      )

      expect(
        screen.queryByText('You must select an option'),
      ).not.toBeInTheDocument()
    })

    test('should mark the group as invalid when error is set', () => {
      render(
        <RadioGroup<ThreeOptionsType> error="Please select an option">
          <ThreeOptions />
        </RadioGroup>,
      )

      expect(screen.getByRole('radiogroup')).toHaveAttribute(
        'aria-invalid',
        'true',
      )
    })
  })

  describe('Accessibility', () => {
    test('should have accessible name from aria-label', () => {
      render(
        <RadioGroup<ThreeOptionsType> aria-label="Delivery method">
          <ThreeOptions />
        </RadioGroup>,
      )

      expect(
        screen.getByRole('radiogroup', { name: 'Delivery method' }),
      ).toBeInTheDocument()
    })

    test('should have accessible name from title via label', () => {
      render(
        <RadioGroup<ThreeOptionsType> title="Delivery method">
          <ThreeOptions />
        </RadioGroup>,
      )

      expect(
        screen.getByRole('radiogroup', { name: 'Delivery method' }),
      ).toBeInTheDocument()
    })

    test('should have aria-describedby pointing to the error message element', () => {
      render(
        <RadioGroup<ThreeOptionsType> error="You must select an option">
          <ThreeOptions />
        </RadioGroup>,
      )

      const group = screen.getByRole('radiogroup')

      expect(group).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('-error'),
      )
    })

    test('should not have aria-describedby when no error is provided', () => {
      render(
        <RadioGroup<ThreeOptionsType>>
          <ThreeOptions />
        </RadioGroup>,
      )

      expect(screen.getByRole('radiogroup')).not.toHaveAttribute(
        'aria-describedby',
      )
    })
  })
})
