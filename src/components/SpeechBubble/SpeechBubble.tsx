import cn from 'classnames'
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import { Focusable } from 'react-aria-components'

import { Button } from '../Button'
import { ContractEditIcon, EditIcon, LockIcon } from '../icons'
import { Tooltip, TooltipTrigger } from '../Tooltip'
import { Typography } from '../Typography'
import styles from './SpeechBubble.module.css'

interface SpeechBubbleCommonProps extends Pick<
  HTMLAttributes<HTMLDivElement>,
  'className'
> {
  /**
   * Timestamp label displayed below the bubble
   */
  timestamp?: string
}

interface QuestionProps extends SpeechBubbleCommonProps {
  /**
   * Content type of the bubble. `question` renders the system's opening
   * question as plain emphasized text, with no bubble background
   */
  variant: 'question'
  /**
   * Question text
   */
  children: string
}

interface SystemChatProps extends SpeechBubbleCommonProps {
  /**
   * Author of the message, controls alignment and bubble color
   */
  author: 'system'
  /**
   * Content type of the bubble. `chat` renders a colored message bubble
   */
  variant: 'chat'
  /**
   * Message text
   */
  children: string
}

interface UserChatEditableProps {
  /**
   * Called when the edit action revealed on hover/focus is activated
   */
  onEdit: () => void
  /**
   * Accessible label for the edit button. Required when `onEdit` is provided
   */
  editLabel: string
}

interface UserChatStaticProps {
  onEdit?: never
  editLabel?: never
}

interface UserChatLockedProps {
  /**
   * Marks the message as no longer editable. Shows a lock indicator instead
   * of the edit action on hover/focus
   */
  locked: true
  /**
   * Tooltip label for the lock indicator. Required when `locked` is `true`
   */
  lockedLabel: string
}

interface UserChatUnlockedProps {
  /**
   * Marks the message as no longer editable. Shows a lock indicator instead
   * of the edit action on hover/focus
   * @default false
   */
  locked?: false
  lockedLabel?: never
}

type UserChatProps = SpeechBubbleCommonProps & {
  /**
   * Author of the message, controls alignment and bubble color
   */
  author: 'user'
  /**
   * Content type of the bubble. `chat` renders a colored message bubble
   */
  variant: 'chat'
  /**
   * Message text
   */
  children: string
} & (UserChatEditableProps | UserChatStaticProps) &
  (UserChatLockedProps | UserChatUnlockedProps)

interface AttachmentProps extends SpeechBubbleCommonProps {
  /**
   * Author of the message. Attachments are only sent by the user
   */
  author: 'user'
  /**
   * Content type of the bubble. `attachment` renders a file reference
   */
  variant: 'attachment'
  /**
   * Name of the attached file
   */
  fileName: string
}

interface CustomProps extends SpeechBubbleCommonProps {
  /**
   * Author of the message. Custom content is only sent by the user
   */
  author: 'user'
  /**
   * Content type of the bubble. `custom` renders arbitrary content inside a
   * bordered container
   */
  variant: 'custom'
  /**
   * Custom content rendered inside the bubble
   */
  children: ReactNode
}

type SpeechBubbleProps =
  | QuestionProps
  | SystemChatProps
  | UserChatProps
  | AttachmentProps
  | CustomProps

const Timestamp = ({
  timestamp,
}: {
  timestamp?: string
}): ReactElement | null =>
  timestamp ? (
    <Typography element="p" textStyle="labelXs" textColor="contentTertiary">
      {timestamp}
    </Typography>
  ) : null

const SpeechBubble = (props: SpeechBubbleProps): ReactElement => {
  const { className } = props

  if (props.variant === 'question') {
    return (
      <div
        className={cn(styles.row, className)}
        data-author="system"
        data-variant="question"
      >
        <Typography element="p" textStyle="bodyMdPrimarySemibold">
          {props.children}
        </Typography>
      </div>
    )
  }

  if (props.variant === 'attachment') {
    return (
      <div
        className={cn(styles.row, className)}
        data-author="user"
        data-variant="attachment"
      >
        <div
          className={styles.bubble}
          data-author="user"
          data-variant="attachment"
        >
          <div className={styles.attachment}>
            <ContractEditIcon aria-hidden className={styles['file-icon']} />
            <Typography element="p" textStyle="labelSm">
              {props.fileName}
            </Typography>
          </div>
        </div>
        <Timestamp timestamp={props.timestamp} />
      </div>
    )
  }

  if (props.variant === 'custom') {
    return (
      <div
        className={cn(styles.row, className)}
        data-author="user"
        data-variant="custom"
      >
        <div className={styles.bubble} data-author="user" data-variant="custom">
          {props.children}
        </div>
      </div>
    )
  }

  const { author, children, timestamp } = props
  const locked = author === 'user' ? (props.locked ?? false) : false
  const lockedLabel = author === 'user' ? props.lockedLabel : undefined
  const onEdit = author === 'user' ? props.onEdit : undefined
  const editLabel = author === 'user' ? props.editLabel : undefined

  return (
    <div
      className={cn(styles.row, className)}
      data-author={author}
      data-variant="chat"
    >
      <div className={styles['chat-group']}>
        {author === 'user' && (locked || onEdit) ? (
          <span className={styles['action-slot']}>
            {locked ? (
              <TooltipTrigger
                delay={300}
                closeDelay={50}
                isDisabled={!lockedLabel}
              >
                <Focusable excludeFromTabOrder>
                  <span className={styles['lock-badge']} tabIndex={0}>
                    <LockIcon aria-hidden />
                  </span>
                </Focusable>
                <Tooltip title={lockedLabel} alignment="top" />
              </TooltipTrigger>
            ) : (
              <TooltipTrigger delay={300} closeDelay={50}>
                <Button
                  variant="link"
                  size="small"
                  className={styles['edit-button']}
                  aria-label={editLabel}
                  onPress={onEdit}
                >
                  <EditIcon aria-hidden />
                </Button>

                <Tooltip title={editLabel} alignment="top" />
              </TooltipTrigger>
            )}
          </span>
        ) : null}
        <div className={styles.bubble} data-author={author} data-variant="chat">
          <Typography element="p" textStyle="bodyMd">
            {children}
          </Typography>
        </div>
      </div>
      <Timestamp timestamp={timestamp} />
    </div>
  )
}

export { SpeechBubble, type SpeechBubbleProps }
