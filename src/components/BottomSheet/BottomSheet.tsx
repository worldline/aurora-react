import cn from 'classnames'
import type { CSSProperties, ReactNode } from 'react'
import {
  Modal as AriaModal,
  Dialog,
  DialogTrigger,
  ModalOverlay,
  type ModalOverlayProps,
} from 'react-aria-components'

import { useVisualViewport } from '../../utils/useVisualViewport'
import styles from './BottomSheet.module.css'
import { type Action, BottomSheetFooter } from './BottomSheetFooter'
import { BottomSheetHeader } from './BottomSheetHeader'

type BottomSheetHeight = 'content' | 'sm' | 'md' | 'lg'

interface BottomSheetProps extends ModalOverlayProps {
  /**
   * The text content displayed within the header of the bottom sheet.
   */
  title: string
  /**
   * The primary body content rendered inside the bottom sheet.
   */
  children: ReactNode
  /**
   * Accessibility label passed into the closing button element for screen readers.
   */
  closeLabel: string
  /**
   * Controls the sheet's height. `content` sizes to fit its content, while
   * `sm`, `md` and `lg` use preferred heights that shrink to fit the
   * viewport when there isn't enough room.
   * @default 'sm'
   */
  height?: BottomSheetHeight
  /**
   * Configuration options for the primary confirming action button inside the footer.
   */
  primaryAction?: Action
  /**
   * Configuration options for the secondary dismissing action button inside the footer.
   */
  secondaryAction?: Action
  /**
   * Custom CSS class name appended directly to the inner sheet container frame.
   */
  className?: string
  /**
   * Whether the body is inset from the sheet edges and spaces its children
   * apart. Set to `false` for content that manages its own spacing, such as a
   * list that must run edge to edge and scroll on its own.
   * @default true
   */
  contentPadding?: boolean
}

const BaseBottomSheet = ({
  title,
  children,
  closeLabel,
  height = 'sm',
  primaryAction,
  secondaryAction,
  className,
  contentPadding = true,
  ...modalProps
}: BottomSheetProps) => {
  const hasActions = Boolean(primaryAction ?? secondaryAction)
  const visualViewport = useVisualViewport()
  const overlayStyle: CSSProperties | undefined = visualViewport
    ? { top: visualViewport.offsetTop, height: visualViewport.height }
    : undefined

  return (
    <ModalOverlay
      {...modalProps}
      className={styles.overlay}
      style={overlayStyle}
      isDismissable
    >
      <AriaModal
        className={cn(styles.modal, {
          [styles['modal-flex']]: height === 'lg',
        })}
      >
        <Dialog
          className={cn(styles.sheet, styles[`height-${height}`], className)}
        >
          <BottomSheetHeader title={title} closeLabel={closeLabel} />
          <div
            className={cn(styles.content, {
              [styles['content-padded']]: contentPadding,
            })}
          >
            {children}
          </div>
          {hasActions ? (
            <BottomSheetFooter
              primaryAction={primaryAction}
              secondaryAction={secondaryAction}
            />
          ) : null}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  )
}

const BottomSheet = Object.assign(BaseBottomSheet, {
  Trigger: DialogTrigger,
})

export { BottomSheet, type BottomSheetProps, type BottomSheetHeight }
