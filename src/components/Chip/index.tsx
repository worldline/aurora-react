/* eslint-disable @eslint-react/no-clone-element */
import cn from 'classnames'
import { cloneElement, type HTMLAttributes, type ReactElement } from 'react'

import { Typography } from '../Typography'

import styles from './Chip.module.css'

type ChipType = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'error'
type ChipSize = 'small' | 'large'

interface Props extends HTMLAttributes<HTMLDivElement> {
  type: ChipType
  size: ChipSize
  label: string
  leadingIcon?: ReactElement<{
    className?: string
  }>
  trailingIcon?: ReactElement<{
    className?: string
  }>
}

const Chip = ({
  type,
  size,
  label,
  leadingIcon,
  trailingIcon,
  className,
  ...props
}: Props): ReactElement => {
  const leadingIconElement = leadingIcon
    ? cloneElement(leadingIcon, {
        className: cn(
          styles[`icon-${size}`],
          styles[`icon-${type}`],
          leadingIcon.props.className,
        ),
      })
    : null

  const trailingIconElement = trailingIcon
    ? cloneElement(trailingIcon, {
        className: cn(
          styles[`icon-${size}`],
          styles[`icon-${type}`],
          trailingIcon.props.className,
        ),
      })
    : null

  return (
    <div
      className={cn(
        styles.chip,
        styles[type],
        styles[size],
        {
          [styles['vpadding-icon']]:
            !!leadingIconElement || trailingIconElement,
          [styles['hpadding-left-icon']]: !!leadingIconElement,
          [styles['hpadding-right-icon']]: !!trailingIconElement,
        },
        className,
      )}
      {...props}
    >
      {leadingIconElement}
      <Typography
        element="span"
        textStyle={sizesToTextStyle[size]}
        textColor={typesToTextColor[type]}
      >
        {label}
      </Typography>
      {trailingIconElement}
    </div>
  )
}

export { Chip, type ChipType, type ChipSize }

const typesToTextColor: Record<
  ChipType,
  React.ComponentProps<typeof Typography>['textColor']
> = {
  brand: 'contentBrand',
  error: 'contentError',
  info: 'contentInfo',
  neutral: 'contentSecondary',
  success: 'contentSuccess',
  warning: 'contentWarning',
}

const sizesToTextStyle: Record<
  ChipSize,
  React.ComponentProps<typeof Typography>['textStyle']
> = {
  small: 'labelSm',
  large: 'labelMd',
}
