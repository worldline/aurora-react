'use client'

import cn from 'classnames'
import type { ReactNode } from 'react'
import {
  Menu as AriaMenu,
  Collection,
  type MenuProps as AriaMenuProps,
} from 'react-aria-components'

import type { WithAriaLabelRequirement } from '@/utils/accessibility'

import styles from './Menu.module.css'
import { MenuDivider } from './MenuDivider'
import { MenuHeader } from './MenuHeader'
import { MenuItem } from './MenuItem'
import { MenuSection } from './MenuSection'
import { MenuTrigger } from './MenuTrigger'

interface AuroraMenuProps {
  className?: string
  header?: ReactNode
}

type MenuProps<T extends object> = WithAriaLabelRequirement<
  AuroraMenuProps & Omit<AriaMenuProps<T>, 'className'>
>

/**
 * A menu component that displays a list of actions, options, or navigation links.
 * If your menu data is static, you should pass the menu items or sections as `children`.
 * If your menu data is dynamic (e.g. from an API or changes over time), you should pass
 * an array of `items` and a render function as `children`. Both `Menu` and `Menu.Section`
 * support this pattern, so you can have dynamic sections with dynamic items if needed.
 */
const BaseMenu = <T extends object>({
  children,
  items,
  className,
  header,
  ...props
}: MenuProps<T>) => (
  <AriaMenu {...props} className={cn(styles.container, className)}>
    {header ? (
      <MenuHeader className={styles.header}>{header}</MenuHeader>
    ) : null}
    {typeof children === 'function' ? (
      <Collection items={items}>{children}</Collection>
    ) : (
      children
    )}
  </AriaMenu>
)

const Menu = Object.assign(BaseMenu, {
  Item: MenuItem,
  Section: MenuSection,
  Divider: MenuDivider,
  Trigger: MenuTrigger,
})

export { Menu, type MenuProps }
