import { render as rtlRender, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { page } from 'vitest/browser'

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

  return result
}

const getWrapper = () => page.getByTestId(testId)

export { render, getWrapper }
