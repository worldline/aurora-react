import { UNSTABLE_ToastQueue as RAToastQueue } from 'react-aria-components'

import type { ToastContent } from './Toast'

class ToastService {
  private readonly queue: RAToastQueue<ToastContent> =
    new RAToastQueue<ToastContent>()

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
