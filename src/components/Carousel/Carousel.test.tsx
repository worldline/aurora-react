import { act, fireEvent, render, screen } from '@testing-library/react'
import type { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { Carousel } from './index'

vi.mock('embla-carousel-react')

const makeEmblaApi = ({
  canScrollPrev = false,
  canScrollNext = true,
  scrollSnaps = [0, 1, 2],
  selectedSnap = 0,
} = {}): EmblaCarouselType =>
  ({
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    canScrollPrev: vi.fn(() => canScrollPrev),
    canScrollNext: vi.fn(() => canScrollNext),
    scrollSnapList: vi.fn(() => scrollSnaps),
    selectedScrollSnap: vi.fn(() => selectedSnap),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
  }) as unknown as EmblaCarouselType

const defaultProps = {
  ariaLabel: 'Featured items',
  slideAriaLabel: (index: number, total: number) =>
    `Slide ${String(index + 1)} of ${String(total)}`,
  prevAriaLabel: 'Previous slide',
  nextAriaLabel: 'Next slide',
}

const flushInit = (): Promise<void> =>
  act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
  })

const renderCarousel = (emblaApi = makeEmblaApi()) => {
  vi.mocked(useEmblaCarousel).mockReturnValue([vi.fn(), emblaApi])
  return {
    emblaApi,
    ...render(
      <Carousel {...defaultProps}>
        <div>Slide A</div>
        <div>Slide B</div>
        <div>Slide C</div>
      </Carousel>,
    ),
  }
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('Carousel', () => {
  test('should render the correct carousel structure', () => {
    vi.mocked(useEmblaCarousel).mockReturnValue([vi.fn(), makeEmblaApi()])
    const { container } = render(
      <Carousel {...defaultProps} className="my-custom-class">
        <div>Slide A</div>
        <div>Slide B</div>
        <div>Slide C</div>
      </Carousel>,
    )

    expect(container.firstChild).toHaveClass('my-custom-class')

    const region = screen.getByRole('region', { name: 'Featured items' })
    expect(region).toBeInTheDocument()
    expect(region).toHaveAttribute('aria-roledescription', 'carousel')

    const slides = screen.getAllByRole('group')
    expect(slides).toHaveLength(3)
    slides.forEach((slide) => {
      expect(slide).toHaveAttribute('aria-roledescription', 'slide')
    })

    expect(
      screen.getByRole('group', { name: 'Slide 1 of 3' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Slide 2 of 3' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Slide 3 of 3' }),
    ).toBeInTheDocument()

    expect(screen.getByText('Slide A')).toBeInTheDocument()
    expect(screen.getByText('Slide B')).toBeInTheDocument()
    expect(screen.getByText('Slide C')).toBeInTheDocument()
  })

  describe('Navigation buttons', () => {
    test('should render prev and next buttons with accessible labels', () => {
      renderCarousel()

      expect(
        screen.getByRole('img', { name: 'Previous slide' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('img', { name: 'Next slide' }),
      ).toBeInTheDocument()
    })

    test('should disable prev button and enable next button when at first slide', async () => {
      renderCarousel(
        makeEmblaApi({ canScrollPrev: false, canScrollNext: true }),
      )

      await flushInit()

      const [prevButton, nextButton] = screen.getAllByRole('button')
      expect(prevButton).toHaveAttribute('data-disabled', 'true')
      expect(nextButton).not.toHaveAttribute('data-disabled')
    })

    test('should enable prev button and disable next button when at last slide', async () => {
      renderCarousel(
        makeEmblaApi({ canScrollPrev: true, canScrollNext: false }),
      )

      await flushInit()

      const [prevButton, nextButton] = screen.getAllByRole('button')
      expect(prevButton).not.toHaveAttribute('data-disabled')
      expect(nextButton).toHaveAttribute('data-disabled', 'true')
    })

    test('should call scrollPrev when prev button is clicked', async () => {
      const { emblaApi } = renderCarousel(
        makeEmblaApi({ canScrollPrev: true, canScrollNext: true }),
      )

      await flushInit()

      const [prevButton] = screen.getAllByRole('button')
      fireEvent.click(prevButton)

      expect(emblaApi.scrollPrev).toHaveBeenCalledTimes(1)
    })

    test('should call scrollNext when next button is clicked', async () => {
      const { emblaApi } = renderCarousel(
        makeEmblaApi({ canScrollPrev: true, canScrollNext: true }),
      )

      await flushInit()

      const [, nextButton] = screen.getAllByRole('button')
      fireEvent.click(nextButton)

      expect(emblaApi.scrollNext).toHaveBeenCalledTimes(1)
    })
  })

  describe('Dots', () => {
    test('should render no dots before initialisation', () => {
      renderCarousel()

      const dots = document.querySelectorAll('[aria-hidden]')
      expect(dots).toHaveLength(0)
    })

    test('should render one dot per scroll snap after initialisation', async () => {
      renderCarousel(makeEmblaApi({ scrollSnaps: [0, 1, 2] }))

      await flushInit()

      const dots = document.querySelectorAll('[aria-hidden]')
      expect(dots).toHaveLength(3)
    })

    test('should mark the selected dot with the selected class', async () => {
      renderCarousel(makeEmblaApi({ scrollSnaps: [0, 1, 2], selectedSnap: 1 }))

      await flushInit()

      const dots = document.querySelectorAll('[aria-hidden]')
      expect(dots[0]).not.toHaveClass('selected')
      expect(dots[1]).toHaveClass('selected')
      expect(dots[2]).not.toHaveClass('selected')
    })
  })
})
