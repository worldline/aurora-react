import type { Key } from 'react-aria-components'

/** Size variant of the autocomplete field. */
type AutocompleteSize = 'small' | 'medium' | 'large'

interface AutocompleteOption {
  /** Stable identifier used as the selection key. */
  id: Key
  /** Primary text displayed for the option, and the text matched while filtering. */
  label: string
  /** Secondary text displayed beneath the label. */
  description?: string
}

interface FooterAction {
  /** Text of the row displayed at the bottom of the option list. */
  label: string
  /** Called when the row is activated. */
  onAction: () => void
}

/** Determines whether an option's label matches the typed input value. */
type AutocompleteFilter = (optionLabel: string, inputValue: string) => boolean

export type {
  FooterAction,
  AutocompleteFilter,
  AutocompleteOption,
  AutocompleteSize,
}
