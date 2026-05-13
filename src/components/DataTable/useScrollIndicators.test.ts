import { renderHook } from '@testing-library/react'
import type { RefObject } from 'react'
import { beforeEach, describe, expect, type Mock, test, vi } from 'vitest'

import { useScrollIndicators } from './useScrollIndicators'

let resizeObserverObserve: Mock
let resizeObserverDisconnect: Mock

beforeEach(() => {
  resizeObserverObserve = vi.fn()
  resizeObserverDisconnect = vi.fn()

  global.ResizeObserver = class ResizeObserver {
    observe(element: Element) {
      resizeObserverObserve(element)
    }
    unobserve = vi.fn()
    disconnect() {
      resizeObserverDisconnect()
    }
  }
})

const createWrapper = ({
  scrollLeft = 0,
  scrollWidth = 100,
  clientWidth = 100,
}: {
  scrollLeft?: number
  scrollWidth?: number
  clientWidth?: number
} = {}): HTMLDivElement => {
  const element = document.createElement('div')

  const properties = { scrollLeft, scrollWidth, clientWidth }
  Object.entries(properties).forEach(([key, value]) => {
    Object.defineProperty(element, key, {
      value,
      writable: true,
      configurable: true,
    })
  })

  return element
}

describe('useScrollIndicators', () => {
  test('should not observe when ref is null', () => {
    const ref: RefObject<HTMLDivElement | null> = { current: null }
    renderHook(() => {
      useScrollIndicators(ref)
    })
    expect(resizeObserverObserve).not.toHaveBeenCalled()
  })

  test('should update indicators on scroll event', () => {
    const wrapper = createWrapper({
      scrollLeft: 0,
      scrollWidth: 200,
      clientWidth: 100,
    })
    const ref: RefObject<HTMLDivElement | null> = { current: wrapper }

    renderHook(() => {
      useScrollIndicators(ref)
    })

    expect(wrapper.hasAttribute('data-scroll-right')).toBe(true)

    Object.defineProperty(wrapper, 'scrollLeft', {
      value: 50,
      configurable: true,
    })
    wrapper.dispatchEvent(new Event('scroll'))

    expect(wrapper.hasAttribute('data-scroll-left')).toBe(true)
    expect(wrapper.hasAttribute('data-scroll-right')).toBe(true)
  })

  test('should clean up observer and listener on unmount', () => {
    const wrapper = createWrapper()
    const removeEventListenerSpy = vi.spyOn(wrapper, 'removeEventListener')
    const ref: RefObject<HTMLDivElement | null> = { current: wrapper }

    const { unmount } = renderHook(() => {
      useScrollIndicators(ref)
    })
    unmount()

    expect(resizeObserverDisconnect).toHaveBeenCalled()
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    )
  })
})
