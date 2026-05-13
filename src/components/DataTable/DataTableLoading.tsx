import { ProgressActivityIcon } from '../icons'
import { Typography } from '../Typography'
import styles from './DataTableLoading.module.css'

interface DataTableLoadingProps {
  label?: string
}

const DataTableLoading = ({ label = 'Loading...' }: DataTableLoadingProps) => (
  <div className={styles['loading-container']} role="status">
    <ProgressActivityIcon
      fill="var(--au-surface-brand-solid)"
      className={styles['loading-spinner']}
      size={32}
      aria-hidden
    />
    <Typography element="span" textStyle="labelSm" textColor="contentPrimary">
      {label}
    </Typography>
  </div>
)

export { DataTableLoading, type DataTableLoadingProps }
