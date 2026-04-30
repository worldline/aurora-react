import { FieldError, Text } from 'react-aria-components'

import { ErrorMessage } from '@/components/Form/ErrorMessage'
import { Typography } from '@/components/Typography'

import styles from './InputField.module.css'

interface FieldSupportProps {
  error?: string | boolean
  helperText?: string
  maxLength?: number
  currentLength: number
  isDisabled?: boolean
  isReadOnly?: boolean
}

const FieldSupport = ({
  error,
  helperText,
  maxLength,
  currentLength,
  isDisabled,
  isReadOnly,
}: FieldSupportProps) => {
  const isErrorString = typeof error === 'string'

  return (
    <div
      className={styles['help-line']}
      data-disabled={isDisabled}
      data-invalid={Boolean(error)}
      data-readonly={isReadOnly}
    >
      {isErrorString && !isDisabled ? (
        <FieldError>
          <ErrorMessage error={error} />
        </FieldError>
      ) : (
        <Text slot="description">
          <Typography
            element="span"
            textStyle="captionMd"
            className={styles['helper-text']}
          >
            {helperText}
          </Typography>
        </Text>
      )}

      {maxLength !== undefined ? (
        <Typography
          element="span"
          textStyle="captionMd"
          className={styles['character-count']}
        >
          {currentLength}/{maxLength}
        </Typography>
      ) : null}
    </div>
  )
}

export { FieldSupport }
