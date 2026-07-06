import type { EmblaCarouselType } from 'embla-carousel'
import { useEffect, useState } from 'react'

interface UseDotButtonType {
  selectedIndex: number
  scrollSnaps: ReadonlyArray<number>
}

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined,
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [scrollSnaps, setScrollSnaps] = useState<ReadonlyArray<number>>([])

  useEffect(() => {
    if (!emblaApi) {
      return () => void 0
    }

    const onInit = (): void => {
      setScrollSnaps(emblaApi.scrollSnapList())
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    const onSelect = (): void => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelect).on('reInit', onInit)
    const timeout = setTimeout(onInit, 0)

    return () => {
      clearTimeout(timeout)
      emblaApi.off('select', onSelect).off('reInit', onInit)
    }
  }, [emblaApi])

  return {
    selectedIndex,
    scrollSnaps,
  }
}
