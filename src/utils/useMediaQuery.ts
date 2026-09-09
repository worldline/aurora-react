'use client'

import { useCallback, useSyncExternalStore } from 'react'

const getServerSnapshot = (): boolean => false

/**
 * jsdom and older browsers ship a `Window` without `matchMedia`, which the DOM
 * typings do not model, so the lookup is narrowed at runtime.
 */
const matchQuery = (query: string): MediaQueryList | undefined =>
  typeof window.matchMedia === 'function' ? window.matchMedia(query) : undefined

/**
 * Tracks whether a CSS media query currently matches, re-rendering whenever it
 * starts or stops matching.
 *
 * Returns `false` while server rendering and in environments without
 * `matchMedia`, so components relying on it render their desktop layout first
 * and correct themselves on hydration.
 *
 * @example
 * ```ts
 * const isMobile = useMediaQuery('(width <= 480px)')
 * ```
 */
const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onStoreChange: () => void): (() => void) => {
      const mediaQueryList = matchQuery(query)

      if (!mediaQueryList) {
        return () => undefined
      }

      mediaQueryList.addEventListener('change', onStoreChange)

      return () => {
        mediaQueryList.removeEventListener('change', onStoreChange)
      }
    },
    [query],
  )

  const getSnapshot = useCallback(
    (): boolean => matchQuery(query)?.matches ?? false,
    [query],
  )

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export { useMediaQuery }
