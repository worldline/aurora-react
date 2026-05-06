import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { ModalActions } from './ModalActions'

import { Modal } from '.'

const renderOpenModal = (props: Partial<Parameters<typeof Modal>[0]> = {}) => {
  const defaultProps = {
    title: 'Test Modal',
    isOpen: true,
    onOpenChange: vi.fn(),
    closeLabel: 'Close',
    children: <span>Modal content</span>,
  }

  return render(
    <Modal.Trigger>
      <button>trigger</button>
      <Modal {...defaultProps} {...props} />
    </Modal.Trigger>,
  )
}

describe('Modal', () => {
  describe('rendering', () => {
    test('should render title and content', () => {
      renderOpenModal()

      expect(
        screen.getByRole('dialog', { name: 'Test Modal' }),
      ).toBeInTheDocument()
      expect(screen.getByText('Modal content')).toBeInTheDocument()
    })

    test('should render with custom title', () => {
      renderOpenModal({ title: 'Custom Title' })

      expect(
        screen.getByRole('dialog', { name: 'Custom Title' }),
      ).toBeInTheDocument()
    })
  })

  describe('close button', () => {
    test('should render close button when closable is true', () => {
      renderOpenModal({ closable: true, closeLabel: 'Close' })

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    test('should not render close button when closable is false', () => {
      renderOpenModal({ closable: false })

      expect(
        screen.queryByRole('button', { name: 'Close' }),
      ).not.toBeInTheDocument()
    })

    test('should use custom close label for aria-label', () => {
      renderOpenModal({ closeLabel: 'Dismiss' })

      expect(
        screen.getByRole('button', { name: 'Dismiss' }),
      ).toBeInTheDocument()
    })

    test('should close modal when close button is pressed', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderOpenModal({ onOpenChange })

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('actions', () => {
    test('should render action buttons when actions are provided', () => {
      renderOpenModal({
        primaryAction: { label: 'Confirm', action: vi.fn() },
        secondaryAction: { label: 'Cancel', action: vi.fn() },
      })

      expect(
        screen.getByRole('button', { name: 'Confirm' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    test('should not render action buttons when no actions are provided', () => {
      renderOpenModal()

      expect(screen.queryAllByRole('button', { name: 'Label' })).toHaveLength(0)
    })

    test('should call primaryAction when primary button is pressed', async () => {
      const user = userEvent.setup()
      const handlePrimaryAction = vi.fn()

      renderOpenModal({
        primaryAction: { label: 'Confirm', action: handlePrimaryAction },
      })

      await user.click(screen.getByRole('button', { name: 'Confirm' }))

      expect(handlePrimaryAction).toHaveBeenCalledTimes(1)
    })

    test('should call secondaryAction when secondary button is pressed', async () => {
      const user = userEvent.setup()
      const handleSecondaryAction = vi.fn()

      renderOpenModal({
        secondaryAction: { label: 'Cancel', action: handleSecondaryAction },
      })

      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(handleSecondaryAction).toHaveBeenCalledTimes(1)
    })

    test('should hide secondary action when secondaryAction is not provided', () => {
      renderOpenModal({
        primaryAction: { label: 'OK', action: vi.fn() },
      })

      expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Cancel' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('keyboard interaction', () => {
    test('should close modal when Escape key is pressed', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderOpenModal({ onOpenChange })

      await user.keyboard('{Escape}')

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    test('should keep focus within modal when pressing Tab', async () => {
      const user = userEvent.setup()

      renderOpenModal({
        primaryAction: { label: 'Confirm', action: vi.fn() },
        secondaryAction: { label: 'Cancel', action: vi.fn() },
      })

      const closeButton = screen.getByRole('button', { name: 'Close' })
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      const confirmButton = screen.getByRole('button', { name: 'Confirm' })

      closeButton.focus()
      expect(closeButton).toHaveFocus()

      await user.tab()
      expect(cancelButton).toHaveFocus()

      await user.tab()
      expect(confirmButton).toHaveFocus()

      await user.tab()
      expect(closeButton).toHaveFocus()
    })

    test('should navigate backwards with Shift+Tab', async () => {
      const user = userEvent.setup()

      renderOpenModal({
        primaryAction: { label: 'Confirm', action: vi.fn() },
      })

      const closeButton = screen.getByRole('button', { name: 'Close' })
      const confirmButton = screen.getByRole('button', { name: 'Confirm' })

      closeButton.focus()

      await user.tab({ shift: true })
      expect(confirmButton).toHaveFocus()
    })

    test('should trigger close button with Enter key', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderOpenModal({ onOpenChange })

      const closeButton = screen.getByRole('button', { name: 'Close' })
      closeButton.focus()

      await user.keyboard('{Enter}')

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    test('should trigger action button with Enter key', async () => {
      const user = userEvent.setup()
      const handlePrimaryAction = vi.fn()

      renderOpenModal({
        primaryAction: { label: 'Confirm', action: handlePrimaryAction },
      })

      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      confirmButton.focus()

      await user.keyboard('{Enter}')

      expect(handlePrimaryAction).toHaveBeenCalledTimes(1)
    })

    test('should trigger action button with Space key', async () => {
      const user = userEvent.setup()
      const handlePrimaryAction = vi.fn()

      renderOpenModal({
        primaryAction: { label: 'Confirm', action: handlePrimaryAction },
      })

      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      confirmButton.focus()

      await user.keyboard(' ')

      expect(handlePrimaryAction).toHaveBeenCalledTimes(1)
    })
  })

  describe('accessibility', () => {
    test('should have dialog role', () => {
      renderOpenModal()

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    test('should be labelled by title', () => {
      renderOpenModal({ title: 'Accessible Modal' })

      expect(
        screen.getByRole('dialog', { name: 'Accessible Modal' }),
      ).toBeInTheDocument()
    })
  })
})

describe('ModalActions', () => {
  test('should render primary and secondary buttons', () => {
    render(
      <ModalActions
        primaryAction={{ label: 'Save', action: vi.fn() }}
        secondaryAction={{ label: 'Discard', action: vi.fn() }}
      />,
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument()
  })

  test('should hide secondary button when secondaryAction is not provided', () => {
    render(<ModalActions primaryAction={{ label: 'OK', action: vi.fn() }} />)

    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Cancel' }),
    ).not.toBeInTheDocument()
  })

  test('should call primaryAction when primary button is pressed', async () => {
    const user = userEvent.setup()
    const handlePrimaryAction = vi.fn()

    render(
      <ModalActions
        primaryAction={{ label: 'Confirm', action: handlePrimaryAction }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(handlePrimaryAction).toHaveBeenCalledTimes(1)
  })

  test('should call secondaryAction when secondary button is pressed', async () => {
    const user = userEvent.setup()
    const handleSecondaryAction = vi.fn()

    render(
      <ModalActions
        secondaryAction={{ label: 'Cancel', action: handleSecondaryAction }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(handleSecondaryAction).toHaveBeenCalledTimes(1)
  })
})
