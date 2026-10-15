import { UNSTABLE_ToastQueue as RAToastQueue } from 'react-aria-components'
import { flushSync } from 'react-dom'

import type { ToastContent } from './Toast'

class ToastService {
  private readonly queue: RAToastQueue<ToastContent> =
    new RAToastQueue<ToastContent>({
      wrapUpdate(updateToasts: () => void): void {
        if (!('startViewTransition' in document)) {
          updateToasts()
          return
        }
        document.startViewTransition(() => {
          // The view transition needs the DOM updated synchronously
          // eslint-disable-next-line @eslint-react/dom-no-flush-sync, react-dom/no-flush-sync
          flushSync(updateToasts)
        })
      },
    })

  addToast({
    variant,
    title,
    content,
    closeLabel,
    options,
    className,
  }: ToastContent): void {
    this.queue.add(
      {
        variant,
        title,
        content,
        closeLabel,
        options,
        className,
      },
      { timeout: options?.timeout },
    )
  }

  closeToast(id: string): void {
    this.queue.close(id)
  }

  closeAllToasts(): void {
    this.queue.clear()
  }

  getQueue(): RAToastQueue<ToastContent> {
    return this.queue
  }
}

const toastService = new ToastService()

export { toastService, type ToastContent }
