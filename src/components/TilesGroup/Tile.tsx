import cn from 'classnames'
import type { ReactElement, ReactNode, Ref } from 'react'

import { Typography } from '../main'

import styles from './Tile.module.css'

type TileOrientation = 'horizontal' | 'vertical'

interface TileProps {
  ref?: Ref<HTMLDivElement>
  orientation?: TileOrientation

  disabled?: boolean
  selected?: boolean

  visualAsset?: ReactNode
  title: ReactNode
  overline?: ReactNode
  description?: ReactNode
  icon?: ReactNode

  trailing?: ReactNode

  className?: string
}

const ORIENTATION_CLASS_MAP: Record<TileOrientation, string> = {
  horizontal: styles['orientation-horizontal'],
  vertical: styles['orientation-vertical'],
}

const Tile = ({
  ref,
  orientation = 'vertical',
  disabled = false,
  selected = false,
  visualAsset,
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
      [styles.selected]: selected,
    },
    className,
  )

  return (
    <div ref={ref} className={tileClassNames}>
      {visualAsset ? <>{visualAsset}</> : null}
      <div className={styles.content}>
        {overline ? (
          <Typography element="p" textStyle="titleSm">
            {overline}
          </Typography>
        ) : null}
        <Typography element="p" textStyle="titleSm">
          {title}
        </Typography>
        {description ? (
          <Typography element="p" textStyle="bodySm">
            {description}
          </Typography>
        ) : null}
      </div>
      <div className={styles.trailing}>{trailing}</div>
    </div>
  )
}

export { Tile }
