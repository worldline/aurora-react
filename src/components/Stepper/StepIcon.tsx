import cn from 'classnames'
import type { ReactElement, ReactNode } from 'react'

import { assertUnreachable } from '@/utils/asserts'

import { CheckIcon } from '../icons'
import { Typography } from '../Typography'

import type { StatusType, Type } from './Step'
import styles from './StepIcon.module.css'

type Props = {
  status: StatusType
  number?: number
} & (
  | { type: 'check' | 'number'; icon?: never }
  | { type: 'icon'; icon: ReactNode }
)

const StepIcon = ({ type, status, number, icon }: Props): ReactElement => {
  const renderIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckIcon fill="currentColor" />
      case 'in-progress':
        switch (type) {
          case 'icon':
            return icon
          case 'check':
            return <div />
          case 'number':
            return (
              <Typography
                element="span"
                textStyle="labelSm"
                textColor="contentSecondary"
              >
                {number}
              </Typography>
            )
          default:
            assertUnreachable(type)
        }
        break
      case 'not-started':
        switch (type) {
          case 'icon':
            return icon
          case 'check':
            return <div />
          case 'number':
            return (
              <Typography
                element="span"
                textStyle="labelSm"
                textColor="contentTertiary"
              >
                {number}
              </Typography>
            )
          default:
            assertUnreachable(type)
        }
        break
      default:
        assertUnreachable(status)
    }
  }

  return (
    <span className={cn(styles.icon, styles[status], typeStyle[type])}>
      {renderIcon()}
    </span>
  )
}

const typeStyle: Readonly<Record<Type, string>> = {
  check: styles['check-type'],
  number: styles['number-type'],
  icon: styles['icon-type'],
}

export { StepIcon }
