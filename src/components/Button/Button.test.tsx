import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, test, vi } from 'vitest'

import { Button } from '.'

describe('Button Component', () => {
  test('should display Button', () => {
    render(<Button>My Button</Button>)

    const btn = screen.getByRole('button', { name: 'My Button' })

    expect(btn).toBeTruthy()
  })

  test('should forward ref to the button element', () => {
    const buttonRef = createRef<HTMLButtonElement>()
    render(<Button ref={buttonRef}>My Button</Button>)

    const btn = screen.getByRole('button', { name: 'My Button' })
    expect(buttonRef.current).toBe(btn)
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

  test('should render destructive button', () => {
    render(<Button destructive>Delete</Button>)

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  test('should render icon-only button with accessible name', () => {
    render(
      <Button aria-label="Add">
        <svg aria-hidden />
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })
})
