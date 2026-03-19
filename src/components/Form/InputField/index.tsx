import { announce } from '@react-aria/live-announcer'
import cn from 'classnames'
import { useEffect, type ReactElement } from 'react'
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  Label,
  Input,
  FieldError,
} from 'react-aria-components'

import { ErrorMessage } from '@/components/Form/ErrorMessage'
import { Typography } from '@/components/Typography'

import styles from './InputField.module.css'

interface AuroraInputFieldProps {
  size?: 'small' | 'medium'
  label?: string
  error?: string | boolean
  announceError?: 'polite' | 'assertive' | false
  placeholder?: string
}

type Props = AuroraInputFieldProps &
  Omit<AriaTextFieldProps, 'children' | 'validate' | 'validationBehavior'>

const InputField = ({
  size = 'small',
  label,
  error,
  className,
  announceError = 'polite',
  placeholder,
  ...props
}: Props): ReactElement => {
  useEffect(() => {
    if (error && typeof error === 'string' && announceError) {
      announce(error, announceError)
    }
  }, [error, announceError])

  return (
    <AriaTextField
      {...props}
      className={cn(styles.container, styles[size], className)}
      isInvalid={Boolean(error)}
    >
      {label && (
        <Typography element="span" textStyle="labelSm">
          <Label className={styles.label}>{label}</Label>
        </Typography>
      )}
      <Input className={styles.input} placeholder={placeholder} />
      <FieldError>
        {error && typeof error === 'string' ? (
          <ErrorMessage error={error} />
        ) : null}
      </FieldError>
    </AriaTextField>
  )
}

export { InputField }
