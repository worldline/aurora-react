import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, test, vi } from 'vitest'

import { SegmentedControls } from '.'

const ThreeControls = () => (
  <>
    <SegmentedControls.Control value="option1">
      Option 1
    </SegmentedControls.Control>
    <SegmentedControls.Control value="option2">
      Option 2
    </SegmentedControls.Control>
    <SegmentedControls.Control value="option3">
      Option 3
    </SegmentedControls.Control>
  </>
)

describe('SegmentedControls Component', () => {
  test('should render controls with accessible role', () => {
    render(
      <SegmentedControls aria-label="Options">
        <ThreeControls />
      </SegmentedControls>,
    )

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
  })

  test('should render group with radiogroup role', () => {
    render(
      <SegmentedControls aria-label="Options">
        <ThreeControls />
      </SegmentedControls>,
    )

    expect(
      screen.getByRole('radiogroup', { name: 'Options' }),
    ).toBeInTheDocument()
  })

  describe('States', () => {
    test('should have no option selected by default', () => {
      render(
        <SegmentedControls aria-label="Options">
          <ThreeControls />
        </SegmentedControls>,
      )

      screen.getAllByRole('radio').forEach((radio) => {
        expect(radio).not.toBeChecked()
      })
    })

    test('should pre-select the option matching defaultValue', () => {
      render(
        <SegmentedControls aria-label="Options" defaultValue="option2">
          <ThreeControls />
        </SegmentedControls>,
      )

      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Option 1' })).not.toBeChecked()
      expect(screen.getByRole('radio', { name: 'Option 3' })).not.toBeChecked()
    })
  })

  describe('User interactions', () => {
    test('should select a control on click', async () => {
      const user = userEvent.setup()
      render(
        <SegmentedControls aria-label="Options">
          <ThreeControls />
        </SegmentedControls>,
      )

      const option1 = screen.getByRole('radio', { name: 'Option 1' })
      expect(option1).not.toBeChecked()

      await user.click(option1)

      expect(option1).toBeChecked()
    })

    test('should switch selection when clicking another control', async () => {
      const user = userEvent.setup()
      render(
        <SegmentedControls aria-label="Options" defaultValue="option1">
          <ThreeControls />
        </SegmentedControls>,
      )

      expect(screen.getByRole('radio', { name: 'Option 1' })).toBeChecked()

      await user.click(screen.getByRole('radio', { name: 'Option 2' }))

      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Option 1' })).not.toBeChecked()
    })

    test('should call onChange when a control is selected', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(
        <SegmentedControls aria-label="Options" onChange={handleChange}>
          <ThreeControls />
        </SegmentedControls>,
      )

      await user.click(screen.getByRole('radio', { name: 'Option 1' }))

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith('option1')
    })

    test('should call onChange with the correct value when switching', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(
        <SegmentedControls
          aria-label="Options"
          defaultValue="option1"
          onChange={handleChange}
        >
          <ThreeControls />
        </SegmentedControls>,
      )

      await user.click(screen.getByRole('radio', { name: 'Option 3' }))

      expect(handleChange).toHaveBeenCalledWith('option3')
    })
  })

  describe('Keyboard navigation', () => {
    test('should navigate between controls with arrow keys', async () => {
      const user = userEvent.setup()
      render(
        <SegmentedControls aria-label="Options">
          <ThreeControls />
        </SegmentedControls>,
      )

      await user.click(screen.getByRole('radio', { name: 'Option 1' }))
      expect(screen.getByRole('radio', { name: 'Option 1' })).toBeChecked()

      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeChecked()

      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('radio', { name: 'Option 3' })).toBeChecked()
    })
  })

  describe('Controlled usage', () => {
    test('should reflect controlled value', () => {
      render(
        <SegmentedControls aria-label="Options" value="option2">
          <ThreeControls />
        </SegmentedControls>,
      )

      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeChecked()
    })

    test('should update when controlled value changes', async () => {
      const ControlledGroup = () => {
        const [value, setValue] = useState('option1')

        return (
          <SegmentedControls
            aria-label="Options"
            value={value}
            onChange={setValue}
          >
            <ThreeControls />
          </SegmentedControls>
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
        <SegmentedControls aria-label="Options" value="option1">
          <ThreeControls />
        </SegmentedControls>,
      )

      await user.click(screen.getByRole('radio', { name: 'Option 2' }))

      expect(screen.getByRole('radio', { name: 'Option 1' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Option 2' })).not.toBeChecked()
    })
  })

  describe('direction', () => {
    test('should have horizontal orientation by default', () => {
      render(
        <SegmentedControls aria-label="Options">
          <ThreeControls />
        </SegmentedControls>,
      )

      expect(
        screen.getByRole('radiogroup', { name: 'Options' }),
      ).toHaveAttribute('aria-orientation', 'horizontal')
    })

    test('should have vertical orientation when direction is vertical', () => {
      render(
        <SegmentedControls aria-label="Options" direction="vertical">
          <ThreeControls />
        </SegmentedControls>,
      )

      expect(
        screen.getByRole('radiogroup', { name: 'Options' }),
      ).toHaveAttribute('aria-orientation', 'vertical')
    })
  })

  describe('trailingIcon', () => {
    test('should render trailing icon when provided', () => {
      render(
        <SegmentedControls aria-label="Options">
          <SegmentedControls.Control
            value="option1"
            trailingIcon={<span data-testid="trailing-icon" />}
          >
            Option 1
          </SegmentedControls.Control>
        </SegmentedControls>,
      )

      expect(screen.getByTestId('trailing-icon')).toBeInTheDocument()
    })

    test('should not render trailing icon when not provided', () => {
      render(
        <SegmentedControls aria-label="Options">
          <SegmentedControls.Control value="option1">
            Option 1
          </SegmentedControls.Control>
        </SegmentedControls>,
      )

      expect(screen.queryByTestId('trailing-icon')).not.toBeInTheDocument()
    })
  })
})
