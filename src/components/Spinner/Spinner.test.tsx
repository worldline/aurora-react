import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HourglassTopIcon } from '@/components/icons'

import { Spinner } from '.'

describe('Spinner', () => {
  it('should render default spinner with role="status", default variant and default aria-label', () => {
    render(<Spinner data-testid="spinner" />)

    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
    expect(spinner).toHaveAttribute('aria-live', 'polite')
    expect(spinner).toHaveClass('size-sm')
    expect(spinner).toHaveClass('variant-line-simple')
  })

  it.each([
    ['line-simple', 'variant-line-simple'],
    ['line-spinner', 'variant-line-spinner'],
  ] as const)(
    'should render variant="%s" with class "%s"',
    (variant, expectedVariantClass) => {
      render(<Spinner variant={variant} data-testid={`spinner-${variant}`} />)

      const spinner = screen.getByTestId(`spinner-${variant}`)
      expect(spinner).toHaveClass(expectedVariantClass)
    },
  )

  it.each([
    ['sm', 'size-sm', 'label-sm'],
    ['md', 'size-md', 'label-sm'],
    ['lg', 'size-lg', 'label-lg'],
    ['xl', 'size-xl', 'label-lg'],
  ] as const)(
    'should render size="%s" with class "%s" and text style "%s"',
    (size, expectedSizeClass, expectedTextStyleClass) => {
      render(
        <Spinner
          size={size}
          title="Loading..."
          data-testid={`spinner-${size}`}
        />,
      )

      const spinner = screen.getByTestId(`spinner-${size}`)
      expect(spinner).toHaveClass(expectedSizeClass)

      const titleElement = screen.getByText('Loading...')
      expect(titleElement).toHaveClass(expectedTextStyleClass)
    },
  )

  it('should render title and link with aria-labelledby', () => {
    render(<Spinner title="Loading records..." />)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveTextContent('Loading records...')

    const titleElement = screen.getByText('Loading records...')
    const titleId = titleElement.getAttribute('id')
    expect(titleId).toBeTruthy()
    expect(spinner).toHaveAttribute('aria-labelledby', titleId)
    expect(spinner).not.toHaveAttribute('aria-label')
  })

  it('should apply custom width and height as numbers (converted to px)', () => {
    render(<Spinner width={48} height={48} data-testid="spinner" />)

    const spinner = screen.getByTestId('spinner')
    const iconContainer = spinner.firstElementChild as HTMLElement
    expect(iconContainer).toHaveStyle({ width: '48px', height: '48px' })
  })

  it('should apply custom width and height as strings', () => {
    render(<Spinner width="3rem" height="3rem" data-testid="spinner" />)

    const spinner = screen.getByTestId('spinner')
    const iconContainer = spinner.firstElementChild as HTMLElement
    expect(iconContainer).toHaveStyle({ width: '3rem', height: '3rem' })
  })

  it('should make height match width when only width is provided', () => {
    render(<Spinner width={50} data-testid="spinner" />)

    const spinner = screen.getByTestId('spinner')
    const iconContainer = spinner.firstElementChild as HTMLElement
    expect(iconContainer).toHaveStyle({ width: '50px', height: '50px' })
  })

  it('should make width match height when only height is provided', () => {
    render(<Spinner height={60} data-testid="spinner" />)

    const spinner = screen.getByTestId('spinner')
    const iconContainer = spinner.firstElementChild as HTMLElement
    expect(iconContainer).toHaveStyle({ width: '60px', height: '60px' })
  })

  it('should render custom icon when provided', () => {
    render(
      <Spinner
        icon={<HourglassTopIcon data-testid="custom-hourglass-icon" />}
      />,
    )

    const customIcon = screen.getByTestId('custom-hourglass-icon')
    expect(customIcon).toBeInTheDocument()
  })

  it('should allow custom aria-label overriding default and title labelling', () => {
    render(
      <Spinner aria-label="Custom loading label" title="Visual title only" />,
    )

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Custom loading label')
    expect(spinner).not.toHaveAttribute('aria-labelledby')
  })

  it('should apply custom className and style', () => {
    render(
      <Spinner
        className="custom-spinner-class"
        style={{ marginTop: '20px' }}
        data-testid="spinner"
      />,
    )

    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveClass('custom-spinner-class')
    expect(spinner).toHaveStyle({ marginTop: '20px' })
  })

  it('should support custom role and aria-live', () => {
    render(
      <Spinner
        role="progressbar"
        aria-live="assertive"
        data-testid="spinner"
      />,
    )

    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveAttribute('role', 'progressbar')
    expect(spinner).toHaveAttribute('aria-live', 'assertive')
  })

  it('should render custom ReactNode for title', () => {
    render(
      <Spinner
        title={<span data-testid="custom-title">Custom Node Title</span>}
      />,
    )

    expect(screen.getByTestId('custom-title')).toBeInTheDocument()
  })
})
