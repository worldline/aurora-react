import cn from 'classnames'
import type { HTMLAttributes, ReactElement } from 'react'

import styles from './Code.module.css'

type Props = HTMLAttributes<HTMLElement> & {
  inline?: boolean
}

const Code = ({
  children,
  className,
  inline = false,
  ...props
}: Props): ReactElement => {
  if (inline) {
    return (
      <code className={cn(styles.code, styles.inline, className)} {...props}>
        {children}
      </code>
    )
  }
  return (
    <pre className={cn(styles.code, className)} {...props}>
      <code>{children}</code>
    </pre>
  )
}

export { Code }
