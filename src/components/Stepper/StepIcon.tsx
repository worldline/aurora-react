import cn from 'classnames'
import type { ReactElement } from 'react'

import { assertUnreachable } from '@/utils/asserts'

import { CheckIcon } from '../icons'
import { Typography } from '../Typography'

import type { StatusType, Type } from './Step'
import styles from './StepIcon.module.css'

interface Props {
  type: Type
  status: StatusType
  number?: number
}

const StepIcon = ({ type, status, number }: Props): ReactElement => {
  const renderIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckIcon fill="currentColor" />
      case 'in-progress':
        return type === 'check' ? (
          <div />
        ) : (
          <Typography
            element="span"
            textStyle="labelSm"
            textColor="contentSecondary"
          >
            {number}
          </Typography>
        )
      case 'not-started':
        return type === 'check' ? (
          <div />
        ) : (
          <Typography
            element="span"
            textStyle="labelSm"
            textColor="contentTertiary"
          >
            {number}
          </Typography>
        )
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
}

export { StepIcon }
