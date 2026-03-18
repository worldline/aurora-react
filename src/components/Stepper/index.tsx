import cn from 'classnames'
import React, { type ReactElement } from 'react'

import type { WithAriaLabelRequirement } from '@/utils/accessibility'

import { type HeadingElement } from '../Typography'

import { Step, type StepItem, type StepType } from './Step'
import styles from './Stepper.module.css'

interface BaseProps<
  T extends StepType,
> extends React.HTMLAttributes<HTMLElement> {
  /**
   * The list of steps to display
   */
  steps: ReadonlyArray<StepItem<T>>
  /**
   * The HTML element used for the step titles
   */
  titleElement: HeadingElement
  /**
   * The visual type of the steps
   * @default 'check'
   */
  type: T
  /**
   * Whether to display connector lines between steps
   * @default true
   */
  connector?: boolean
}

type Props<T extends StepType> = WithAriaLabelRequirement<BaseProps<T>>

/**
 * A component for displaying a list of steps to be completed.
 *
 * You must provide an `aria-label` or `aria-labelledby` to the component for accessibility.
 */
const Stepper = <T extends StepType>({
  steps,
  titleElement,
  type,
  connector = true,
  className,
  ...props
}: Props<T>): ReactElement => (
  <ol
    className={cn(styles.stepper, className, {
      [styles['no-chip']]: !steps.some((step) => !!step.chip),
    })}
    {...props}
  >
    {steps.map((step, index) => {
      const isLast = index === steps.length - 1
      return (
        <Step
          key={step.id}
          className={styles.step}
          gridRow={index + 1}
          step={step}
          index={index}
          isLast={isLast}
          connector={connector && !isLast}
          titleElement={titleElement}
          type={type}
        />
      )
    })}
  </ol>
)

export { Stepper, type StepItem }
