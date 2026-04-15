/* eslint-disable @eslint-react/no-clone-element */
'use client'

import cn from 'classnames'
import { cloneElement, type ReactElement } from 'react'
import {
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
} from 'react-aria-components'

import { CheckIcon } from '../icons'
import { Typography } from '../Typography'

import styles from './MenuItem.module.css'

interface MenuItemProps extends Omit<AriaMenuItemProps, 'children'> {
  title: string
  description?: string
  leadingIcon?: ReactElement<{ 'aria-hidden'?: boolean; className?: string }>
}

const MenuItem = ({
  title,
  leadingIcon,
  description,
  isDisabled,
  className,
  ...props
}: MenuItemProps) => {
  const leadingIconElement = leadingIcon
    ? cloneElement(leadingIcon, {
        className: cn(styles.icon, leadingIcon.props.className),
        'aria-hidden': true,
      })
    : null

  return (
    <AriaMenuItem
      {...props}
      isDisabled={isDisabled}
      className={cn(styles['menu-item'], className)}
    >
      {({ isSelected, isDisabled }) => (
        <>
          {leadingIconElement}
          <div className={styles.label}>
            <Typography
              slot="label"
              element="span"
              textStyle="bodyMd"
              textColor={isDisabled ? 'contentDisabled' : 'contentPrimary'}
              className={styles.title}
            >
              {title}
            </Typography>
            {description ? (
              <Typography
                slot="description"
                element="span"
                textStyle="captionMd"
                textColor={isDisabled ? 'contentDisabled' : 'contentTertiary'}
                className={styles.description}
              >
                {description}
              </Typography>
            ) : null}
          </div>
          {isSelected ? (
            <CheckIcon aria-hidden className={styles.check} />
          ) : null}
        </>
      )}
    </AriaMenuItem>
  )
}

export { MenuItem, type MenuItemProps }
