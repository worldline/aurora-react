import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Breadcrumbs, type RenderLink } from './Breadcrumbs'

const homeItem = { id: 'home', label: 'Home', href: '/' }
const levelOneItem = { id: 'level-1', label: 'Level 1', href: '/level-1' }
const currentItem = {
  id: 'current',
  label: 'Current Page',
  href: '/level-1/current',
}

describe('Breadcrumbs', () => {
  test('renders nothing when items is empty', () => {
    const { container } = render(<Breadcrumbs items={[]} />)
    expect(container.firstChild).toBeNull()
  })

  test('renders a labeled breadcrumb list', () => {
    render(<Breadcrumbs items={[homeItem]} />)
    expect(
      screen.getByRole('list', { name: 'Breadcrumbs' }),
    ).toBeInTheDocument()
  })

  test('uses "Breadcrumbs" as default aria-label', () => {
    render(<Breadcrumbs items={[homeItem]} />)
    expect(
      screen.getByRole('list', { name: 'Breadcrumbs' }),
    ).toBeInTheDocument()
  })

  test('applies custom aria-label', () => {
    render(<Breadcrumbs items={[homeItem]} aria-label="Site navigation" />)
    expect(
      screen.getByRole('list', { name: 'Site navigation' }),
    ).toBeInTheDocument()
  })

  test('applies custom className to the list element', () => {
    render(<Breadcrumbs items={[homeItem]} className="custom-class" />)
    expect(screen.getByRole('list', { name: 'Breadcrumbs' })).toHaveClass(
      'custom-class',
    )
  })

  describe('single home item', () => {
    test('renders the home item as the current page with no interactive link', () => {
      render(<Breadcrumbs items={[homeItem]} />)
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    test('marks the home item as aria-current="page"', () => {
      render(<Breadcrumbs items={[homeItem]} />)
      expect(
        screen
          .getByRole('list', { name: 'Breadcrumbs' })
          .querySelector('[aria-current="page"]'),
      ).toBeInTheDocument()
    })

    test('provides an accessible label for the home icon', () => {
      render(<Breadcrumbs items={[homeItem]} />)
      expect(
        screen
          .getByRole('list', { name: 'Breadcrumbs' })
          .querySelector('[aria-label="Home"]'),
      ).toBeInTheDocument()
    })
  })

  describe('two items', () => {
    test('renders the first item as a navigable home link', () => {
      render(<Breadcrumbs items={[homeItem, currentItem]} />)
      expect(screen.getAllByRole('link')).toHaveLength(1)
    })

    test('renders the last item as non-interactive text', () => {
      render(<Breadcrumbs items={[homeItem, currentItem]} />)
      expect(screen.getByText('Current Page').closest('a')).toBeNull()
    })

    test('marks the last item as aria-current="page"', () => {
      render(<Breadcrumbs items={[homeItem, currentItem]} />)
      expect(
        screen.getByText('Current Page').closest('[aria-current="page"]'),
      ).toBeInTheDocument()
    })
  })

  describe('three or more items', () => {
    test('renders home and intermediate items as links, last item as non-interactive', () => {
      render(<Breadcrumbs items={[homeItem, levelOneItem, currentItem]} />)
      expect(screen.getAllByRole('link')).toHaveLength(2)
    })

    test('renders the intermediate item label as a navigable link', () => {
      render(<Breadcrumbs items={[homeItem, levelOneItem, currentItem]} />)
      expect(screen.getByRole('link', { name: 'Level 1' })).toBeInTheDocument()
    })

    test('does not render the current page label as a link', () => {
      render(<Breadcrumbs items={[homeItem, levelOneItem, currentItem]} />)
      expect(screen.getByText('Current Page').closest('a')).toBeNull()
    })
  })

  describe('renderLink', () => {
    test('renders the element returned by renderLink for navigable items', () => {
      const renderLink: RenderLink = (domProps) => {
        if ('href' in domProps) {
          return <a data-testid="custom-link" {...domProps} />
        }
        return <span {...domProps} />
      }

      render(
        <Breadcrumbs items={[homeItem, currentItem]} renderLink={renderLink} />,
      )

      expect(screen.getByTestId('custom-link')).toBeInTheDocument()
    })

    test('does not use renderLink for the current page item', () => {
      const renderLink: RenderLink = (domProps) => {
        if ('href' in domProps) {
          return <a data-testid="custom-link" {...domProps} />
        }
        return <span {...domProps} />
      }

      render(
        <Breadcrumbs items={[homeItem, currentItem]} renderLink={renderLink} />,
      )

      expect(
        screen.getByText('Current Page').closest('[data-testid="custom-link"]'),
      ).toBeNull()
    })

    test('uses renderLink for all navigable items', () => {
      const renderLink: RenderLink = (domProps) => {
        if ('href' in domProps) {
          return <a data-testid="custom-link" {...domProps} />
        }
        return <span {...domProps} />
      }

      render(
        <Breadcrumbs
          items={[homeItem, levelOneItem, currentItem]}
          renderLink={renderLink}
        />,
      )

      expect(screen.getAllByTestId('custom-link')).toHaveLength(2)
    })
  })
})
