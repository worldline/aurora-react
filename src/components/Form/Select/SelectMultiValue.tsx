import { SelectValue } from 'react-aria-components'

import { Typography } from '@/components/Typography'

import styles from './Select.module.css'

/** Props for the SelectMultiValue component. */
interface SelectMultiValueProps {
  /** Placeholder text shown when no option is selected. */
  placeholder: string
}

const SelectMultiValue = ({ placeholder }: SelectMultiValueProps) => (
  <SelectValue className={styles['selected-value']}>
    {({ selectedText, state }) => {
      const { selectedItems } = state
      const displayText = resolveDisplayText(
        selectedItems.length,
        selectedItems.at(0)?.textValue,
        selectedText,
        placeholder,
      )

      return (
        <Typography
          element="span"
          textStyle="bodyMd"
          data-selected={state.selectedItems.length > 0 ? true : undefined}
          className={styles['selected-text']}
        >
          {displayText}
        </Typography>
      )
    }}
  </SelectValue>
)

const resolveDisplayText = (
  count: number,
  firstItemText: string | undefined,
  selectedText: string,
  placeholder: string,
): string => {
  if (count === 1) {
    return selectedText
  }
  if (count > 1) {
    return `${firstItemText ?? ''}, +${String(count - 1)}`
  }
  return placeholder
}

export { SelectMultiValue }
