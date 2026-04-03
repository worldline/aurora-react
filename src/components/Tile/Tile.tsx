/* eslint-disable @eslint-react/no-clone-element */
import cn from 'classnames'
import {
  cloneElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'

import { Typography } from '@/components/Typography'

import styles from './Tile.module.css'

export type TileOrientation = 'horizontal' | 'vertical'

interface TileContentProps {
  /**
   * Layout direction
   */
  orientation?: TileOrientation
  /**
   * Decorative icon, must accept className
   */
  icon?: ReactElement<{ className?: string }>
  /**
   * Primary text
   */
  title: string
  /**
   * Secondary text above title
   */
  overline?: string
  /**
   * Supporting text  below titke
   */
  description?: string
  /**
   * right-side content: icon, checkbox, or button
   */
  trailing: ReactNode
  /**
   * Additional Class on root elemnt
   */
  className?: string
}

interface TileStateProps {
  disabled?: boolean
  selected?: boolean
  focusVisible?: boolean
  hovered?: boolean
}
interface TileProps extends TileContentProps, TileStateProps {
  ref?: Ref<HTMLDivElement>
}

const Tile = ({
  ref,
  orientation = 'horizontal',
  disabled = false,
  selected = false,
  focusVisible = false,
  hovered = false,
  icon,
  title,
  overline,
  description,
  className,
  trailing,
}: TileProps) => {
  const tileClassName = cn(styles.tile, className)

  const iconElement = icon
    ? cloneElement(icon, {
        className: cn(styles.icon, icon.props.className),
      })
    : null

  return (
    <div
      ref={ref}
      className={tileClassName}
      data-orientation={orientation}
      data-disabled={disabled || undefined}
      data-selected={selected && !disabled ? true : undefined}
      data-focus-visible={focusVisible && !disabled ? true : undefined}
      data-hovered={hovered && !selected && !disabled ? true : undefined}
    >
      {iconElement}
      <div className={styles.content}>
        {overline ? (
          <Typography
            element="p"
            textStyle="bodySm"
            textColor={disabled ? 'contentDisabled' : 'contentSecondary'}
          >
            {overline}
          </Typography>
        ) : null}
        <Typography
          element="p"
          textStyle="titleSm"
          textColor={disabled ? 'contentDisabled' : 'contentPrimary'}
        >
          {title}
        </Typography>
        {description ? (
          <Typography
            element="p"
            textStyle="bodyMd"
            textColor={disabled ? 'contentDisabled' : 'contentSecondary'}
          >
            {description}
          </Typography>
        ) : null}
      </div>
      <div className={styles.trailing}>{trailing}</div>
    </div>
  )
}

export { Tile, type TileContentProps, type TileProps }
