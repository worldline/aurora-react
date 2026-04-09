/* eslint-disable @eslint-react/no-clone-element, @typescript-eslint/prefer-nullish-coalescing */
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
   * Supporting text below title
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

interface TileBaseProps extends TileContentProps, TileStateProps {
  ref?: Ref<HTMLDivElement>
}

interface StandaloneTileProps extends TileBaseProps {
  /** Handler called when the tile is clicked
   */
  onClick: () => void
}

interface ComposedTileProps extends TileBaseProps {
  onClick?: never
}

type TileProps = StandaloneTileProps | ComposedTileProps

const Tile = ({
  ref,
  orientation = 'horizontal',
  disabled,
  selected,
  onClick,
  focusVisible,
  hovered,
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

  const isInteractive = !!onClick && !disabled

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && isInteractive) {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      ref={ref}
      className={tileClassName}
      data-orientation={orientation}
      aria-disabled={disabled || undefined}
      data-selected={(selected && !disabled) || undefined}
      data-focus-visible={(focusVisible && !disabled) || undefined}
      data-hovered={(hovered && !selected && !disabled) || undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      tabIndex={isInteractive ? 0 : undefined}
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
