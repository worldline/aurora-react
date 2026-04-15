import cn from 'classnames'

import { Divider, type DividerProps } from '@/components/Divider'

import styles from './MenuDivider.module.css'

const MenuDivider = ({ className, ...props }: DividerProps) => (
  <Divider {...props} className={cn(styles.container, className)} />
)

export { MenuDivider }
