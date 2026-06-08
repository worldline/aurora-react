import cn from 'classnames'
import type { CSSProperties } from 'react'
import { ProgressBar } from 'react-aria-components'

import { Typography } from '@/components/Typography'

import styles from './ProgressCircle.module.css'

type MaxValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type Value = 0 | MaxValue
type MinValue = Value
type ProgressCircleStyle = Pick<CSSProperties, 'backgroundColor'>

interface Props {
  /** Current step. Must be an integer between minValue and maxValue (inclusive). */
  value: Value
  /** First valid step. Must not exceed maxValue. @default 1 */
  minValue?: MinValue
  /** Total number of steps. Must be an integer between 1 and 9 (inclusive). */
  maxValue: MaxValue
  /** Accessible label announced by screen readers. No visible label is rendered. */
  'aria-label': string
  /** Additional CSS class applied to the inner wrapper element. */
  className?: string
  /**
   * Inline style overrides for the inner value label element.
   * Only backgroundColor is allowed.
   */
  style?: ProgressCircleStyle
}

const ProgressCircle = ({
  value,
  minValue = 1,
  maxValue,
  'aria-label': ariaLabel,
  className,
  style,
}: Props) => {
  if (import.meta.env.DEV) {
    if (!Number.isInteger(value)) {
      throw new Error(
        `ProgressCircle: value (${String(value)}) must be an integer.`,
      )
    }
    if (minValue > maxValue) {
      throw new Error(
        `ProgressCircle: minValue (${String(minValue)}) must not exceed maxValue (${String(maxValue)}).`,
      )
    }
    if (value < minValue || value > maxValue) {
      throw new Error(
        `ProgressCircle: value (${String(value)}) must be between minValue (${String(minValue)}) and maxValue (${String(maxValue)}).`,
      )
    }
  }

  const percentage = (value / maxValue) * 100

  return (
    <ProgressBar
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      valueLabel={`${String(value)}/${String(maxValue)}`}
      aria-label={ariaLabel}
      className={styles.container}
    >
      {({ valueText }) => {
        const wrapperStyle = {
          background: `conic-gradient(var(--au-surface-brand-solid) ${String(percentage)}%, var(--au-surface-neutral-medium) ${String(percentage)}% 100%)`,
        } satisfies CSSProperties

        return (
          <div className={cn(styles.wrapper, className)} style={wrapperStyle}>
            <Typography
              element="span"
              textStyle="captionSm"
              className={styles.label}
              style={style}
            >
              {valueText}
            </Typography>
          </div>
        )
      }}
    </ProgressBar>
  )
}

export { ProgressCircle, type Props as ProgressCircleProps }
