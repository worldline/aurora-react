'use client'

/* eslint-disable @eslint-react/no-clone-element */
import cn from 'classnames'
import { cloneElement, type ReactElement } from 'react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components'

import { ProgressActivityIcon } from '../icons'
import styles from './Button.module.css'
import { buttonClassName } from './buttonStyles'

interface AuroraButtonProps {
  /**
   * Visual style variant of the button
   * - `primary`: Main call-to-action with brand color
   * - `secondary`: Subtle style for secondary actions
   * - `link`: Button as a link
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'link'

  /**
   * Size of the button
   * - `small`: Compact button for tight spaces
   * - `medium`: Standard button size
   * - `large`: Larger button for emphasis
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * Optional leading icon element
   */
  leadingIcon?: ReactElement<{
    className?: string
  }>

  /**
   * Optional trailing icon element
   */
  trailingIcon?: ReactElement<{
    className?: string
  }>
}

type Props = AuroraButtonProps & AriaButtonProps

/**
 * Accessible button component built with React Aria
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" onPress={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 */
const Button = ({
  variant,
  size,
  children,
  leadingIcon,
  trailingIcon,
  isPending,
  ...props
}: Props): ReactElement => {
  const className = cn(buttonClassName({ variant, size }), props.className)

  const leadingIconElement =
    leadingIcon && !isPending
      ? cloneElement(leadingIcon, {
          className: cn(styles.icon, leadingIcon.props.className),
        })
      : null

  const trailingIconElement =
    trailingIcon && !isPending
      ? cloneElement(trailingIcon, {
          className: cn(styles.icon, trailingIcon.props.className),
        })
      : null

  return (
    <AriaButton {...props} isPending={isPending} className={className}>
      <>
        {isPending ? (
          <ProgressActivityIcon
            className={cn(styles.icon, styles['pending-icon'])}
            aria-hidden
          />
        ) : null}
        {leadingIconElement}
        {children}
        {trailingIconElement}
      </>
    </AriaButton>
  )
}

export { Button, type AuroraButtonProps }
