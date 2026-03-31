import cn from 'classnames'
import type { ReactElement, Ref } from 'react'
import { GridList, type GridListProps } from 'react-aria-components'

import styles from './TilesGroup.module.css'

interface TilesGroupProps<T extends object> extends GridListProps<T> {
  ref?: Ref<HTMLDivElement>
}

const TilesGroup = <T extends object>({
  ref,
  className,
  ...props
}: TilesGroupProps<T>): ReactElement => (
  <GridList
    ref={ref}
    className={cn(styles['tiles-group'], className)}
    {...props}
  />
)

export { TilesGroup }
