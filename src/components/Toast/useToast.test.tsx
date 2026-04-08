import { renderHook } from '@testing-library/react'
import { type PropsWithChildren } from 'react'
import { describe, expect, test } from 'vitest'

import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

describe('useToast', () => {
  test('should throw error when used outside ToastProvider', () => {
    expect(() => {
      renderHook(() => useToast())
    }).toThrow('useToast must be used within a ToastProvider')
  })

  test('should return toast functions when used inside ToastProvider', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <ToastProvider>{children}</ToastProvider>
    )

    const { result } = renderHook(() => useToast(), { wrapper })

    expect(result.current).toHaveProperty('addToast')
    expect(result.current).toHaveProperty('closeToast')
    expect(result.current).toHaveProperty('closeAllToasts')
    expect(typeof result.current.addToast).toBe('function')
    expect(typeof result.current.closeToast).toBe('function')
    expect(typeof result.current.closeAllToasts).toBe('function')
  })
})
