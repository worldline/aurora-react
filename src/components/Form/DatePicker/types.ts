import type { RangeValue } from '@react-types/shared'
import type {
  DateRangePickerProps as AriaDateRangePickerProps,
  DateValue,
} from 'react-aria-components'

import { type FieldRequirementProps } from '@/components/Form/FieldLabel'

import type { CalendarContentProps } from './CalendarContent'
import type { DateRangePreset } from './DateRangePresetList'

interface DateRangePickerAction {
  /** The visible label text for the action button. */
  label: string
  /** Handler invoked when the action button is pressed. */
  onAction: () => void
}

interface DateRangePickerActions {
  /** Configuration for the primary action button (e.g. "Apply"). */
  primaryAction: DateRangePickerAction
  /** Configuration for the secondary action button (e.g. "Reset to default"). */
  secondaryAction: DateRangePickerAction
}

interface DateRangePickerProps extends CalendarContentProps {
  /**
   * Defines the height and padding scale of the input inputs.
   * @default 'small'
   */
  size?: 'small' | 'medium'
  /**
   * The text label displayed above or alongside the date inputs.
   */
  label?: string
  /**
   * Text content for the tooltip shown next to the label; requires label.
   */
  tooltip?: string
  /**
   * Accessible name for the tooltip trigger button; required when tooltip is set.
   */
  tooltipTriggerAriaLabel?: string
  /**
   * The validation error message displayed below the input.
   */
  error?: string
  /**
   * Configures screen reader announcements for accessibility when an error occurs.
   * @default 'polite'
   */
  announceError?: 'polite' | 'assertive' | false
  /**
   * Whether to display the date field inputs inside the calendar popover.
   * Only applies to the composite variant.
   * @default true
   */
  showDateField?: boolean
  /**
   * Array of preset date range options. When provided, renders the composite
   * variant with a preset list (desktop) or filter chips (mobile).
   */
  presets?: ReadonlyArray<DateRangePreset>
  /**
   * The id of the currently selected preset.
   */
  selectedPresetId?: string
  /**
   * Called when the user selects a preset option, or with `undefined` when
   * a custom date range is picked on the calendar and the preset is cleared.
   */
  onPresetSelect?: (presetId: string | undefined) => void
  /**
   * Action button configuration for the composite variant.
   * When provided alongside presets, renders "Reset to default" and "Apply"
   * style action buttons. Requires defaultPreset.
   */
  actions?: DateRangePickerActions
  /**
   * The preset applied when the secondary action (reset to default) is
   * triggered. Required when actions are provided.
   */
  defaultPreset?: DateRangePreset
  /**
   * Custom formatter for displaying the selected date range on the trigger
   * button. Receives the range value and must return a display string.
   * When omitted, defaults to "From DD/MM/YYYY to DD/MM/YYYY".
   */
  formatRange?: (range: RangeValue<DateValue>) => string
  /**
   * The text displayed on the trigger button in composite mode.
   * Typically the label of the selected preset. When omitted, the
   * committed date range is shown using `formatRange`.
   */
  triggerText?: string
  /**
   * Accessible label for the trigger button in composite mode.
   */
  triggerAriaLabel?: string
  /**
   * Title displayed at the top of the bottom sheet on mobile viewports.
   * Required when presets are provided.
   */
  sheetTitle?: string
  /**
   * Accessible label for the close button inside the mobile bottom sheet.
   * Required when presets are provided.
   */
  closeLabel?: string
}

type DateRangePickerInternalProps = DateRangePickerProps &
  FieldRequirementProps &
  Omit<
    AriaDateRangePickerProps<DateValue>,
    'children' | 'validate' | 'validationBehavior' | 'isRequired'
  >

export {
  type DateRangePickerProps,
  type DateRangePickerAction,
  type DateRangePickerActions,
  type DateRangePickerInternalProps,
}
