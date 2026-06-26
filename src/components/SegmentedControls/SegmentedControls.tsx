'use client'

import cn from 'classnames'
import { type ReactNode } from 'react'
import { RadioGroup, type RadioGroupProps } from 'react-aria-components'

import { SegmentedControl } from './SegmentedControl'
import styles from './SegmentedControls.module.css'

interface SegmentedControlsProps extends Omit<RadioGroupProps, 'children'> {
  /** SegmentedControls.Control items */
  children: ReactNode
  /** Layout direction of the controls group */
  direction?: 'horizontal' | 'vertical'
}

const SegmentedControlsBase = ({
  children,
  direction = 'horizontal',
  ...props
}: SegmentedControlsProps) => (
  <RadioGroup
    {...props}
    orientation={direction}
    className={cn(styles.group, props.className)}
  >
    {children}
  </RadioGroup>
)

const SegmentedControls = Object.assign(SegmentedControlsBase, {
  Control: SegmentedControl,
})

export { SegmentedControls }
