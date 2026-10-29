'use client'

/* eslint-disable @eslint-react/no-clone-element */
import cn from 'classnames'
import { cloneElement, type ReactElement, type Ref } from 'react'
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
   * When true, applies destructive (danger) color styling to signal an irreversible action.
   * Can be combined with any variant.
   * @default false
   */
  destructive?: boolean

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

  /**
   * Ref forwarded to the underlying button element
   */
  ref?: Ref<HTMLButtonElement>
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
  destructive,
  children,
  leadingIcon,
  trailingIcon,
  isPending,
  ref,
  ...props
}: Props) => {
  const className = cn(
    buttonClassName({ variant, size, destructive }),
    props.className,
  )

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
    <AriaButton
      ref={ref}
      {...props}
      isPending={isPending}
      className={className}
    >
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
