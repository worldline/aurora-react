import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { Switch } from '.'

describe('Switch rendering', () => {
  test('renders with correct ARIA role', () => {
    render(
      <Switch
        aria-label="Switch feature"
        isSelected={false}
        onChange={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('switch', { name: 'Switch feature' }),
    ).toBeInTheDocument()
  })

  test('renders label when provided', () => {
    render(
      <Switch label="Enable feature" isSelected={false} onChange={vi.fn()} />,
    )

    expect(
      screen.getByRole('switch', { name: 'Enable feature' }),
    ).toBeInTheDocument()
  })

  test('renders no label text when label is not provided', () => {
    render(
      <Switch
        aria-label="Switch feature"
        isSelected={false}
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('switch')).not.toHaveTextContent(/\S/)
  })

  test('renders description when label and description are provided', () => {
    render(
      <Switch
        label="Enable feature"
        description="Turns on notifications"
        isSelected={false}
        onChange={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('switch', {
        name: 'Enable feature Turns on notifications',
      }),
    ).toBeInTheDocument()
  })

  test('does not render description without a label', () => {
    render(
      <Switch
        aria-label="Switch feature"
        isSelected={false}
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('switch')).not.toHaveTextContent(/\S/)
  })
})

describe('Switch controlled', () => {
  test('reflects isSelected=false as unchecked', () => {
    render(
      <Switch
        aria-label="Switch feature"
        isSelected={false}
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  test('reflects isSelected=true as checked', () => {
    render(<Switch aria-label="Switch feature" isSelected onChange={vi.fn()} />)

    expect(screen.getByRole('switch')).toBeChecked()
  })

  test('calls onChange with true when clicked while off', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <Switch
        aria-label="Switch feature"
        isSelected={false}
        onChange={handleChange}
      />,
    )

    await user.click(screen.getByRole('switch'))

    expect(handleChange).toHaveBeenCalledOnce()
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  test('calls onChange with false when clicked while on', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <Switch aria-label="Switch feature" isSelected onChange={handleChange} />,
    )

    await user.click(screen.getByRole('switch'))

    expect(handleChange).toHaveBeenCalledOnce()
    expect(handleChange).toHaveBeenCalledWith(false)
  })

  test('does not self-toggle — visual state stays until parent updates isSelected', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <Switch
        aria-label="Switch feature"
        isSelected={false}
        onChange={handleChange}
      />,
    )

    await user.click(screen.getByRole('switch'))

    expect(handleChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  test('calls onChange with true on Space key press', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <Switch
        aria-label="Switch feature"
        isSelected={false}
        onChange={handleChange}
      />,
    )

    screen.getByRole('switch').focus()
    await user.keyboard(' ')

    expect(handleChange).toHaveBeenCalledOnce()
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  test('does not call onChange and stays unchecked when disabled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <Switch
        aria-label="Switch feature"
        isSelected={false}
        isDisabled
        onChange={handleChange}
      />,
    )

    await user.click(screen.getByRole('switch'))

    expect(handleChange).not.toHaveBeenCalled()
    expect(screen.getByRole('switch')).not.toBeChecked()
  })
})

describe('Switch uncontrolled', () => {
  test('is unchecked by default', () => {
    render(<Switch aria-label="Switch feature" />)

    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  test('reflects defaultSelected state', () => {
    render(<Switch aria-label="Switch feature" defaultSelected />)

    expect(screen.getByRole('switch')).toBeChecked()
  })

  test('toggles on click', async () => {
    const user = userEvent.setup()
    render(<Switch aria-label="Switch feature" />)

    await user.click(screen.getByRole('switch'))

    expect(screen.getByRole('switch')).toBeChecked()
  })
})

describe('Switch form integration', () => {
  test('includes name and value in form data when selected', async () => {
    const user = userEvent.setup()
    let formData: FormData | undefined

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          formData = new FormData(event.currentTarget)
        }}
      >
        <Switch
          aria-label="Switch feature"
          name="notifications"
          value="enabled"
          defaultSelected
        />
        <button type="submit">Submit</button>
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(formData?.get('notifications')).toBe('enabled')
  })

  test('excludes name from form data when not selected', async () => {
    const user = userEvent.setup()
    let formData: FormData | undefined

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          formData = new FormData(event.currentTarget)
        }}
      >
        <Switch
          aria-label="Switch feature"
          name="notifications"
          value="enabled"
        />
        <button type="submit">Submit</button>
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(formData?.get('notifications')).toBeNull()
  })

  test('defaults value to "on" when no value prop is provided', async () => {
    const user = userEvent.setup()
    let formData: FormData | undefined

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          formData = new FormData(event.currentTarget)
        }}
      >
        <Switch
          aria-label="Switch feature"
          name="notifications"
          defaultSelected
        />
        <button type="submit">Submit</button>
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(formData?.get('notifications')).toBe('on')
  })
})
