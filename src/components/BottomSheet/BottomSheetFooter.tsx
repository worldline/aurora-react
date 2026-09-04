import { Button } from '../Button'
import styles from './BottomSheetFooter.module.css'

interface Action {
  label: string
  action: () => void
}

interface BottomSheetFooterProps {
  primaryAction?: Action
  secondaryAction?: Action
}

const BottomSheetFooter = ({
  primaryAction,
  secondaryAction,
}: BottomSheetFooterProps) => (
  <div className={styles.footer}>
    {secondaryAction ? (
      <Button
        variant="secondary"
        size="small"
        onPress={secondaryAction.action}
        className={styles.button}
      >
        {secondaryAction.label}
      </Button>
    ) : null}
    {primaryAction ? (
      <Button
        variant="primary"
        size="small"
        onPress={primaryAction.action}
        className={styles.button}
      >
        {primaryAction.label}
      </Button>
    ) : null}
  </div>
)

export { BottomSheetFooter, type Action, type BottomSheetFooterProps }
