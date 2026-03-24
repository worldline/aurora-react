import cn from 'classnames'
import type { ReactElement, ReactNode } from 'react'
import { Button } from 'react-aria-components'

import { CheckCircleIcon, ErrorIcon, WarningIcon } from '../icons'
import CloseIcon from '../icons/Close'
import { Typography } from '../main'

import styles from './Alert.module.css'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  /**
   * Semantic meaning of the alert
   * Maps to visual style and icon
   * @default 'info'
   */
  variant?: AlertVariant

  /**
   * Optional heading displayed above content
   */
  title?: string

  /**
   * Main content of the alert
   */
  children: ReactNode

  /**
   * Enables dismiss functionality
   * If provided, close button is rendered
   */
  onClose?: () => void

  /**
   * Additional CSS class names
   */
  className?: string
}

type IconComponent = typeof CheckCircleIcon

const ALERT_ICON_MAP = {
  info: ErrorIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
} satisfies Record<AlertVariant, IconComponent>

const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}: AlertProps): ReactElement => {
  const Icon = ALERT_ICON_MAP[variant]
  return (
    <div
      role="alert"
      data-variant={variant}
      className={cn(styles.alert, className)}
    >
      <Icon aria-hidden className={styles.icon} />
      <div className={styles.content}>
        {title ? (
          <Typography element="p" textStyle="titleSm">
            {title}
          </Typography>
        ) : null}
        <Typography element="p" textStyle="bodyMd" textColor="contentSecondary">
          {children}
        </Typography>
      </div>

      {onClose ? (
        <Button onClick={onClose} aria-label="Close alert">
          <CloseIcon aria-hidden />
        </Button>
      ) : null}
    </div>
  )
}

export { Alert, type AlertProps }
