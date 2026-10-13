'use client'

import { announce } from '@react-aria/live-announcer'
import { useEffect, useRef, useState } from 'react'
import type { Key } from 'react-aria-components'

import { useMediaQuery } from '@/utils/useMediaQuery'

import { AutocompleteDropdown } from './AutocompleteDropdown'
import { AutocompleteSheet } from './AutocompleteSheet'
import type {
  AutocompleteFilter,
  AutocompleteOption,
  AutocompleteSize,
  FooterAction,
} from './types'

/** Viewport below which the autocomplete switches to the bottom sheet. */
const MOBILE_MEDIA_QUERY = '(width <= 480px)'

const TOOLTIP_REQUIRES_LABEL_ERROR =
  'Autocomplete: tooltip requires label to be provided.'
const TOOLTIP_REQUIRES_ARIA_LABEL_ERROR =
  'Autocomplete: tooltip requires tooltipTriggerAriaLabel to be provided.'

interface AutocompleteProps {
  /** Options offered in the list. */
  options: Array<AutocompleteOption>
  /** Label displayed above the field. */
  label?: string
  /** Text content for the tooltip shown next to the label; requires label. */
  tooltip?: string
  /** Accessible name for the tooltip trigger button; required when tooltip is set. */
  tooltipTriggerAriaLabel?: string
  /** Accessible name used when no visible `label` is provided. */
  'aria-label'?: string
  /**
   * Size variant of the field.
   * @default 'small'
   */
  size?: AutocompleteSize
  /** Placeholder shown while the field is empty. */
  placeholder: string
  /** Helper text displayed below the field. */
  helperText?: string
  /** Error message displayed below the field. */
  error?: string
  /**
   * Live-region politeness for the error announcement, or `false` to disable it.
   * @default 'polite'
   */
  announceError?: 'polite' | 'assertive' | false
  /** Key of the selected option, for controlled usage. */
  selectedKey?: Key | null
  /** Key of the option selected initially, for uncontrolled usage. */
  defaultSelectedKey?: Key
  /** Called when the selected option changes. */
  onSelectionChange?: (key: Key | null) => void
  /** Text currently typed in the field, for controlled usage. */
  inputValue?: string
  /** Text typed in the field initially, for uncontrolled usage. */
  defaultInputValue?: string
  /** Called whenever the text typed in the field changes. */
  onInputValueChange?: (inputValue: string) => void
  /**
   * Determines whether an option matches the typed input value.
   * @default A case-insensitive "contains" match on the option's label.
   */
  filter?: AutocompleteFilter
  /**
   * Minimum number of characters typed before the popover opens. Only applies
   * to the popover presentation; the bottom sheet always opens on demand.
   * @default 0 opens as soon as the field is focused
   */
  minCharsToOpen?: number
  /** Whether a value must be selected before the enclosing form can be submitted. */
  isRequired?: boolean
  /** Whether the field is disabled. */
  isDisabled?: boolean
  /** Whether the field only displays its value. */
  isReadOnly?: boolean
  /** Row appended below the options, offering to enter a value manually. */
  footerAction?: FooterAction
  /** Builds the count line displayed above the options. */
  formatResultsCount: (count: number) => string
  /** Text shown in place of the options when none of them match the input. */
  emptyLabel: string
  /** Accessible name of the button clearing the field. */
  clearLabel: string
  /** Title displayed at the top of the bottom sheet. Falls back to `label`. */
  sheetTitle?: string
  /** Accessible name of the button closing the bottom sheet. */
  closeLabel: string
  /** Name submitted with the enclosing form. */
  name?: string
  /** Additional CSS class name applied to the field container. */
  className?: string
  /** Autocomplete dropdown / bottom sheet is in pending state */
  isPending?: boolean
  /** Label to go with the pending state */
  pendingLabel?: string
}

/**
 * Text field that suggests matching options as the user types.
 *
 * On viewports wider than the mobile breakpoint the options open in a popover
 * anchored to the field. On narrower ones they open in a bottom sheet holding
 * its own search field, which gives the list room next to the on-screen
 * keyboard.
 *
 * @example
 * ```tsx
 * <Autocomplete
 *   label="Country"
 *   options={countries}
 *   onSelectionChange={setCountry}
 *   placeholder="Search ..."
 *   formatResultsCount={(count) => `${count} results found`}
 *   emptyLabel="No result found"
 *   clearLabel="Clear"
 *   closeLabel="Close"
 * />
 * ```
 */
const Autocomplete = ({
  options,
  label,
  tooltip,
  tooltipTriggerAriaLabel,
  'aria-label': ariaLabel,
  size = 'small',
  placeholder,
  helperText,
  error,
  announceError = 'polite',
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  inputValue: inputValueProp,
  defaultInputValue,
  onInputValueChange,
  filter,
  minCharsToOpen,
  isRequired,
  isDisabled,
  isReadOnly,
  footerAction,
  formatResultsCount,
  emptyLabel,
  clearLabel,
  sheetTitle,
  closeLabel,
  name,
  className,
  isPending = false,
  pendingLabel,
}: AutocompleteProps) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  if (tooltip !== undefined && label === undefined) {
    throw new Error(TOOLTIP_REQUIRES_LABEL_ERROR)
  }
  if (tooltip !== undefined && tooltipTriggerAriaLabel === undefined) {
    throw new Error(TOOLTIP_REQUIRES_ARIA_LABEL_ERROR)
  }

  const isSelectionControlled = selectedKey !== undefined

  const [internalSelectedKey, setInternalSelectedKey] = useState<Key | null>(
    defaultSelectedKey ?? null,
  )
  const currentSelectedKey = isSelectionControlled
    ? selectedKey
    : internalSelectedKey
  const selectedLabel =
    options.find((option) => option.id === currentSelectedKey)?.label ?? ''

  const isInputValueControlled = inputValueProp !== undefined

  const [internalInputValue, setInternalInputValue] = useState(
    defaultInputValue ?? selectedLabel,
  )
  const inputValue = isInputValueControlled
    ? inputValueProp
    : internalInputValue
  const [lastSelectedLabel, setLastSelectedLabel] = useState(selectedLabel)
  const lastNotifiedSelectedLabelRef = useRef(selectedLabel)

  const setInputValue = (value: string, shouldClearSelection = true): void => {
    if (shouldClearSelection && value !== inputValue && currentSelectedKey) {
      if (!isSelectionControlled) {
        setInternalSelectedKey(null)
        setLastSelectedLabel('')
      }

      onSelectionChange?.(null)
    }

    if (!isInputValueControlled) {
      setInternalInputValue(value)
    }

    onInputValueChange?.(value)
  }

  const synchronizeSelectedLabel = (value: string): void => {
    setLastSelectedLabel(value)

    if (!isInputValueControlled) {
      setInternalInputValue(value)
    }
  }

  // Follows selections the field did not make itself: a parent driving
  // `selectedKey`, or options that only name the selected key once they have
  // been fetched.
  if (lastSelectedLabel !== selectedLabel) {
    synchronizeSelectedLabel(selectedLabel)
  }

  // Notify controlled consumers after rendering; invoking their callback in
  // the synchronization above could update a parent while this component is
  // still rendering.
  useEffect(() => {
    if (lastNotifiedSelectedLabelRef.current === selectedLabel) {
      return
    }

    lastNotifiedSelectedLabelRef.current = selectedLabel
    onInputValueChange?.(selectedLabel)
  }, [onInputValueChange, selectedLabel])

  useEffect(() => {
    if (error && announceError) {
      announce(error, announceError)
    }
  }, [error, announceError])

  const handleSelectionChange = (key: Key | null): void => {
    setInternalSelectedKey(key)

    // React Aria leaves the input text alone when both the value and the input
    // value are controlled, so the label is mirrored here. Under a controlled
    // `selectedKey` that is left to the sync above instead, so the text only
    // changes once the parent has accepted the new selection.
    if (!isSelectionControlled) {
      setInputValue(
        options.find((option) => option.id === key)?.label ?? '',
        false,
      )
    }

    onSelectionChange?.(key)
  }

  if (isMobile) {
    return (
      <AutocompleteSheet
        footerAction={footerAction}
        ariaLabel={ariaLabel}
        className={className}
        clearLabel={clearLabel}
        closeLabel={closeLabel}
        emptyLabel={emptyLabel}
        error={error}
        filter={filter}
        formatResultsCount={formatResultsCount}
        helperText={helperText}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        label={label}
        tooltip={tooltip}
        tooltipTriggerAriaLabel={tooltipTriggerAriaLabel}
        name={name}
        onInputChange={setInputValue}
        onSelectionChange={handleSelectionChange}
        options={options}
        placeholder={placeholder}
        selectedKey={currentSelectedKey}
        sheetTitle={sheetTitle ?? label ?? ariaLabel ?? ''}
        size={size}
        isPending={isPending}
        pendingLabel={pendingLabel}
      />
    )
  }

  return (
    <AutocompleteDropdown
      footerAction={footerAction}
      ariaLabel={ariaLabel}
      className={className}
      clearLabel={clearLabel}
      emptyLabel={emptyLabel}
      error={error}
      filter={filter}
      formatResultsCount={formatResultsCount}
      helperText={helperText}
      inputValue={inputValue}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      label={label}
      tooltip={tooltip}
      tooltipTriggerAriaLabel={tooltipTriggerAriaLabel}
      minCharsToOpen={minCharsToOpen}
      name={name}
      onInputChange={setInputValue}
      onSelectionChange={handleSelectionChange}
      options={options}
      placeholder={placeholder}
      selectedKey={currentSelectedKey}
      size={size}
      isPending={isPending}
      pendingLabel={pendingLabel}
    />
  )
}

export { Autocomplete, type AutocompleteProps }
