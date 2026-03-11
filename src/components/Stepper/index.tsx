import cn from 'classnames'
import React, { type ReactElement } from 'react'

import type { WithAriaLabelRequirement } from '@/utils/accessibility'

import { type HeadingElement } from '../Typography'

import { Step, type StepItem, type Type } from './Step'
import styles from './Stepper.module.css'

interface BaseProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The list of steps to display
   */
  steps: ReadonlyArray<StepItem>
  /**
   * The HTML element used for the step titles
   */
  titleElement: HeadingElement
  /**
   * The visual type of the steps
   * @default 'check'
   */
  type?: Type
  /**
   * Whether to display connector lines between steps
   * @default true
   */
  connector?: boolean
  /**
   * Whether to display the status chip on each step
   * @default true
   */
  chip?: boolean
}

type Props = WithAriaLabelRequirement<BaseProps>

/**
 * A component for displaying a list of steps to be completed.
 *
 * You must provide an `aria-label` or `aria-labelledby` to the component for accessibility.
 */
const Stepper = ({
  steps,
  titleElement,
  type = 'check',
  connector = true,
  chip = true,
  className,
  ...props
}: Props): ReactElement => (
  <ol
    className={cn(styles.stepper, className, {
      [styles['no-chip']]: !chip,
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
          chip={chip}
        />
      )
    })}
  </ol>
)

export { Stepper, type StepItem }
