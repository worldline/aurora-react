'use client'

import cn from 'classnames'
import type { ReactNode } from 'react'
import {
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  type TagGroupProps,
} from 'react-aria-components'

import styles from './Filter.module.css'

interface FilterGroupProps extends Omit<
  TagGroupProps,
  'children' | 'className' | 'style'
> {
  /** The collection of individual filter items  to render inside the list */
  children?: ReactNode
  /** Custom CSS class names to apply to the filter group container */
  className?: string
}

const FilterGroup = ({ children, className, ...props }: FilterGroupProps) => (
  <AriaTagGroup {...props} className={cn(styles['filter-group'], className)}>
    <AriaTagList className={styles['filter-list']}>{children}</AriaTagList>
  </AriaTagGroup>
)

export { FilterGroup, type FilterGroupProps }
