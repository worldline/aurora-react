'use client'

import { useEffect, useRef, useState } from 'react'
import {
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipTriggerComponentProps,
} from 'react-aria-components'

import { useMediaQuery } from '@/utils/useMediaQuery'

import styles from './TooltipTrigger.module.css'

const TOUCH_MEDIA_QUERY = '(hover: none) and (pointer: coarse)'

/**
 * Wraps React Aria's `TooltipTrigger` so the tooltip also works on touch
 * devices. React Aria only opens tooltips on hover or focus-visible, neither
 * of which a tap produces, so on touch devices this instead opens the
 * tooltip on tap and closes it on a second tap, a tap elsewhere, focus
 * moving away, or Escape.
 */
const TooltipTrigger = ({
  children,
  isDisabled,
  ...props
}: TooltipTriggerComponentProps) => {
  const [isOpenOnTouch, setIsOpenOnTouch] = useState(false)
  const touchWrapperRef = useRef<HTMLSpanElement>(null)
  const isTouchDevice = useMediaQuery(TOUCH_MEDIA_QUERY)

  useEffect(() => {
    if (!isOpenOnTouch) {
      return undefined
    }

    const closeIfOutsideTap = (event: PointerEvent): void => {
      if (touchWrapperRef.current?.contains(event.target as Node)) {
        return
      }

      setIsOpenOnTouch(false)
    }

    document.addEventListener('pointerdown', closeIfOutsideTap)

    return () => {
      document.removeEventListener('pointerdown', closeIfOutsideTap)
    }
  }, [isOpenOnTouch])

  if (!isTouchDevice) {
    return (
      <AriaTooltipTrigger isDisabled={isDisabled} {...props}>
        {children}
      </AriaTooltipTrigger>
    )
  }

  const toggleOnTap = (): void => {
    if (isDisabled) {
      return
    }

    setIsOpenOnTouch((previousIsOpen) => !previousIsOpen)
  }

  return (
    <AriaTooltipTrigger
      {...props}
      isDisabled={isDisabled}
      isOpen={isOpenOnTouch}
      onOpenChange={setIsOpenOnTouch}
      shouldCloseOnPress={false}
    >
      <span
        ref={touchWrapperRef}
        className={styles['touch-wrapper']}
        onPointerUp={toggleOnTap}
      >
        {children}
      </span>
    </AriaTooltipTrigger>
  )
}

export { TooltipTrigger }
