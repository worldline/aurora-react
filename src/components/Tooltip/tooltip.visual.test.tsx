import { describe, expect, test } from 'vitest'

import { type Theme, themes } from '@/__tests__/ThemeWrapper'
import { render } from '@/__tests__/visual/testUtils'
import { Button } from '@/components/Button'

import { Tooltip, type TooltipAlignment, TooltipTrigger } from '.'

const alignments = [
  'top start',
  'top',
  'top end',
  'bottom start',
  'bottom',
  'bottom end',
  'left',
  'right',
] as const

interface TooltipTestProps {
  title?: string
  description?: string
  alignment?: TooltipAlignment
}

const renderOpenTooltip = async (props: TooltipTestProps, theme: Theme) => {
  await render(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '160px',
      }}
    >
      <TooltipTrigger isOpen delay={0}>
        <Button variant="primary">Tooltip trigger</Button>
        <Tooltip {...props} />
      </TooltipTrigger>
    </div>,
    theme,
  )
}

describe('Tooltip', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('title only', async () => {
      await renderOpenTooltip(
        {
          title: 'Tooltip title',
        },
        theme,
      )

      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test.each(alignments)('%s alignment', async (alignment) => {
      await renderOpenTooltip(
        {
          title: 'Tooltip title',
          description: 'Tooltip description here',
          alignment,
        },
        theme,
      )

      await expect(document.querySelector('body')).toMatchScreenshot()
    })
  })
})
