import { fireEvent, render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'

import { Button } from '.'

describe('Button Component', () => {
  test('should display Button', () => {
    render(<Button>My Button</Button>)

    const btn = screen.getByRole('button', { name: 'My Button' })

    expect(btn).toBeTruthy()
  })

  test('should handle click', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>My Button</Button>)

    const btn = screen.getByRole('button')
    fireEvent.click(btn)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('should have icons when not in pending state', () => {
    render(
      <Button
        leadingIcon={<span data-testid="leading-icon" />}
        trailingIcon={<span data-testid="trailing-icon" />}
        isPending={false}
      >
        My Button
      </Button>,
    )

    const btn = screen.getByRole('button', { name: 'My Button' })
    expect(btn).toBeTruthy()

    const leadingIcon = screen.queryByTestId('leading-icon')
    const trailingIcon = screen.queryByTestId('trailing-icon')

    expect(leadingIcon).toBeInTheDocument()
    expect(trailingIcon).toBeInTheDocument()
  })

  test('should not have icons when in pending state', () => {
    render(
      <Button
        leadingIcon={<span data-testid="leading-icon" />}
        trailingIcon={<span data-testid="trailing-icon" />}
        isPending
      >
        My Button
      </Button>,
    )

    const btn = screen.getByRole('button', { name: 'My Button' })
    expect(btn).toBeTruthy()

    const leadingIcon = screen.queryByTestId('leading-icon')
    const trailingIcon = screen.queryByTestId('trailing-icon')

    expect(leadingIcon).not.toBeInTheDocument()
    expect(trailingIcon).not.toBeInTheDocument()
  })
})
