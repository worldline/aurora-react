import { render as rtlRender, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { page, userEvent } from 'vitest/browser'

import { ThemeWrapper, type Theme } from '../ThemeWrapper'

const testId = 'theme-wrapper'

const render = async (
  children: ReactElement,
  theme: Theme,
  renderOptions?: RenderOptions,
) => {
  const result = rtlRender(
    <ThemeWrapper data-testid={testId} theme={theme}>
      {children}
    </ThemeWrapper>,
    renderOptions,
  )

  await document.fonts.ready
  // Unhover to avoid mouse position / hover styles from leaking between tests
  const user = userEvent.setup()
  await user.unhover(document.body, { position: { x: 9999, y: 9999 } })

  return result
}

const getWrapper = () => page.getByTestId(testId)

export { render, getWrapper }
