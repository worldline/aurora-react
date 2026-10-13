'use client'

import cn from 'classnames'
import { type RefObject, use, useEffect, useRef } from 'react'
import {
  ComboBox,
  ComboBoxStateContext,
  Group,
  Input,
  type Key,
  Label,
} from 'react-aria-components'

import { Button } from '@/components/Button'
import { FieldLabel } from '@/components/Form/FieldLabel'
import { FieldSupport } from '@/components/Form/FieldSupport'
import {
  CancelIcon,
  ProgressActivityIcon,
  SearchIcon,
} from '@/components/icons'
import { Popover } from '@/components/Popover'
import { Typography } from '@/components/Typography'

import styles from './Autocomplete.module.css'
import { AutocompleteList } from './AutocompleteList'
import type {
  AutocompleteFilter,
  AutocompleteOption,
  AutocompleteSize,
  FooterAction,
} from './types'

interface ClearButtonProps {
  /** Accessible name of the button. */
  label: string
  /** Ref to the autocomplete input that should regain focus after clearing. */
  inputRef: RefObject<HTMLInputElement | null>
}

/**
 * Resets the input and the selection. Rendered inside the combo box so it can
 * reach the state React Aria keeps for the field.
 *
 * Hidden while the list is open: React Aria marks everything outside the input
 * and the popover `aria-hidden`, which a focusable button must never sit
 * inside. Backspace covers clearing while the user is still searching.
 */
const ClearButton = ({ label, inputRef }: ClearButtonProps) => {
  const state = use(ComboBoxStateContext)

  if (!state?.inputValue) {
    return null
  }

  return (
    <Button
      aria-label={label}
      className={styles['clear-button']}
      excludeFromTabOrder={state.isOpen}
      onPress={() => {
        state.setValue(null)
        state.setInputValue('')
        inputRef.current?.focus({ preventScroll: true })
      }}
      size="small"
      slot={null}
      variant="link"
    >
      <CancelIcon aria-hidden className={styles['clear-icon']} />
    </Button>
  )
}

interface OpenThresholdControllerProps {
  /** Minimum number of characters required before the popover can open. */
  minCharsToOpen: number
}

const OpenThresholdController = ({
  minCharsToOpen,
}: OpenThresholdControllerProps) => {
  const state = use(ComboBoxStateContext)

  useEffect(() => {
    if (!state?.isFocused) {
      return
    }

    const hasEnoughCharacters = state.inputValue.length >= minCharsToOpen

    if (hasEnoughCharacters && !state.isOpen) {
      state.open(null, 'input')
    }

    if (!hasEnoughCharacters && state.isOpen) {
      state.close()
    }
  }, [state, minCharsToOpen])

  return null
}

interface DropdownPanelProps {
  /** Options offered in the list, before React Aria filters them. */
  options: Array<AutocompleteOption>
  /** Builds the count line displayed above the options. */
  formatResultsCount: (count: number) => string
  /** Row appended below the options, offering to enter a value manually. */
  footerAction?: FooterAction
  /** Text shown in place of the options when none of them match the input. */
  emptyLabel: string
}

/**
 * Reads the filtered collection from the combo box so the count always matches
 * the rows React Aria actually renders.
 */
const DropdownPanel = ({
  options,
  formatResultsCount,
  footerAction,
  emptyLabel,
}: DropdownPanelProps) => {
  const state = use(ComboBoxStateContext)

  return (
    <AutocompleteList
      footerAction={footerAction}
      emptyLabel={emptyLabel}
      options={options}
      resultsLabel={formatResultsCount(state?.collection.size ?? 0)}
    />
  )
}

interface AutocompleteDropdownProps {
  /** Options offered in the list. */
  options: Array<AutocompleteOption>
  /** Label displayed above the field. */
  label?: string
  /** Text content for the tooltip shown next to the label; requires label. */
  tooltip?: string
  /** Accessible name for the tooltip trigger button; required when tooltip is set. */
  tooltipTriggerAriaLabel?: string
  /** Accessible name used when no visible `label` is provided. */
  ariaLabel?: string
  /** Size variant of the field. */
  size: AutocompleteSize
  /** Placeholder shown while the field is empty. */
  placeholder: string
  /** Current text held by the input. */
  inputValue: string
  /** Called whenever the text held by the input changes. */
  onInputChange: (inputValue: string) => void
  /** Key of the option currently selected, or `null` when there is none. */
  selectedKey: Key | null
  /** Called when the selected option changes. */
  onSelectionChange: (key: Key | null) => void
  /** Helper text displayed below the field. */
  helperText?: string
  /** Error message displayed below the field. */
  error?: string
  /** Whether a value must be selected before the form can be submitted. */
  isRequired?: boolean
  /** Whether the field is disabled. */
  isDisabled?: boolean
  /** Whether the field only displays its value. */
  isReadOnly?: boolean
  /** Name submitted with the enclosing form. */
  name?: string
  /** Builds the count line displayed above the options. */
  formatResultsCount: (count: number) => string
  /** Text shown in place of the options when none of them match the input. */
  emptyLabel: string
  /** Accessible name of the button clearing the field. */
  clearLabel: string
  /** Row appended below the options, offering to enter a value manually. */
  footerAction?: FooterAction
  /**
   * Determines whether an option matches the typed input value.
   * @default A case-insensitive "contains" match on the option's label.
   */
  filter?: AutocompleteFilter
  /**
   * Minimum number of characters typed before the popover can open.
   * @default 0 opens as soon as the field is focused
   */
  minCharsToOpen?: number
  /** Additional CSS class name applied to the field container. */
  className?: string
  /** Autocomplete dropdown / bottom sheet is in pending state */
  isPending?: boolean
  /** Label to go with the pending state */
  pendingLabel?: string
}

/**
 * Desktop presentation: a text input that opens its options in a popover
 * anchored to the field.
 */
const AutocompleteDropdown = ({
  options,
  label,
  tooltip,
  tooltipTriggerAriaLabel,
  ariaLabel,
  size,
  placeholder,
  inputValue,
  onInputChange,
  selectedKey,
  onSelectionChange,
  helperText,
  error,
  isRequired,
  isDisabled,
  isReadOnly,
  name,
  formatResultsCount,
  emptyLabel,
  clearLabel,
  footerAction,
  filter,
  minCharsToOpen = 0,
  className,
  isPending = false,
  pendingLabel,
}: AutocompleteDropdownProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <ComboBox
      allowsEmptyCollection
      aria-label={label ? undefined : ariaLabel}
      className={cn(
        styles.container,
        styles[size],
        { [styles.filled]: inputValue.length > 0 },
        className,
      )}
      defaultFilter={filter}
      inputValue={inputValue}
      isDisabled={isDisabled}
      isInvalid={Boolean(error)}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      menuTrigger={minCharsToOpen > 0 ? 'manual' : 'focus'}
      name={name}
      onChange={onSelectionChange}
      onInputChange={onInputChange}
      value={selectedKey}
    >
      {minCharsToOpen > 0 ? (
        <OpenThresholdController minCharsToOpen={minCharsToOpen} />
      ) : null}

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

      <Group className={styles['input-wrapper']}>
        <SearchIcon aria-hidden className={styles['search-icon']} />
        <Input
          className={styles.input}
          placeholder={placeholder}
          ref={inputRef}
        />
        {isReadOnly || isDisabled ? null : (
          <ClearButton label={clearLabel} inputRef={inputRef} />
        )}
      </Group>

      <Popover
        className={cn(styles.popover, { [styles.pending]: isPending })}
        offset={4}
        maxHeight={320}
      >
        <DropdownPanel
          footerAction={footerAction}
          emptyLabel={emptyLabel}
          formatResultsCount={formatResultsCount}
          options={options}
        />
        <div
          aria-hidden={!isPending}
          className={styles['pending-overlay']}
          role={isPending ? 'status' : undefined}
        >
          <ProgressActivityIcon
            className={cn(styles.icon, styles['pending-icon'])}
            aria-hidden
          />
          {pendingLabel ? (
            <Typography element="p" textStyle="labelSm">
              {pendingLabel}
            </Typography>
          ) : null}
        </div>
      </Popover>

      {(error ?? helperText) ? (
        <FieldSupport
          currentLength={inputValue.length}
          error={error}
          helperText={helperText}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
        />
      ) : null}
    </ComboBox>
  )
}

export { AutocompleteDropdown, type AutocompleteDropdownProps }
