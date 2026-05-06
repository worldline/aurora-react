import cn from 'classnames'
import type { ReactElement, ReactNode } from 'react'

import { Button } from '../Button'
import { CheckCircleIcon, CloseIcon, ErrorIcon, WarningIcon } from '../icons'
import { Typography } from '../Typography'
import styles from './Alert.module.css'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertBaseProps {
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
   * Additional CSS class names
   */
  className?: string

  /**
   * ID of the content element for accessibility
   */
  id?: string
}

interface AlertClosableProps {
  /**
   * Enables dismiss functionality
   * If provided, close button is rendered
   */
  onClose: () => void

  /**
   * Accessible label for the close button
   * Required when onClose is provided
   */
  closeLabel: string
}

interface AlertNonClosableProps {
  onClose?: never
  closeLabel?: never
}

type AlertProps = AlertBaseProps & (AlertClosableProps | AlertNonClosableProps)

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
  closeLabel,
  className,
  id,
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
        <Typography
          element="p"
          textStyle="bodyMd"
          textColor="contentSecondary"
          id={id}
        >
          {children}
        </Typography>
      </div>

      {onClose ? (
        <Button
          onPress={onClose}
          aria-label={closeLabel}
          variant="link"
          size="small"
        >
          <CloseIcon aria-hidden />
        </Button>
      ) : null}
    </div>
  )
}

export { Alert, type AlertBaseProps as AlertProps }
