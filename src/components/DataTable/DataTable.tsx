'use client'

import cn from 'classnames'
import {
  type CSSProperties,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useRef,
} from 'react'
import { Table, type TableProps } from 'react-aria-components'

import styles from './DataTable.module.css'
import { DataTableBody } from './DataTableBody'
import { DataTableCell } from './DataTableCell'
import { DataTableColumn } from './DataTableColumn'
import { DataTableHeader } from './DataTableHeader'
import { DataTableLoading } from './DataTableLoading'
import { DataTableRow } from './DataTableRow'
import { DataTableSectionHeader } from './DataTableSectionHeader'
import { DataTableContext, type DataTableContextValue } from './dataTableStyles'
import { useScrollIndicators } from './useScrollIndicators'

const countColumns = (children: ReactNode): number => {
  const topLevel: Array<ReactNode> = Array.isArray(children)
    ? (children as Array<ReactNode>)
    : [children]
  const header = topLevel.find(
    (child): child is ReactElement<{ children?: ReactNode }> =>
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === DataTableHeader,
  )
  if (!header) {
    return 0
  }

  const headerChildren = header.props.children
  if (headerChildren === undefined || headerChildren === null) {
    return 0
  }

  if (!Array.isArray(headerChildren)) {
    return 1
  }

  return (headerChildren as Array<ReactNode>).filter((c: ReactNode) =>
    isValidElement(c),
  ).length
}

interface DataTableProps extends Omit<TableProps, 'className' | 'style'> {
  className?: string
  style?: CSSProperties
  footer?: ReactNode
  loading?: boolean
  loadingLabel?: string
  showCheckbox?: boolean
  showAction?: boolean
}

const DataTableBase = ({
  className,
  children,
  style,
  footer,
  loading = false,
  loadingLabel,
  showCheckbox = false,
  showAction = false,
  ...props
}: DataTableProps) => {
  const totalColumns =
    countColumns(children) + (showCheckbox ? 1 : 0) + (showAction ? 1 : 0)
  const contextValue: DataTableContextValue = {
    showCheckbox,
    showAction,
    columnCount: totalColumns,
  }
  const wrapperRef = useRef<HTMLDivElement>(null)

  useScrollIndicators(wrapperRef)

  return (
    <DataTableContext value={contextValue}>
      <div ref={wrapperRef} className={styles.wrapper} style={{ ...style }}>
        <Table className={cn(styles.table, className)} {...props}>
          {children}
        </Table>
        {footer !== undefined || loading ? (
          <div className={styles.footer}>
            {loading ? <DataTableLoading label={loadingLabel} /> : footer}
          </div>
        ) : null}
      </div>
    </DataTableContext>
  )
}

const DataTable = Object.assign(DataTableBase, {
  Header: DataTableHeader,
  Column: DataTableColumn,
  Body: DataTableBody,
  Row: DataTableRow,
  Cell: DataTableCell,
  SectionHeader: DataTableSectionHeader,
})

export { DataTable, type DataTableProps }
