import cn from 'classnames'
import { Separator, type SeparatorProps } from 'react-aria-components'

import styles from './Divider.module.css'

interface DividerProps extends SeparatorProps {
  className?: string
}

const Divider = ({ className, ...props }: DividerProps) => (
  <Separator {...props} className={cn(styles.container, className)} />
)

export { Divider, type DividerProps }
