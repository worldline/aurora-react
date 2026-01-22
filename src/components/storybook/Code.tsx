import cn from 'classnames'
import type { HTMLAttributes, ReactElement } from 'react'

import styles from './Code.module.css'

const Code = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLPreElement>): ReactElement => (
  <pre className={cn(styles.code, className)} {...props}>
    <code>{children}</code>
  </pre>
)

export { Code }
