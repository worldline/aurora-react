'use client'

import { getLocalTimeZone, today } from '@internationalized/date'
import { announce } from '@react-aria/live-announcer'
import type { RangeValue } from '@react-types/shared'
import cn from 'classnames'
import { useEffect, useId, useRef, useState } from 'react'
import {
  DateRangePicker as AriaDateRangePicker,
  type DateValue,
  Dialog,
  RangeCalendar,
} from 'react-aria-components'

import { BottomSheet } from '@/components/BottomSheet'
import { Button } from '@/components/Button'
import { FilterGroup } from '@/components/Filter/FilterGroup'
import { FilterItem } from '@/components/Filter/FilterItem'
import { Popover } from '@/components/Popover'
import { useMediaQuery } from '@/utils/useMediaQuery'

import { ErrorMessage } from '../ErrorMessage'
import calendarStyles from './Calendar.module.css'
import { CalendarContent } from './CalendarContent'
import styles from './DatePicker.module.css'
import { DateRangeInputGroup } from './DateRangeInputGroup'
import compositeStyles from './DateRangePickerComposite.module.css'
import { DateRangePickerTrigger } from './DateRangePickerTrigger'
import { DateRangePresetList } from './DateRangePresetList'
import type { DateRangePickerInternalProps } from './types'

const MOBILE_MEDIA_QUERY = '(width <= 480px)'

const formatDateValue = (date: DateValue): string => {
  const day = String(date.day).padStart(2, '0')
  const month = String(date.month).padStart(2, '0')
  return `${day}/${month}/${String(date.year)}`
}

const defaultFormatRange = (range: RangeValue<DateValue>): string =>
  `From ${formatDateValue(range.start)} to ${formatDateValue(range.end)}`

const computePresetRange = (duration: {
  years?: number
  months?: number
  weeks?: number
  days?: number
}): RangeValue<DateValue> => {
  const end = today(getLocalTimeZone())
  const start = end.subtract(duration)
  return { start, end }
}

const DateRangePickerComposite = ({
  size = 'small',
  error,
  announceError = 'polite',
  calendarGridProps,
  calendarGridBodyProps,
  calendarGridHeaderProps,
  calendarHeaderCellProps,
  calendarCellProps,
  className,
  isRequired,
  isDisabled,
  isReadOnly,
  showDateField = true,
  presets,
  selectedPresetId,
  onPresetSelect,
  actions,
  defaultPreset,
  formatRange = defaultFormatRange,
  triggerText,
  triggerAriaLabel,
  sheetTitle,
  closeLabel,
  value: valueProp,
  defaultValue,
  onChange,
  ...restProps
}: DateRangePickerInternalProps) => {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined
  useEffect(() => {
    if (error && announceError) {
      announce(error, announceError)
    }
  }, [error, announceError])
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  const [internalValue, setInternalValue] =
    useState<RangeValue<DateValue> | null>(defaultValue ?? null)
  const isControlled = valueProp !== undefined
  const committedValue = isControlled ? valueProp : internalValue
  const [draftValue, setDraftValue] = useState<RangeValue<DateValue> | null>(
    committedValue,
  )
  const [draftPresetId, setDraftPresetId] = useState<string | undefined>(
    selectedPresetId,
  )

  const commitRange = (
    range: RangeValue<DateValue>,
    presetId?: string,
  ): void => {
    setInternalValue(range)
    onChange?.(range)
    onPresetSelect?.(presetId)
  }

  const handleToggle = (): void => {
    if (isDisabled || isReadOnly) {
      return
    }
    if (isOpen) {
      setIsOpen(false)
      return
    }
    setDraftValue(committedValue)
    setDraftPresetId(selectedPresetId)
    setIsOpen(true)
  }

  const handleDraftChange = (newValue: RangeValue<DateValue> | null): void => {
    setDraftValue(newValue)
    setDraftPresetId(undefined)
    if (!actions && newValue !== null) {
      commitRange(newValue, undefined)
      setIsOpen(false)
    }
  }

  const handlePresetSelect = (presetId: string): void => {
    const matchedPreset = presets?.find((preset) => preset.id === presetId)
    if (!matchedPreset) {
      return
    }
    const range = computePresetRange(matchedPreset.duration)
    setDraftValue(range)
    setDraftPresetId(presetId)
    if (!actions) {
      commitRange(range, presetId)
      setIsOpen(false)
    }
  }

  const handleApply = (): void => {
    if (draftValue !== null) {
      setInternalValue(draftValue)
      onChange?.(draftValue)
    }
    onPresetSelect?.(draftPresetId)
    actions?.primaryAction.onAction()
    setIsOpen(false)
  }

  const handleReset = (): void => {
    if (defaultPreset) {
      const range = computePresetRange(defaultPreset.duration)
      setDraftValue(range)
      setDraftPresetId(defaultPreset.id)
      commitRange(range, defaultPreset.id)
    }
    actions?.secondaryAction.onAction()
    setIsOpen(false)
  }

  const calendarContent = (
    <RangeCalendar className={calendarStyles.calendar}>
      <CalendarContent
        calendarGridProps={calendarGridProps}
        calendarGridBodyProps={calendarGridBodyProps}
        calendarGridHeaderProps={calendarGridHeaderProps}
        calendarHeaderCellProps={calendarHeaderCellProps}
        calendarCellProps={calendarCellProps}
      />
    </RangeCalendar>
  )

  const actionButtons = actions ? (
    <div className={compositeStyles.actions}>
      <Button
        className={compositeStyles['action-button']}
        variant="secondary"
        size="small"
        slot={null}
        onPress={handleReset}
      >
        {actions.secondaryAction.label}
      </Button>
      <Button
        className={compositeStyles['action-button']}
        variant="primary"
        size="small"
        slot={null}
        onPress={handleApply}
      >
        {actions.primaryAction.label}
      </Button>
    </div>
  ) : null

  const dateFieldContent = showDateField ? (
    <div className={compositeStyles['date-range-field']}>
      <DateRangeInputGroup />
    </div>
  ) : null

  const resolvedPresetLabel = selectedPresetId
    ? presets?.find((preset) => preset.id === selectedPresetId)?.label
    : undefined

  const displayText =
    triggerText ??
    resolvedPresetLabel ??
    (committedValue !== null ? formatRange(committedValue) : '')

  const triggerElement = (
    <DateRangePickerTrigger
      ref={triggerRef}
      displayText={displayText}
      isOpen={isOpen}
      onToggle={handleToggle}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      triggerAriaLabel={triggerAriaLabel}
    />
  )

  const dateRangePickerProps = {
    ...restProps,
    value: draftValue,
    onChange: handleDraftChange,
    isInvalid: Boolean(error),
    isRequired,
    isDisabled,
    isReadOnly,
    'aria-describedby': errorId,
  }

  if (isMobile) {
    return (
      <div className={cn(styles.container, styles[size], className)}>
        {triggerElement}
        {error ? <ErrorMessage id={errorId} error={error} /> : null}

        <BottomSheet
          title={sheetTitle ?? ''}
          closeLabel={closeLabel ?? ''}
          height="content"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          contentPadding={false}
        >
          <AriaDateRangePicker {...dateRangePickerProps}>
            <div className={compositeStyles['mobile-content']}>
              {presets && presets.length > 0 ? (
                <div className={compositeStyles['mobile-presets']}>
                  <FilterGroup
                    selectionMode="single"
                    selectedKeys={draftPresetId ? [draftPresetId] : []}
                    onSelectionChange={(keys) => {
                      const selectedKeysArray = Array.from(keys)
                      if (selectedKeysArray.length > 0) {
                        handlePresetSelect(String(selectedKeysArray[0]))
                      }
                    }}
                    aria-label="Date range presets"
                  >
                    {presets.map((preset) => (
                      <FilterItem key={preset.id} id={preset.id}>
                        {preset.label}
                      </FilterItem>
                    ))}
                  </FilterGroup>
                </div>
              ) : null}
              {dateFieldContent}
              <div className={compositeStyles['mobile-calendar']}>
                {calendarContent}
                {actionButtons}
              </div>
            </div>
          </AriaDateRangePicker>
        </BottomSheet>
      </div>
    )
  }

  return (
    <AriaDateRangePicker
      {...dateRangePickerProps}
      className={cn(styles.container, styles[size], className)}
    >
      {triggerElement}
      {error ? <ErrorMessage id={errorId} error={error} /> : null}

      <Popover
        className={compositeStyles['composite-popover']}
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Dialog className={compositeStyles['composite-dialog']}>
          {presets && presets.length > 0 ? (
            <DateRangePresetList
              presets={presets}
              selectedPresetId={draftPresetId}
              onPresetSelect={handlePresetSelect}
            />
          ) : null}
          <div className={compositeStyles['calendar-layout']}>
            {dateFieldContent}
            {calendarContent}
            {actionButtons}
          </div>
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  )
}

export { DateRangePickerComposite }
