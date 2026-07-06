import type { EmblaCarouselType } from 'embla-carousel'
import { useCallback, useEffect, useState } from 'react'

interface UsePrevNextButtonsType {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState<boolean>(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState<boolean>(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) {
      return
    }
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) {
      return
    }
    emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) {
      return () => void 0
    }

    const updateButtonStates = (): void => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev())
      setNextBtnDisabled(!emblaApi.canScrollNext())
    }

    emblaApi.on('select', updateButtonStates).on('reInit', updateButtonStates)
    const timeout = setTimeout(updateButtonStates, 0)

    return () => {
      clearTimeout(timeout)
      emblaApi
        .off('select', updateButtonStates)
        .off('reInit', updateButtonStates)
    }
  }, [emblaApi])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  }
}
