import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { Toast } from './Toast'

vi.mock('@worldline/aurora-design-tokens/variables', () => ({
  MotionFadeOutDuration: '300ms',
}))

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('rendering', () => {
    test('should render toast with title and content', () => {
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        content: {
          variant: 'success' as const,
          title: 'Success Title',
          content: 'Success message content',
          closeLabel: 'Close',
        },
      }

      render(<Toast toast={toast} onClose={mockOnClose} />)

      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent('Success Title')
      expect(alert).toHaveTextContent('Success message content')
    })
  })

  describe('close button accessibility', () => {
    test('should render close button with correct closeLabel', () => {
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        content: {
          variant: 'success' as const,
          title: 'Title',
          content: 'Content',
          closeLabel: 'Close notification',
        },
      }

      render(<Toast toast={toast} onClose={mockOnClose} />)

      const closeButton = screen.getByRole('button', {
        name: 'Close notification',
      })
      expect(closeButton).toBeInTheDocument()
    })

    test('should render close button with custom closeLabel', () => {
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        content: {
          variant: 'error' as const,
          title: 'Error',
          content: 'An error occurred',
          closeLabel: 'Dismiss error',
        },
      }

      render(<Toast toast={toast} onClose={mockOnClose} />)

      const closeButton = screen.getByRole('button', { name: 'Dismiss error' })
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('close functionality', () => {
    test('should call onClose after timeout when close button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        content: {
          variant: 'success' as const,
          title: 'Success',
          content: 'Operation completed',
          closeLabel: 'Custom Close',
        },
      }

      render(<Toast toast={toast} onClose={mockOnClose} />)

      const closeButton = screen.getByRole('button', { name: 'Custom Close' })

      await user.click(closeButton)

      expect(mockOnClose).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    test('should not call onClose before timeout completes', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        content: {
          variant: 'info' as const,
          title: 'Info',
          content: 'Information message',
          closeLabel: 'OK',
        },
      }

      render(<Toast toast={toast} onClose={mockOnClose} />)

      const closeButton = screen.getByRole('button', { name: 'OK' })
      await user.click(closeButton)

      // Advance time but not enough to trigger onClose
      vi.advanceTimersByTime(200)

      expect(mockOnClose).not.toHaveBeenCalled()

      // Complete the timeout
      vi.advanceTimersByTime(100)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    test('should apply fade-out class when close button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        content: {
          variant: 'success' as const,
          title: 'Success',
          content: 'Done',
          closeLabel: 'Close',
        },
      }

      render(<Toast toast={toast} onClose={mockOnClose} />)

      const alert = screen.getByRole('alert')

      expect(alert).not.toHaveClass('toast-fade-out')

      const closeButton = screen.getByRole('button', { name: 'Close' })
      await user.click(closeButton)

      expect(alert).toHaveClass('toast-fade-out')
    })

    test('should cleanup timeout on unmount', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        content: {
          variant: 'success' as const,
          title: 'Success',
          content: 'Done',
          closeLabel: 'Close',
        },
      }

      const { unmount } = render(<Toast toast={toast} onClose={mockOnClose} />)

      const closeButton = screen.getByRole('button', { name: 'Close' })
      await user.click(closeButton)

      // Unmount before timeout completes
      unmount()

      vi.advanceTimersByTime(300)

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('auto close', () => {
    test('should auto close toast after timeout duration', () => {
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        timeout: 5000,
        content: {
          variant: 'info' as const,
          title: 'Auto close',
          content: 'This will auto close',
          closeLabel: 'Close',
        },
      }

      render(<Toast toast={toast} onClose={mockOnClose} />)

      // Toast should be visible initially
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(mockOnClose).not.toHaveBeenCalled()

      // Advance time but not enough to trigger fade-out (timeout - fadeOutDuration)
      act(() => {
        vi.advanceTimersByTime(4000)
      })
      expect(mockOnClose).not.toHaveBeenCalled()
      expect(alert).not.toHaveClass('toast-fade-out')

      // Advance to trigger fade-out (4700ms total = 5000 - 300)
      act(() => {
        vi.advanceTimersByTime(700)
      })
      expect(alert).toHaveClass('toast-fade-out')
      expect(mockOnClose).not.toHaveBeenCalled()

      // Complete the fade-out duration (300ms more = 5000ms total)
      act(() => {
        vi.advanceTimersByTime(300)
      })

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    test('should apply fade-out class before calling onClose during auto close', () => {
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        timeout: 3000,
        content: {
          variant: 'success' as const,
          title: 'Success',
          content: 'Auto closing',
          closeLabel: 'Close',
        },
      }

      render(<Toast toast={toast} onClose={mockOnClose} />)

      const alert = screen.getByRole('alert')
      expect(alert).not.toHaveClass('toast-fade-out')

      act(() => {
        vi.advanceTimersByTime(2700)
      })

      expect(alert).toHaveClass('toast-fade-out')
      expect(mockOnClose).not.toHaveBeenCalled()

      // Complete the fade-out duration
      act(() => {
        vi.advanceTimersByTime(300)
      })

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    test('should cleanup auto close timeout on unmount', () => {
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        timeout: 4000,
        content: {
          variant: 'warning' as const,
          title: 'Warning',
          content: 'This will be unmounted',
          closeLabel: 'Close',
        },
      }

      const { unmount } = render(<Toast toast={toast} onClose={mockOnClose} />)

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      unmount()

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    test('should not auto close when timeout is not provided', () => {
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        content: {
          variant: 'error' as const,
          title: 'Error',
          content: 'No auto close',
          closeLabel: 'Close',
        },
      }

      render(<Toast toast={toast} onClose={mockOnClose} />)

      // Advance time significantly
      act(() => {
        vi.advanceTimersByTime(10000)
      })

      // Should not auto close without timeout
      expect(mockOnClose).not.toHaveBeenCalled()

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(alert).not.toHaveClass('toast-fade-out')
    })
  })

  describe('custom className', () => {
    test('should combine custom className with fade-out class', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const mockOnClose = vi.fn()
      const toast = {
        key: 'toast-1',
        content: {
          variant: 'success' as const,
          title: 'Title',
          content: 'Content',
          closeLabel: 'Close',
        },
      }

      render(
        <Toast toast={toast} onClose={mockOnClose} className="custom-class" />,
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('custom-class')
      expect(alert).not.toHaveClass('toast-fade-out')

      const closeButton = screen.getByRole('button', { name: 'Close' })
      await user.click(closeButton)

      expect(alert).toHaveClass('custom-class')
      expect(alert).toHaveClass('toast-fade-out')
    })
  })
})
