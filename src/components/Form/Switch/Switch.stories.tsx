import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Form/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional label displayed next to the switch',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    description: {
      control: 'text',
      description: 'Optional helper text displayed below the label',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    defaultSelected: {
      control: 'boolean',
      description: 'Initial selected state (uncontrolled)',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    onChange: {
      action: 'changed',
      description: 'Handler called when the switch value changes',
      table: {
        type: { summary: '(isSelected: boolean) => void' },
        category: 'Behaviour',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {
    'aria-label': 'Switch feature',
  },
}

export const Selected: Story = {
  args: {
    'aria-label': 'Switch feature',
    defaultSelected: true,
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Enable notifications',
  },
}

export const WithLabelSelected: Story = {
  args: {
    label: 'Enable notifications',
    defaultSelected: true,
  },
}

export const WithLabelAndDescription: Story = {
  args: {
    label: 'Enable notifications',
    description: 'Receive push notifications for new messages',
  },
}

export const WithLabelAndDescriptionSelected: Story = {
  args: {
    label: 'Enable notifications',
    description: 'Receive push notifications for new messages',
    defaultSelected: true,
  },
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Switch feature',
    isDisabled: true,
  },
}

export const DisabledSelected: Story = {
  args: {
    'aria-label': 'Switch feature',
    isDisabled: true,
    defaultSelected: true,
  },
}

const ControlledSwitch = () => {
  const [isSelected, setIsSelected] = useState(true)

  return (
    <Switch
      label={isSelected ? 'On' : 'Off'}
      isSelected={isSelected}
      onChange={setIsSelected}
    />
  )
}

export const Controlled: Story = {
  render: () => <ControlledSwitch />,
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Switch label="Off" />
      <Switch label="On" defaultSelected />
      <Switch
        label="Disabled off"
        isDisabled
        description="Helper text for extra context"
      />
      <Switch label="Disabled on" isDisabled defaultSelected />
      <Switch
        label="With description"
        description="Helper text for extra context"
      />
      <Switch
        label="With description (on)"
        description="Helper text for extra context"
        defaultSelected
      />
    </div>
  ),
}
