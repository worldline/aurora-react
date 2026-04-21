import cn from 'classnames'

import { Button } from '../Button'

import styles from './ModalActions.module.css'

type ModalActionsAlignment = 'fill' | 'left' | 'right'

interface Action {
  label: string
  action: () => void
}

interface ModalActionsProps {
  alignment?: ModalActionsAlignment
  primaryAction?: Action
  secondaryAction?: Action
  className?: string
}

const ModalActions = ({
  alignment = 'fill',
  primaryAction,
  secondaryAction,
  className,
}: ModalActionsProps) => {
  const actionsClassName = cn(
    styles.actions,
    {
      [styles['alignment-fill']]: alignment === 'fill',
      [styles['alignment-left']]: alignment === 'left',
      [styles['alignment-right']]: alignment === 'right',
    },
    className,
  )

  const buttonClassName = styles['action-button']

  return (
    <div className={actionsClassName}>
      {secondaryAction ? (
        <Button
          variant="secondary"
          size="small"
          onPress={secondaryAction.action}
          className={buttonClassName}
        >
          {secondaryAction.label}
        </Button>
      ) : null}
      <Button
        variant="primary"
        size="small"
        onPress={primaryAction?.action}
        className={buttonClassName}
      >
        {primaryAction?.label}
      </Button>
    </div>
  )
}

export {
  ModalActions,
  type Action,
  type ModalActionsAlignment,
  type ModalActionsProps,
}
