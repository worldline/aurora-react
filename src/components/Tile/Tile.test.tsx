import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Tile } from './Tile'

const TrailingArrow = <span aria-hidden="true">→</span>

describe('Tile', () => {
  describe('content', () => {
    test('should render title', () => {
      render(<Tile title="Contact Support" trailing={TrailingArrow} />)

      expect(screen.getByText('Contact Support')).toBeInTheDocument()
    })

    test('should render overline when provided', () => {
      render(<Tile title="Title" overline="Step 1" trailing={TrailingArrow} />)

      expect(screen.getByText('Step 1')).toBeInTheDocument()
    })

    test('should not render overline when not provided', () => {
      render(<Tile title="Title" trailing={TrailingArrow} />)

      expect(screen.queryByText('Step 1')).not.toBeInTheDocument()
    })

    test('should render description when provided', () => {
      render(
        <Tile
          title="Title"
          description="Get help from our team"
          trailing={TrailingArrow}
        />,
      )

      expect(screen.getByText('Get help from our team')).toBeInTheDocument()
    })

    test('should not render description when not provided', () => {
      render(<Tile title="Title" trailing={TrailingArrow} />)

      expect(
        screen.queryByText('Get help from our team'),
      ).not.toBeInTheDocument()
    })

    test('should render trailing content', () => {
      render(<Tile title="Title" trailing={TrailingArrow} />)

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
})
