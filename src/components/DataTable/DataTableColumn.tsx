'use client'

import cn from 'classnames'
import type { CSSProperties, ReactNode } from 'react'
import {
  Column,
  type ColumnProps,
  type ColumnRenderProps,
} from 'react-aria-components'

import { ArrowDownwardIcon, ArrowUpwardIcon } from '../icons'
import { Typography } from '../Typography'
import styles from './DataTableColumn.module.css'
import {
  buildFixedClassName,
  buildFixedStyle,
  type FixedColumnProps,
} from './dataTableStyles'

const SortIndicator = ({
  direction,
}: {
  direction?: 'ascending' | 'descending'
}) => {
  if (direction === 'ascending') {
    return <ArrowUpwardIcon aria-hidden size={16} />
  }
  if (direction === 'descending') {
    return <ArrowDownwardIcon aria-hidden size={16} />
  }

  return null
}

interface DataTableColumnProps
  extends
    Omit<ColumnProps, 'children' | 'className' | 'style'>,
    FixedColumnProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

const DataTableColumn = ({
  children,
  className,
  fixed,
  fixedOffset = 0,
  fixedShadow = false,
  style,
  ...props
}: DataTableColumnProps) => (
  <Column
    {...props}
    style={buildFixedStyle(fixed, fixedOffset, style)}
    className={(renderProps) =>
      buildFixedClassName(
        cn(styles.column, {
          [styles.sortable]: renderProps.allowsSorting,
        }),
        fixed,
        fixedShadow,
        className,
        true,
      )
    }
  >
    {(renderProps: ColumnRenderProps) => (
      <div className={styles['column-content']}>
        <Typography
          element="span"
          textStyle="labelSm"
          textColor="contentSecondary"
        >
          {children}
        </Typography>
        {renderProps.allowsSorting ? (
          <SortIndicator direction={renderProps.sortDirection} />
        ) : null}
      </div>
    )}
  </Column>
)

export { DataTableColumn, type DataTableColumnProps }
