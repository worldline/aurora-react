import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useRef } from 'react'

import { FileUpload } from '.'

const messages = {
  dropZoneInstruction: 'Drop or paste files here or',
  dropZoneActiveInstruction: 'Drop it!',
  browseFilesButton: 'Browse files',
  tooltipTriggerAriaLabel: 'More information',
  fileTooLargeError: 'File exceeds maximum size',
  fileTypeError: 'File type is not accepted',
  uploadFailedError: 'Upload failed',
  removeFailedError: 'Remove failed',
  maxFilesError: 'Too many files selected',
  uploadingLabel: 'Uploading...',
  removeFileAriaLabel: (fileName: string) => `Remove ${fileName}`,
  uploadedAnnouncement: (fileName: string) => `${fileName} uploaded`,
  removedAnnouncement: (fileName: string) => `${fileName} removed`,
  uploadFailedAnnouncement: (fileName: string) =>
    `${fileName} failed to upload`,
  removeFailedAnnouncement: (fileName: string) =>
    `${fileName} failed to remove`,
}

const meta: Meta<typeof FileUpload> = {
  title: 'Components/Form/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label displayed above the upload zone',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    messages: {
      control: 'object',
      description:
        'Translatable copy used by the component UI and accessibility labels',
      table: {
        type: { summary: 'FileUploadMessages' },
        category: 'Content',
      },
    },
    tooltip: {
      control: 'text',
      description: 'Text content for the tooltip shown next to the label',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    helperText: {
      control: 'text',
      description: 'Hint text displayed inside the drop zone',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    acceptedFileTypes: {
      control: 'object',
      description: 'MIME types or file extensions accepted by the file picker',
      table: {
        type: { summary: 'string[]' },
        category: 'Behaviour',
      },
    },
    maxFileSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
      table: {
        type: { summary: 'number' },
        category: 'Behaviour',
      },
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files allowed. Defaults to a single file',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
        category: 'Behaviour',
      },
    },
    getFileHref: {
      description: 'Returns an optional URL to preview or download a file',
      table: {
        type: { summary: '(file: UploadedFile) => string | undefined' },
        category: 'Behaviour',
      },
    },
    error: {
      control: 'text',
      description: 'Field-level error message',
      table: {
        type: { summary: 'string | boolean' },
        category: 'Content',
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the upload field is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    isUploadDisabled: {
      control: 'boolean',
      description:
        'Disable browsing and dropping while keeping removal available',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof FileUpload>

const resolveImmediately = (): Promise<string> =>
  Promise.resolve(crypto.randomUUID())
const SERVER_ERROR_MESSAGE = 'Server error'
const FILE_INPUT_SELECTOR = 'input[type="file"]'
const rejectWithErrorAfterDelay = (): Promise<string> =>
  new Promise<string>((_resolve, reject) => {
    window.setTimeout(() => {
      reject(new Error(SERVER_ERROR_MESSAGE))
    }, 2000)
  })
const resolveRemove = (): Promise<void> => Promise.resolve()
const uploadFileLabel = 'Upload file'
const uploadFilesLabel = 'Upload files'
const pdfFileType = 'application/pdf'
const ACCEPTED_PDF_AND_PNG_FILE_TYPES: Array<string> = [pdfFileType, '.png']
const defaultHelperText =
  'Maximum file size 10MB\nAccepted formats PDF PNG JPEG'
const initialFileToRemove = {
  id: 'file-3',
  name: 'contract-to-remove.pdf',
  description: 'Pending server removal',
}

const mixedUploadStatesArgs = {
  label: uploadFilesLabel,
  maxFiles: 5,
  messages,
  helperText:
    'The first file stays uploading, the second fails, and the third succeeds.',
  getFileDescription: (file: File) =>
    file.name === 'third.pdf' ? 'Final approved document' : '',
  onUpload: (file: File): Promise<string> => {
    if (file.name === 'first.pdf') {
      return new Promise<string>(() => undefined)
    }

    if (file.name === 'second.pdf') {
      return Promise.reject(new Error(SERVER_ERROR_MESSAGE))
    }

    return resolveImmediately()
  },
  onRemove: resolveRemove,
} satisfies Story['args']

const removeFailedErrorMessage = 'Could not remove file from server'

const overflowFilesArgs = {
  label: uploadFilesLabel,
  maxFiles: 2,
  messages,
  helperText: 'The sixth file should be rejected with an error row.',
  onUpload: resolveImmediately,
  onRemove: resolveRemove,
} satisfies Story['args']

const OverflowFilesExample = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasUploadedRef = useRef(false)

  useEffect(() => {
    if (hasUploadedRef.current) {
      return
    }

    hasUploadedRef.current = true

    const input =
      containerRef.current?.querySelector<HTMLInputElement>(FILE_INPUT_SELECTOR)

    if (input === null || input === undefined) {
      return
    }

    const dataTransfer = new DataTransfer()

    Array.from({ length: 3 }, (_, index) => index + 1).forEach((index) => {
      const fileNumber = String(index)
      dataTransfer.items.add(
        new File([`file-${fileNumber}`], `file-${fileNumber}.pdf`, {
          type: pdfFileType,
        }),
      )
    })

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: dataTransfer.files,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, [])

  return (
    <div ref={containerRef}>
      <FileUpload {...overflowFilesArgs} />
    </div>
  )
}

const MaxFileSizeErrorExample = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasUploadedRef = useRef(false)

  useEffect(() => {
    if (hasUploadedRef.current) {
      return
    }

    hasUploadedRef.current = true

    const input =
      containerRef.current?.querySelector<HTMLInputElement>(FILE_INPUT_SELECTOR)

    if (input === null || input === undefined) {
      return
    }

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(
      new File([new Uint8Array(60 * 1024)], 'too-large.pdf', {
        type: pdfFileType,
      }),
    )

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: dataTransfer.files,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, [])

  return (
    <div ref={containerRef}>
      <FileUpload
        label={uploadFileLabel}
        maxFileSize={50 * 1024}
        helperText="Maximum file size: 50 KB."
        messages={messages}
        onUpload={resolveImmediately}
        onRemove={resolveRemove}
      />
    </div>
  )
}

const AcceptedFileTypesErrorExample = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasUploadedRef = useRef(false)

  useEffect(() => {
    if (hasUploadedRef.current) {
      return
    }

    hasUploadedRef.current = true

    const input =
      containerRef.current?.querySelector<HTMLInputElement>(FILE_INPUT_SELECTOR)

    if (input === null || input === undefined) {
      return
    }

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(
      new File(['csv,not,allowed'], 'import.csv', {
        type: 'text/csv',
      }),
    )

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: dataTransfer.files,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, [])

  return (
    <div ref={containerRef}>
      <FileUpload
        label={uploadFileLabel}
        acceptedFileTypes={ACCEPTED_PDF_AND_PNG_FILE_TYPES}
        helperText="Accepted file types: PDF and PNG."
        maxFiles={3}
        messages={messages}
        onUpload={resolveImmediately}
        onRemove={resolveRemove}
      />
    </div>
  )
}

const removeInitialFileFailsArgs = {
  label: uploadFilesLabel,
  maxFiles: 5,
  defaultFiles: [initialFileToRemove],
  messages,
  onUpload: resolveImmediately,
  onRemove: (): Promise<void> =>
    new Promise<void>((_resolve, reject) => {
      window.setTimeout(() => {
        reject(new Error(removeFailedErrorMessage))
      }, 1000)
    }),
} satisfies Story['args']

const RemoveInitialFileFailsExample = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (hasTriggeredRef.current) {
      return
    }

    hasTriggeredRef.current = true

    const removeButtonLabel = messages.removeFileAriaLabel(
      initialFileToRemove.name,
    )
    const removeButton = containerRef.current?.querySelector<HTMLButtonElement>(
      `button[aria-label="${removeButtonLabel}"]`,
    )

    if (removeButton === null || removeButton === undefined) {
      return
    }

    removeButton.click()
  }, [])

  return (
    <div ref={containerRef}>
      <FileUpload {...removeInitialFileFailsArgs} />
    </div>
  )
}

const MixedUploadStatesExample = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasUploadedRef = useRef(false)

  useEffect(() => {
    if (hasUploadedRef.current) {
      return
    }

    hasUploadedRef.current = true

    const input =
      containerRef.current?.querySelector<HTMLInputElement>(
        'input[type="file"]',
      )

    if (input === null || input === undefined) {
      return
    }

    const firstFile = new File(['first'], 'first.pdf', {
      type: pdfFileType,
    })
    const secondFile = new File(['second'], 'second.pdf', {
      type: pdfFileType,
    })
    const thirdFile = new File(['third'], 'third.pdf', {
      type: pdfFileType,
    })

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(secondFile)
    dataTransfer.items.add(firstFile)
    dataTransfer.items.add(thirdFile)

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: dataTransfer.files,
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, [])

  return (
    <div ref={containerRef}>
      <FileUpload {...mixedUploadStatesArgs} />
    </div>
  )
}

export const Default: Story = {
  args: {
    label: uploadFileLabel,
    helperText: 'This is a hint text to help user.',
    messages,
    onUpload: resolveImmediately,
    onRemove: resolveRemove,
  },
}

export const WithTooltip: Story = {
  args: {
    label: uploadFileLabel,
    tooltip: 'Accepted formats: PNG, PDF. Max size: 5 MB.',
    messages,
    onUpload: resolveImmediately,
    onRemove: resolveRemove,
  },
}

export const WithHelperText: Story = {
  args: {
    label: uploadFileLabel,
    helperText: defaultHelperText,
    messages,
    onUpload: resolveImmediately,
    onRemove: resolveRemove,
  },
}

export const WithError: Story = {
  args: {
    label: uploadFileLabel,
    error: 'A file is required to proceed.',
    messages,
    onUpload: resolveImmediately,
    onRemove: resolveRemove,
  },
}

export const Disabled: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  args: {
    label: uploadFileLabel,
    isDisabled: true,
    helperText: defaultHelperText,
    messages,
    onUpload: resolveImmediately,
    onRemove: resolveRemove,
  },
}

export const Multiple: Story = {
  args: {
    label: uploadFilesLabel,
    maxFiles: 3,
    helperText: 'You can select multiple files at once.',
    messages,
    onUpload: resolveImmediately,
    onRemove: resolveRemove,
  },
}

export const WithInitialFiles: Story = {
  args: {
    label: uploadFilesLabel,
    maxFiles: 5,
    defaultFiles: [
      { id: 'file-1', name: 'quarterly-report.pdf' },
      { id: 'file-2', name: 'company-logo.png' },
    ],
    messages,
    onUpload: resolveImmediately,
    onRemove: resolveRemove,
  },
}

export const WithFileDescription: Story = {
  args: {
    label: uploadFilesLabel,
    maxFiles: 5,
    defaultFiles: [
      {
        id: 'file-1',
        name: 'quarterly-report.pdf',
        description: 'Super important document',
      },
      { id: 'file-2', name: 'company-logo.png', description: '48 KB' },
    ],
    getFileDescription: (file: File) => `${(file.size / 1024).toFixed(1)} KB`,
    messages,
    onUpload: resolveImmediately,
    onRemove: resolveRemove,
  },
}

export const WithMixedUploadStates: Story = {
  args: mixedUploadStatesArgs,
  render: () => <MixedUploadStatesExample />,
}

export const RemoveInitialFileFailsAfterDelay: Story = {
  args: removeInitialFileFailsArgs,
  render: () => <RemoveInitialFileFailsExample />,
}

export const UploadFails: Story = {
  args: {
    label: uploadFileLabel,
    messages,
    onUpload: rejectWithErrorAfterDelay,
    onRemove: resolveRemove,
    helperText: defaultHelperText,
  },
}

export const WithMaxFileSize: Story = {
  args: {
    label: uploadFileLabel,
    maxFileSize: 50 * 1024,
    helperText: 'Maximum file size: 50 KB.',
    messages,
    onUpload: resolveImmediately,
    onRemove: resolveRemove,
  },
  render: () => <MaxFileSizeErrorExample />,
}

export const WithAcceptedFileTypes: Story = {
  args: {
    label: uploadFileLabel,
    acceptedFileTypes: ACCEPTED_PDF_AND_PNG_FILE_TYPES,
    helperText: 'Accepted file types: PDF and PNG.',
    maxFiles: 3,
    messages,
    onUpload: resolveImmediately,
    onRemove: resolveRemove,
  },
  render: () => <AcceptedFileTypesErrorExample />,
}

export const WithMaxFilesOverflow: Story = {
  args: overflowFilesArgs,
  render: () => <OverflowFilesExample />,
}

export const DeferredUpload: Story = {
  args: {
    label: uploadFilesLabel,
    maxFiles: 3,
    helperText:
      'Files are held locally and can be appended to FormData on submit.',
    messages,
  },
}

export const WithFileLinks: Story = {
  args: {
    label: uploadFilesLabel,
    maxFiles: 5,
    defaultFiles: [
      {
        id: 'file-1',
        name: 'annual-report.pdf',
        description: 'Click to preview document',
        href: 'https://example.com/annual-report.pdf',
      },
      {
        id: 'file-2',
        name: 'company-overview.pdf',
        description: 'Generated via getFileHref',
      },
    ],
    getFileHref: (file) => file.href ?? `https://example.com/files/${file.id}`,
    messages,
    onUpload: resolveImmediately,
    onRemove: resolveRemove,
  },
}
