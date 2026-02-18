import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Link } from '.'

describe('Link Component', () => {
  describe('default variant', () => {
    it('should render an anchor element', () => {
      render(
        <Link variant="default" href="#">
          Link
        </Link>,
      )

      const linkElement = screen.getByText('Link')
      expect(linkElement.tagName).toBe('A')
      expect(linkElement).toHaveAttribute('href', '#')
    })

    it('should not have button style', () => {
      render(
        <Link variant="default" href="#" className="custom-class">
          Link
        </Link>,
      )

      expect(screen.getByText('Link')).toHaveClass('custom-class')
    })
  })

  describe('button variant', () => {
    it('should have button style', () => {
      render(
        <Link variant="button" href="#" className="custom-class">
          Link
        </Link>,
      )

      expect(screen.getByText('Link')).toHaveClass(
        'button primary md custom-class',
      )
    })

    it('should render an anchor element', () => {
      render(
        <Link variant="button" href="#">
          Link
        </Link>,
      )

      const linkElement = screen.getByText('Link')
      expect(linkElement.tagName).toBe('A')
      expect(linkElement).toHaveAttribute('href', '#')
    })

    it('should allow custom render function', () => {
      render(
        <Link
          variant="button"
          href="#"
          render={(domProps) => {
            if ('href' in domProps) {
              return <a aria-label="Custom link" {...domProps} />
            }
            throw new Error("Expected 'href' in domProps for Link component")
          }}
        >
          Link
        </Link>,
      )

      const customLinkElement = screen.getByLabelText('Custom link')
      expect(customLinkElement).toBeInTheDocument()
      expect(customLinkElement).toHaveAttribute('href', '#')
    })
  })
})
