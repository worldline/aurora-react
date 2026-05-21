'use client'

import cn from 'classnames'
import {
  Button,
  CalendarCell,
  type CalendarCellProps,
  CalendarGrid,
  CalendarGridBody,
  type CalendarGridBodyProps,
  CalendarGridHeader,
  type CalendarGridHeaderProps,
  type CalendarGridProps,
  CalendarHeaderCell,
  type CalendarHeaderCellProps,
  Heading,
} from 'react-aria-components'

import { ChevronBackwardIcon, ChevronForwardIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import calendarStyles from './Calendar.module.css'

interface CalendarContentProps {
  /** Props forwarded to the root `CalendarGrid` component, excluding `children`. */
  calendarGridProps?: Omit<CalendarGridProps, 'children'>

  /** Props forwarded to the `CalendarGridBody` component, excluding `children`. */
  calendarGridBodyProps?: Omit<CalendarGridBodyProps, 'children'>

  /** Props forwarded to the `CalendarGridHeader` component, excluding `children`. */
  calendarGridHeaderProps?: Omit<CalendarGridHeaderProps, 'children'>

  /** Props forwarded to individual `CalendarHeaderCell` components (days of the week), excluding `children`. */
  calendarHeaderCellProps?: Omit<CalendarHeaderCellProps, 'children'>

  /** Props forwarded to individual `CalendarCell` components (day numbers), excluding `children` and `date`. */
  calendarCellProps?: Omit<CalendarCellProps, 'children' | 'date'>
}

const CalendarContent = ({
  calendarGridProps,
  calendarGridBodyProps,
  calendarGridHeaderProps,
  calendarHeaderCellProps,
  calendarCellProps,
}: CalendarContentProps) => (
  <>
    <header className={calendarStyles.header}>
      <Button slot="previous" className={calendarStyles['nav-button']}>
        <ChevronBackwardIcon aria-hidden size={24} />
      </Button>
      <Heading className={calendarStyles.heading} />
      <Button slot="next" className={calendarStyles['nav-button']}>
        <ChevronForwardIcon aria-hidden size={24} />
      </Button>
    </header>
    <CalendarGrid
      {...calendarGridProps}
      className={cn(calendarStyles.grid, calendarGridProps?.className)}
    >
      <CalendarGridHeader
        {...calendarGridHeaderProps}
        className={cn(
          calendarStyles['grid-header'],
          calendarGridHeaderProps?.className,
        )}
      >
        {(day) => (
          <CalendarHeaderCell
            {...calendarHeaderCellProps}
            className={cn(
              calendarStyles['header-cell'],
              calendarHeaderCellProps?.className,
            )}
          >
            <Typography
              element="p"
              textStyle="captionSm"
              textColor="contentSecondary"
            >
              {day}
            </Typography>
          </CalendarHeaderCell>
        )}
      </CalendarGridHeader>
      <CalendarGridBody
        {...calendarGridBodyProps}
        className={cn(
          calendarStyles['grid-body'],
          calendarGridBodyProps?.className,
        )}
      >
        {(date) => (
          <CalendarCell
            {...calendarCellProps}
            date={date}
            className={cn(calendarStyles.cell, calendarCellProps?.className)}
          >
            {({ formattedDate, isOutsideMonth }) => (
              <Typography
                element="p"
                textStyle="captionSm"
                textColor={
                  isOutsideMonth ? 'contentSecondary' : 'contentPrimary'
                }
              >
                {formattedDate}
              </Typography>
            )}
          </CalendarCell>
        )}
      </CalendarGridBody>
    </CalendarGrid>
  </>
)

export { CalendarContent, type CalendarContentProps }
