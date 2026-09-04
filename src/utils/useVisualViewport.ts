'use client'

import { useCallback, useSyncExternalStore } from 'react'

interface VisualViewportInsets {
  /**
   * Height of the visible viewport, in pixels. Shrinks when the on-screen
   * keyboard opens on mobile browsers.
   */
  height: number
  /**
   * Distance between the top of the layout viewport and the top of the
   * visible viewport, in pixels. Becomes non-zero when the browser scrolls
   * the page to keep a focused input visible above the keyboard.
   */
  offsetTop: number
}

const getServerSnapshot = (): VisualViewportInsets | undefined => undefined

/**
 * Cache holding the last snapshot handed out, so `getSnapshot` can return a
 * stable reference across renders instead of a new object every call, which
 * `useSyncExternalStore` would otherwise treat as a change on every render.
 */
const cache: { snapshot?: VisualViewportInsets } = {}

const getSnapshot = (): VisualViewportInsets | undefined => {
  const { visualViewport } = window

  if (!visualViewport) {
    return undefined
  }

  if (
    cache.snapshot?.height === visualViewport.height &&
    cache.snapshot.offsetTop === visualViewport.offsetTop
  ) {
    return cache.snapshot
  }

  cache.snapshot = {
    height: visualViewport.height,
    offsetTop: visualViewport.offsetTop,
  }

  return cache.snapshot
}

/**
 * Tracks the browser's `VisualViewport`, which shrinks when the on-screen
 * keyboard opens on mobile browsers such as iOS Safari, unlike the layout
 * viewport that `100vh`/`inset: 0` are computed against. Elements
 * fixed-positioned from these insets stay above the keyboard instead of
 * being covered by it.
 *
 * Only the `resize` event is tracked, not `scroll`: React Aria's own overlay
 * scroll lock already refocuses inputs without letting iOS Safari natively
 * scroll the page, so `offsetTop` should not otherwise move. Subscribing to
 * `scroll` as well would re-run this on every rubber-band/momentum tick,
 * fighting the browser's own touch handling.
 *
 * Returns `undefined` server-side and in browsers without the VisualViewport
 * API, so callers should fall back to their CSS-only layout in that case.
 */
const useVisualViewport = (): VisualViewportInsets | undefined => {
  const subscribe = useCallback((onStoreChange: () => void): (() => void) => {
    const { visualViewport } = window

    if (!visualViewport) {
      return () => undefined
    }

    visualViewport.addEventListener('resize', onStoreChange)

    return () => {
      visualViewport.removeEventListener('resize', onStoreChange)
    }
  }, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export { useVisualViewport, type VisualViewportInsets }
