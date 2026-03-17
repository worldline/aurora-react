import cn from 'classnames'
import {
  type ComponentProps,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'

import { Chip } from '../Chip'
import { Typography, type HeadingElement, type TextColor } from '../Typography'

import styles from './Step.module.css'
import { StepIcon } from './StepIcon'

type StepType = 'check' | 'number' | 'icon'

type StepStatusType = 'complete' | 'in-progress' | 'not-started'

interface StepStatus {
  label: string
  ariaLabel?: string
  type: StepStatusType
}

type StepItem<T extends StepType> = {
  id: string
  title: string
  description?: string
  date?: string
  status: StepStatus
} & (T extends 'icon' ? { icon: ReactNode } : { icon?: never })

interface Props<T extends StepType> extends HTMLAttributes<HTMLLIElement> {
  step: StepItem<T>
  connector: boolean
  titleElement: HeadingElement
  type: T
  index: number
  isLast: boolean
  chip: boolean
  gridRow?: number
}

const Step = <T extends StepType>({
  step,
  connector,
  titleElement,
  type,
  index,
  isLast,
  chip,
  gridRow,
  className,
  ...props
}: Props<T>): ReactElement => {
  const bodyTextColor = bodyTextColorByStatusType[step.status.type]
  const hasBody = Boolean(step.description ?? step.date)

  const renderStepIcon = () => {
    const number = index + 1

    if (type === 'icon') {
      return (
        <StepIcon
          status={step.status.type}
          type={type}
          number={number}
          icon={step.icon}
        />
      )
    }

    return <StepIcon status={step.status.type} type={type} number={number} />
  }

  return (
    <li
      key={step.id}
      className={cn(
        styles.step,
        styles[step.status.type],
        styles[type],
        { [styles['no-body']]: !hasBody },
        className,
        {
          [styles['last-step']]: isLast,
        },
      )}
      aria-label={`${step.title}. ${step.status.label}`}
      aria-current={step.status.type === 'in-progress' ? 'step' : undefined}
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
                textColor={bodyTextColor}
              >
                {step.description}
              </Typography>
            )}
            {step.date && (
              <Typography
                element="p"
                textStyle="captionMd"
                textColor={bodyTextColor}
              >
                {step.date}
              </Typography>
            )}
          </div>
        ) : null}
      </div>
      {chip ? (
        <Chip
          style={{ gridRow }}
          className={cn(styles['right-column'], {
            'visually-hidden': step.status.type === 'not-started',
          })}
          label={step.status.label}
          aria-label={step.status.ariaLabel}
          type={chipTypeByStatusType[step.status.type]}
          size="small"
        />
      ) : null}
    </li>
  )
}

type ChipType = ComponentProps<typeof Chip>['type']

const chipTypeByStatusType: Readonly<Record<StepStatusType, ChipType>> = {
  complete: 'success',
  'in-progress': 'info',
  'not-started': 'neutral',
}

const bodyTextColorByStatusType: Readonly<Record<StepStatusType, TextColor>> = {
  complete: 'contentSecondary',
  'in-progress': 'contentBrand',
  'not-started': 'contentSecondary',
}

export {
  Step,
  type StepStatusType,
  type StepItem,
  type StepStatus,
  type StepType,
}
