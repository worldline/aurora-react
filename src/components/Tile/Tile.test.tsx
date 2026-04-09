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
        />,
      )

      expect(screen.getByText('Contact Support')).toBeInTheDocument()
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Get help from our team')).toBeInTheDocument()
      expect(screen.getByText('→')).toBeInTheDocument()
    })
  })

  describe('orientation', () => {
    test('should default to horizontal', () => {
      const { container } = render(
        <Tile title="Title" trailing={TrailingArrow} />,
      )

      expect(container.firstChild).toHaveAttribute(
        'data-orientation',
        'horizontal',
      )
    })

    test('should set vertical when specified', () => {
      const { container } = render(
        <Tile title="Title" orientation="vertical" trailing={TrailingArrow} />,
      )

      expect(container.firstChild).toHaveAttribute(
        'data-orientation',
        'vertical',
      )
    })
  })

  describe('states', () => {
    test('should set data-disabled when disabled', () => {
      const { container } = render(
        <Tile title="Title" disabled trailing={TrailingArrow} />,
      )

      expect(container.firstChild).toHaveAttribute('data-disabled')
    })

    test('should set data-selected when selected', () => {
      const { container } = render(
        <Tile title="Title" selected trailing={TrailingArrow} />,
      )

      expect(container.firstChild).toHaveAttribute('data-selected')
    })

    test('should not set data-selected when selected but disabled', () => {
      const { container } = render(
        <Tile title="Title" selected disabled trailing={TrailingArrow} />,
      )

      expect(container.firstChild).not.toHaveAttribute('data-selected')
    })

    test('should set data-focus-visible when focused', () => {
      const { container } = render(
        <Tile title="Title" focusVisible trailing={TrailingArrow} />,
      )

      expect(container.firstChild).toHaveAttribute('data-focus-visible')
    })

    test('should not set data-focus-visible when focused but disabled', () => {
      const { container } = render(
        <Tile title="Title" focusVisible disabled trailing={TrailingArrow} />,
      )

      expect(container.firstChild).not.toHaveAttribute('data-focus-visible')
    })

    test('should set data-hovered when hovered', () => {
      const { container } = render(
        <Tile title="Title" hovered trailing={TrailingArrow} />,
      )

      expect(container.firstChild).toHaveAttribute('data-hovered')
    })

    test('should not set data-hovered when hovered but disabled', () => {
      const { container } = render(
        <Tile title="Title" hovered disabled trailing={TrailingArrow} />,
      )

      expect(container.firstChild).not.toHaveAttribute('data-hovered')
    })

    test('should not set data-hovered when hovered but selected', () => {
      const { container } = render(
        <Tile title="Title" hovered selected trailing={TrailingArrow} />,
      )

      expect(container.firstChild).not.toHaveAttribute('data-hovered')
    })
  })

  describe('interaction', () => {
    test('should call onClick when clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()

      render(<Tile title="Title" trailing={TrailingArrow} onClick={onClick} />)

      await user.click(screen.getByText('Title'))

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('should receive focus when tabbing to an interactive tile', async () => {
      const user = userEvent.setup()

      render(<Tile title="Title" trailing={TrailingArrow} onClick={vi.fn()} />)

      await user.tab()

      expect(screen.getByText('Title').closest('[tabindex="0"]')).toHaveFocus()
    })

    test('should call onClick when Enter or Space is pressed on a focused interactive tile', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()

      render(<Tile title="Title" trailing={TrailingArrow} onClick={onClick} />)
      const tile = screen.getByText('Title').closest('[tabindex="0"]')

      expect(tile).not.toBeNull()
      if (!tile) {
        throw new Error('Interactive tile element was not found')
      }

      await user.tab()
      await user.keyboard('{Enter}')
      await user.keyboard(' ')

      expect(tile).toHaveFocus()

      expect(onClick).toHaveBeenCalledTimes(2)
    })
  })
})
