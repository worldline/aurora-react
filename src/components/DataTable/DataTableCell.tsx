import cn from 'classnames'
import type { CSSProperties, ReactNode } from 'react'
import { Cell, type CellProps } from 'react-aria-components'

import { Typography } from '../Typography'
import styles from './DataTableCell.module.css'
import {
  buildFixedClassName,
  buildFixedStyle,
  type FixedColumnProps,
} from './dataTableStyles'

const renderCellContent = (children: ReactNode) => {
  if (typeof children === 'string' || typeof children === 'number') {
    return (
      <Typography element="span" textStyle="bodySm">
        {children}
      </Typography>
    )
  }
  return children
}

interface DataTableCellProps
  extends
    Omit<CellProps, 'className' | 'children' | 'style'>,
    FixedColumnProps {
  className?: string
  children?: ReactNode
  style?: CSSProperties
}

const DataTableCell = ({
  className,
  children,
  fixed,
  fixedOffset = 0,
  fixedShadow = false,
  style,
  ...props
}: DataTableCellProps) => (
  <Cell
    className={buildFixedClassName(
      cn(styles.cell),
      fixed,
      fixedShadow,
      className,
    )}
    style={buildFixedStyle(fixed, fixedOffset, style)}
    {...props}
  >
    {renderCellContent(children)}
  </Cell>
)

export { DataTableCell, type DataTableCellProps }
