/* eslint-disable @typescript-eslint/unbound-method */
import { beforeEach, describe, expect, test, vi } from 'vitest'

import type { ToastContent } from './toast.service'

const mockAdd = vi.fn()
const mockClose = vi.fn()
const mockClear = vi.fn()

vi.mock('react-aria-components', () => ({
  UNSTABLE_ToastQueue: class MockToastQueue {
    add = mockAdd
    close = mockClose
    clear = mockClear
  },
}))

describe('ToastService', () => {
  beforeEach(() => {
    mockAdd.mockClear()
    mockClose.mockClear()
    mockClear.mockClear()
  })

  describe('addToast', () => {
    test('should add toast without timeout', async () => {
      const { toastService } = await import('./toast.service')

      const toastContent: ToastContent = {
        variant: 'success',
        title: 'Success',
        content: 'Operation completed successfully',
        closeLabel: 'Close',
      }

      toastService.addToast(toastContent)

      expect(mockAdd).toHaveBeenCalledTimes(1)
      expect(mockAdd).toHaveBeenCalledWith(
        {
          variant: 'success',
          title: 'Success',
          content: 'Operation completed successfully',
          closeLabel: 'Close',
          options: undefined,
        },
        { timeout: undefined },
      )
    })

    test('should add toast with timeout option', async () => {
      const { toastService } = await import('./toast.service')

      const toastContent: ToastContent = {
        variant: 'info',
        title: 'Information',
        content: 'This is an informational message',
        closeLabel: 'Dismiss',
        options: { timeout: 5000 },
      }

      toastService.addToast(toastContent)

      expect(mockAdd).toHaveBeenCalledTimes(1)
      expect(mockAdd).toHaveBeenCalledWith(
        {
          variant: 'info',
          title: 'Information',
          content: 'This is an informational message',
          closeLabel: 'Dismiss',
          options: { timeout: 5000 },
        },
        { timeout: 5000 },
      )
    })
  })

  describe('closeToast', () => {
    test('should close multiple toasts by id', async () => {
      const { toastService } = await import('./toast.service')

      toastService.closeToast('toast-1')
      toastService.closeToast('toast-2')

      expect(mockClose).toHaveBeenCalledTimes(2)
      expect(mockClose).toHaveBeenNthCalledWith(1, 'toast-1')
      expect(mockClose).toHaveBeenNthCalledWith(2, 'toast-2')
    })
  })

  describe('closeAllToasts', () => {
    test('should clear all toasts', async () => {
      const { toastService } = await import('./toast.service')

      toastService.closeAllToasts()

      expect(mockClear).toHaveBeenCalledTimes(1)
    })
  })

  describe('getQueue - no mock', async () => {
    const { toastService } = await import('./toast.service')

    test('should return the toast queue instance', () => {
      const queue = toastService.getQueue()

      expect(queue).toBeDefined()
      expect(queue.add).toBeDefined()
      expect(queue.close).toBeDefined()
      expect(queue.clear).toBeDefined()
    })

    test('should return the same queue instance on multiple calls', () => {
      const firstCall = toastService.getQueue()
      const secondCall = toastService.getQueue()

      expect(firstCall).toBe(secondCall)
    })
  })
})
