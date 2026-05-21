import cn from 'classnames'
import { ListBoxItem, type ListBoxItemProps } from 'react-aria-components'

import { CheckIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './SelectItem.module.css'

/** Props for the SelectItem component. */
interface SelectItemProps<T extends object> extends Omit<
  ListBoxItemProps<T>,
  'children'
> {
  /** Label content rendered inside the item. */
  children: string
}

const SelectItem = <T extends object>({
  children,

  className,
  ...props
}: SelectItemProps<T>) => (
  <ListBoxItem
    {...props}
    className={cn(styles.item, className)}
    textValue={children}
  >
    {({ isSelected }) => (
      <>
        <div className={styles['item-content']}>
          <Typography element="span" textStyle="bodyMd">
            {children}
          </Typography>
        </div>
        {isSelected ? (
          <CheckIcon aria-hidden className={styles['check-icon']} size={24} />
        ) : null}
      </>
    )}
  </ListBoxItem>
)

export { SelectItem, type SelectItemProps }
