import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'
import { CheckCircleIcon } from '@/components/icons'

import { FeaturedIcon } from './index'

describe('FeaturedIcon', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('square with low emphasis', async () => {
      await render(
        <FeaturedIcon
          type="square"
          size="medium"
          emphasis="low"
          icon={<CheckCircleIcon aria-hidden />}
        />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('square with medium emphasis', async () => {
      await render(
        <FeaturedIcon
          type="square"
          size="medium"
          emphasis="medium"
          icon={<CheckCircleIcon aria-hidden />}
        />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('circle with low emphasis', async () => {
      await render(
        <FeaturedIcon
          type="circle"
          size="medium"
          emphasis="low"
          icon={<CheckCircleIcon aria-hidden />}
        />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('circle with medium emphasis', async () => {
      await render(
        <FeaturedIcon
          type="circle"
          size="medium"
          emphasis="medium"
          icon={<CheckCircleIcon aria-hidden />}
        />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
