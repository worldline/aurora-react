import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { Alert } from '.'

describe('Alert Component', () => {
  test('should render as accessible alert with title and message', () => {
    render(
      <Alert variant="error" title="Error occurred">
        Please try again later
      </Alert>,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Error occurred')
    expect(alert).toHaveTextContent('Please try again later')
  })

  test('should call onClose when user dismisses alert', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<Alert onClose={onClose}>Message</Alert>)

    await user.click(screen.getByRole('button', { name: 'Close alert' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('should not render dismiss button when onClose is not provided', () => {
    render(<Alert>Message</Alert>)

    expect(
      screen.queryByRole('button', { name: 'Close alert' }),
    ).not.toBeInTheDocument()
  })
})
