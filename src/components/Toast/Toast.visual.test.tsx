import { act } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { render } from '@/__tests__/visual/testUtils'

import { Button } from '../Button'
import styles from './Toast.stories.module.css'
import { ToastProvider } from './ToastProvider'
import { ToastRegion } from './ToastRegion'
import { useToast } from './useToast'

const ToastButtons = ({
  variant = 'info',
  title = 'Toast notification',
  content = 'This is a toast message',
  timeout,
}: {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  content?: string
  timeout?: number
}) => {
  const { addToast, closeAllToasts } = useToast()
  return (
    <>
      <Button
        style={{ marginTop: '100px' }}
        onPress={() => {
          addToast({
            title,
            content,
            closeLabel: 'Close Toast',
            options: { timeout },
            variant,
          })
        }}
      >
        Show Toast
      </Button>
      <Button
        onPress={() => {
          closeAllToasts()
        }}
      >
        Close all Toasts
      </Button>
    </>
  )
}

const ToastPage = (props: {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  content?: string
  timeout?: number
}) => (
  <ToastProvider>
    <ToastRegion className={styles['toast-region']} />
    <ToastButtons {...props} />
  </ToastProvider>
)

describe('Toast', () => {
  const user = userEvent.setup()

  describe.each(themes)('%s mode', (theme) => {
    describe.each(['info', 'success', 'warning', 'error'] as const)(
      '%s',
      (type) => {
        test('', async () => {
          await render(<ToastPage variant={type} />, theme)
          await act(async () => {
            await user.click(page.getByRole('button', { name: 'Show Toast' }))
          })

          await act(async () => {
            await document.activeViewTransition?.finished
          })

          try {
            await expect(document.querySelector('body')).toMatchScreenshot()
          } finally {
            await act(async () => {
              await user.click(
                page.getByRole('button', { name: 'Close all Toasts' }),
              )
            })
            await act(async () => {
              await document.activeViewTransition?.finished
            })
          }
        })
      },
    )
  })
})
