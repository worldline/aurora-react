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

interface TileProps {
  ref?: Ref<HTMLDivElement>
  orientation?: TileOrientation

  disabled?: boolean
  selected?: boolean
  focusVisible?: boolean
  hovered?: boolean

  icon?: ReactElement<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
  title: string
  overline?: string
  description?: string

  trailing: ReactNode

  className?: string
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
  const tileClassName = cn(
    styles.tile,
    {
      [styles.disabled]: disabled,
      [styles.selected]: selected && !disabled,
      [styles['focus-visible']]: focusVisible && !disabled,
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
    <div ref={ref} className={tileClassName} data-orientation={orientation}>
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
