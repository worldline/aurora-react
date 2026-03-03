import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Check from '../icons/Check'

import { FeaturedIcon } from '.'

describe('FeaturedIcon', () => {
  it('should apply className from props and internal classNames', () => {
    render(
      <FeaturedIcon
        size="large"
        icon={<Check aria-hidden />}
        className="custom-class"
        data-testid="icon"
      />,
    )

    const container = screen.getByTestId('icon')
    expect(container).toHaveClass('container')
    expect(container).toHaveClass('large')
    expect(container).toHaveClass('custom-class')
  })
})
