import cn from 'classnames'
import type { ReactElement, ReactNode, Ref } from 'react'
import { GridList } from 'react-aria-components'

import styles from './TilesGroup.module.css'

interface TilesGroupProps {
  ref?: Ref<HTMLDivElement>
  items?: Array<unknown>
  children?: ReactNode
  areaLabel?: string
  ariaLabelledby?: string
  className?: string
}

const TilesGroup = ({
  ref,
  children,
  areaLabel,
  ariaLabelledby,
  className,
}: TilesGroupProps): ReactElement => (
  <GridList
    ref={ref}
    className={cn(styles['tiles-group'], className)}
    aria-label={areaLabel}
    aria-labelledby={ariaLabelledby}
  >
    {children}
  </GridList>
)

export { TilesGroup }
