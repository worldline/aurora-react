'use client'

import type { ComponentProps } from 'react'
import { Pressable as AriaPressable } from 'react-aria-components'

type PressableProps = ComponentProps<typeof AriaPressable>

/**
 * A low-level component that can be used for custom interactive elements.
 * Prefer to use `Button`, `Link`, and so on when possible. When wrapping
 * non-button elements, ensure proper accessibility with role, tabIndex,
 * focus styles, and so on.
 */
const Pressable = ({ children, ...props }: PressableProps) => (
  <AriaPressable {...props}>{children}</AriaPressable>
)

export { Pressable, type PressableProps }
