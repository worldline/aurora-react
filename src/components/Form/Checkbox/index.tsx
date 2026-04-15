'use client'

import cn from 'classnames'
import { useId, type ComponentProps } from 'react'
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps,
} from 'react-aria-components'

import { ErrorMessage } from '@/components/Form/ErrorMessage'
import { CheckIcon, CheckIndeterminateIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './Checkbox.module.css'

export type CheckboxSize = 'small' | 'medium'

export interface CustomCheckboxProps extends Omit<CheckboxProps, 'children'> {
  /** Custom label content as children (alternative to title/helperText props) */
  children?: React.ReactNode
  /** Size variant of the checkbox */
  size?: CheckboxSize
  /** Main title text displayed next to checkbox */
  title?: string
  /** Helper text displayed below the title */
  helperText?: string
  /** Error state - boolean for visual state only, string to display error message */
  error?: boolean | string
}

const sizesToStyleProps: Record<
  CheckboxSize,
  {
    labelTextStyle: ComponentProps<typeof Typography>['textStyle']
    bodyTextStyle: ComponentProps<typeof Typography>['textStyle']
  }
> = {
  small: {
    labelTextStyle: 'labelSm',
    bodyTextStyle: 'bodySm',
  },
  medium: {
    labelTextStyle: 'labelMd',
    bodyTextStyle: 'bodyMd',
  },
}

const sizeStyles = {
  small: styles.sm,
  medium: styles.md,
} as const

const CheckboxStateIcon = ({
  isIndeterminate,
  isSelected,
}: {
  isIndeterminate: boolean
  isSelected: boolean
}) => {
  if (isIndeterminate) {
    return <CheckIndeterminateIcon aria-hidden />
  }
  if (isSelected) {
    return <CheckIcon aria-hidden />
  }
  return null
}

const Checkbox = ({
  children,
  size = 'small',
  title,
  helperText,
  error = false,
  ...props
}: CustomCheckboxProps) => {
  const hasErrorMessage = error && typeof error === 'string'
  const id = useId()
  const titleId = title ? `${id}-title` : undefined
  const errorId = hasErrorMessage ? `${id}-error` : undefined

  return (
    <AriaCheckbox
      isInvalid={Boolean(error)}
      aria-labelledby={titleId}
      aria-describedby={errorId}
      {...props}
      className={cn(
        styles.checkbox,
        sizeStyles[size],
        {
          [styles.error]: error,
        },
        props.className,
      )}
    >
      {({ isIndeterminate, isSelected }) => (
        <>
          <div className={styles.indicator}>
            <CheckboxStateIcon
              isIndeterminate={isIndeterminate}
              isSelected={isSelected}
            />
          </div>
          {title || helperText || hasErrorMessage ? (
            <div className={styles.content}>
              {title ? (
                <Typography
                  id={titleId}
                  element="p"
                  textStyle={sizesToStyleProps[size].labelTextStyle}
                  textColor={
                    props.isDisabled ? 'contentDisabled' : 'contentPrimary'
                  }
                >
                  {title}
                </Typography>
              ) : null}
              {helperText ? (
                <Typography
                  element="p"
                  textStyle={sizesToStyleProps[size].bodyTextStyle}
                  textColor={
                    props.isDisabled ? 'contentDisabled' : 'contentSecondary'
                  }
                >
                  {helperText}
                </Typography>
              ) : null}
              {hasErrorMessage ? (
                <ErrorMessage id={errorId} error={error} />
              ) : null}
            </div>
          ) : (
            children
          )}
        </>
      )}
    </AriaCheckbox>
  )
}

export { Checkbox }
