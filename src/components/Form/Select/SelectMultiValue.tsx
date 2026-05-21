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
      let displayText = placeholder

      const { selectedItems } = state

      if (selectedItems.length === 1) {
        displayText = selectedText
      } else if (selectedItems.length > 1) {
        const firstItemText = selectedItems[0]?.textValue ?? ''
        displayText = `${firstItemText}, +${String(selectedItems.length - 1)}`
      }

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

export { SelectMultiValue }
