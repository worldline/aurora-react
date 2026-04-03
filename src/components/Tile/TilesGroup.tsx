import cn from 'classnames'
import type { Ref } from 'react'
import { GridList, type GridListProps } from 'react-aria-components'

import type { WithAriaLabelRequirement } from '@/utils/accessibility'

import styles from './TilesGroup.module.css'

type TilesGroupProps<T extends object> = WithAriaLabelRequirement<
  GridListProps<T>
> & { ref?: Ref<HTMLDivElement> }

const TilesGroup = <T extends object>({
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

export { TilesGroup }
