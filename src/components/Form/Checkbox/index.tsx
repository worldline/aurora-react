'use client'

import cn from 'classnames'
import { type ComponentProps, type ReactNode, useId, useRef } from 'react'
import {
  CheckboxButton as AriaCheckboxButton,
  CheckboxField as AriaCheckboxField,
  type CheckboxFieldProps,
} from 'react-aria-components'

import { ErrorMessage } from '@/components/Form/ErrorMessage'
import { CheckIcon, CheckIndeterminateSmallIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './Checkbox.module.css'

export type CheckboxSize = 'small' | 'medium'

export interface CustomCheckboxProps extends Omit<
  CheckboxFieldProps,
  'children'
> {
  /** Custom label content as children (alternative to title/helperText props) */
  children?: ReactNode
  /** CSS class applied to the checkbox button element */
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
    return <CheckIndeterminateSmallIcon aria-hidden />
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
  className,
  ...props
}: CustomCheckboxProps) => {
  const hasErrorMessage = error && typeof error === 'string'
  const id = useId()
  const titleId = title ? `${id}-title` : undefined
  const errorId = hasErrorMessage ? `${id}-error` : undefined
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <AriaCheckboxField
      isInvalid={Boolean(error)}
      aria-labelledby={titleId}
      aria-describedby={errorId}
      inputRef={inputRef}
      {...props}
    >
      <AriaCheckboxButton
        className={cn(
          styles.checkbox,
          sizeStyles[size],
          { [styles.error]: error },
          className,
        )}
      >
        {({
          isIndeterminate,
          isSelected,
          isDisabled,
        }: {
          isIndeterminate: boolean
          isSelected: boolean
          isDisabled: boolean
        }) => (
          <>
            <div className={styles.indicator}>
              <CheckboxStateIcon
                isIndeterminate={isIndeterminate}
                isSelected={isSelected}
              />
            </div>
            {title || helperText || hasErrorMessage ? (
              <div
                className={styles.content}
                onClick={() => !isDisabled && inputRef.current?.click()}
              >
                {title ? (
                  <Typography
                    id={titleId}
                    element="p"
                    textStyle={sizesToStyleProps[size].labelTextStyle}
                    textColor={
                      isDisabled ? 'contentDisabled' : 'contentPrimary'
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
                      isDisabled ? 'contentDisabled' : 'contentSecondary'
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
      </AriaCheckboxButton>
    </AriaCheckboxField>
  )
}

export { Checkbox }
