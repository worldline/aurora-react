/* eslint-disable @eslint-react/no-clone-element */
import cn from 'classnames'
import {
  cloneElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'

import { Typography } from '../main'

import styles from './Tile.module.css'

export type TileOrientation = 'horizontal' | 'vertical'

interface TileProps {
  ref?: Ref<HTMLDivElement>
  orientation?: TileOrientation

  disabled?: boolean
  selected?: boolean
  focused?: boolean
  hovered?: boolean

  icon?: ReactElement<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
  title: string
  overline?: string
  description?: string

  trailing: ReactNode

  className?: string
}

const ORIENTATION_CLASS_MAP: Record<TileOrientation, string> = {
  horizontal: styles['orientation-horizontal'],
  vertical: styles['orientation-vertical'],
}

const Tile = ({
  ref,
  orientation = 'horizontal',
  disabled = false,
  selected = false,
  focused = false,
  hovered = false,
  icon,
  title,
  overline,
  description,
  className,
  trailing,
}: TileProps): ReactElement => {
  const tileClassNames = cn(
    styles.tile,
    ORIENTATION_CLASS_MAP[orientation],
    {
      [styles.disabled]: disabled,
      [styles.selected]: selected && !disabled,
      [styles.focused]: focused && !disabled,
      [styles['focus-visible']]: focused && !disabled,
      [styles.hovered]: hovered && !selected && !disabled,
    },
    className,
  )

  const iconElement = icon
    ? cloneElement(icon, {
        className: cn(styles.icon, icon.props.className),
        'aria-hidden': true,
      })
    : null

  return (
    <div ref={ref} className={tileClassNames}>
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

export { Tile }
