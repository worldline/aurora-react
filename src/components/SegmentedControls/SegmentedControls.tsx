'use client'

import cn from 'classnames'
import { type ReactNode } from 'react'
import { RadioGroup, type RadioGroupProps } from 'react-aria-components'

import { SegmentedControl } from './SegmentedControl'
import styles from './SegmentedControls.module.css'

interface SegmentedControlsProps<T extends string> extends Omit<
  RadioGroupProps,
  'children' | 'value' | 'defaultValue' | 'onChange'
> {
  /** SegmentedControls.Control items */
  children: ReactNode
  /** Currently selected value */
  value?: T
  /** Default selected value for uncontrolled usage */
  defaultValue?: T
  /** Callback fired when the selected value changes */
  onChange?: (value: T) => void
}

const SegmentedControlsBase = <T extends string>({
  children,
  orientation = 'horizontal',
  onChange,
  ...props
}: SegmentedControlsProps<T>) => (
  <RadioGroup
    {...props}
    orientation={orientation}
    onChange={
      onChange === undefined
        ? undefined
        : (value: string) => {
            onChange(value as T)
          }
    }
    className={cn(styles.group, props.className)}
  >
    {children}
  </RadioGroup>
)

const SegmentedControls = Object.assign(SegmentedControlsBase, {
  Control: SegmentedControl,
})

export { SegmentedControls }
