import cn from 'classnames'
import { type ReactElement } from 'react'

import { Chip } from '../Chip'
import { Typography, type TextColor, type HeadingElement } from '../Typography'

import styles from './Step.module.css'
import { StepIcon } from './StepIcon'

type Type = 'icon' | 'number'

type StatusType = 'complete' | 'in-progress' | 'not-started'

interface StepStatus {
  label: string
  ariaLabel?: string
  type: StatusType
}

interface StepItem {
  id: string
  title: string
  description: string
  date?: string
  status: StepStatus
}

interface Props extends React.HTMLAttributes<HTMLLIElement> {
  step: StepItem
  connector: boolean
  titleElement: HeadingElement
  type: Type
  index: number
  isLast: boolean
  gridRow?: number
}

const Step = ({
  step,
  connector,
  titleElement,
  type,
  index,
  isLast,
  gridRow,
  className,
  ...props
}: Props): ReactElement => {
  const bodyTextColor = bodyTextColorByStatusType[step.status.type]

  return (
    <li
      key={step.id}
      className={cn(styles.step, step.status.type, className, {
        [styles['last-step']]: isLast,
      })}
      aria-label={`${step.title}. ${step.status.label}`}
      aria-current={step.status.type === 'in-progress' ? 'step' : undefined}
      {...props}
    >
      <div className={styles['left-column']} style={{ gridRow }} aria-hidden>
        <StepIcon status={step.status.type} type={type} number={index + 1} />
        {connector ? (
          <div
            className={cn(styles.connector, {
              [styles.dashed]: type === 'number',
            })}
          />
        ) : null}
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
        <div className={styles.body}>
          <Typography element="p" textStyle="bodyMd" textColor={bodyTextColor}>
            {step.description}
          </Typography>
          {step.date ? (
            <Typography
              element="p"
              textStyle="captionMd"
              textColor={bodyTextColor}
            >
              {step.date}
            </Typography>
          ) : null}
        </div>
      </div>
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
    </li>
  )
}

type ChipType = React.ComponentProps<typeof Chip>['type']

const chipTypeByStatusType: Readonly<Record<StatusType, ChipType>> = {
  complete: 'success',
  'in-progress': 'neutral',
  'not-started': 'neutral',
}

const bodyTextColorByStatusType: Readonly<Record<StatusType, TextColor>> = {
  complete: 'contentSecondary',
  'in-progress': 'contentBrand',
  'not-started': 'contentSecondary',
}

export { Step, type StepItem, type StepStatus, type Type, type StatusType }
