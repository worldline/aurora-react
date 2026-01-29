import cn from 'classnames'
import { useId, type ReactElement } from 'react'

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
  gridRow?: number
}

const Step = ({
  step,
  index,
  connector,
  titleElement,
  type,
  gridRow,
  className,
  ...props
}: Props): ReactElement => {
  const titleId = useId()
  const statusId = useId()
  const bodyTextColor = bodyTextColorByStatusType[step.status.type]

  return (
    <li
      key={step.id}
      className={cn(styles.step, step.status.type, className)}
      aria-labelledby={`${titleId} ${statusId}`}
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
          id={titleId}
          element={titleElement}
          textStyle="textMdMedium"
          textColor={titleColorByStatusType[step.status.type]}
          className={styles.title}
        >
          {step.title}
        </Typography>
        <div className={styles.body}>
          <Typography
            element="p"
            textStyle="textMdRegular"
            textColor={bodyTextColor}
          >
            {step.description}
          </Typography>
          <Typography
            element="p"
            textStyle="textSmRegular"
            textColor={bodyTextColor}
          >
            {step.date}
          </Typography>
        </div>
      </div>
      <Chip
        id={statusId}
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

const titleColorByStatusType: Readonly<Record<StatusType, TextColor>> = {
  complete: 'contentPrimary',
  'in-progress': 'contentPrimary',
  'not-started': 'contentSecondary',
}

const bodyTextColorByStatusType: Readonly<Record<StatusType, TextColor>> = {
  complete: 'contentSecondary',
  'in-progress': 'contentBrand',
  'not-started': 'contentSecondary',
}

export { Step, type StepItem, type StepStatus, type Type, type StatusType }
