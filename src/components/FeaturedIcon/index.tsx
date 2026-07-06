/* eslint-disable @eslint-react/no-clone-element */
import cn from 'classnames'
import React from 'react'

import styles from './FeaturedIcon.module.css'

type FeaturedIconType = 'square' | 'circle'
type FeaturedIconSize =
  'small' | 'medium' | 'large' | 'xlarge' | '2xlarge' | '3xlarge' | '4xlarge'
type FeaturedIconEmphasis = 'low' | 'medium'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  type: FeaturedIconType
  size: FeaturedIconSize
  emphasis: FeaturedIconEmphasis
  icon: React.ReactElement<{ className?: string }>
}

const FeaturedIcon = ({ type, size, emphasis, icon, ...props }: Props) => {
  const clonedIcon = React.cloneElement(icon, {
    className: cn(styles.icon, icon.props.className),
  })

  return (
    <div
      {...props}
      className={cn(
        styles.container,
        styles[type],
        sizeClass[size],
        emphasisClass[emphasis],
        props.className,
      )}
    >
      {clonedIcon}
    </div>
  )
}

const sizeClass: Record<FeaturedIconSize, string> = {
  small: styles['size-small'],
  medium: styles['size-medium'],
  large: styles['size-large'],
  xlarge: styles['size-xlarge'],
  '2xlarge': styles['size-2xlarge'],
  '3xlarge': styles['size-3xlarge'],
  '4xlarge': styles['size-4xlarge'],
} as const

const emphasisClass: Record<FeaturedIconEmphasis, string> = {
  low: styles['emphasis-low'],
  medium: styles['emphasis-medium'],
} as const

export { FeaturedIcon }
