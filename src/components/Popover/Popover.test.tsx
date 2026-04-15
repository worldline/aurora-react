import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Button } from '@/components/Button'
import { Menu } from '@/components/Menu'

import { Popover } from '.'

describe('Popover', () => {
  it('should render popover content when triggered', async () => {
    const user = userEvent.setup()

    render(
      <Menu.Trigger>
        <Button>Open</Button>
        <Popover>
          <div>Popover content</div>
        </Popover>
      </Menu.Trigger>,
    )

    expect(screen.queryByText('Popover content')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByText('Popover content')).toBeInTheDocument()
  })

  it('should support controlled open state', () => {
    render(
      <Menu.Trigger>
        <Button>Trigger</Button>
        <Popover isOpen>
          <div>Always visible</div>
        </Popover>
      </Menu.Trigger>,
    )

    expect(screen.getByText('Always visible')).toBeInTheDocument()
  })
})
