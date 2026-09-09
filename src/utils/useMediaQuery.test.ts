import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { useMediaQuery } from './useMediaQuery'

interface FakeMediaQueryList {
  list: MediaQueryList
  emitChange: (matches: boolean) => void
  listenerCount: () => number
}

/**
 * Minimal stand-in for the `MediaQueryList` jsdom does not provide, keeping
 * hold of its listeners so a viewport change can be replayed.
 */
const createFakeMediaQueryList = (
  query: string,
  matches: boolean,
): FakeMediaQueryList => {
  const listeners = new Set<() => void>()
  const list = {
    matches,
    media: query,
    addEventListener: (_event: string, listener: () => void) => {
      listeners.add(listener)
    },
    removeEventListener: (_event: string, listener: () => void) => {
      listeners.delete(listener)
    },
  }

  return {
    list: list as unknown as MediaQueryList,
    emitChange: (nextMatches: boolean) => {
      list.matches = nextMatches
      for (const listener of listeners) {
        listener()
      }
    },
    listenerCount: () => listeners.size,
  }
}

const stubMatchMedia = (mediaQueryList: MediaQueryList): void => {
  vi.stubGlobal('matchMedia', () => mediaQueryList)
}

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('should report whether the query matches on the first render', () => {
    const matching = createFakeMediaQueryList('(width <= 480px)', true)
    stubMatchMedia(matching.list)

    const { result } = renderHook(() => useMediaQuery('(width <= 480px)'))

    expect(result.current).toBe(true)
  })

  test('should report a change of viewport', () => {
    const matching = createFakeMediaQueryList('(width <= 480px)', false)
    stubMatchMedia(matching.list)

    const { result } = renderHook(() => useMediaQuery('(width <= 480px)'))
    expect(result.current).toBe(false)

    act(() => {
      matching.emitChange(true)
    })

    expect(result.current).toBe(true)
  })

  test('should stop listening once the caller unmounts', () => {
    const matching = createFakeMediaQueryList('(width <= 480px)', false)
    stubMatchMedia(matching.list)

    const { unmount } = renderHook(() => useMediaQuery('(width <= 480px)'))
    expect(matching.listenerCount()).toBe(1)

    unmount()

    expect(matching.listenerCount()).toBe(0)
  })

  test('should report no match without matchMedia', () => {
    const { result } = renderHook(() => useMediaQuery('(width <= 480px)'))

    expect(result.current).toBe(false)
  })
})
