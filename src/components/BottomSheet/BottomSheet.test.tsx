import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { BottomSheet } from '.'

const renderOpenBottomSheet = (
  props: Partial<Parameters<typeof BottomSheet>[0]> = {},
) => {
  const defaultProps = {
    title: 'Test bottom sheet',
    isOpen: true,
    onOpenChange: vi.fn(),
    closeLabel: 'Close',
    children: <span>Bottom sheet content</span>,
  }

  return render(
    <BottomSheet.Trigger>
      <button>trigger</button>
      <BottomSheet {...defaultProps} {...props} />
    </BottomSheet.Trigger>,
  )
}

describe('BottomSheet', () => {
  describe('rendering', () => {
    test('should render title and content', () => {
      renderOpenBottomSheet()

      expect(
        screen.getByRole('dialog', { name: 'Test bottom sheet' }),
      ).toBeInTheDocument()
      expect(screen.getByText('Bottom sheet content')).toBeInTheDocument()
    })

    test('should render with custom title', () => {
      renderOpenBottomSheet({ title: 'Custom title' })

      expect(
        screen.getByRole('dialog', { name: 'Custom title' }),
      ).toBeInTheDocument()
    })

    test('should inset the body from the sheet edges by default', () => {
      renderOpenBottomSheet()

      expect(
        screen.getByText('Bottom sheet content').parentElement,
      ).toHaveClass('content-padded')
    })

    test('should let the body run edge to edge when padding is turned off', () => {
      renderOpenBottomSheet({ contentPadding: false })

      expect(
        screen.getByText('Bottom sheet content').parentElement,
      ).not.toHaveClass('content-padded')
    })
  })

  describe('close button', () => {
    test('should always render the close button with the provided label', () => {
      renderOpenBottomSheet({ closeLabel: 'Close' })

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    test('should close the bottom sheet when the close button is pressed', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderOpenBottomSheet({ onOpenChange })

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('actions', () => {
    test('should render action buttons when actions are provided', () => {
      renderOpenBottomSheet({
        primaryAction: { label: 'Confirm', action: vi.fn() },
        secondaryAction: { label: 'Cancel', action: vi.fn() },
      })

      expect(
        screen.getByRole('button', { name: 'Confirm' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    test('should not render action buttons when no actions are provided', () => {
      renderOpenBottomSheet()

      expect(
        screen.queryByRole('button', { name: 'Confirm' }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Cancel' }),
      ).not.toBeInTheDocument()
    })

    test('should call primaryAction when primary button is pressed', async () => {
      const user = userEvent.setup()
      const handlePrimaryAction = vi.fn()

      renderOpenBottomSheet({
        primaryAction: { label: 'Confirm', action: handlePrimaryAction },
      })

      await user.click(screen.getByRole('button', { name: 'Confirm' }))

      expect(handlePrimaryAction).toHaveBeenCalledTimes(1)
    })

    test('should call secondaryAction when secondary button is pressed', async () => {
      const user = userEvent.setup()
      const handleSecondaryAction = vi.fn()

      renderOpenBottomSheet({
        secondaryAction: { label: 'Cancel', action: handleSecondaryAction },
      })

      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(handleSecondaryAction).toHaveBeenCalledTimes(1)
    })

    test('should hide secondary action when secondaryAction is not provided', () => {
      renderOpenBottomSheet({
        primaryAction: { label: 'OK', action: vi.fn() },
      })

      expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Cancel' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('controlled state', () => {
    test('should not self-toggle and rely on the parent for open state', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderOpenBottomSheet({ isOpen: true, onOpenChange })

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('keyboard interaction', () => {
    test('should close the bottom sheet when Escape key is pressed', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderOpenBottomSheet({ onOpenChange })

      await user.keyboard('{Escape}')

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('accessibility', () => {
    test('should have dialog role', () => {
      renderOpenBottomSheet()

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    test('should be labelled by title', () => {
      renderOpenBottomSheet({ title: 'Accessible bottom sheet' })

      expect(
        screen.getByRole('dialog', { name: 'Accessible bottom sheet' }),
      ).toBeInTheDocument()
    })
  })
})
