import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import { Breadcrumbs } from '.'

const homeItem = { id: 'home', label: 'Home', href: '/' }

describe('Breadcrumbs', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('single home item', async () => {
      await render(<Breadcrumbs items={[homeItem]} />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('two items', async () => {
      await render(
        <Breadcrumbs
          items={[
            homeItem,
            { id: 'current', label: 'Level 1', href: '/level-1' },
          ]}
        />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('three items', async () => {
      await render(
        <Breadcrumbs
          items={[
            homeItem,
            { id: 'level-1', label: 'Level 1', href: '/level-1' },
            { id: 'current', label: 'Level 2', href: '/level-1/level-2' },
          ]}
        />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('five items', async () => {
      await render(
        <Breadcrumbs
          items={[
            homeItem,
            { id: 'level-1', label: 'Level 1', href: '/level-1' },
            { id: 'level-2', label: 'Level 2', href: '/level-1/level-2' },
            {
              id: 'level-3',
              label: 'Level 3',
              href: '/level-1/level-2/level-3',
            },
            {
              id: 'current',
              label: 'Level 4',
              href: '/level-1/level-2/level-3/level-4',
            },
          ]}
        />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
