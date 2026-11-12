/* eslint-disable @eslint-react/no-clone-element */
'use client'

import cn from 'classnames'
import { cloneElement, type ReactElement } from 'react'
import {
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
} from 'react-aria-components'

import { CheckIcon } from '../icons'
import { type TextColor, Typography } from '../Typography'
import styles from './MenuItem.module.css'

interface MenuItemProps extends Omit<AriaMenuItemProps, 'children'> {
  /**
   * The main text of the menu item.
   */
  title: string
  /**
   * Optional secondary text displayed below the title.
   */
  description?: string
  /**
   * Optional icon displayed before the title.
   */
  leadingIcon?: ReactElement<{ 'aria-hidden'?: boolean; className?: string }>
  /**
   * When true, applies destructive (danger) color styling to signal an irreversible action.
   */
  destructive?: boolean
}

const getTextColor = (
  isDisabled: boolean,
  destructive: boolean | undefined,
  defaultColor: TextColor,
): TextColor => {
  if (isDisabled) {
    return 'contentDisabled'
  }
  if (destructive) {
    return 'contentDanger'
  }
  return defaultColor
}

const MenuItem = ({
  title,
  leadingIcon,
  description,
  destructive,
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
      className={cn(
        styles['menu-item'],
        { [styles.destructive]: destructive },
        className,
      )}
    >
      {({ isSelected, isDisabled }) => (
        <>
          {leadingIconElement}
          <div className={styles.label}>
            <Typography
              slot="label"
              element="span"
              textStyle="bodyMd"
              textColor={getTextColor(
                isDisabled,
                destructive,
                'contentPrimary',
              )}
              className={styles.title}
            >
              {title}
            </Typography>
            {description ? (
              <Typography
                slot="description"
                element="span"
                textStyle="captionMd"
                textColor={getTextColor(
                  isDisabled,
                  destructive,
                  'contentTertiary',
                )}
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
