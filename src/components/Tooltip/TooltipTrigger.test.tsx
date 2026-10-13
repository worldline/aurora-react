import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { Button } from '@/components/Button'

import { Tooltip, TooltipTrigger } from '.'

/** jsdom ships no `matchMedia`, so touch capability has to be faked outright. */
const stubTouchDevice = ({
  isTouchDevice,
}: {
  isTouchDevice: boolean
}): void => {
  vi.stubGlobal(
    'matchMedia',
    (query: string): MediaQueryList =>
      ({
        matches: isTouchDevice,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  )
}

describe('TooltipTrigger on touch devices', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    stubTouchDevice({ isTouchDevice: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  test('should open the tooltip when the trigger is tapped', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(
      <TooltipTrigger>
        <Button variant="primary">Help</Button>
        <Tooltip title="Helpful information" />
      </TooltipTrigger>,
    )

    const trigger = screen.getByRole('button', { name: 'Help' })
    await user.pointer({ keys: '[TouchA]', target: trigger })

    expect(screen.getByRole('tooltip')).toBeVisible()
    expect(screen.getByText('Helpful information')).toBeVisible()
  })

  test('should close the tooltip when the trigger is tapped again', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(
      <TooltipTrigger>
        <Button variant="primary">Help</Button>
        <Tooltip title="Helpful information" />
      </TooltipTrigger>,
    )

    const trigger = screen.getByRole('button', { name: 'Help' })
    await user.pointer({ keys: '[TouchA]', target: trigger })
    expect(screen.getByRole('tooltip')).toBeVisible()

    await user.pointer({ keys: '[TouchA]', target: trigger })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  test('should close the tooltip when tapping outside of it', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(
      <div>
        <TooltipTrigger>
          <Button variant="primary">Help</Button>
          <Tooltip title="Helpful information" />
        </TooltipTrigger>
        <Button variant="secondary">Elsewhere</Button>
      </div>,
    )

    const trigger = screen.getByRole('button', { name: 'Help' })
    await user.pointer({ keys: '[TouchA]', target: trigger })
    expect(screen.getByRole('tooltip')).toBeVisible()

    const elsewhere = screen.getByRole('button', { name: 'Elsewhere' })
    await user.pointer({ keys: '[TouchA]', target: elsewhere })

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  test('should not open the tooltip when the trigger is disabled', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(
      <TooltipTrigger isDisabled>
        <Button variant="primary">Help</Button>
        <Tooltip title="Helpful information" />
      </TooltipTrigger>,
    )

    const trigger = screen.getByRole('button', { name: 'Help' })
    await user.pointer({ keys: '[TouchA]', target: trigger })

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
