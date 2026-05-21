import { ErrorMessage } from '@/components/Form/ErrorMessage'
import { Typography } from '@/components/Typography'

import styles from './Select.module.css'

/** Props for the SelectFieldSupport component. */
interface SelectFieldSupportProps {
  /** Error message to display. */
  error?: string
  /** HTML id applied to the error message for `aria-describedby` association. */
  errorId?: string
  /** Helper text displayed when there is no error. */
  helperText?: string
}

const SelectFieldSupport = ({
  error,
  errorId,
  helperText,
}: SelectFieldSupportProps) => (
  <div className={styles['help-line']}>
    {error ? (
      <ErrorMessage id={errorId} error={error} />
    ) : (
      <Typography
        element="span"
        textStyle="captionMd"
        className={styles['helper-text']}
      >
        {helperText}
      </Typography>
    )}
  </div>
)

export { SelectFieldSupport, type SelectFieldSupportProps }
