import cn from 'classnames'
import React from 'react'

import { ErrorIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './ErrorMessage.module.css'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  error: string
}

const ErrorMessage = ({ error, ...props }: Props) => (
  <div {...props} className={cn(styles.container, props.className)}>
    <ErrorIcon aria-hidden className={styles.icon} />
    <Typography element="span" textStyle="captionMd" className={styles.message}>
      {error}
    </Typography>
  </div>
)

export { ErrorMessage }
