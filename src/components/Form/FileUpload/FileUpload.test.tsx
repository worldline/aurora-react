import { announce } from '@react-aria/live-announcer'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { FileUpload } from '.'

vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
}))

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

const makeFile = (name = 'document.pdf', size = 1024): File =>
  new File(['x'.repeat(size)], name, { type: 'application/pdf' })

const resolveUpload = vi.fn(() => Promise.resolve('server-1'))
const resolveRemove = vi.fn(() => Promise.resolve())
const rejectWithMessage = (message: string) =>
  vi.fn(() => Promise.reject(new Error(message)))

const getFileInput = (): HTMLInputElement => {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]')
  if (input === null) {
    throw new Error('File input not found in the document')
  }
  return input
}

describe('FileUpload', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    test('renders label', () => {
      render(
        <FileUpload
          label="Upload file"
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
        />,
      )
      expect(screen.getByText('Upload file')).toBeVisible()
    })

    test('renders browse button', () => {
      render(
        <FileUpload
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
        />,
      )
      expect(screen.getByRole('button', { name: 'Browse files' })).toBeVisible()
    })

    test('defaults accepted file types to images and pdfs', () => {
      render(
        <FileUpload
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
        />,
      )

      expect(getFileInput()).toHaveAttribute(
        'accept',
        'image/*,application/pdf',
      )
    })

    test('uses custom accepted file types when provided', () => {
      render(
        <FileUpload
          acceptedFileTypes={['application/pdf', '.png']}
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
        />,
      )

      expect(getFileInput()).toHaveAttribute('accept', 'application/pdf,.png')
    })

    test('renders hint text inside the drop zone', () => {
      render(
        <FileUpload
          helperText="Max size: 5 MB"
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
        />,
      )
      expect(screen.getByText('Max size: 5 MB')).toBeVisible()
    })

    test('renders tooltip trigger button when tooltip prop is provided', () => {
      render(
        <FileUpload
          label="Upload file"
          tooltip="Accepted formats: PDF"
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
        />,
      )
      expect(
        screen.getByRole('button', { name: 'More information' }),
      ).toBeVisible()
    })

    test('does not render tooltip trigger when tooltip prop is not provided', () => {
      render(
        <FileUpload
          label="Upload file"
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
        />,
      )
      expect(
        screen.queryByRole('button', { name: 'More information' }),
      ).not.toBeInTheDocument()
    })

    test('throws when tooltip is provided without label', () => {
      expect(() => {
        render(
          <FileUpload
            tooltip="Accepted formats: PDF"
            messages={messages}
            onUpload={resolveUpload}
            onRemove={resolveRemove}
          />,
        )
      }).toThrow('FileUpload: tooltip requires label to be provided.')
    })

    test('renders field-level error message', () => {
      render(
        <FileUpload
          error="A file is required"
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
        />,
      )
      expect(screen.getByText('A file is required')).toBeVisible()
    })

    test('does not render error message when isDisabled', () => {
      render(
        <FileUpload
          error="A file is required"
          isDisabled
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
        />,
      )
      expect(screen.queryByText('A file is required')).not.toBeInTheDocument()
    })
  })

  describe('File upload flow', () => {
    test('shows uploading state without a remove button while onUpload is pending', async () => {
      let resolveUploadPromise!: () => void
      const pendingUpload = new Promise<string>((resolve) => {
        resolveUploadPromise = () => {
          resolve('server-1')
        }
      })
      const onUpload = vi.fn(() => pendingUpload)

      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      expect(screen.getByText('report.pdf')).toBeVisible()
      expect(screen.getByText(messages.uploadingLabel)).toBeVisible()
      expect(
        screen.queryByRole('button', { name: 'Remove report.pdf' }),
      ).not.toBeInTheDocument()

      resolveUploadPromise()
    })

    test('calls onUpload with the selected file', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      const file = makeFile('invoice.pdf')
      await userEvent.upload(getFileInput(), file)

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledWith(file)
      })
    })

    test('transitions to error state when onUpload rejects with an Error', async () => {
      const onUpload = rejectWithMessage('Server unavailable')
      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(screen.getByText('Server unavailable')).toBeVisible()
      })
    })

    test('shows generic error message when onUpload rejects with a non-Error', async () => {
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      const onUpload = vi.fn(() => Promise.reject('unexpected'))
      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(screen.getByText(messages.uploadFailedError)).toBeVisible()
      })
    })
  })

  describe('maxFileSize validation', () => {
    test('rejects oversized file without calling onUpload', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      render(
        <FileUpload
          maxFileSize={100}
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('large.pdf', 200))

      expect(onUpload).not.toHaveBeenCalled()
      expect(screen.getByText(messages.fileTooLargeError)).toBeVisible()
    })

    test('accepts file within maxFileSize', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      render(
        <FileUpload
          maxFileSize={1024 * 10}
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('small.pdf', 512))

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('File description', () => {
    test('renders description returned by getFileDescription', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      const getFileDescription = (file: File): string =>
        `${file.name} — custom desc`

      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
          getFileDescription={getFileDescription}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      expect(screen.getByText('report.pdf — custom desc')).toBeVisible()
    })
  })

  describe('Remove file', () => {
    test('calls onRemove with the server id and drops the row on success', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-42'))
      const onRemove = vi.fn(() => Promise.resolve())
      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={onRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove report.pdf' }),
        ).toBeVisible()
      })

      await userEvent.click(
        screen.getByRole('button', { name: 'Remove report.pdf' }),
      )

      await waitFor(() => {
        expect(screen.queryByText('report.pdf')).not.toBeInTheDocument()
      })
      expect(onRemove).toHaveBeenCalledWith('server-42')
    })

    test('keeps the file and shows an error when onRemove rejects', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-42'))
      const onRemove = vi.fn(() => Promise.reject(new Error('Delete failed')))
      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={onRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove report.pdf' }),
        ).toBeVisible()
      })

      await userEvent.click(
        screen.getByRole('button', { name: 'Remove report.pdf' }),
      )

      await waitFor(() => {
        expect(screen.getByText('Delete failed')).toBeVisible()
      })
      expect(screen.getByText('report.pdf')).toBeVisible()
      expect(
        screen.getByRole('button', { name: 'Remove report.pdf' }),
      ).toBeEnabled()
    })

    test('drops an upload-failed row locally without calling onRemove', async () => {
      const onUpload = rejectWithMessage('Server unavailable')
      const onRemove = vi.fn(() => Promise.resolve())
      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={onRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove report.pdf' }),
        ).toBeVisible()
      })

      await userEvent.click(
        screen.getByRole('button', { name: 'Remove report.pdf' }),
      )

      expect(screen.queryByText('report.pdf')).not.toBeInTheDocument()
      expect(onRemove).not.toHaveBeenCalled()
    })
  })

  describe('Initial files', () => {
    test('seeds the list from defaultFiles on mount and removes via server id', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      const onRemove = vi.fn(() => Promise.resolve())
      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={onRemove}
          defaultFiles={[
            { id: 'server-7', name: 'existing.pdf', description: 'PDF · 2 MB' },
          ]}
        />,
      )

      expect(screen.getByText('existing.pdf')).toBeVisible()
      expect(screen.getByText('PDF · 2 MB')).toBeVisible()

      await userEvent.click(
        screen.getByRole('button', { name: 'Remove existing.pdf' }),
      )

      await waitFor(() => {
        expect(screen.queryByText('existing.pdf')).not.toBeInTheDocument()
      })
      expect(onRemove).toHaveBeenCalledWith('server-7')
    })

    test('does not render remove buttons when isDisabled is true', () => {
      render(
        <FileUpload
          isDisabled
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
          defaultFiles={[{ id: 'server-7', name: 'existing.pdf' }]}
        />,
      )

      expect(
        screen.queryByRole('button', { name: 'Remove existing.pdf' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('Multiple files', () => {
    test('calls onUpload once per file when multiple is true', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      render(
        <FileUpload
          maxFiles={5}
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      const files = [makeFile('a.pdf'), makeFile('b.pdf')]
      await userEvent.upload(getFileInput(), files)

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledTimes(2)
      })
    })

    test('limits uploads to the default maxFiles count when multiple is true', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      render(
        <FileUpload
          maxFiles={5}
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      await userEvent.upload(getFileInput(), [
        makeFile('a.pdf'),
        makeFile('b.pdf'),
        makeFile('c.pdf'),
        makeFile('d.pdf'),
        makeFile('e.pdf'),
        makeFile('f.pdf'),
      ])

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledTimes(5)
      })
      expect(screen.getByText('f.pdf')).toBeVisible()
      expect(screen.getByText(messages.maxFilesError)).toBeVisible()
    })

    test('limits uploads to the provided maxFiles count when multiple is true', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      render(
        <FileUpload
          maxFiles={2}
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      await userEvent.upload(getFileInput(), [
        makeFile('a.pdf'),
        makeFile('b.pdf'),
        makeFile('c.pdf'),
      ])

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledTimes(2)
      })
      expect(screen.getByText('c.pdf')).toBeVisible()
      expect(screen.getByText(messages.maxFilesError)).toBeVisible()
    })
  })

  describe('Controlled state', () => {
    test('parent holds state; FileUpload does not self-toggle', async () => {
      const onUpload = vi.fn((_file: File) => Promise.resolve('server-1'))

      const Parent = () => {
        const [uploadCount, setUploadCount] = useState(0)
        return (
          <div>
            <span data-testid="count">{uploadCount}</span>
            <FileUpload
              messages={messages}
              onUpload={async (file: File) => {
                const serverId = await onUpload(file)
                setUploadCount((prev) => prev + 1)
                return serverId
              }}
              onRemove={resolveRemove}
            />
          </div>
        )
      }

      render(<Parent />)

      await userEvent.upload(getFileInput(), makeFile('doc.pdf'))

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('1')
      })
    })
  })

  describe('File type validation', () => {
    test('rejects a file whose type is not accepted without calling onUpload', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      const user = userEvent.setup({ applyAccept: false })
      render(
        <FileUpload
          acceptedFileTypes={['application/pdf']}
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      const image = new File(['x'], 'photo.png', { type: 'image/png' })
      await user.upload(getFileInput(), image)

      expect(screen.getByText('photo.png')).toBeVisible()
      expect(screen.getByText(messages.fileTypeError)).toBeVisible()
      expect(onUpload).not.toHaveBeenCalled()
    })

    test('accepts a file matching an extension in acceptedFileTypes', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      render(
        <FileUpload
          acceptedFileTypes={['.pdf']}
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Multiple files disabled', () => {
    test('uploads only the first file when multiple is false', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={resolveRemove}
        />,
      )

      await userEvent.upload(getFileInput(), [
        makeFile('a.pdf'),
        makeFile('b.pdf'),
      ])

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledTimes(1)
      })
      expect(screen.getByText('a.pdf')).toBeVisible()
      expect(screen.queryByText('b.pdf')).not.toBeInTheDocument()
    })
  })

  describe('Remove file pending and fallback', () => {
    test('disables the remove button while removal is pending', async () => {
      let resolveRemovePromise!: () => void
      const pendingRemove = new Promise<void>((resolve) => {
        resolveRemovePromise = () => {
          resolve()
        }
      })
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      const onRemove = vi.fn(() => pendingRemove)
      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={onRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove report.pdf' }),
        ).toBeVisible()
      })

      await userEvent.click(
        screen.getByRole('button', { name: 'Remove report.pdf' }),
      )

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove report.pdf' }),
        ).toBeDisabled()
      })

      resolveRemovePromise()

      await waitFor(() => {
        expect(screen.queryByText('report.pdf')).not.toBeInTheDocument()
      })
    })

    test('shows the removeFailedError fallback when onRemove rejects with a non-Error', async () => {
      const onUpload = vi.fn(() => Promise.resolve('server-1'))
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      const onRemove = vi.fn(() => Promise.reject('unexpected'))
      render(
        <FileUpload
          messages={messages}
          onUpload={onUpload}
          onRemove={onRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove report.pdf' }),
        ).toBeVisible()
      })

      await userEvent.click(
        screen.getByRole('button', { name: 'Remove report.pdf' }),
      )

      await waitFor(() => {
        expect(screen.getByText(messages.removeFailedError)).toBeVisible()
      })
    })
  })

  describe('Screen reader announcements', () => {
    test('announces when a file finishes uploading', async () => {
      render(
        <FileUpload
          messages={messages}
          onUpload={() => Promise.resolve('server-1')}
          onRemove={resolveRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(vi.mocked(announce)).toHaveBeenCalledWith(
          'report.pdf uploaded',
          'polite',
        )
      })
    })

    test('announces when an upload fails', async () => {
      render(
        <FileUpload
          messages={messages}
          onUpload={rejectWithMessage('Server unavailable')}
          onRemove={resolveRemove}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(vi.mocked(announce)).toHaveBeenCalledWith(
          'report.pdf failed to upload',
          'assertive',
        )
      })
    })

    test('announces when a file is removed', async () => {
      render(
        <FileUpload
          messages={messages}
          onUpload={() => Promise.resolve('server-1')}
          onRemove={() => Promise.resolve()}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove report.pdf' }),
        ).toBeVisible()
      })

      await userEvent.click(
        screen.getByRole('button', { name: 'Remove report.pdf' }),
      )

      await waitFor(() => {
        expect(vi.mocked(announce)).toHaveBeenCalledWith(
          'report.pdf removed',
          'polite',
        )
      })
    })
  })

  describe('onChange', () => {
    test('calls onChange with the uploaded files after a successful upload', async () => {
      const onChange = vi.fn()
      render(
        <FileUpload
          messages={messages}
          onUpload={() => Promise.resolve('server-9')}
          onRemove={resolveRemove}
          onChange={onChange}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith([
          expect.objectContaining({ id: 'server-9', name: 'report.pdf' }),
        ])
      })
    })

    test('calls onChange with the remaining files after a removal', async () => {
      const onChange = vi.fn()
      render(
        <FileUpload
          messages={messages}
          onUpload={() => Promise.resolve('server-1')}
          onRemove={() => Promise.resolve()}
          onChange={onChange}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith([
          expect.objectContaining({ id: 'server-1' }),
        ])
      })

      await userEvent.click(
        screen.getByRole('button', { name: 'Remove report.pdf' }),
      )

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith([])
      })
    })

    test('does not call onChange on mount for defaultFiles', () => {
      const onChange = vi.fn()
      render(
        <FileUpload
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
          onChange={onChange}
          defaultFiles={[{ id: 'server-7', name: 'existing.pdf' }]}
        />,
      )

      expect(screen.getByText('existing.pdf')).toBeVisible()
      expect(onChange).not.toHaveBeenCalled()
    })

    test('does not call onChange when an upload fails', async () => {
      const onChange = vi.fn()
      render(
        <FileUpload
          messages={messages}
          onUpload={rejectWithMessage('Server unavailable')}
          onRemove={resolveRemove}
          onChange={onChange}
        />,
      )

      await userEvent.upload(getFileInput(), makeFile('report.pdf'))

      await waitFor(() => {
        expect(screen.getByText('Server unavailable')).toBeVisible()
      })
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('File Icons', () => {
    test('renders specific file icon for known extensions from defaultFiles', () => {
      const { container } = render(
        <FileUpload
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
          defaultFiles={[
            { id: '1', name: 'doc.pdf' },
            { id: '2', name: 'data.csv' },
            { id: '3', name: 'unknown.xyz' },
          ]}
        />,
      )

      expect(screen.getByText('doc.pdf')).toBeVisible()
      expect(screen.getByText('data.csv')).toBeVisible()
      expect(screen.getByText('unknown.xyz')).toBeVisible()
      expect(container.querySelectorAll('svg')).toHaveLength(7) // 1 browse + 3 file icons + 3 remove buttons
    })
  })

  describe('Deferred Upload Mode', () => {
    test('allows uploading and removing files without onUpload or onRemove props', async () => {
      const onChange = vi.fn()
      render(
        <FileUpload maxFiles={5} messages={messages} onChange={onChange} />,
      )

      const file = makeFile('contract.pdf')
      await userEvent.upload(getFileInput(), file)

      expect(screen.getByText('contract.pdf')).toBeVisible()

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith([
          expect.objectContaining({
            name: 'contract.pdf',
            file,
          }),
        ])
      })

      await userEvent.click(
        screen.getByRole('button', { name: 'Remove contract.pdf' }),
      )

      await waitFor(() => {
        expect(screen.queryByText('contract.pdf')).not.toBeInTheDocument()
        expect(onChange).toHaveBeenLastCalledWith([])
      })
    })
  })

  describe('File Links', () => {
    test('renders file name as a link when href is provided in defaultFiles', () => {
      render(
        <FileUpload
          messages={messages}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
          defaultFiles={[
            {
              id: '1',
              name: 'invoice.pdf',
              href: 'https://example.com/invoice.pdf',
            },
            { id: '2', name: 'receipt.pdf' },
          ]}
        />,
      )

      const link = screen.getByRole('link', { name: 'invoice.pdf' })
      expect(link).toHaveAttribute('href', 'https://example.com/invoice.pdf')
      expect(link).toHaveAttribute('target', '_blank')

      expect(
        screen.queryByRole('link', { name: 'receipt.pdf' }),
      ).not.toBeInTheDocument()
      expect(screen.getByText('receipt.pdf')).toBeVisible()
    })

    test('renders file name as a link computed via getFileHref for default and uploaded files', async () => {
      render(
        <FileUpload
          maxFiles={5}
          messages={messages}
          defaultFiles={[{ id: 'server-1', name: 'existing.pdf' }]}
          getFileHref={(file) => `https://example.com/files/${file.id}`}
          onUpload={resolveUpload}
          onRemove={resolveRemove}
        />,
      )

      expect(
        screen.getByRole('link', { name: 'existing.pdf' }),
      ).toHaveAttribute('href', 'https://example.com/files/server-1')

      await userEvent.upload(getFileInput(), makeFile('new.pdf'))

      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'new.pdf' })).toHaveAttribute(
          'href',
          'https://example.com/files/server-1',
        )
      })
    })
  })
})
