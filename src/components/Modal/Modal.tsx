import cn from 'classnames'
import type { ReactNode } from 'react'
import {
  Dialog,
  DialogTrigger,
  Heading,
  Modal as AriaModal,
  ModalOverlay,
  type ModalOverlayProps,
  type DialogProps,
} from 'react-aria-components'

import { Button } from '../Button'
import { CloseIcon } from '../icons'
import { Typography } from '../Typography'

import styles from './Modal.module.css'
import {
  ModalActions,
  type Action,
  type ModalActionsAlignment,
} from './ModalActions'

type ModalAlignment = 'center' | 'left' | 'right'

interface ModalProps extends Omit<ModalOverlayProps, 'className'> {
  title: string
  children: ReactNode
  closable?: boolean
  alignment?: ModalAlignment
  actionsAlignment?: ModalActionsAlignment
  primaryAction?: Action
  secondaryAction?: Action
  className?: string
  closeLabel?: string
  dialogProps?: DialogProps
}

const BaseModal = ({
  title,
  children,
  closable = true,
  alignment = 'center',
  actionsAlignment = 'fill',
  primaryAction,
  secondaryAction,
  className,
  closeLabel,
  dialogProps,
  ...modalProps
}: ModalProps) => {
  const hasActions = Boolean(primaryAction ?? secondaryAction)

  return (
    <ModalOverlay
      {...modalProps}
      className={cn(styles.overlay, styles[`overlay-${alignment}`])}
    >
      <AriaModal
        className={cn(
          styles.modal,
          styles[`modal-${alignment}`],
          {
            [styles['modal-full-height']]:
              alignment === 'left' || alignment === 'right',
          },
          className,
        )}
      >
        <Dialog
          {...dialogProps}
          className={cn(styles.dialog, dialogProps?.className)}
        >
          <div className={styles.header}>
            <Heading slot="title" className={styles.title}>
              <Typography
                element="span"
                textStyle="titleMd"
                textColor="contentPrimary"
              >
                {title}
              </Typography>
            </Heading>
            {closable ? (
              <Button
                aria-label={closeLabel}
                variant="link"
                size="small"
                slot="close"
              >
                <CloseIcon aria-hidden />
              </Button>
            ) : null}
          </div>

          <div className={styles.content}>{children}</div>

          {hasActions ? (
            <ModalActions
              alignment={actionsAlignment}
              primaryAction={primaryAction}
              secondaryAction={secondaryAction}
            />
          ) : null}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  )
}

const Modal = Object.assign(BaseModal, {
  Trigger: DialogTrigger,
})

export { Modal, type ModalProps }
