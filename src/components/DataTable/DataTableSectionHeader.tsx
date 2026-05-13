'use client'

import cn from 'classnames'
import { use } from 'react'
import { Cell, Row, type RowProps } from 'react-aria-components'

import { Typography } from '../Typography'
import styles from './DataTableSectionHeader.module.css'
import { DataTableContext } from './dataTableStyles'

interface DataTableSectionHeaderProps extends Omit<
  RowProps<object>,
  'children' | 'className'
> {
  children: string
  className?: string
}

const DataTableSectionHeader = ({
  children,
  className,
  ...props
}: DataTableSectionHeaderProps) => {
  const { columnCount } = use(DataTableContext)
  const emptyCells = Array.from({ length: columnCount - 1 }, (_, index) => (
    <Cell key={index} className={styles['section-header-empty']} />
  ))

  return (
    <Row className={cn(styles['section-header'], className)} {...props}>
      <Cell className={styles['section-header-cell']}>
        <Typography element="span" textStyle="captionMd">
          {children}
        </Typography>
      </Cell>
      {emptyCells}
    </Row>
  )
}

export { DataTableSectionHeader, type DataTableSectionHeaderProps }
