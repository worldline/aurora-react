import cn from 'classnames'
import { createContext, type CSSProperties } from 'react'

import styles from './DataTableCell.module.css'

interface DataTableContextValue {
  showCheckbox: boolean
  showAction: boolean
  columnCount: number
}

const DataTableContext = createContext<DataTableContextValue>({
  showCheckbox: false,
  showAction: false,
  columnCount: 0,
})

interface FixedColumnProps {
  fixed?: 'left' | 'right'
  fixedOffset?: number
  fixedShadow?: boolean
}

const buildFixedStyle = (
  fixed: FixedColumnProps['fixed'],
  fixedOffset: number,
  style: CSSProperties | undefined,
): CSSProperties | undefined => {
  if (!fixed) {
    return style
  }
  return {
    ...style,
    [fixed === 'left' ? 'left' : 'right']: fixedOffset,
  }
}

const buildFixedClassName = (
  baseClasses: string,
  fixed: FixedColumnProps['fixed'],
  fixedShadow: boolean,
  className: string | undefined,
  isColumnHeader = false,
): string =>
  cn(
    baseClasses,
    {
      [styles['fixed-left']]: fixed === 'left',
      [styles['fixed-right']]: fixed === 'right',
      [styles['fixed-shadow']]: fixedShadow,
      [styles['fixed-column']]: isColumnHeader && !!fixed,
    },
    className,
  )

export {
  DataTableContext,
  buildFixedStyle,
  buildFixedClassName,
  type DataTableContextValue,
  type FixedColumnProps,
}
