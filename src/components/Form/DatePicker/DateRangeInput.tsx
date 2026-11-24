'use client'

import { DateInput, DateSegment } from 'react-aria-components'

import { ArrowForwardIcon } from '@/components/icons'

import styles from './DatePicker.module.css'

const DateRangeInput = () => (
  <>
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
  </>
)

export { DateRangeInput }
