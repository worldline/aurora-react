'use client'

import { announce } from '@react-aria/live-announcer'
import { type ReactNode, useEffect, useRef } from 'react'
import { Button, Dialog, Group, Label } from 'react-aria-components'

import { FieldLabel } from '@/components/Form/FieldLabel'
import { CalendarTodayIcon } from '@/components/icons'
import { Popover } from '@/components/Popover'

import { ErrorMessage } from '../ErrorMessage'
import calendarStyles from './Calendar.module.css'
import styles from './DatePicker.module.css'

interface DateFieldBaseProps {
  label?: string
  isRequired?: boolean
  tooltip?: string
  tooltipTriggerAriaLabel?: string
  error?: string
  announceError?: 'polite' | 'assertive' | false
  dateInputContent: ReactNode
  calendarContent: ReactNode
  errorId?: string
}

const DateFieldBase = ({
  label,
  isRequired,
  tooltip,
  tooltipTriggerAriaLabel,
  error,
  announceError = 'polite',
  dateInputContent,
  calendarContent,
  errorId,
}: DateFieldBaseProps) => {
  const triggerRef = useRef(null)
  useEffect(() => {
    if (error && announceError) {
      announce(error, announceError)
    }
  }, [error, announceError])

  return (
    <>
      {label !== undefined || tooltip !== undefined ? (
        <Label>
          <FieldLabel
            label={label}
            isRequired={isRequired}
            tooltip={tooltip}
            tooltipTriggerAriaLabel={tooltipTriggerAriaLabel}
            className={styles.label}
          />
        </Label>
      ) : null}

      <Group className={styles['input-wrapper']} ref={triggerRef}>
        {dateInputContent}
        <Button className={styles['calendar-button']}>
          <CalendarTodayIcon aria-hidden size={24} />
        </Button>
      </Group>

      {error ? <ErrorMessage id={errorId} error={error} /> : null}

      <Popover className={calendarStyles.popover} triggerRef={triggerRef}>
        <Dialog className={calendarStyles.dialog}>{calendarContent}</Dialog>
      </Popover>
    </>
  )
}

export { DateFieldBase, type DateFieldBaseProps }
