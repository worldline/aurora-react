'use client'

import { announce } from '@react-aria/live-announcer'
import cn from 'classnames'
import { type ReactNode, useEffect, useState } from 'react'
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  Group,
  Input,
  Label,
  NumberField,
  type NumberFieldProps,
} from 'react-aria-components'

import { FieldLabel } from '@/components/Form/FieldLabel'
import { FieldSupport } from '@/components/Form/FieldSupport'

import styles from './InputField.module.css'

const TOOLTIP_REQUIRES_LABEL_ERROR =
  'InputField: tooltip requires label to be provided.'
const TOOLTIP_REQUIRES_ARIA_LABEL_ERROR =
  'InputField: tooltip requires tooltipTriggerAriaLabel to be provided.'

interface InputFieldBaseProps {
  /** Size of the input field. */
  size?: 'small' | 'medium' | 'large'
  /** Visible label for the input field. */
  label?: string
  /** Text content for the tooltip shown next to the label; requires label. */
  tooltip?: string
  /** Accessible name for the tooltip trigger button; required when tooltip is set. */
  tooltipTriggerAriaLabel?: string
  /** Error state or error message. */
  error?: string | boolean
  /** How an error message is announced to assistive technology. */
  announceError?: 'polite' | 'assertive' | false
  /** Placeholder text. */
  placeholder?: string
  /** Content to display at the start of the input. */
  leading?: ReactNode
  /** Content to display at the end of the input. */
  trailing?: ReactNode
  /** Helper text displayed below the input. */
  helperText?: string
}

interface DefaultInputFieldProps extends InputFieldBaseProps {
  /** The type of input field. */
  type?: 'default' | 'text' | 'search' | 'url' | 'tel' | 'email' | 'password'
  /** Maximum character length. */
  maxLength?: number
}

interface CurrencyInputFieldProps extends InputFieldBaseProps {
  /** The type of input field. */
  type: 'currency'
}

type DefaultProps = DefaultInputFieldProps &
  Omit<
    AriaTextFieldProps,
    'children' | 'validate' | 'validationBehavior' | 'type'
  >

type CurrencyProps = CurrencyInputFieldProps &
  Omit<NumberFieldProps, 'children'>

type InputFieldProps = DefaultInputFieldProps | CurrencyInputFieldProps

type Props = DefaultProps | CurrencyProps

const DefaultInputField = ({
  size = 'small',
  label,
  tooltip,
  tooltipTriggerAriaLabel,
  error,
  className,
  announceError = 'polite',
  placeholder,
  leading,
  trailing,
  helperText,
  maxLength,
  isRequired,
  onChange,
  value,
  defaultValue,
  type,
  ...props
}: DefaultProps) => {
  const [internalLength, setInternalLength] = useState<number>(
    (defaultValue ?? '').length,
  )

  const currentLength = value !== undefined ? value.length : internalLength
  const htmlInputType =
    type === 'default' || type === undefined ? undefined : type

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
      type={htmlInputType}
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
            tooltip={tooltip}
            tooltipTriggerAriaLabel={tooltipTriggerAriaLabel}
            className={styles.label}
          />
        </Label>
      ) : null}

      <Group className={styles['input-wrapper']}>
        {leading}
        <Input
          className={styles.input}
          placeholder={placeholder}
          maxLength={maxLength}
        />
        {trailing}
      </Group>

      {typeof error === 'string' || helperText || maxLength !== undefined ? (
        <FieldSupport
          error={error}
          helperText={helperText}
          maxLength={maxLength}
          currentLength={currentLength}
          isDisabled={props.isDisabled}
          isReadOnly={props.isReadOnly}
        />
      ) : null}
    </AriaTextField>
  )
}

const CurrencyInputField = ({
  size = 'small',
  label,
  tooltip,
  tooltipTriggerAriaLabel,
  error,
  className,
  announceError = 'polite',
  placeholder,
  leading,
  trailing,
  helperText,
  isRequired,
  onChange,
  value,
  defaultValue,
  type: _type,
  ...props
}: CurrencyProps) => {
  const [internalFilled, setInternalFilled] = useState(
    defaultValue !== undefined && !Number.isNaN(defaultValue),
  )

  const isFilled = value !== undefined ? !Number.isNaN(value) : internalFilled

  useEffect(() => {
    if (error && typeof error === 'string' && announceError) {
      announce(error, announceError)
    }
  }, [error, announceError])

  const handleChange = (newValue: number): void => {
    setInternalFilled(!Number.isNaN(newValue))
    onChange?.(newValue)
  }

  return (
    <NumberField
      {...props}
      className={cn(
        styles.container,
        styles[size],
        { [styles.filled]: isFilled },
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
            tooltip={tooltip}
            tooltipTriggerAriaLabel={tooltipTriggerAriaLabel}
            className={styles.label}
          />
        </Label>
      ) : null}

      <Group className={styles['input-wrapper']}>
        {leading}
        <Input className={styles.input} placeholder={placeholder} />
        {trailing}
      </Group>

      {typeof error === 'string' || helperText ? (
        <FieldSupport
          error={error}
          helperText={helperText}
          currentLength={0}
          isDisabled={props.isDisabled}
          isReadOnly={props.isReadOnly}
        />
      ) : null}
    </NumberField>
  )
}

const InputField = (props: Props) => {
  if (props.tooltip !== undefined && props.label === undefined) {
    throw new Error(TOOLTIP_REQUIRES_LABEL_ERROR)
  }
  if (
    props.tooltip !== undefined &&
    props.tooltipTriggerAriaLabel === undefined
  ) {
    throw new Error(TOOLTIP_REQUIRES_ARIA_LABEL_ERROR)
  }
  if (props.type === 'currency') {
    return <CurrencyInputField {...props} />
  }
  return <DefaultInputField {...props} />
}

export { InputField, type InputFieldProps }
