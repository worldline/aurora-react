import cn from 'classnames'
import type { HTMLAttributes, ReactElement } from 'react'

import styles from './Card.module.css'

const Card = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): ReactElement => (
  <div className={cn(styles.card, className)} {...props}>
    {children}
  </div>
)

export { Card }
