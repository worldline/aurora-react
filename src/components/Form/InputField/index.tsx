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
} from 'react-aria-components'

import { Typography } from '@/components/Typography'

import { FieldSupport } from './FieldSupport'
import styles from './InputField.module.css'

interface InputFieldProps {
  size?: 'small' | 'medium' | 'large'
  label?: string
  error?: string | boolean
  announceError?: 'polite' | 'assertive' | false
  placeholder?: string
  leading?: ReactNode
  trailing?: ReactNode
  helperText?: string
  maxLength?: number
}

type Props = InputFieldProps &
  Omit<AriaTextFieldProps, 'children' | 'validate' | 'validationBehavior'>

const InputField = ({
  size = 'small',
  label,
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
  ...props
}: Props) => {
  const [internalLength, setInternalLength] = useState(
    (defaultValue ?? '').length,
  )

  const currentLength = value !== undefined ? value.length : internalLength

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

export { InputField, type InputFieldProps }
