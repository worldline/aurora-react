'use client'

import cn from 'classnames'
import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  useId,
} from 'react'

import { LoadingCircleIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './Spinner.module.css'

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'
type SpinnerVariant = 'line-simple' | 'line-spinner'

interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: SpinnerVariant
  size?: SpinnerSize
  icon?: ReactElement
  width?: number | string
  height?: number | string
  title?: ReactNode
}

const textStyleMap: Record<SpinnerSize, 'labelSm' | 'labelLg'> = {
  sm: 'labelSm',
  md: 'labelSm',
  lg: 'labelLg',
  xl: 'labelLg',
}

const sizeClassMap: Record<SpinnerSize, string> = {
  sm: styles['size-sm'],
  md: styles['size-md'],
  lg: styles['size-lg'],
  xl: styles['size-xl'],
}

const variantClassMap: Record<SpinnerVariant, string> = {
  'line-simple': styles['variant-line-simple'],
  'line-spinner': styles['variant-line-spinner'],
}

const Spinner = ({
  variant = 'line-simple',
  size = 'sm',
  icon,
  width,
  height,
  title,
  role = 'status',
  'aria-live': ariaLive = 'polite',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  style,
  ...props
}: SpinnerProps) => {
  const generatedTitleId = useId()
  const hasTitle = title !== undefined && title !== null && title !== ''
  const titleId = hasTitle ? generatedTitleId : undefined

  // Compute accessible labeling
  let computedAriaLabelledBy: string | undefined = ariaLabelledBy
  if (computedAriaLabelledBy === undefined && !ariaLabel) {
    computedAriaLabelledBy = titleId
  }

  let computedAriaLabel: string | undefined = ariaLabel
  if (computedAriaLabel === undefined && !hasTitle && !ariaLabelledBy) {
    computedAriaLabel = 'Loading'
  }

  const resolvedWidth = width ?? height
  const resolvedHeight = height ?? width

  const iconContainerStyle: CSSProperties = {
    ...(resolvedWidth !== undefined
      ? {
          width:
            typeof resolvedWidth === 'number'
              ? `${String(resolvedWidth)}px`
              : resolvedWidth,
        }
      : {}),
    ...(resolvedHeight !== undefined
      ? {
          height:
            typeof resolvedHeight === 'number'
              ? `${String(resolvedHeight)}px`
              : resolvedHeight,
        }
      : {}),
  }

  const renderTitle = () => {
    if (!hasTitle) {
      return null
    }
    if (typeof title === 'string') {
      return (
        <Typography
          id={titleId}
          element="p"
          textStyle={textStyleMap[size]}
          textColor="contentPrimary"
          className={styles.title}
        >
          {title}
        </Typography>
      )
    }
    return title
  }

  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-label={computedAriaLabel}
      aria-labelledby={computedAriaLabelledBy}
      className={cn(
        styles.spinner,
        variantClassMap[variant],
        sizeClassMap[size],
        className,
      )}
      style={style}
      {...props}
    >
      <div className={styles['icon-container']} style={iconContainerStyle}>
        <div className={styles['spinner-animation']}>
          {icon ?? (
            <LoadingCircleIcon
              aria-hidden
              className={styles.icon}
              size="100%"
            />
          )}
        </div>
      </div>

      {renderTitle()}
    </div>
  )
}

export { Spinner, type SpinnerProps, type SpinnerSize, type SpinnerVariant }
