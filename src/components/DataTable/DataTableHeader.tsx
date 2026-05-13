'use client'

import cn from 'classnames'
import { type ReactNode, use } from 'react'
import {
  Column,
  TableHeader,
  type TableHeaderProps,
} from 'react-aria-components'

import { Checkbox } from '../Form/Checkbox'
import styles from './DataTableHeader.module.css'
import { DataTableContext } from './dataTableStyles'

interface DataTableHeaderProps<T extends object> extends Omit<
  TableHeaderProps<T>,
  'className' | 'children'
> {
  className?: string
  children?: ReactNode
  actionLabel?: string
}

const DataTableHeader = <T extends object>({
  className,
  children,
  actionLabel = 'Actions',
  ...props
}: DataTableHeaderProps<T>) => {
  const { showCheckbox, showAction } = use(DataTableContext)

  return (
    <TableHeader className={cn(styles['header-row'], className)} {...props}>
      {showCheckbox ? (
        <Column className={styles['column-checkbox']} aria-label="Select all">
          <Checkbox slot="selection" />
        </Column>
      ) : null}
      {children}
      {showAction ? (
        <Column className={styles['column-action']}>
          <span className={styles['sr-only']}>{actionLabel}</span>
        </Column>
      ) : null}
    </TableHeader>
  )
}

export { DataTableHeader, type DataTableHeaderProps }
