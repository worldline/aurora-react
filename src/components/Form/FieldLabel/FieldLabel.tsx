import cn from 'classnames'
import { type JSX } from 'react'

import { Button } from '@/components/Button'
import { HelpIcon } from '@/components/icons'
import { Tooltip, TooltipTrigger } from '@/components/Tooltip'
import { Typography } from '@/components/Typography'

import styles from './FieldLabel.module.css'

interface FieldLabelProps {
  /** Text label rendered above the field. */
  label?: string
  /** Marks the field as required; appends a visible asterisk after the label text. */
  isRequired?: boolean
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
          {isRequired ? <span aria-hidden="true">*</span> : null}
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

export { FieldLabel, type FieldLabelProps }
