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

import {
  FieldLabel,
  type FieldRequirementProps,
} from '@/components/Form/FieldLabel'
import { FieldSupport } from '@/components/Form/FieldSupport'

import styles from './TextArea.module.css'

const DEFAULT_SIZE = 'small' as const
const DEFAULT_ANNOUNCE_ERROR = 'polite' as const
const DEFAULT_CHARACTER_COUNT = true
const DEFAULT_ROWS = 5

const TOOLTIP_REQUIRES_LABEL_ERROR =
  'TextArea: tooltip requires label to be provided.'
const TOOLTIP_REQUIRES_ARIA_LABEL_ERROR =
  'TextArea: tooltip requires tooltipTriggerAriaLabel to be provided.'

interface TextAreaProps {
  /** Size variant of the textarea */
  size?: 'small' | 'medium'
  /** Label text displayed above the textarea */
  label?: string
  /** Text content for the tooltip shown next to the label; requires label. */
  tooltip?: string
  /** Accessible name for the tooltip trigger button; required when tooltip is set. */
  tooltipTriggerAriaLabel?: string
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
  FieldRequirementProps &
  Omit<
    AriaTextFieldProps,
    'children' | 'validate' | 'validationBehavior' | 'isRequired'
  >

const TextArea = ({
  size = DEFAULT_SIZE,
  label,
  tooltip,
  tooltipTriggerAriaLabel,
  error,
  className,
  announceError = DEFAULT_ANNOUNCE_ERROR,
  placeholder,
  helperText,
  maxLength,
  characterCount = DEFAULT_CHARACTER_COUNT,
  rows = DEFAULT_ROWS,
  isRequired,
  showRequiredMark,
  optionalLabel,
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

  if (tooltip !== undefined && label === undefined) {
    throw new Error(TOOLTIP_REQUIRES_LABEL_ERROR)
  }
  if (tooltip !== undefined && tooltipTriggerAriaLabel === undefined) {
    throw new Error(TOOLTIP_REQUIRES_ARIA_LABEL_ERROR)
  }

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
      {label !== undefined || tooltip !== undefined ? (
        <Label>
          <FieldLabel
            label={label}
            isRequired={isRequired}
            showRequiredMark={showRequiredMark}
            optionalLabel={optionalLabel}
            tooltip={tooltip}
            tooltipTriggerAriaLabel={tooltipTriggerAriaLabel}
            className={styles.label}
          />
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
