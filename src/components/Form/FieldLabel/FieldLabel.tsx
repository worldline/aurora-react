import cn from 'classnames'
import { type JSX } from 'react'

import { Button } from '@/components/Button'
import { HelpIcon } from '@/components/icons'
import { Tooltip, TooltipTrigger } from '@/components/Tooltip'
import { Typography } from '@/components/Typography'

import styles from './FieldLabel.module.css'

/**
 * Requirement-related props shared by every labelled form field.
 * `optionalLabel` cannot be combined with `isRequired`.
 *
 * The first branch accepts any `isRequired` (including a non-literal boolean)
 * as long as no `optionalLabel` is given; the second accepts `optionalLabel`
 * only when `isRequired` is absent or `false`.
 */
type FieldRequirementProps =
  | {
      /** Marks the field as required for assistive technology and validation; has no visual effect. */
      isRequired?: boolean
      /** Shows an asterisk after the label of a required field. */
      showRequiredMark?: boolean
      /** Only allowed when the field is not required. */
      optionalLabel?: undefined
    }
  | {
      /** Marks the field as required for assistive technology and validation; has no visual effect. */
      isRequired?: false
      /** Shows an asterisk after the label of a required field. */
      showRequiredMark?: boolean
      /** Text appended in parentheses after the label, e.g. "optional" renders "Label (optional)". */
      optionalLabel?: string
    }

interface FieldLabelProps {
  /** Text label rendered above the field. */
  label?: string
  /** Marks the field as required; the asterisk is only shown with showRequiredMark. */
  isRequired?: boolean
  /** Shows an asterisk after the label when the field is required. */
  showRequiredMark?: boolean
  /** Text appended in parentheses after the label when the field is not required. */
  optionalLabel?: string
  /** Text content for the tooltip shown next to the label; requires label. */
  tooltip?: string
  /** Accessible name for the tooltip trigger button; required when tooltip is set. */
  tooltipTriggerAriaLabel?: string
  /**
   * DOM id applied to the label element, for callers associating it via
   * aria-labelledby instead of react-aria's `<Label>`.
   */
  id?: string
  /**
   * Additional class name applied to the label text, so callers keep their
   * own state-driven color rules (e.g. selected/disabled/read-only) scoped
   * to their own CSS module.
   */
  className?: string
}

const FieldLabel = ({
  label,
  isRequired,
  tooltip,
  tooltipTriggerAriaLabel,
  id,
  className,
  showRequiredMark,
  optionalLabel,
}: FieldLabelProps): JSX.Element | null => {
  const hasLabelRow = label !== undefined || tooltip !== undefined

  return hasLabelRow ? (
    <div className={styles['label-row']}>
      {label !== undefined ? (
        <Typography
          id={id}
          element="span"
          textStyle="labelSm"
          className={cn(styles.label, className)}
        >
          {label}
          {!isRequired && optionalLabel ? ` (${optionalLabel})` : null}
          {isRequired && showRequiredMark ? (
            <span aria-hidden="true">*</span>
          ) : null}
        </Typography>
      ) : null}
      {tooltip !== undefined ? (
        <TooltipTrigger delay={300}>
          <Button
            aria-label={tooltipTriggerAriaLabel}
            variant="link"
            slot={null}
            className={styles['tooltip-trigger']}
          >
            <HelpIcon size={24} aria-hidden />
          </Button>
          <Tooltip title={tooltip} alignment="top" />
        </TooltipTrigger>
      ) : null}
    </div>
  ) : null
}

export { FieldLabel, type FieldLabelProps, type FieldRequirementProps }
