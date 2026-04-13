import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { Tile } from './Tile'

const TrailingArrow = <span aria-hidden="true">→</span>

describe('Tile', () => {
  describe('content', () => {
    test('should render title, overline, description, and trailing content', () => {
      render(
        <Tile
          title="Contact Support"
          overline="Step 1"
          description="Get help from our team"
          trailing={TrailingArrow}
          onAction={vi.fn()}
        />,
      )

      expect(
        screen.getByRole('button', { name: /Contact Support/ }),
      ).toBeInTheDocument()
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Get help from our team')).toBeInTheDocument()
      expect(screen.getByText('→')).toBeInTheDocument()
    })
  })

  describe('orientation', () => {
    test('should default to horizontal', () => {
      render(<Tile title="Title" trailing={TrailingArrow} onAction={vi.fn()} />)

      expect(screen.getByRole('button', { name: 'Title' })).toHaveAttribute(
        'data-orientation',
        'horizontal',
      )
    })

    test('should set vertical when specified', () => {
      render(
        <Tile
          title="Title"
          orientation="vertical"
          trailing={TrailingArrow}
          onAction={vi.fn()}
        />,
      )

      expect(screen.getByRole('button', { name: 'Title' })).toHaveAttribute(
        'data-orientation',
        'vertical',
      )
    })
  })

  describe('states', () => {
    test('should set aria-disabled when disabled', () => {
      render(
        <Tile
          title="Title"
          disabled
          trailing={TrailingArrow}
          onAction={vi.fn()}
        />,
      )

      expect(screen.getByRole('button', { name: 'Title' })).toHaveAttribute(
        'aria-disabled',
        'true',
      )
    })

    test('should set data-selected when selected', () => {
      render(
        <Tile
          title="Title"
          selected
          trailing={TrailingArrow}
          onAction={vi.fn()}
        />,
      )

      expect(screen.getByRole('button', { name: 'Title' })).toHaveAttribute(
        'data-selected',
      )
    })

    test('should not set data-selected when selected but disabled', () => {
      render(
        <Tile
          title="Title"
          selected
          disabled
          trailing={TrailingArrow}
          onAction={vi.fn()}
        />,
      )

      expect(screen.getByRole('button', { name: 'Title' })).not.toHaveAttribute(
        'data-selected',
      )
    })

    test('should set data-focus-visible when focused', () => {
      render(
        <Tile
          title="Title"
          focusVisible
          trailing={TrailingArrow}
          onAction={vi.fn()}
        />,
      )

      expect(screen.getByRole('button', { name: 'Title' })).toHaveAttribute(
        'data-focus-visible',
      )
    })

    test('should not set data-focus-visible when focused but disabled', () => {
      render(
        <Tile
          title="Title"
          focusVisible
          disabled
          trailing={TrailingArrow}
          onAction={vi.fn()}
        />,
      )

      expect(screen.getByRole('button', { name: 'Title' })).not.toHaveAttribute(
        'data-focus-visible',
      )
    })

    test('should set data-hovered when hovered', () => {
      render(
        <Tile
          title="Title"
          hovered
          trailing={TrailingArrow}
          onAction={vi.fn()}
        />,
      )

      expect(screen.getByRole('button', { name: 'Title' })).toHaveAttribute(
        'data-hovered',
      )
    })

    test('should not set data-hovered when hovered but disabled', () => {
      render(
        <Tile
          title="Title"
          hovered
          disabled
          trailing={TrailingArrow}
          onAction={vi.fn()}
        />,
      )

      expect(screen.getByRole('button', { name: 'Title' })).not.toHaveAttribute(
        'data-hovered',
      )
    })

    test('should not set data-hovered when hovered but selected', () => {
      render(
        <Tile
          title="Title"
          hovered
          selected
          trailing={TrailingArrow}
          onAction={vi.fn()}
        />,
      )

      expect(screen.getByRole('button', { name: 'Title' })).not.toHaveAttribute(
        'data-hovered',
      )
    })
  })

  describe('interaction', () => {
    test('should call onAction when clicked', async () => {
      const user = userEvent.setup()
      const onAction = vi.fn()

      render(
        <Tile title="Title" trailing={TrailingArrow} onAction={onAction} />,
      )

      await user.click(screen.getByRole('button', { name: 'Title' }))

      expect(onAction).toHaveBeenCalledTimes(1)
    })

    test('should receive focus when tabbing to an interactive tile', async () => {
      const user = userEvent.setup()

      render(<Tile title="Title" trailing={TrailingArrow} onAction={vi.fn()} />)

      await user.tab()

      expect(screen.getByRole('button', { name: 'Title' })).toHaveFocus()
    })

    test('should call onAction when Enter or Space is pressed on a focused interactive tile', async () => {
      const user = userEvent.setup()
      const onAction = vi.fn()

      render(
        <Tile title="Title" trailing={TrailingArrow} onAction={onAction} />,
      )
      const tile = screen.getByRole('button', { name: 'Title' })

      await user.tab()
      await user.keyboard('{Enter}')
      await user.keyboard(' ')

      expect(tile).toHaveFocus()

      expect(onAction).toHaveBeenCalledTimes(2)
    })
  })
})
