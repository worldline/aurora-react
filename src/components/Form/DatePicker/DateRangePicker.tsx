'use client'

import cn from 'classnames'
import { useId } from 'react'
import {
  DateRangePicker as AriaDateRangePicker,
  RangeCalendar,
} from 'react-aria-components'

import calendarStyles from './Calendar.module.css'
import { CalendarContent } from './CalendarContent'
import { DateFieldBase } from './DateFieldBase'
import styles from './DatePicker.module.css'
import { DateRangeInput } from './DateRangeInput'
import { DateRangePickerComposite } from './DateRangePickerComposite'
import type { DateRangePickerInternalProps } from './types'

const TOOLTIP_REQUIRES_LABEL_ERROR =
  'DateRangePicker: tooltip requires label to be provided.'
const TOOLTIP_REQUIRES_ARIA_LABEL_ERROR =
  'DateRangePicker: tooltip requires tooltipTriggerAriaLabel to be provided.'
const ACTIONS_REQUIRES_DEFAULT_PRESET_ERROR =
  'DateRangePicker: actions requires defaultPreset to be provided.'

const DateRangePicker = (props: DateRangePickerInternalProps) => {
  const id = useId()

  const {
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
    showRequiredMark,
    optionalLabel,
    presets,
    actions,
    triggerAriaLabel,
    value,
    defaultValue,
    onChange,
    ...restProps
  } = props

  if (tooltip !== undefined && label === undefined) {
    throw new Error(TOOLTIP_REQUIRES_LABEL_ERROR)
  }
  if (tooltip !== undefined && tooltipTriggerAriaLabel === undefined) {
    throw new Error(TOOLTIP_REQUIRES_ARIA_LABEL_ERROR)
  }
  if (actions !== undefined && props.defaultPreset === undefined) {
    throw new Error(ACTIONS_REQUIRES_DEFAULT_PRESET_ERROR)
  }

  if (presets || actions || triggerAriaLabel) {
    return <DateRangePickerComposite {...props} />
  }

  const errorId = error ? `${id}-error` : undefined

  return (
    <AriaDateRangePicker
      {...restProps}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
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
        showRequiredMark={showRequiredMark}
        optionalLabel={optionalLabel}
        dateInputContent={<DateRangeInput />}
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

export { DateRangePicker }
