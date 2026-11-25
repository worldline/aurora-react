import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { BlockIcon, PersonIcon, SettingsIcon } from '@/components/icons'
import { Menu } from '@/components/Menu'
import { Pressable } from '@/components/Pressable'
import { Typography } from '@/components/Typography'

import { Popover } from './index'
import styles from './Popover.stories.module.css'

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: false,
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
    triggerRef: {
      control: false,
      description:
        'A ref to the element that the popover should be anchored to. By default, it will anchor to the trigger element (e.g. Menu.Trigger), ' +
        'but you can use this prop to anchor to a different element.',
      table: {
        type: { summary: 'RefObject<HTMLElement>' },
        category: 'Positioning',
      },
    },
    placement: {
      control: 'select',
      options: [
        'bottom',
        'bottom left',
        'bottom right',
        'bottom start',
        'bottom end',
        'top',
        'top left',
        'top right',
        'top start',
        'top end',
        'left',
        'left top',
        'left bottom',
        'start',
        'start top',
        'start bottom',
        'right',
        'right top',
        'right bottom',
        'end',
        'end top',
        'end bottom',
      ],
      table: {
        category: 'Positioning',
      },
    },
    offset: {
      control: 'number',
      description:
        'The distance in pixels between the popover and its trigger element.',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'number' },
        category: 'Positioning',
      },
    },
    crossOffset: {
      control: 'number',
      description:
        'The distance in pixels to offset the popover along the cross axis.',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'number' },
        category: 'Positioning',
      },
    },
    shouldFlip: {
      control: 'boolean',
      description:
        'Whether the popover should automatically flip to the opposite side if there is not enough space in the preferred placement.',
      table: {
        type: { summary: 'boolean' },
        category: 'Positioning',
      },
    },
    isOpen: {
      control: 'boolean',
      description:
        'If not provided, the popover will be uncontrolled and manage its own open state.',
      table: {
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    defaultOpen: {
      control: 'boolean',
      description:
        'The initial open state of the popover when used in uncontrolled mode.',
      table: {
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    onOpenChange: {
      action: 'openChange',
      description:
        'Handler called when the open state of the popover changes. Receives the new open state as a parameter.',
      table: {
        type: { summary: '(isOpen: boolean) => void' },
        category: 'Behaviour',
      },
    },
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof Popover>

export const WithMenuAndPressable: Story = {
  render: (args) => (
    <Menu.Trigger>
      <Pressable>
        <div
          role="button"
          tabIndex={0}
          className={styles['custom-trigger']}
          aria-label="Open menu"
        >
          <PersonIcon aria-hidden />
        </div>
      </Pressable>
      <Popover {...args}>
        <Menu aria-label="Menu">
          <Menu.Item title="Option 1" leadingIcon={<BlockIcon />} />
          <Menu.Item title="Option 2" leadingIcon={<SettingsIcon />} />
        </Menu>
      </Popover>
    </Menu.Trigger>
  ),
}

export const WithMenuAndButton: Story = {
  render: (args) => (
    <Menu.Trigger>
      <Button variant="primary">Open menu</Button>
      <Popover {...args}>
        <Menu aria-label="Menu">
          <Menu.Item title="Option 1" leadingIcon={<BlockIcon />} />
          <Menu.Item title="Option 2" leadingIcon={<SettingsIcon />} />
        </Menu>
      </Popover>
    </Menu.Trigger>
  ),
}

const CustomAnchorExample = () => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef(null)

  return (
    <div className={styles['custom-anchor-container']}>
      <Button
        onPress={() => {
          setIsOpen(true)
        }}
      >
        Open
      </Button>
      <Typography
        ref={triggerRef}
        element="span"
        textStyle="bodyMd"
        className={styles['anchor-text']}
      >
        Popover will be positioned relative to me
      </Typography>
      <Popover
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom start"
      >
        <Card className={styles['popover-content']}>
          <Typography element="p" textStyle="bodyMd">
            I'm positioned relative to the custom anchor instead of the trigger.
          </Typography>
        </Card>
      </Popover>
    </div>
  )
}

export const WithCustomAnchor: Story = {
  render: () => <CustomAnchorExample />,
}
