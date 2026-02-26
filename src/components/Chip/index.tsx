/* eslint-disable @eslint-react/no-clone-element */
import cn from 'classnames'
import { cloneElement, type HTMLAttributes, type ReactElement } from 'react'

import { Typography } from '../Typography'

import styles from './Chip.module.css'

type Type = 'neutral' | 'brand' | 'success' | 'warning' | 'error'
type Size = 'small' | 'large'

interface Props extends HTMLAttributes<HTMLDivElement> {
  type: Type
  size: Size
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

export { Chip }

const typesToTextColor: Record<
  Type,
  React.ComponentProps<typeof Typography>['textColor']
> = {
  brand: 'contentBrand',
  error: 'contentError',
  neutral: 'contentSecondary',
  success: 'contentSuccess',
  warning: 'contentWarning',
}

const sizesToTextStyle: Record<
  Size,
  React.ComponentProps<typeof Typography>['textStyle']
> = {
  small: 'labelSm',
  large: 'labelMd',
}
