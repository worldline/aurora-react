'use client'

import { announce } from '@react-aria/live-announcer'
import cn from 'classnames'
import { type ReactNode, useEffect, useId } from 'react'
import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  Button,
  Label,
  ListBox,
} from 'react-aria-components'

import { KeyboardArrowDownIcon, KeyboardArrowUpIcon } from '@/components/icons'
import { Popover } from '@/components/Popover'
import { Typography } from '@/components/Typography'

import styles from './Select.module.css'
import { SelectFieldSupport } from './SelectFieldSupport'
import { SelectMultiValue } from './SelectMultiValue'

/** Aurora-specific props for the Select component. */
interface AuroraSelectProps {
  /** Size variant of the select trigger. */
  size?: 'small' | 'medium'
  /** Label displayed above the select. */
  label?: string
  /** Error message displayed below the select. */
  error?: string
  /** Live-region politeness for the error announcement, or `false` to disable. */
  announceError?: 'polite' | 'assertive' | false
  /** Placeholder text shown when no option is selected. */
  placeholder?: string
  /** Helper text displayed below the select. */
  helperText?: string
  /** Content rendered before the selected value inside the trigger. */
  leading?: ReactNode
  /** Whether the select is read-only. */
  isReadOnly?: boolean
}

type Props<M extends 'single' | 'multiple' = 'single'> = AuroraSelectProps &
  Omit<AriaSelectProps<object, M>, 'children'> & {
    children: ReactNode
  }

const Select = <M extends 'single' | 'multiple' = 'single'>({
  size = 'small',
  label,
  error,
  className,
  announceError = 'polite',
  placeholder = 'Select an option',
  helperText,
  leading,
  isRequired,
  isReadOnly,
  children,
  ...props
}: Props<M>) => {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined

  useEffect(() => {
    if (error && announceError) {
      announce(error, announceError)
    }
  }, [error, announceError])

  return (
    <AriaSelect
      {...props}
      aria-describedby={errorId}
      aria-readonly={isReadOnly ?? undefined}
      className={cn(styles.container, styles[size], className)}
      isInvalid={Boolean(error)}
      isRequired={isRequired}
      isOpen={isReadOnly ? false : (props.isOpen ?? undefined)}
      placeholder={placeholder}
    >
      {({ isOpen }) => (
        <>
          {label ? (
            <Label>
              <Typography
                element="span"
                textStyle="labelSm"
                className={styles.label}
              >
                {label}
                {isRequired ? <span aria-hidden="true">*</span> : null}
              </Typography>
            </Label>
          ) : null}

          <Button className={styles.trigger}>
            {leading ? <span className={styles.leading}>{leading}</span> : null}
            <SelectMultiValue placeholder={placeholder} />
            {isOpen ? (
              <KeyboardArrowUpIcon
                aria-hidden
                className={styles.chevron}
                size={24}
              />
            ) : (
              <KeyboardArrowDownIcon
                aria-hidden
                className={styles.chevron}
                size={24}
              />
            )}
          </Button>

          <Popover className={styles.popover} offset={4}>
            <ListBox className={styles.listbox}>{children}</ListBox>
          </Popover>

          {error || helperText ? (
            <SelectFieldSupport
              error={error}
              errorId={errorId}
              helperText={helperText}
            />
          ) : null}
        </>
      )}
    </AriaSelect>
  )
}

export { Select, type AuroraSelectProps }
