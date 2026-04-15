'use client'

import type { ReactNode } from 'react'
import {
  MenuTrigger as AriaMenuTrigger,
  type MenuTriggerProps as AriaMenuTriggerProps,
} from 'react-aria-components'

interface MenuTriggerProps extends AriaMenuTriggerProps {
  children: ReactNode
}

const MenuTrigger = ({ children, ...props }: MenuTriggerProps) => (
  <AriaMenuTrigger {...props}>{children}</AriaMenuTrigger>
)

export { MenuTrigger, type MenuTriggerProps }
