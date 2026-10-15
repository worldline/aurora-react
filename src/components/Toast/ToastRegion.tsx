import cn from 'classnames'
import {
  UNSTABLE_Toast as RAToast,
  UNSTABLE_ToastContent as RAToastContent,
  UNSTABLE_ToastQueue as RAToastQueue,
  UNSTABLE_ToastRegion as RAToastRegion,
} from 'react-aria-components'

import { Toast } from './Toast'
import styles from './Toast.module.css'
import { type ToastContent, toastService } from './toast.service'
import { useToast } from './useToast'

const ToastRegion = ({
  className,
  toastClassName,
}: {
  className?: string
  toastClassName?: string
}) => {
  const { closeToast } = useToast()
  const queue: RAToastQueue<ToastContent> = toastService.getQueue()
  return (
    <RAToastRegion
      queue={queue}
      className={cn(styles['toast-region'], className)}
    >
      {({ toast }) => {
        const handleToastClose = (): void => {
          closeToast(toast.key)
        }

        return (
          <RAToast
            toast={toast}
            style={{
              viewTransitionName: toast.key,
              viewTransitionClass: styles['toast-transition'],
            }}
            className={cn(
              styles['toast-slide-in'],
              toastClassName,
              toast.content.className,
            )}
            aria-labelledby={toast.key}
          >
            <RAToastContent className={styles['toast-content']}>
              <Toast
                toast={toast}
                onClose={handleToastClose}
                className={cn(styles.toast)}
              />
            </RAToastContent>
          </RAToast>
        )
      }}
    </RAToastRegion>
  )
}

export { ToastRegion }
