import cn from 'classnames'
import type { HTMLAttributes, ReactElement } from 'react'

import styles from './Chip.module.css'

interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  type: 'neutral' | 'brand' | 'success' | 'warning' | 'error'
  size: 'small' | 'large'
  label: string
  renderLeadingIcon?: (color: string, className: string) => ReactElement
  renderTrailingIcon?: (color: string, className: string) => ReactElement
}

const Chip = ({
  type,
  size,
  label,
  renderLeadingIcon,
  renderTrailingIcon,
  ...props
}: ChipProps): ReactElement => {
  const iconStyle = {
    small: styles['icon-small'],
    large: styles['icon-large'],
  }

  const leadingIcon = renderLeadingIcon?.('currentColor', iconStyle[size])
  const trailingIcon = renderTrailingIcon?.('currentColor', iconStyle[size])

  return (
    <div className={cn(styles.chip, styles[type], styles[size])} {...props}>
      {leadingIcon}
      <span>{label}</span>
      {trailingIcon}
    </div>
  )
}

export { Chip }
