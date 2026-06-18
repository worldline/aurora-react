import cn from 'classnames'

import type { AuroraButtonProps } from './Button'
import styles from './Button.module.css'

const sizeStyles = {
  small: styles.sm,
  medium: styles.md,
  large: styles.lg,
} as const

const buttonClassName = ({
  variant = 'primary',
  size = 'medium',
}: {
  variant: AuroraButtonProps['variant']
  size: AuroraButtonProps['size']
}): string => cn(styles.button, styles[variant], sizeStyles[size])

export { buttonClassName }
