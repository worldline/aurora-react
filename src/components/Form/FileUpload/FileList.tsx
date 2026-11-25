import type { JSX } from 'react'

import { Button } from '@/components/Button'
import {
  ContractEditIcon,
  DeleteIcon,
  ErrorIcon,
  ProgressActivityIcon,
} from '@/components/icons'
import { Link } from '@/components/Link'
import { Typography } from '@/components/Typography'

import styles from './FileList.module.css'

type FileStatus = 'uploading' | 'uploaded' | 'removing' | 'error'

const renderFileIcon = (): JSX.Element => (
  <ContractEditIcon size={32} aria-hidden />
)

interface FileEntry {
  /** Stable client-side identifier used as the React key */
  id: string
  /** Server-assigned identifier, present once the file is stored server-side */
  serverId?: string
  /** File name shown in the row */
  name: string
  /** Current upload or removal status */
  status: FileStatus
  /** Optional description shown below the file name */
  description?: string
  /** Error message shown when an upload or removal fails */
  errorMessage?: string
  /** Optional URL to download or preview the file */
  href?: string
}

const getSecondaryText = (
  entry: FileEntry,
  uploadingLabel: string,
): string | undefined => {
  if (entry.status === 'uploading') {
    return uploadingLabel
  }
  if (entry.errorMessage !== undefined) {
    return entry.errorMessage
  }
  return entry.description
}

interface FileRowProps {
  /** File entry to render */
  entry: FileEntry
  /** Text shown below the filename while the file is uploading */
  uploadingLabel: string
  /** Returns the accessible label for the remove button */
  removeFileAriaLabel: (fileName: string) => string
  /** Called with the entry id when the remove button is pressed */
  onRemove: (id: string) => void
  /** Whether the field and its remove action are disabled */
  isDisabled?: boolean
}

const FileRow = ({
  entry,
  uploadingLabel,
  removeFileAriaLabel,
  onRemove,
  isDisabled = false,
}: FileRowProps) => {
  const { id, name, status, href } = entry
  const isUploading = status === 'uploading'
  const isRemoving = status === 'removing'
  const isError = status === 'error'
  const hasError = entry.errorMessage !== undefined
  const isClickable = href !== undefined && !isUploading && !isError
  const secondaryText = getSecondaryText(entry, uploadingLabel)

  const fileNameElement = (
    <Typography
      element="span"
      textStyle="titleSm"
      className={styles['file-name']}
    >
      {name}
    </Typography>
  )

  return (
    <li className={styles['file-row']} data-status={status}>
      <div className={styles['file-icon']}>
        {isUploading ? (
          <ProgressActivityIcon
            size={32}
            aria-hidden
            className={styles.spinner}
          />
        ) : null}
        {isError ? (
          <ErrorIcon size={32} aria-hidden className={styles['error-icon']} />
        ) : null}
        {!isUploading && !isError ? renderFileIcon() : null}
      </div>

      <div className={styles['file-info']}>
        {isClickable ? (
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles['file-link']}
          >
            {fileNameElement}
          </Link>
        ) : (
          fileNameElement
        )}
        {secondaryText !== undefined ? (
          <Typography
            element="span"
            textStyle="bodyMd"
            textColor={hasError ? 'contentDanger' : 'contentSecondary'}
          >
            {secondaryText}
          </Typography>
        ) : null}
      </div>

      {isUploading || isDisabled ? null : (
        <Button
          aria-label={removeFileAriaLabel(name)}
          variant="link"
          className={styles['file-action']}
          isDisabled={isRemoving}
          onPress={() => {
            onRemove(id)
          }}
        >
          {isRemoving ? (
            <ProgressActivityIcon
              size={24}
              aria-hidden
              className={styles.spinner}
            />
          ) : (
            <DeleteIcon size={24} aria-hidden />
          )}
        </Button>
      )}
    </li>
  )
}

interface FileListProps {
  /** File entries to display, in upload order */
  entries: Array<FileEntry>
  /** Text shown below the filename while a file is uploading */
  uploadingLabel: string
  /** Returns the accessible label for a row's remove button */
  removeFileAriaLabel: (fileName: string) => string
  /** Called with the entry id when a row's remove button is pressed */
  onRemove: (id: string) => void
  /** Whether the field and its remove action are disabled */
  isDisabled?: boolean
}

const FileList = ({
  entries,
  uploadingLabel,
  removeFileAriaLabel,
  onRemove,
  isDisabled = false,
}: FileListProps) => {
  if (entries.length === 0) {
    return null
  }

  return (
    <ul className={styles['file-list']}>
      {entries.map((entry) => (
        <FileRow
          key={entry.id}
          entry={entry}
          uploadingLabel={uploadingLabel}
          removeFileAriaLabel={removeFileAriaLabel}
          onRemove={onRemove}
          isDisabled={isDisabled}
        />
      ))}
    </ul>
  )
}

export { FileList, type FileEntry, type FileStatus }
