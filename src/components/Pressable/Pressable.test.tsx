import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Pressable } from '.'

describe('Pressable', () => {
  it('should render children', () => {
    render(
      <Pressable>
        <button type="button">Press me</button>
      </Pressable>,
    )

    expect(screen.getByRole('button', { name: 'Press me' })).toBeInTheDocument()
  })

  it('should handle press events', async () => {
    const user = userEvent.setup()
    const onPress = vi.fn()

    render(
      <Pressable onPress={onPress}>
        <button type="button">Press me</button>
      </Pressable>,
    )

    await user.click(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should not trigger onPress when disabled', async () => {
    const user = userEvent.setup()
    const onPress = vi.fn()

    render(
      <Pressable isDisabled onPress={onPress}>
        <button type="button">Press me</button>
      </Pressable>,
    )

    await user.click(screen.getByRole('button'))
    expect(onPress).not.toHaveBeenCalled()
  })
})
