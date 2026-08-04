import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { Button } from '@/components/Button'

import { Tooltip, TooltipTrigger } from '.'

const CORNER_ALIGNMENTS = [
  ['top start', 'top'],
  ['top end', 'top'],
  ['bottom start', 'bottom'],
  ['bottom end', 'bottom'],
] as const

describe('Tooltip Component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const triggerTooltipViaFocus = async (
    trigger: HTMLElement,
  ): Promise<void> => {
    await act(async () => {
      trigger.focus()
      await vi.advanceTimersByTimeAsync(500)
    })
  }

  test('should display tooltip with title on focus', async () => {
    render(
      <TooltipTrigger delay={0}>
        <Button variant="primary">Trigger</Button>
        <Tooltip title="Tooltip title" />
      </TooltipTrigger>,
    )

    const trigger = screen.getByRole('button', { name: 'Trigger' })
    await triggerTooltipViaFocus(trigger)

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeVisible()
    })
    expect(screen.getByText('Tooltip title')).toBeVisible()
  })

  test('should display tooltip with title and description', async () => {
    render(
      <TooltipTrigger delay={0}>
        <Button variant="primary">Trigger</Button>
        <Tooltip title="Title" description="Description text" />
      </TooltipTrigger>,
    )

    const trigger = screen.getByRole('button', { name: 'Trigger' })
    await triggerTooltipViaFocus(trigger)

    await waitFor(() => {
      expect(screen.getByText('Title')).toBeVisible()
    })
    expect(screen.getByText('Description text')).toBeVisible()
  })

  test('should display tooltip with description only', async () => {
    render(
      <TooltipTrigger delay={0}>
        <Button variant="primary">Trigger</Button>
        <Tooltip description="Just a description" />
      </TooltipTrigger>,
    )

    const trigger = screen.getByRole('button', { name: 'Trigger' })
    await triggerTooltipViaFocus(trigger)

    await waitFor(() => {
      expect(screen.getByText('Just a description')).toBeVisible()
    })
  })

  test('should hide tooltip when focus leaves', async () => {
    render(
      <TooltipTrigger delay={0} closeDelay={0}>
        <Button variant="primary">Trigger</Button>
        <Tooltip title="Tooltip title" />
      </TooltipTrigger>,
    )

    const trigger = screen.getByRole('button', { name: 'Trigger' })
    await triggerTooltipViaFocus(trigger)

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeVisible()
    })

    await act(async () => {
      trigger.blur()
      await vi.advanceTimersByTimeAsync(500)
    })

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  test('should show tooltip on tab navigation', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(
      <TooltipTrigger delay={0}>
        <Button variant="primary">Trigger</Button>
        <Tooltip title="Focus tooltip" />
      </TooltipTrigger>,
    )

    await user.tab()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeVisible()
    })
    expect(screen.getByText('Focus tooltip')).toBeVisible()
  })

  test.each(CORNER_ALIGNMENTS)(
    'should apply correct arrow alignment class for %s alignment',
    async (alignment, basePlacement) => {
      render(
        <TooltipTrigger delay={0}>
          <Button variant="primary">Trigger</Button>
          <Tooltip title="Tooltip title" alignment={alignment} />
        </TooltipTrigger>,
      )

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await triggerTooltipViaFocus(trigger)

      const tooltip = await screen.findByRole('tooltip')
      const arrow = tooltip.querySelector('[data-placement]')

      const expectedClass = alignment.includes('start')
        ? 'arrow-start'
        : 'arrow-end'

      expect(tooltip).toHaveAttribute('data-placement', basePlacement)
      expect(arrow?.className).toContain(expectedClass)
    },
  )

  test('should remain open when controlled with isOpen', () => {
    render(
      <TooltipTrigger isOpen>
        <Button variant="primary">Trigger</Button>
        <Tooltip title="Controlled tooltip" />
      </TooltipTrigger>,
    )

    expect(screen.getByRole('tooltip')).toBeVisible()
    expect(screen.getByText('Controlled tooltip')).toBeVisible()
  })
})
