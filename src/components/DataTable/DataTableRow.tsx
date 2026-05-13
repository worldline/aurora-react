'use client'

import cn from 'classnames'
import { type ReactNode, use } from 'react'
import { Cell, Row, type RowProps } from 'react-aria-components'

import { Checkbox } from '../Form/Checkbox'
import { MoreVertIcon } from '../icons'
import styles from './DataTableRow.module.css'
import { DataTableContext } from './dataTableStyles'

interface DataTableRowProps<T extends object> extends Omit<
  RowProps<T>,
  'className' | 'children'
> {
  className?: string
  mobileHeading?: string
  children?: ReactNode
}

const DataTableRow = <T extends object>({
  className,
  mobileHeading,
  children,
  ...props
}: DataTableRowProps<T>) => {
  const { showCheckbox, showAction } = use(DataTableContext)

  return (
    <Row
      className={cn(
        styles.row,
        { [styles['mobile-card']]: !!mobileHeading },
        className,
      )}
      data-mobile-heading={mobileHeading}
      {...props}
    >
      {showCheckbox ? (
        <Cell className={styles['cell-checkbox']}>
          <Checkbox slot="selection" />
        </Cell>
      ) : null}
      {children}
      {showAction ? (
        <Cell className={styles['cell-action']}>
          <MoreVertIcon size={24} aria-hidden />
        </Cell>
      ) : null}
    </Row>
  )
}

export { DataTableRow, type DataTableRowProps }
