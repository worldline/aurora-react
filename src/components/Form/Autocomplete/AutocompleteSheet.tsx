'use client'

import cn from 'classnames'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import {
  Autocomplete as AriaAutocomplete,
  Group,
  Input,
  type Key,
  Label,
  TextField,
  useFilter,
} from 'react-aria-components'

import { BottomSheet } from '@/components/BottomSheet'
import { Button } from '@/components/Button'
import { ErrorMessage } from '@/components/Form/ErrorMessage'
import { FieldLabel } from '@/components/Form/FieldLabel'
import {
  CancelIcon,
  ProgressActivityIcon,
  SearchIcon,
} from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './Autocomplete.module.css'
import { AutocompleteList } from './AutocompleteList'
import type {
  AutocompleteFilter,
  AutocompleteOption,
  AutocompleteSize,
  FooterAction,
} from './types'

interface SheetSearchFieldProps {
  /** Label displayed above the search input. */
  label?: string
  /** Accessible name used when no visible `label` is provided. */
  ariaLabel?: string
  /** Size variant of the search input. */
  size: AutocompleteSize
  /** Placeholder shown while the search input is empty. */
  placeholder: string
  /** Current text held by the search input. */
  searchValue: string
  /** Called when the user empties the search input from its clear button. */
  onClear: () => void
  /** Accessible name of the button clearing the search input. */
  clearLabel: string
  /** Whether a value must be selected before the form can be submitted. */
  isRequired?: boolean
  /** Called whenever the text held by the input changes. */
  onInputChange?: (inputValue: string) => void
}

/**
 * Search input shown at the top of the sheet. React Aria's `Autocomplete`
 * wires it to the list below through context, so it takes no value props.
 *
 * The sheet renders in a portal, outside the field container, so the size and
 * filled classes the closed field inherits are repeated here.
 */
const SheetSearchField = ({
  label,
  ariaLabel,
  size,
  placeholder,
  searchValue,
  onClear,
  clearLabel,
  isRequired,
}: SheetSearchFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  const handleClear = (): void => {
    onClear()
    inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <TextField
      aria-label={label ? undefined : ariaLabel}
      className={cn(styles['sheet-field'], styles[size], {
        [styles.filled]: searchValue.length > 0,
      })}
    >
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

      <Group className={styles['input-wrapper']}>
        <SearchIcon aria-hidden className={styles['search-icon']} />
        <Input
          className={styles.input}
          placeholder={placeholder}
          ref={inputRef}
        />
        {searchValue ? (
          <Button
            aria-label={clearLabel}
            className={styles['clear-button']}
            onPress={handleClear}
            size="small"
            slot={null}
            variant="link"
          >
            <CancelIcon aria-hidden className={styles['clear-icon']} />
          </Button>
        ) : null}
      </Group>
    </TextField>
  )
}

interface AutocompleteSheetProps {
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
  /** Placeholder shown while no option is selected. */
  placeholder: string
  /** Key of the option currently selected, or `null` when there is none. */
  selectedKey: Key | null
  /** Called with the key of the option the user picked. */
  onSelectionChange: (key: Key | null) => void
  /** Called whenever the text held by the sheet search input changes. */
  onInputChange: (inputValue: string) => void
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
  /** Text shown in place of the options when none of them match the search. */
  emptyLabel: string
  /** Accessible name of the button clearing the search field. */
  clearLabel: string
  /** Title displayed at the top of the sheet. */
  sheetTitle: string
  /** Accessible name of the button closing the sheet. */
  closeLabel: string
  /** Row appended below the options, offering to enter a value manually. */
  footerAction?: FooterAction
  /**
   * Determines whether an option matches the typed input value.
   * @default A case-insensitive "contains" match on the option's label.
   */
  filter?: AutocompleteFilter
  /** Additional CSS class name applied to the field container. */
  className?: string
  /** Whether the sheet is displaying pending results. */
  isPending?: boolean
  /** Label announced while the sheet is pending. */
  pendingLabel?: string
}

/**
 * Mobile presentation: a trigger that mirrors the closed field and opens the
 * search input and its options inside a bottom sheet.
 */
const AutocompleteSheet = ({
  options,
  label,
  tooltip,
  tooltipTriggerAriaLabel,
  ariaLabel,
  size,
  placeholder,
  selectedKey,
  onSelectionChange,
  onInputChange,
  helperText,
  error,
  isRequired,
  isDisabled,
  isReadOnly,
  name,
  formatResultsCount,
  emptyLabel,
  clearLabel,
  sheetTitle,
  closeLabel,
  footerAction,
  filter,
  className,
  isPending = false,
  pendingLabel,
}: AutocompleteSheetProps) => {
  const id = useId()
  const labelId = `${id}-label`
  const valueId = `${id}-value`
  const errorId = error ? `${id}-error` : undefined

  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { contains } = useFilter({ sensitivity: 'base' })
  const filterOption = filter ?? contains

  const selectedOption = options.find((option) => option.id === selectedKey)
  // The sheet filters the very same way React Aria does below, so the count
  // always describes the rows the list actually renders.
  const matchingOptions = options.filter((option) =>
    filterOption(option.label, searchValue),
  )

  const openSheet = (): void => {
    setSearchValue('')
    setIsOpen(true)
  }

  const selectOption = (key: Key): void => {
    onSelectionChange(key)
    setIsOpen(false)
  }

  const handleInputChange = (inputValue: string): void => {
    setSearchValue(inputValue)
    onInputChange(inputValue)
  }

  return (
    <div
      className={cn(
        styles.container,
        styles[size],
        { [styles.filled]: selectedOption !== undefined },
        className,
      )}
      data-disabled={isDisabled ? true : undefined}
      data-invalid={error ? true : undefined}
      data-open={isOpen ? true : undefined}
      data-readonly={isReadOnly ? true : undefined}
    >
      {label !== undefined || tooltip !== undefined ? (
        <FieldLabel
          id={labelId}
          label={label}
          isRequired={isRequired}
          tooltip={tooltip}
          tooltipTriggerAriaLabel={tooltipTriggerAriaLabel}
          className={styles.label}
        />
      ) : null}

      <Button
        aria-describedby={errorId}
        aria-label={label ? undefined : ariaLabel}
        // The value is part of the name so the trigger announces both the
        // field it stands for and what is currently selected.
        aria-labelledby={label ? `${labelId} ${valueId}` : undefined}
        className={cn(styles['input-wrapper'], styles.trigger)}
        isDisabled={isDisabled}
        // Read-only keeps the trigger focusable, the way the popover
        // presentation keeps its read-only input focusable, so the value can
        // still be reached and read out with the keyboard. It just does not
        // open the sheet.
        onPress={isReadOnly === true ? undefined : openSheet}
        variant="link"
      >
        <SearchIcon aria-hidden className={styles['search-icon']} />
        <Typography
          element="span"
          id={valueId}
          textStyle="bodyMd"
          className={styles['trigger-value']}
        >
          {selectedOption?.label ?? placeholder}
        </Typography>
      </Button>

      {name ? (
        <input name={name} type="hidden" value={String(selectedKey ?? '')} />
      ) : null}

      {(error ?? helperText) ? (
        <div className={styles['help-line']}>
          {error ? (
            <ErrorMessage error={error} id={errorId} />
          ) : (
            <Typography
              element="span"
              textStyle="captionMd"
              className={styles['helper-text']}
            >
              {helperText}
            </Typography>
          )}
        </div>
      ) : null}

      <BottomSheet
        closeLabel={closeLabel}
        contentPadding={false}
        height="lg"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={sheetTitle}
        className={styles.sheet}
      >
        <AriaAutocomplete
          filter={filterOption}
          inputValue={searchValue}
          onInputChange={handleInputChange}
        >
          <div className={styles['sheet-body']}>
            <SheetSearchField
              ariaLabel={ariaLabel}
              clearLabel={clearLabel}
              isRequired={isRequired}
              label={label}
              onClear={() => {
                handleInputChange('')
              }}
              placeholder={placeholder}
              searchValue={searchValue}
              size={size}
            />

            <div
              className={cn(styles['sheet-panel'], {
                [styles.pending]: isPending,
              })}
            >
              <AutocompleteList
                footerAction={footerAction}
                emptyLabel={emptyLabel}
                listAriaLabel={label ?? ariaLabel}
                options={options}
                resultsLabel={formatResultsCount(matchingOptions.length)}
                selection={{ selectedKey, onSelect: selectOption }}
              />
              <div
                aria-hidden={!isPending}
                className={styles['pending-overlay']}
                role={isPending ? 'status' : undefined}
              >
                <ProgressActivityIcon
                  className={styles['pending-icon']}
                  aria-hidden
                />
                {pendingLabel ? (
                  <Typography element="p" textStyle="labelSm">
                    {pendingLabel}
                  </Typography>
                ) : null}
              </div>
            </div>
          </div>
        </AriaAutocomplete>
      </BottomSheet>
    </div>
  )
}

export { AutocompleteSheet, type AutocompleteSheetProps }
