'use client'

import cn from 'classnames'
import { useId } from 'react'
import {
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  DateInput,
  DateSegment,
  type DateValue,
  RangeCalendar,
} from 'react-aria-components'

import { ArrowForwardIcon } from '@/components/icons'

import calendarStyles from './Calendar.module.css'
import { CalendarContent, type CalendarContentProps } from './CalendarContent'
import { DateFieldBase } from './DateFieldBase'
import styles from './DatePicker.module.css'

const TOOLTIP_REQUIRES_LABEL_ERROR =
  'DateRangePicker: tooltip requires label to be provided.'
const TOOLTIP_REQUIRES_ARIA_LABEL_ERROR =
  'DateRangePicker: tooltip requires tooltipTriggerAriaLabel to be provided.'

/**
 * Custom layout and style configuration for the DateRangePicker component.
 */
interface DateRangePickerProps extends CalendarContentProps {
  /**
   * Defines the height and padding scale of the input inputs.
   * @default 'small'
   */
  size?: 'small' | 'medium'
  /**
   * The text label displayed above or alongside the date inputs.
   */
  label?: string
  /**
   * Text content for the tooltip shown next to the label; requires label.
   */
  tooltip?: string
  /**
   * Accessible name for the tooltip trigger button; required when tooltip is set.
   */
  tooltipTriggerAriaLabel?: string
  /**
   * The validation error message displayed below the input.
   */
  error?: string
  /**
   * Configures screen reader announcements for accessibility when an error occurs.
   * @default 'polite'
   */
  announceError?: 'polite' | 'assertive' | false
}

/**
 * Combined properties for the component, merging local configurations
 * with foundational React Aria capabilities.
 */
type Props = DateRangePickerProps &
  Omit<
    AriaDateRangePickerProps<DateValue>,
    'children' | 'validate' | 'validationBehavior'
  >

const DateRangePicker = ({
  size = 'small',
  label,
  tooltip,
  tooltipTriggerAriaLabel,
  error,
  announceError = 'polite',
  calendarGridProps,
  calendarGridBodyProps,
  calendarGridHeaderProps,
  calendarHeaderCellProps,
  calendarCellProps,
  className,
  isRequired,
  ...props
}: Props) => {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined

  if (tooltip !== undefined && label === undefined) {
    throw new Error(TOOLTIP_REQUIRES_LABEL_ERROR)
  }
  if (tooltip !== undefined && tooltipTriggerAriaLabel === undefined) {
    throw new Error(TOOLTIP_REQUIRES_ARIA_LABEL_ERROR)
  }

  return (
    <AriaDateRangePicker
      {...props}
      className={cn(styles.container, styles[size], className)}
      isInvalid={Boolean(error)}
      isRequired={isRequired}
      aria-describedby={errorId}
    >
      <DateFieldBase
        label={label}
        isRequired={isRequired}
        tooltip={tooltip}
        tooltipTriggerAriaLabel={tooltipTriggerAriaLabel}
        error={error}
        errorId={errorId}
        announceError={announceError}
        dateInputContent={
          <>
            <DateInput slot="start" className={styles['date-input']}>
              {(segment) => (
                <DateSegment segment={segment} className={styles.segment} />
              )}
            </DateInput>
            <span className={styles.separator}>
              <ArrowForwardIcon aria-hidden size={20} />
            </span>
            <DateInput slot="end" className={styles['date-input']}>
              {(segment) => (
                <DateSegment segment={segment} className={styles.segment} />
              )}
            </DateInput>
          </>
        }
        calendarContent={
          <RangeCalendar className={calendarStyles.calendar}>
            <CalendarContent
              calendarGridProps={calendarGridProps}
              calendarGridBodyProps={calendarGridBodyProps}
              calendarGridHeaderProps={calendarGridHeaderProps}
              calendarHeaderCellProps={calendarHeaderCellProps}
              calendarCellProps={calendarCellProps}
            />
          </RangeCalendar>
        }
      />
    </AriaDateRangePicker>
  )
}

export { DateRangePicker, type DateRangePickerProps }
