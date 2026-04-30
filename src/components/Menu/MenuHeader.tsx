import cn from 'classnames'
import type { ReactNode } from 'react'
import { Header } from 'react-aria-components'

import { Menu } from './Menu'
import styles from './MenuHeader.module.css'

interface MenuHeaderProps {
  children: ReactNode
  className?: string
}

const MenuHeader = ({ children, className }: MenuHeaderProps) => (
  <>
    <Menu.Section className={cn(styles.section, className)}>
      <Header className={styles.content}>{children}</Header>
    </Menu.Section>
    <Menu.Divider />
  </>
)

export { MenuHeader, type MenuHeaderProps }
