'use client'

import { DateInput, DateSegment, Group } from 'react-aria-components'

import { ArrowForwardIcon } from '@/components/icons'

import styles from './DateRangePickerComposite.module.css'

/** Renders start date input, arrow icon, and end date input in a styled group. */
const DateRangeInputGroup = () => (
  <Group className={styles['input-wrapper']} inert>
    <DateInput slot="start" className={styles['date-input']}>
      {(segment) => (
        <DateSegment segment={segment} className={styles.segment} />
      )}
    </DateInput>
    <span className={styles.separator}>
      <ArrowForwardIcon aria-hidden size={20} />
    </span>
    <DateInput slot="end" className={styles['date-input']}>
      {(segment) => (
        <DateSegment segment={segment} className={styles.segment} />
      )}
    </DateInput>
  </Group>
)

export { DateRangeInputGroup }
