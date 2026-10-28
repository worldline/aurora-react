import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../Button'
import { Typography } from '../Typography'
import { BottomSheet } from './BottomSheet'

const meta: Meta<typeof BottomSheet> = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Bottom sheet title',
    height: 'sm',
    primaryAction: { label: 'Label', action: () => undefined },
    secondaryAction: { label: 'Label', action: () => undefined },
    closeLabel: 'Close',
  },
  argTypes: {
    height: {
      control: 'select',
      options: ['content', 'sm', 'md', 'lg'],
      table: {
        category: 'Layout',
      },
    },
    title: {
      control: 'text',
      table: {
        category: 'Content',
      },
    },
    children: {
      control: 'text',
      table: {
        category: 'Content',
      },
    },
    contentPadding: {
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
        category: 'Layout',
      },
    },
    primaryAction: {
      control: 'object',
      table: {
        category: 'Actions',
      },
    },
    secondaryAction: {
      control: 'object',
      table: {
        category: 'Actions',
      },
    },
    closeLabel: {
      control: 'text',
      table: {
        category: 'Accessibility',
      },
    },
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomSheet>

export default meta
type Story = StoryObj<typeof BottomSheet>

const BottomSheetWithTrigger = (args: Story['args']) => {
  const [isOpen, setIsOpen] = useState(false)

  const close = () => {
    setIsOpen(false)
  }

  return (
    <BottomSheet.Trigger>
      <Button
        onPress={() => {
          setIsOpen(true)
        }}
      >
        Open bottom sheet
      </Button>
      <BottomSheet
        {...args}
        title={args?.title ?? 'Bottom sheet title'}
        closeLabel={args?.closeLabel ?? 'Close'}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        primaryAction={
          args?.primaryAction
            ? { label: args.primaryAction.label, action: close }
            : undefined
        }
        secondaryAction={
          args?.secondaryAction
            ? { label: args.secondaryAction.label, action: close }
            : undefined
        }
      >
        {args?.children ?? (
          <Typography element="p" textStyle="bodyMd" textColor="contentPrimary">
            Content here
          </Typography>
        )}
      </BottomSheet>
    </BottomSheet.Trigger>
  )
}

export const Small: Story = {
  args: {
    height: 'sm',
  },
  render: (args) => <BottomSheetWithTrigger {...args} />,
}

export const Medium: Story = {
  args: {
    height: 'md',
  },
  render: (args) => <BottomSheetWithTrigger {...args} />,
}

export const Large: Story = {
  args: {
    height: 'lg',
  },
  render: (args) => <BottomSheetWithTrigger {...args} />,
}

export const Content: Story = {
  args: {
    height: 'content',
  },
  render: (args) => <BottomSheetWithTrigger {...args} />,
}

export const LongHeadline: Story = {
  args: {
    height: 'sm',
    title:
      'A very long bottom sheet headline that wraps across multiple lines to demonstrate how the header handles longer titles',
  },
  render: (args) => <BottomSheetWithTrigger {...args} />,
}

export const WithoutActions: Story = {
  args: {
    height: 'sm',
    primaryAction: undefined,
    secondaryAction: undefined,
  },
  render: (args) => <BottomSheetWithTrigger {...args} />,
}

export const WithoutSecondaryAction: Story = {
  args: {
    height: 'sm',
    primaryAction: { label: 'OK', action: () => undefined },
    secondaryAction: undefined,
  },
  render: (args) => (
    <BottomSheetWithTrigger {...args}>
      {/* <div
        style={{ height: 500, background: 'lightgray', width: '100%' }}
      ></div> */}
    </BottomSheetWithTrigger>
  ),
}

export const WithoutContentPadding: Story = {
  args: {
    height: 'sm',
    contentPadding: false,
    primaryAction: undefined,
    secondaryAction: undefined,
    // children: (
    //   <div style={{ height: 500, width: '100%', background: 'lightgray' }} />
    // ),
  },
  render: (args) => <BottomSheetWithTrigger {...args} />,
}
