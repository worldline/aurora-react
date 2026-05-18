import { MotionFadeOutDuration } from '@worldline/aurora-design-tokens/variables'
import cn from 'classnames'
import { type ComponentProps, useCallback, useEffect, useState } from 'react'
import { type ToastProps as RAToastProps } from 'react-aria-components'

import { Alert } from '../Alert'
import styles from './Toast.module.css'

const motionFadeOutDuration = parseInt(MotionFadeOutDuration, 10)

type ToastVariant = NonNullable<ComponentProps<typeof Alert>['variant']>

interface ToastContent {
  variant: ToastVariant
  title: string
  content: string
  closeLabel: string
  options?: { timeout?: number }
}

interface ToastProps extends RAToastProps<ToastContent> {
  onClose: () => void
}

const Toast = ({ toast, onClose, className }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = useCallback((): void => {
    setIsVisible(false)
  }, [])

  useEffect(() => {
    if (isVisible) {
      return () => void 0
    }

    const timeout = setTimeout(onClose, motionFadeOutDuration)

    return () => {
      clearTimeout(timeout)
    }
  }, [isVisible, onClose])

  useEffect(() => {
    if (!toast.timeout) {
      return () => void 0
    }

    const timeout = setTimeout(
      handleClose,
      toast.timeout - motionFadeOutDuration,
    )

    return () => {
      clearTimeout(timeout)
    }
  }, [toast.timeout, handleClose])

  return (
    <Alert
      title={toast.content.title}
      variant={toast.content.variant}
      onClose={handleClose}
      closeLabel={toast.content.closeLabel}
      className={cn(className, {
        [styles['toast-fade-out']]: !isVisible,
      })}
      id={toast.key}
    >
      {toast.content.content}
    </Alert>
  )
}

export { Toast, type ToastProps, type ToastContent }
