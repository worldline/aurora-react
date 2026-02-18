'use client'

import cn from 'classnames'
import type { ReactElement } from 'react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components'

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
const Button = ({ variant, size, children, ...props }: Props): ReactElement => {
  const className = cn(buttonClassName({ variant, size }), props.className)

  return (
    <AriaButton {...props} className={className}>
      {children}
    </AriaButton>
  )
}

export { Button, type AuroraButtonProps }
