import cn from 'classnames'
import { type HTMLAttributes, type ReactElement, type ReactNode } from 'react'

import { Chip } from '../Chip'
import { Typography, type HeadingElement } from '../Typography'

import styles from './Step.module.css'
import { StepIcon } from './StepIcon'

type StepType = 'check' | 'number' | 'icon'

type StepStatus = 'complete' | 'current' | 'incomplete'

type StepItem<T extends StepType> = {
  id: string
  title: string
  description?: string
  date?: string
  status: StepStatus
  chip?: ReactElement<typeof Chip>
} & (T extends 'icon' ? { icon: ReactNode } : { icon?: never })

interface Props<T extends StepType> extends HTMLAttributes<HTMLLIElement> {
  step: StepItem<T>
  connector: boolean
  titleElement: HeadingElement
  type: T
  index: number
  isLast: boolean
  gridRow?: number
}

const Step = <T extends StepType>({
  step,
  connector,
  titleElement,
  type,
  index,
  isLast,
  gridRow,
  className,
  ...props
}: Props<T>): ReactElement => {
  const hasBody = Boolean(step.description ?? step.date)

  const renderStepIcon = () => {
    const number = index + 1

    if (type === 'icon') {
      return (
        <StepIcon
          status={step.status}
          type={type}
          number={number}
          icon={step.icon}
        />
      )
    }

    return <StepIcon status={step.status} type={type} number={number} />
  }

  return (
    <li
      key={step.id}
      className={cn(
        styles.step,
        styles[step.status],
        styles[type],
        { [styles['no-body']]: !hasBody },
        className,
        {
          [styles['last-step']]: isLast,
        },
      )}
      aria-label={step.title}
      aria-current={step.status === 'current' ? 'step' : undefined}
      {...props}
    >
      <div className={styles['left-column']} style={{ gridRow }} aria-hidden>
        {renderStepIcon()}
        {connector ? <div className={cn(styles.connector)} /> : null}
      </div>
      <div className={styles['middle-column']} style={{ gridRow }}>
        <Typography
          element={titleElement}
          textStyle="labelMd"
          textColor="contentPrimary"
          className={styles.title}
        >
          {step.title}
        </Typography>
        {hasBody ? (
          <div className={styles.body}>
            {step.description && (
              <Typography
                element="p"
                textStyle="bodyMd"
                textColor="contentSecondary"
              >
                {step.description}
              </Typography>
            )}
            {step.date && (
              <Typography
                element="p"
                textStyle="captionMd"
                textColor="contentSecondary"
              >
                {step.date}
              </Typography>
            )}
          </div>
        ) : null}
      </div>
      {step.chip ? (
        <div style={{ gridRow }} className={styles['right-column']}>
          {step.chip}
        </div>
      ) : null}
    </li>
  )
}

export { Step, type StepItem, type StepStatus, type StepType }
