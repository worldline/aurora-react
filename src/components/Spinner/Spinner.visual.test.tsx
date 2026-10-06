import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'
import { HourglassTopIcon } from '@/components/icons'

import { Spinner, type SpinnerSize, type SpinnerVariant } from '.'

const sizes: Array<SpinnerSize> = ['sm', 'md', 'lg', 'xl']
const variants: Array<SpinnerVariant> = ['line-simple', 'line-spinner']

describe('Spinner', () => {
  describe.each(themes)('%s mode', (theme) => {
    test.each(variants)('variant %s', async (variant) => {
      await render(
        <Spinner variant={variant} size="md" title="Loading..." />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test.each(sizes)('size %s with title', async (size) => {
      await render(<Spinner size={size} title="Loading..." />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test.each(sizes)('size %s without title', async (size) => {
      await render(<Spinner size={size} />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with custom icon', async () => {
      await render(
        <Spinner
          size="md"
          icon={<HourglassTopIcon aria-hidden />}
          title="Waiting..."
        />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with custom size (80px)', async () => {
      await render(<Spinner width={80} height={80} title="Custom" />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
