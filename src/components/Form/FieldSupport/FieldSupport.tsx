import { FieldError, Text } from 'react-aria-components'

import { ErrorMessage } from '@/components/Form/ErrorMessage'
import { Typography } from '@/components/Typography'

import styles from './FieldSupport.module.css'

interface FieldSupportProps {
  /** Error message or boolean to indicate error state */
  error?: string | boolean
  /** Helper text displayed below the field */
  helperText?: string
  /** Maximum character length for the counter display */
  maxLength?: number
  /** Current character count */
  currentLength: number
  /** Whether the field is disabled */
  isDisabled?: boolean
  /** Whether the field is read-only */
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
      aria-disabled={isDisabled ? true : undefined}
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
            data-helper-text
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
          data-character-count
        >
          {currentLength}/{maxLength}
        </Typography>
      ) : null}
    </div>
  )
}

export { FieldSupport, type FieldSupportProps }
