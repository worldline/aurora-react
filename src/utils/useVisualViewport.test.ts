import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { useVisualViewport } from './useVisualViewport'

interface FakeVisualViewport {
  visualViewport: VisualViewport
  resize: (height: number, offsetTop?: number) => void
  listenerCount: (type: string) => number
}

/**
 * Minimal stand-in for the `VisualViewport` jsdom does not provide, keeping
 * hold of its listeners so a keyboard open/close can be replayed.
 */
const createFakeVisualViewport = (
  height: number,
  offsetTop = 0,
): FakeVisualViewport => {
  const listeners = new Map<string, Set<() => void>>()
  const visualViewport = {
    height,
    offsetTop,
    addEventListener: (type: string, listener: () => void) => {
      const typeListeners = listeners.get(type) ?? new Set()
      typeListeners.add(listener)
      listeners.set(type, typeListeners)
    },
    removeEventListener: (type: string, listener: () => void) => {
      listeners.get(type)?.delete(listener)
    },
  }

  return {
    visualViewport: visualViewport as unknown as VisualViewport,
    resize: (nextHeight: number, nextOffsetTop = 0) => {
      visualViewport.height = nextHeight
      visualViewport.offsetTop = nextOffsetTop
      for (const listener of listeners.get('resize') ?? []) {
        listener()
      }
    },
    listenerCount: (type: string) => listeners.get(type)?.size ?? 0,
  }
}

const stubVisualViewport = (visualViewport: VisualViewport): void => {
  vi.stubGlobal('visualViewport', visualViewport)
}

describe('useVisualViewport', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('should report the viewport size on the first render', () => {
    const fake = createFakeVisualViewport(640)
    stubVisualViewport(fake.visualViewport)

    const { result } = renderHook(() => useVisualViewport())

    expect(result.current).toEqual({ height: 640, offsetTop: 0 })
  })

  test('should report a shrunk height and offset once the keyboard opens', () => {
    const fake = createFakeVisualViewport(640)
    stubVisualViewport(fake.visualViewport)

    const { result } = renderHook(() => useVisualViewport())

    act(() => {
      fake.resize(320, 40)
    })

    expect(result.current).toEqual({ height: 320, offsetTop: 40 })
  })

  test('should stop listening once the caller unmounts', () => {
    const fake = createFakeVisualViewport(640)
    stubVisualViewport(fake.visualViewport)

    const { unmount } = renderHook(() => useVisualViewport())
    expect(fake.listenerCount('resize')).toBe(1)

    unmount()

    expect(fake.listenerCount('resize')).toBe(0)
  })

  test('should report undefined without the VisualViewport API', () => {
    vi.stubGlobal('visualViewport', undefined)

    const { result } = renderHook(() => useVisualViewport())

    expect(result.current).toBeUndefined()
  })
})
