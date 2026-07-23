'use client'

/* eslint-disable @eslint-react/no-children-map */
import cn from 'classnames'
import useEmblaCarousel from 'embla-carousel-react'
import { Children, type ReactElement } from 'react'

import { Button } from '../Button'
import { ChevronBackwardIcon, ChevronForwardIcon } from '../icons'
import styles from './Carousel.module.css'
import { useDotButton } from './useCarouselDots'
import { usePrevNextButtons } from './useCarouselPrevNext'

const ANIMATION_DURATION = 25

interface CarouselProps {
  /**
   * The slides to display. Each child must accept a `className` prop.
   */
  children: Array<ReactElement<{ className?: string }>>
  /**
   * Additional CSS class name applied to the carousel root element.
   */
  className?: string
  /**
   * Index of the slide to show on initial render.
   * @default 0
   */
  defaultIndex?: number
  /**
   * When true, disables slide transition animation.
   * @default false
   */
  reducedMotion?: boolean
  /**
   * Accessible label for the carousel region.
   */
  ariaLabel?: string
  /**
   * Returns the accessible label for a given slide.
   * Receives the 0-based slide index and the total number of slides.
   */
  slideAriaLabel: (index: number, total: number) => string
  /**
   * Accessible label for the previous-slide button.
   */
  prevAriaLabel: string
  /**
   * Accessible label for the next-slide button.
   */
  nextAriaLabel: string
}

const Carousel = ({
  children,
  className,
  defaultIndex = 0,
  reducedMotion = false,
  ariaLabel,
  slideAriaLabel,
  prevAriaLabel,
  nextAriaLabel,
}: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    duration: reducedMotion ? 0 : ANIMATION_DURATION,
    startIndex: defaultIndex,
  })

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi)

  const { selectedIndex, scrollSnaps } = useDotButton(emblaApi)

  return (
    <div
      className={cn(styles.embla, className)}
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      role="region"
    >
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {Children.map(children, (slide, index) => (
            <div
              className={cn(styles.slide)}
              aria-roledescription="slide"
              role="group"
              aria-label={slideAriaLabel(index, children.length)}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <Button
          leadingIcon={<ChevronBackwardIcon aria-label={prevAriaLabel} />}
          onClick={onPrevButtonClick}
          isDisabled={prevBtnDisabled}
          variant="link"
          className={styles['navigation-arrow']}
        />

        <div className={styles.dots}>
          {scrollSnaps.map((snap, index) => (
            <span
              key={snap}
              aria-hidden
              className={cn(styles.dot, {
                [styles.selected]: index === selectedIndex,
              })}
            />
          ))}
        </div>
        <Button
          leadingIcon={<ChevronForwardIcon aria-label={nextAriaLabel} />}
          onClick={onNextButtonClick}
          isDisabled={nextBtnDisabled}
          variant="link"
          className={styles['navigation-arrow']}
        />
      </div>
    </div>
  )
}

export { Carousel }
export type { CarouselProps }
