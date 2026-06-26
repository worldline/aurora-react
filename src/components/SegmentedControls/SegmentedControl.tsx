'use client'
/* eslint-disable @eslint-react/no-clone-element */
import cn from 'classnames'
import { cloneElement, type ReactElement } from 'react'
import {
  RadioButton as AriaRadioButton,
  RadioField as AriaRadioField,
  type RadioFieldProps,
} from 'react-aria-components'

import { Typography } from '../Typography'
import styles from './SegmentedControl.module.css'

interface SegmentedControlProps extends Omit<RadioFieldProps, 'children'> {
  /** Text label displayed inside the control */
  children: string
  /** Optional icon displayed after the label */
  trailingIcon?: ReactElement<{ className?: string }>
  /** Additional CSS class name applied to the control element */
  className?: string
}

const SegmentedControl = ({
  children,
  trailingIcon,
  className,
  ...props
}: SegmentedControlProps) => {
  const trailingIconElement = trailingIcon
    ? cloneElement(trailingIcon, {
        className: cn(styles.icon, trailingIcon.props.className),
      })
    : null

  return (
    <AriaRadioField {...props} className={styles.field}>
      <AriaRadioButton className={cn(styles.control, className)}>
        <Typography
          element="span"
          textStyle="labelSm"
          textColor="contentPrimary"
          className={styles.label}
        >
          {children}
        </Typography>
        {trailingIconElement}
      </AriaRadioButton>
    </AriaRadioField>
  )
}

export { SegmentedControl }
