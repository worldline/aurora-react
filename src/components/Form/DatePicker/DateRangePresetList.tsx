'use client'

import type { DateDuration } from '@internationalized/date'
import cn from 'classnames'

import { CheckIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './DateRangePreset.module.css'

interface DateRangePreset {
  /** Unique identifier for this preset. */
  id: string
  /** Display label shown to the user. */
  label: string
  /** Duration to subtract from today to compute the date range start. */
  duration: DateDuration
}

interface DateRangePresetListProps {
  /** The available preset options to display. */
  presets: ReadonlyArray<DateRangePreset>
  /** The id of the currently selected preset. */
  selectedPresetId?: string
  /** Called when the user selects a preset. */
  onPresetSelect: (presetId: string) => void
}

const DateRangePresetList = ({
  presets,
  selectedPresetId,
  onPresetSelect,
}: DateRangePresetListProps) => (
  <div
    className={styles['preset-list']}
    role="listbox"
    aria-label="Date range presets"
  >
    {presets.map((preset) => {
      const isSelected = preset.id === selectedPresetId

      return (
        <button
          key={preset.id}
          type="button"
          role="option"
          aria-selected={isSelected}
          className={cn(styles['preset-item'], {
            [styles['preset-item-selected']]: isSelected,
          })}
          onClick={() => {
            onPresetSelect(preset.id)
          }}
        >
          <Typography
            element="span"
            textStyle="bodyMd"
            textColor="contentPrimary"
            className={styles['preset-label']}
          >
            {preset.label}
          </Typography>
          {isSelected ? (
            <CheckIcon
              aria-hidden
              size={24}
              className={styles['preset-check']}
            />
          ) : null}
        </button>
      )
    })}
  </div>
)

export {
  DateRangePresetList,
  type DateRangePreset,
  type DateRangePresetListProps,
}
