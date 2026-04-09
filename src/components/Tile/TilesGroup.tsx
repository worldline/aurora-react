import cn from 'classnames'
import type { JSX, Ref } from 'react'
import { GridList, type GridListProps } from 'react-aria-components'

import type { WithAriaLabelRequirement } from '@/utils/accessibility'

import { TileItem } from './TileItem'
import styles from './TilesGroup.module.css'

type TilesGroupProps<T extends object> = WithAriaLabelRequirement<
  GridListProps<T>
> & { ref?: Ref<HTMLDivElement> }

interface TilesGroupComponent {
  <T extends object>(props: TilesGroupProps<T>): JSX.Element
  Tile: typeof TileItem
}

const TilesGroupBase = <T extends object>({
  ref,
  className,
  ...props
}: TilesGroupProps<T>) => (
  <GridList
    ref={ref}
    className={cn(styles['tiles-group'], className)}
    {...props}
  />
)

const TilesGroup = Object.assign(TilesGroupBase, {
  Tile: TileItem,
}) satisfies TilesGroupComponent

export { TilesGroup }
