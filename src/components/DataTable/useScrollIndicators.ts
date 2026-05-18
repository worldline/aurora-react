import { type RefObject, useEffect } from 'react'

const updateScrollIndicators = (wrapper: HTMLElement): void => {
  const scrollLeft = Math.round(wrapper.scrollLeft)
  const maxScroll = wrapper.scrollWidth - wrapper.clientWidth
  const hasScroll = wrapper.scrollWidth > wrapper.clientWidth
  wrapper.toggleAttribute('data-scroll-left', scrollLeft > 0)
  wrapper.toggleAttribute('data-scroll-right', scrollLeft < maxScroll)
  wrapper.toggleAttribute('data-has-scroll', hasScroll)
}

export const useScrollIndicators = (
  wrapperRef: RefObject<HTMLDivElement | null>,
): void => {
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) {
      return () => void 0
    }

    const onScroll = (): void => {
      updateScrollIndicators(wrapper)
    }

    updateScrollIndicators(wrapper)

    const observer = new ResizeObserver(onScroll)
    observer.observe(wrapper)
    wrapper.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      wrapper.removeEventListener('scroll', onScroll)
    }
  }, [wrapperRef])
}
