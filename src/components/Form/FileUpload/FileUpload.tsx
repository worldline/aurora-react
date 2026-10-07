'use client'

import { announce } from '@react-aria/live-announcer'
import cn from 'classnames'
import { useEffect, useId, useRef, useState } from 'react'
import {
  DropZone,
  type DropZoneProps,
  FileTrigger,
  isFileDropItem,
} from 'react-aria-components'

import { Button } from '@/components/Button'
import { ErrorMessage } from '@/components/Form/ErrorMessage'
import { FileList as FileEntriesList } from '@/components/Form/FileUpload/FileList'
import { FileUploadLabel } from '@/components/Form/FileUpload/FileUploadLabel'
import { UploadIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './FileUpload.module.css'

type DropEvent = Parameters<NonNullable<DropZoneProps['onDrop']>>[0]
type FileEntryStatus = 'uploading' | 'uploaded' | 'removing' | 'error'

interface LocalFileEntry {
  /** Stable client-side identifier used as the React key */
  id: string
  /** Server-assigned identifier, present once the file is stored server-side */
  serverId?: string
  /** File name shown in the row */
  name: string
  /** Current upload or removal status */
  status: FileEntryStatus
  /** Optional description shown below the file name */
  description?: string
  /** Error message shown when an upload or removal fails */
  errorMessage?: string
  /** The underlying raw browser File object (present for newly selected/dropped files) */
  file?: File
  /** Optional URL to download or preview the file */
  href?: string
}

interface UploadedFile {
  /** Server-assigned identifier in immediate mode, or client id in deferred mode */
  id: string
  /** File name shown in the row */
  name: string
  /** Optional description shown below the file name */
  description?: string
  /** The raw browser File object, present when the file was selected on the client */
  file?: File
  /** Optional URL to download or preview the file */
  href?: string
}

interface FileUploadProps {
  /** Label displayed above the upload zone */
  label?: string
  /** Text content for the tooltip shown next to the label; requires label */
  tooltip?: string
  /** Translatable copy used by the component UI and accessibility labels */
  messages: FileUploadMessages
  /** Hint text displayed inside the drop zone, below the browse button */
  helperText?: string
  /** MIME types or file extensions accepted by the file picker, e.g. ['image/png', '.pdf']; defaults to images and PDFs */
  acceptedFileTypes?: Array<string>
  /** Maximum file size in bytes; files exceeding this limit are rejected without calling onUpload */
  maxFileSize?: number
  /** Maximum number of files allowed; defaults to 1 */
  maxFiles?: number
  /** Returns the description string shown below the filename in each file row */
  getFileDescription?: (file: File) => string
  /** Returns an optional URL to preview or download a file */
  getFileHref?: (file: UploadedFile) => string | undefined
  /** Files already stored server-side, shown as uploaded when the component mounts */
  defaultFiles?: Array<UploadedFile>
  /** Called once per file immediately after selection; resolves with the server-assigned id and drives the upload state.
   *  When omitted, FileUpload operates in deferred upload mode. */
  onUpload?: (file: File) => Promise<string>
  /** Called with a file's server id when its remove button is pressed; the returned promise drives the removal state. Required in immediate mode, optional in deferred mode. */
  onRemove?: (id: string) => Promise<void>
  /** Called with the current server-stored or selected files whenever the uploaded set changes (after a successful upload or removal); not called on mount for defaultFiles */
  onChange?: (files: Array<UploadedFile>) => void
  /** Field-level error message or boolean to indicate error state */
  error?: string | boolean
  /** Whether the upload field is disabled */
  isDisabled?: boolean
  /** Whether selecting or dropping files is disabled while existing files remain removable */
  isUploadDisabled?: boolean
  /** CSS class applied to the root element */
  className?: string
  /** CSS class applied to the drop zone element */
  dropzoneClassName?: string
}

interface FileUploadMessages {
  /** Instruction text shown in the drop zone before the browse button */
  dropZoneInstruction: string
  /** Optional text shown when the drop zone is in active drop target state */
  dropZoneActiveInstruction?: string
  /** Label used for the browse files button */
  browseFilesButton: string
  /** Accessible label for the tooltip trigger button */
  tooltipTriggerAriaLabel: string
  /** Message shown when a file exceeds maxFileSize */
  fileTooLargeError: string
  /** Message shown when a file's type is not in acceptedFileTypes */
  fileTypeError: string
  /** Fallback message shown when upload fails with a non-Error rejection */
  uploadFailedError: string
  /** Fallback message shown when removal fails with a non-Error rejection */
  removeFailedError: string
  /** Message shown when more files are selected than maxFiles allows */
  maxFilesError: string
  /** Text shown below the filename while a file is uploading */
  uploadingLabel: string
  /** Returns the accessible label for the remove file button */
  removeFileAriaLabel: (fileName: string) => string
  /** Returns the screen-reader announcement made when a file finishes uploading */
  uploadedAnnouncement: (fileName: string) => string
  /** Returns the screen-reader announcement made when a file is removed */
  removedAnnouncement: (fileName: string) => string
  /** Returns the screen-reader announcement made when a file fails to upload */
  uploadFailedAnnouncement: (fileName: string) => string
  /** Returns the screen-reader announcement made when a file fails to be removed */
  removeFailedAnnouncement: (fileName: string) => string
}

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const DEFAULT_ACCEPTED_FILE_TYPES: Array<string> = [
  'image/*',
  'application/pdf',
]
const TOOLTIP_REQUIRES_LABEL_ERROR =
  'FileUpload: tooltip requires label to be provided.'

const isFileTypeAccepted = (
  file: File,
  acceptedTypes: Array<string>,
): boolean => {
  if (acceptedTypes.length === 0) {
    return true
  }

  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()

  return acceptedTypes.some((acceptedType) => {
    const baseType = acceptedType.toLowerCase()

    // 1. Handle extensions (e.g., .jpg, .pdf)
    if (baseType.startsWith('.')) {
      return fileName.endsWith(baseType)
    }

    // 2. Handle wildcard MIME types (e.g., image/*)
    if (baseType.endsWith('/*')) {
      const typeGroup = baseType.split('/')[0]
      return fileType.startsWith(`${typeGroup}/`)
    }

    // 3. Handle specific MIME types (e.g., application/pdf)
    return fileType === baseType
  })
}

const toUploadedFiles = (entries: Array<LocalFileEntry>): Array<UploadedFile> =>
  entries.reduce<Array<UploadedFile>>((uploadedFiles, entry) => {
    if (entry.status !== 'uploaded') {
      return uploadedFiles
    }

    const id = entry.serverId ?? entry.id

    return [
      ...uploadedFiles,
      {
        id,
        name: entry.name,
        description: entry.description,
        file: entry.file,
        href: entry.href,
      },
    ]
  }, [])

const FileUpload = ({
  label,
  tooltip,
  messages,
  helperText,
  acceptedFileTypes = DEFAULT_ACCEPTED_FILE_TYPES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  maxFiles = 1,
  getFileDescription,
  getFileHref,
  defaultFiles,
  onUpload,
  onRemove,
  onChange,
  error,
  isDisabled = false,
  isUploadDisabled = false,
  className,
  dropzoneClassName,
}: FileUploadProps) => {
  const [fileEntries, setFileEntries] = useState<Array<LocalFileEntry>>(() =>
    (defaultFiles ?? []).map((uploadedFile): LocalFileEntry => ({
      id: crypto.randomUUID(),
      serverId: uploadedFile.id,
      name: uploadedFile.name,
      status: 'uploaded',
      description: uploadedFile.description,
      href: uploadedFile.href ?? getFileHref?.(uploadedFile),
    })),
  )
  const labelId = useId()
  const errorId = useId()
  const committedSignatureRef = useRef<string | null>(null)
  const browseButtonRef = useRef<HTMLButtonElement>(null)
  const labelledby = label !== undefined ? labelId : undefined
  const isUploadBlocked = isDisabled || isUploadDisabled

  useEffect(() => {
    const uploadedFiles = toUploadedFiles(fileEntries)
    const signature = uploadedFiles.map((file) => file.id).join('|')

    if (committedSignatureRef.current === null) {
      committedSignatureRef.current = signature
      return
    }

    if (signature === committedSignatureRef.current) {
      return
    }

    committedSignatureRef.current = signature
    onChange?.(uploadedFiles)
  }, [fileEntries, onChange])

  const hasFieldError = typeof error === 'string' && !isDisabled

  if (tooltip !== undefined && label === undefined) {
    throw new Error(TOOLTIP_REQUIRES_LABEL_ERROR)
  }

  const removeEntry = (id: string): void => {
    setFileEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  const rejectOverflowFile = (
    id: string,
    file: File,
    description: string | undefined,
  ): void => {
    setFileEntries((prev) => [
      ...prev,
      {
        id,
        name: file.name,
        status: 'error',
        description,
        errorMessage: messages.maxFilesError,
      },
    ])
    announce(messages.uploadFailedAnnouncement(file.name), 'assertive')
  }

  const handleRemove = async (id: string): Promise<void> => {
    const entry = fileEntries.find((fileEntry): boolean => fileEntry.id === id)

    if (entry === undefined) {
      return
    }

    if (onRemove === undefined || entry.serverId === undefined) {
      removeEntry(id)
      announce(messages.removedAnnouncement(entry.name), 'polite')
      return
    }

    const serverId = entry.serverId
    setFileEntries((prev) =>
      prev.map((fileEntry) =>
        fileEntry.id === id
          ? { ...fileEntry, status: 'removing', errorMessage: undefined }
          : fileEntry,
      ),
    )

    try {
      await onRemove(serverId)
      removeEntry(id)
      announce(messages.removedAnnouncement(entry.name), 'polite')
    } catch (removeError) {
      const errorMessage =
        removeError instanceof Error
          ? removeError.message
          : messages.removeFailedError
      setFileEntries((prev) =>
        prev.map((fileEntry) =>
          fileEntry.id === id
            ? { ...fileEntry, status: 'error', errorMessage }
            : fileEntry,
        ),
      )
      announce(messages.removeFailedAnnouncement(entry.name), 'assertive')
    }
  }

  const rejectFile = (
    id: string,
    file: File,
    description: string | undefined,
    errorMessage: string,
  ): void => {
    setFileEntries((prev) => [
      ...prev,
      { id, name: file.name, status: 'error', description, errorMessage },
    ])
    announce(messages.uploadFailedAnnouncement(file.name), 'assertive')
  }

  const processFile = async (file: File): Promise<void> => {
    const id = crypto.randomUUID()
    const description = getFileDescription?.(file)

    if (!isFileTypeAccepted(file, acceptedFileTypes)) {
      rejectFile(id, file, description, messages.fileTypeError)
      return
    }

    if (file.size > maxFileSize) {
      rejectFile(id, file, description, messages.fileTooLargeError)
      return
    }

    if (onUpload === undefined) {
      const href = getFileHref?.({ id, name: file.name, description, file })
      setFileEntries((prev) => [
        ...prev,
        { id, name: file.name, status: 'uploaded', description, file, href },
      ])
      announce(messages.uploadedAnnouncement(file.name), 'polite')
      return
    }

    setFileEntries((prev) => [
      ...prev,
      { id, name: file.name, status: 'uploading', description, file },
    ])

    try {
      const serverId = await onUpload(file)
      const href = getFileHref?.({
        id: serverId,
        name: file.name,
        description,
        file,
      })
      setFileEntries((prev) =>
        prev.map((entry) =>
          entry.id === id
            ? { ...entry, status: 'uploaded', serverId, file, href }
            : entry,
        ),
      )
      announce(messages.uploadedAnnouncement(file.name), 'polite')
    } catch (uploadError) {
      const errorMessage =
        uploadError instanceof Error
          ? uploadError.message
          : messages.uploadFailedError
      setFileEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, status: 'error', errorMessage } : entry,
        ),
      )
      announce(messages.uploadFailedAnnouncement(file.name), 'assertive')
    }
  }

  const handleDrop = async (event: DropEvent): Promise<void> => {
    const fileItems = event.items.filter(isFileDropItem)
    const files = await Promise.all(fileItems.map((item) => item.getFile()))

    const remainingFileSlots = Math.max(maxFiles - fileEntries.length, 0)
    await Promise.all(
      files.map(async (file, index) => {
        if (index < remainingFileSlots) {
          await processFile(file)
          return
        }

        rejectOverflowFile(
          crypto.randomUUID(),
          file,
          getFileDescription?.(file),
        )
      }),
    )
  }

  const handleSelect = async (fileList: FileList | null): Promise<void> => {
    if (fileList === null || isUploadBlocked) {
      return
    }

    const files = Array.from(fileList)

    const remainingFileSlots = Math.max(maxFiles - fileEntries.length, 0)
    await Promise.all(
      files.map(async (file, index) => {
        if (index < remainingFileSlots) {
          await processFile(file)
          return
        }

        rejectOverflowFile(
          crypto.randomUUID(),
          file,
          getFileDescription?.(file),
        )
      }),
    )
  }

  return (
    <div
      className={cn(styles.container, className)}
      data-disabled={isDisabled || undefined}
      aria-disabled={isDisabled || undefined}
    >
      <div className={cn(styles.upload)}>
        <FileUploadLabel
          label={label}
          tooltip={tooltip}
          labelId={labelId}
          tooltipTriggerAriaLabel={messages.tooltipTriggerAriaLabel}
        />

        <DropZone
          aria-labelledby={labelledby}
          aria-describedby={hasFieldError ? errorId : undefined}
          aria-disabled={isUploadBlocked || undefined}
          getDropOperation={() => 'copy'}
          onDrop={(event) => {
            if (!isUploadBlocked) {
              void handleDrop(event)
            }
          }}
          isDisabled={isUploadBlocked}
          data-invalid={(Boolean(error) && !isDisabled) || undefined}
          className={cn(styles['drop-zone'], dropzoneClassName)}
        >
          <div className={styles['drop-zone-content']}>
            <Typography
              element="p"
              textStyle="bodyMd"
              textColor={isUploadBlocked ? 'contentDisabled' : 'contentPrimary'}
              className={styles['drop-text']}
            >
              {messages.dropZoneInstruction}
            </Typography>
            {messages.dropZoneActiveInstruction !== undefined ? (
              <Typography
                element="p"
                textStyle="bodyMd"
                className={styles['drop-text-active']}
              >
                {messages.dropZoneActiveInstruction}
              </Typography>
            ) : null}
            <FileTrigger
              onSelect={(files) => {
                void handleSelect(files)
              }}
              acceptedFileTypes={acceptedFileTypes}
              allowsMultiple={maxFiles > 1}
            >
              <Button
                ref={browseButtonRef}
                onPress={() => {
                  browseButtonRef.current?.focus()
                }}
                leadingIcon={<UploadIcon aria-hidden />}
                variant="secondary"
                size="small"
                isDisabled={isUploadBlocked}
              >
                {messages.browseFilesButton}
              </Button>
            </FileTrigger>
            {helperText !== undefined ? (
              <Typography
                element="p"
                textStyle="captionMd"
                className={styles['hint-text']}
              >
                {helperText}
              </Typography>
            ) : null}
          </div>
        </DropZone>
        {typeof error === 'string' && !isDisabled ? (
          <ErrorMessage id={errorId} error={error} />
        ) : null}
      </div>
      <FileEntriesList
        entries={fileEntries}
        uploadingLabel={messages.uploadingLabel}
        removeFileAriaLabel={messages.removeFileAriaLabel}
        onRemove={(id) => {
          void handleRemove(id)
        }}
        isDisabled={isDisabled}
      />
    </div>
  )
}

export {
  FileUpload,
  type FileUploadMessages,
  type FileUploadProps,
  type UploadedFile,
}
