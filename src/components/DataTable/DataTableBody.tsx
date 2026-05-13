'use client'

import cn from 'classnames'
import { TableBody, type TableBodyProps } from 'react-aria-components'

import styles from './DataTableBody.module.css'

interface DataTableBodyProps<T extends object> extends Omit<
  TableBodyProps<T>,
  'className'
> {
  className?: string
}

const DataTableBody = <T extends object>({
  className,
  ...props
}: DataTableBodyProps<T>) => (
  <TableBody className={cn(styles.body, className)} {...props} />
)

export { DataTableBody, type DataTableBodyProps }
