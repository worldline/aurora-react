import {
  type Key,
  ListBox,
  ListBoxItem,
  type Selection,
} from 'react-aria-components'

import { Button } from '@/components/Button'
import { AddIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './Autocomplete.module.css'
import type { AutocompleteOption, FooterAction } from './types'

interface ListSelection {
  /** Key of the option currently selected, or `null` when there is none. */
  selectedKey: Key | null
  /** Called with the key of the option the user picked. */
  onSelect: (key: Key) => void
}

interface AutocompleteListProps {
  /** Options rendered as selectable rows. */
  options: Array<AutocompleteOption>
  /** Sentence describing how many options the list currently holds. */
  resultsLabel: string
  /** Row appended below the options, offering to enter a value manually. */
  footerAction?: FooterAction
  /** Text shown in place of the options when none of them match the input. */
  emptyLabel: string
  /**
   * Selection wiring for presentations that own it themselves. Omitted inside a
   * combo box, which drives the list through context.
   */
  selection?: ListSelection
  /** Accessible name of the list, required when `selection` is provided. */
  listAriaLabel?: string
}

const firstKeyOf = (keys: Selection): Key | undefined =>
  keys === 'all' ? undefined : [...keys].at(0)

const selectedKeysOf = (
  selection: ListSelection | undefined,
): Array<Key> | undefined => {
  if (!selection) {
    return undefined
  }

  if (selection.selectedKey === null) {
    return []
  }

  return [selection.selectedKey]
}

/**
 * Results count, option rows and optional "footer action" row shared by the
 * popover and bottom sheet presentations.
 */
const AutocompleteList = ({
  options,
  resultsLabel,
  footerAction,
  emptyLabel,
  selection,
  listAriaLabel,
}: AutocompleteListProps) => (
  <>
    <div className={styles['results-count']}>
      <Typography
        element="span"
        textStyle="captionMd"
        textColor="contentTertiary"
      >
        {resultsLabel}
      </Typography>
    </div>

    <ListBox
      aria-label={listAriaLabel}
      className={styles.listbox}
      items={options}
      onSelectionChange={
        selection
          ? (keys) => {
              // Pressing the already-selected option toggles it off in React
              // Aria's single-selection model, emitting an empty `Selection`
              // instead of the pressed key. That only happens by re-pressing
              // the current selection, so fall back to it to still select and
              // close.
              const key = firstKeyOf(keys) ?? selection.selectedKey

              if (key !== null) {
                selection.onSelect(key)
              }
            }
          : undefined
      }
      renderEmptyState={() => (
        <div className={styles['empty-state']}>
          <Typography
            element="span"
            textStyle="bodyMd"
            textColor="contentTertiary"
          >
            {emptyLabel}
          </Typography>
        </div>
      )}
      selectedKeys={selectedKeysOf(selection)}
      selectionMode={selection ? 'single' : undefined}
    >
      {(option) => (
        <ListBoxItem
          aria-label={
            option.description
              ? `${option.label}, ${option.description}`
              : option.label
          }
          className={styles.option}
          id={option.id}
          textValue={option.label}
        >
          <div className={styles['option-content']}>
            <Typography
              element="span"
              textStyle="bodyMd"
              textColor="contentPrimary"
            >
              {option.label}
            </Typography>
            {option.description ? (
              <Typography
                element="span"
                textStyle="captionMd"
                textColor="contentTertiary"
              >
                {option.description}
              </Typography>
            ) : null}
          </div>
        </ListBoxItem>
      )}
    </ListBox>

    {footerAction ? (
      <div className={styles.footer}>
        <Button
          leadingIcon={<AddIcon />}
          onPress={footerAction.onAction}
          size="small"
          variant="link"
        >
          <Typography
            element="span"
            textStyle="captionMd"
            textColor="contentPrimary"
            className={styles['footer-text']}
          >
            {footerAction.label}
          </Typography>
        </Button>
      </div>
    ) : null}
  </>
)

export { AutocompleteList, type AutocompleteListProps, type ListSelection }
