'use client'

import { announce } from '@react-aria/live-announcer'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import {
  TextArea as AriaTextArea,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  Label,
} from 'react-aria-components'

import { FieldSupport } from '@/components/Form/FieldSupport'
import { Typography } from '@/components/Typography'

import styles from './TextArea.module.css'

const DEFAULT_SIZE = 'small' as const
const DEFAULT_ANNOUNCE_ERROR = 'polite' as const
const DEFAULT_CHARACTER_COUNT = true
const DEFAULT_ROWS = 5

interface TextAreaProps {
  /** Size variant of the textarea */
  size?: 'small' | 'medium'
  /** Label text displayed above the textarea */
  label?: string
  /** Error message or boolean to indicate error state */
  error?: string | boolean
  /** Controls how errors are announced to screen readers */
  announceError?: 'polite' | 'assertive' | false
  /** Placeholder text displayed when the textarea is empty */
  placeholder?: string
  /** Helper text displayed below the textarea */
  helperText?: string
  /** Maximum character length with counter display */
  maxLength?: number
  /** Whether the character count is displayed when maxLength is set */
  characterCount?: boolean
  /** Number of visible text rows */
  rows?: number
}

type Props = TextAreaProps &
  Omit<AriaTextFieldProps, 'children' | 'validate' | 'validationBehavior'>

const TextArea = ({
  size = DEFAULT_SIZE,
  label,
  error,
  className,
  announceError = DEFAULT_ANNOUNCE_ERROR,
  placeholder,
  helperText,
  maxLength,
  characterCount = DEFAULT_CHARACTER_COUNT,
  rows = DEFAULT_ROWS,
  isRequired,
  onChange,
  value,
  defaultValue,
  ...props
}: Props) => {
  const [internalLength, setInternalLength] = useState<number>(
    (defaultValue ?? '').length,
  )

  const currentLength = value !== undefined ? value.length : internalLength
  const visibleMaxLength = characterCount ? maxLength : undefined
  const shouldRenderSupport =
    typeof error === 'string' ||
    Boolean(helperText) ||
    visibleMaxLength !== undefined

  useEffect(() => {
    if (error && typeof error === 'string' && announceError) {
      announce(error, announceError)
    }
  }, [error, announceError])

  const handleChange = (newValue: string): void => {
    setInternalLength(newValue.length)
    onChange?.(newValue)
  }

  return (
    <AriaTextField
      {...props}
      aria-label={label ? props['aria-label'] : (props['aria-label'] ?? label)}
      className={cn(
        styles.container,
        styles[size],
        { [styles.filled]: currentLength > 0 },
        className,
      )}
      isInvalid={Boolean(error)}
      isRequired={isRequired}
      onChange={handleChange}
      value={value}
      defaultValue={defaultValue}
    >
      {label ? (
        <Label>
          <Typography
            element="span"
            textStyle="labelSm"
            className={styles.label}
          >
            {label}
            {isRequired ? <span aria-hidden="true">*</span> : null}
          </Typography>
        </Label>
      ) : null}

      <AriaTextArea
        className={styles.textarea}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        data-placeholder={currentLength === 0 || undefined}
      />

      {shouldRenderSupport ? (
        <FieldSupport
          error={error}
          helperText={helperText}
          maxLength={visibleMaxLength}
          currentLength={currentLength}
          isDisabled={props.isDisabled}
          isReadOnly={props.isReadOnly}
        />
      ) : null}
    </AriaTextField>
  )
}

export { TextArea, type TextAreaProps }
