import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { ProgressCircle } from '.'

const CONIC_GRADIENT_LITERAL = 'conic-gradient'

describe('ProgressCircle', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('renders with progressbar role and accessible label', () => {
    render(
      <ProgressCircle value={4} maxValue={5} aria-label="Upload progress" />,
    )

    expect(
      screen.getByRole('progressbar', { name: 'Upload progress' }),
    ).toBeInTheDocument()
  })

  test('sets correct aria-valuenow, aria-valuemin, aria-valuemax', () => {
    render(<ProgressCircle value={3} maxValue={5} aria-label="Progress" />)

    const progressbar = screen.getByRole('progressbar', { name: 'Progress' })
    expect(progressbar).toHaveAttribute('aria-valuenow', '3')
    expect(progressbar).toHaveAttribute('aria-valuemin', '1')
    expect(progressbar).toHaveAttribute('aria-valuemax', '5')
  })

  test('displays value/maxValue as label', () => {
    render(<ProgressCircle value={4} maxValue={5} aria-label="Progress" />)

    expect(screen.getByText('4/5')).toBeInTheDocument()
  })

  test('sets conic gradient to 0% when value is at minValue', () => {
    render(
      <ProgressCircle
        value={0}
        minValue={0}
        maxValue={5}
        aria-label="Progress"
      />,
    )

    const progressbar = screen.getByRole('progressbar', { name: 'Progress' })
    const wrapper = progressbar.querySelector('div')

    expect(wrapper).not.toBeNull()
    expect(wrapper?.getAttribute('style')).toContain(CONIC_GRADIENT_LITERAL)
    expect(wrapper?.getAttribute('style')).toContain('0%')
  })

  test('sets conic gradient to 100% when value is at maxValue', () => {
    render(
      <ProgressCircle value={5} maxValue={5} aria-label="Progress complete" />,
    )

    const progressbar = screen.getByRole('progressbar', {
      name: 'Progress complete',
    })
    const wrapper = progressbar.querySelector('div')

    expect(wrapper).not.toBeNull()
    expect(wrapper?.getAttribute('style')).toContain(CONIC_GRADIENT_LITERAL)
    expect(wrapper?.getAttribute('style')).toContain('100%')
  })

  test('applies provided backgroundColor to the inner value label', () => {
    render(
      <ProgressCircle
        value={3}
        maxValue={5}
        aria-label="Progress"
        style={{ backgroundColor: 'red' }}
      />,
    )

    const progressbar = screen.getByRole('progressbar', { name: 'Progress' })
    const label = progressbar.querySelector('span')

    expect(label).not.toBeNull()
    expect(label?.getAttribute('style')).toContain('background-color: red;')
  })

  test('throws when value exceeds maxValue', () => {
    expect(() =>
      render(<ProgressCircle value={6} maxValue={5} aria-label="Progress" />),
    ).toThrow('value (6) must be between')
  })

  test('throws when minValue exceeds maxValue', () => {
    expect(() =>
      render(
        <ProgressCircle
          value={4}
          minValue={6}
          maxValue={5}
          aria-label="Progress"
        />,
      ),
    ).toThrow('minValue (6) must not exceed maxValue (5)')
  })
})
