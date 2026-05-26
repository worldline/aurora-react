/* eslint-disable @eslint-react/no-clone-element */
import cn from 'classnames'
import { cloneElement, type ReactElement } from 'react'
import { Tag, type TagProps } from 'react-aria-components'

import { CloseIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import { Button } from '../Button'
import styles from './Filter.module.css'

interface FilterItemProps extends Omit<TagProps, 'children' | 'className'> {
  /**
   * The text displayed inside the filter item.
   */
  children: string

  /**
   * An optional icon element displayed before the text label.
   */
  leadingIcon?: ReactElement<{ className?: string }>

  /**
   * Additional CSS class names to apply to the filter element.
   */
  className?: string

  /**
   * The accessible aria-label for the close/remove button.
   */
  closeLabel?: string
}

const getTextColor = (isDisabled: boolean, isSelected: boolean) => {
  if (isDisabled) {
    return 'contentDisabled'
  }
  return isSelected ? 'contentOnBrand' : 'contentPrimary'
}

const FilterItem = ({
  children,
  leadingIcon,
  className,
  closeLabel,
  ...props
}: FilterItemProps) => (
  <Tag
    {...props}
    textValue={props.textValue ?? children}
    className={cn(styles['filter-item'], className)}
  >
    {({ isSelected, isDisabled, allowsRemoving }) => {
      const textColor = getTextColor(isDisabled, isSelected)

      const leadingIconElement = leadingIcon
        ? cloneElement(leadingIcon, {
            className: cn(styles.icon, leadingIcon.props.className),
          })
        : null

      return (
        <>
          <div className={styles.content}>
            {leadingIconElement}
            <Typography
              element="span"
              textStyle="labelMd"
              textColor={textColor}
              className={styles.label}
            >
              {children}
            </Typography>
          </div>
          {allowsRemoving && !isSelected ? (
            <Button
              slot="remove"
              aria-label={closeLabel}
              variant="link"
              size="small"
              className={styles['remove-button']}
            >
              <CloseIcon aria-hidden />
            </Button>
          ) : null}
        </>
      )
    }}
  </Tag>
)

export { FilterItem, type FilterItemProps }
