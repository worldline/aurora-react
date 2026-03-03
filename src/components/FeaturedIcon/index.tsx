/* eslint-disable @eslint-react/no-clone-element */
import cn from 'classnames'
import React from 'react'

import styles from './FeaturedIcon.module.css'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  size: 'small' | 'medium' | 'large' | 'xlarge'
  icon: React.ReactElement<{ className?: string }>
}

const FeaturedIcon = ({ size, ...props }: Props) => {
  const icon = React.cloneElement(props.icon, {
    className: cn(styles.icon, props.icon.props.className),
  })
  return (
    <div
      {...props}
      className={cn(styles.container, styles[size], props.className)}
    >
      {icon}
    </div>
  )
}

export { FeaturedIcon }
