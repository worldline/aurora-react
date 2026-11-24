'use client'

import cn from 'classnames'
import { type Ref } from 'react'

import { Button } from '@/components/Button'
import { ChevronForwardIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './DateRangePickerComposite.module.css'

interface DateRangePickerTriggerProps {
  /** The text displayed on the trigger button. */
  displayText: string
  /** Whether the associated popover or bottom sheet is open. */
  isOpen: boolean
  /** Called when the trigger button is pressed. */
  onToggle: () => void
  /** Whether the trigger button is disabled. */
  isDisabled?: boolean
  /** Whether the trigger button is read-only. */
  isReadOnly?: boolean
  /** Accessible label for the trigger button. */
  triggerAriaLabel?: string
  /** Ref forwarded to the underlying button element. */
  ref?: Ref<HTMLButtonElement>
}

const DateRangePickerTrigger = ({
  displayText,
  isOpen,
  onToggle,
  isDisabled,
  isReadOnly,
  triggerAriaLabel,
  ref,
}: DateRangePickerTriggerProps) => (
  <Button
    variant="link"
    slot={null}
    ref={ref}
    className={cn(styles.trigger, isReadOnly && styles['trigger-readonly'])}
    onPress={onToggle}
    isDisabled={isDisabled}
    aria-label={triggerAriaLabel}
    aria-expanded={isOpen}
    aria-haspopup="dialog"
    aria-readonly={isReadOnly ?? undefined}
  >
    <Typography
      element="span"
      textStyle="labelMd"
      className={styles['trigger-text']}
    >
      {displayText}
    </Typography>
    {isOpen ? (
      <ChevronForwardIcon
        aria-hidden
        size={20}
        className={cn(styles['trigger-icon'], styles['trigger-icon-up'])}
      />
    ) : (
      <ChevronForwardIcon
        aria-hidden
        size={20}
        className={cn(styles['trigger-icon'], styles['trigger-icon-down'])}
      />
    )}
  </Button>
)

export { DateRangePickerTrigger }
