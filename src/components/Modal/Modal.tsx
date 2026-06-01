import cn from 'classnames'
import type { ReactNode } from 'react'
import {
  Modal as AriaModal,
  Dialog,
  type DialogProps,
  DialogTrigger,
  Heading,
  ModalOverlay,
  type ModalOverlayProps,
} from 'react-aria-components'

import { Button } from '../Button'
import { CloseIcon } from '../icons'
import { Typography } from '../Typography'
import styles from './Modal.module.css'
import {
  type Action,
  ModalActions,
  type ModalActionsAlignment,
} from './ModalActions'

type ModalAlignment = 'center' | 'left' | 'right'

interface ModalProps extends ModalOverlayProps {
  /**
   * The text content displayed within the main header slot of the modal dialog.
   */
  title: string
  /**
   * The primary body content rendered inside the modal container.
   */
  children: ReactNode
  /**
   * Controls whether the exit icon button is visible in the top-right corner.
   * @default true
   */
  closable?: boolean
  /**
   * Determines the structural placement alignment. Side layouts ('left' | 'right')
   * trigger a full-height sidebar variation.
   * @default 'center'
   */
  alignment?: ModalAlignment
  /**
   * Customizes the button grid stretching and sizing inside the footer action area.
   * @default 'fill'
   */
  actionsAlignment?: ModalActionsAlignment
  /**
   * Configuration options for the primary confirming action button inside the footer.
   */
  primaryAction?: Action
  /**
   * Configuration options for the secondary dismissing action button inside the footer.
   */
  secondaryAction?: Action
  /**
   * Custom CSS class name appended directly to the inner layout container frame.
   */
  className?: string
  /**
   * Accessibility label passed into the closing button element for screen readers.
   */
  closeLabel?: string
  /**
   * Direct override settings forwarded straight to the lower React Aria `Dialog` primitive.
   */
  dialogProps?: DialogProps
  /**
   * Custom CSS class name appended directly to the backdrop mask container frame.
   */
  modalOverlayClassName?: string
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
  modalOverlayClassName,
  ...modalProps
}: ModalProps) => {
  const hasActions = Boolean(primaryAction ?? secondaryAction)

  return (
    <ModalOverlay
      {...modalProps}
      className={cn(
        styles.overlay,
        styles[`overlay-${alignment}`],
        modalOverlayClassName,
      )}
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
