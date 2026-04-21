import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../Button'
import { Typography } from '../Typography'

import { Modal } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Modal title',
    closable: true,

    alignment: 'center',
    actionsAlignment: 'fill',
    primaryAction: { label: 'Label', action: () => undefined },
    secondaryAction: { label: 'Label', action: () => undefined },
    closeLabel: 'Close',
  },
  argTypes: {
    alignment: {
      control: 'select',
      options: ['center', 'left', 'right'],
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
    closable: {
      control: 'boolean',
      table: {
        category: 'Behavior',
      },
    },

    actionsAlignment: {
      control: 'select',
      options: ['fill', 'left', 'right'],
      table: {
        category: 'Actions',
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
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof Modal>

const ModalWithTrigger = (args: Story['args']) => {
  const [isOpen, setIsOpen] = useState(false)

  const close = () => {
    setIsOpen(false)
  }

  return (
    <Modal.Trigger>
      <Button
        onPress={() => {
          setIsOpen(true)
        }}
      >
        Open Modal
      </Button>
      <Modal
        {...args}
        title={args?.title ?? 'Modal title'}
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
      </Modal>
    </Modal.Trigger>
  )
}

export const CenterAligned: Story = {
  args: {
    alignment: 'center',
  },
  render: (args) => <ModalWithTrigger {...args} />,
}

export const LeftAligned: Story = {
  args: {
    alignment: 'left',
  },
  render: (args) => <ModalWithTrigger {...args} />,
}

export const RightAligned: Story = {
  args: {
    alignment: 'right',
  },
  render: (args) => <ModalWithTrigger {...args} />,
}

export const WithoutActions: Story = {
  args: {
    alignment: 'center',
    primaryAction: undefined,
    secondaryAction: undefined,
  },
  render: (args) => <ModalWithTrigger {...args} />,
}

export const WithoutCloseButton: Story = {
  args: {
    closable: false,
    alignment: 'center',
  },
  render: (args) => <ModalWithTrigger {...args} />,
}

export const WithoutSecondaryAction: Story = {
  args: {
    alignment: 'center',
    primaryAction: { label: 'OK', action: () => undefined },
    secondaryAction: undefined,
  },
  render: (args) => <ModalWithTrigger {...args} />,
}

export const WithoutSecondaryActionLeft: Story = {
  args: {
    alignment: 'left',
    primaryAction: { label: 'Continue', action: () => undefined },
    secondaryAction: undefined,
    children: (
      <>
        <Typography element="p" textStyle="bodyMd" textColor="contentPrimary">
          This modal only has a primary action button.
        </Typography>
        <Typography element="p" textStyle="bodyMd" textColor="contentPrimary">
          Use this pattern for informational dialogs that require
          acknowledgment.
        </Typography>
      </>
    ),
  },
  render: (args) => <ModalWithTrigger {...args} />,
}

export const LeftActionsAlignment: Story = {
  args: {
    alignment: 'left',
    actionsAlignment: 'left',
  },
  render: (args) => <ModalWithTrigger {...args} />,
}

export const RightActionsAlignment: Story = {
  args: {
    alignment: 'right',
    actionsAlignment: 'right',
  },
  render: (args) => <ModalWithTrigger {...args} />,
}
