import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  allCompletedSteps,
  allCompletedStepsMultiline,
  allIconSteps,
  allIconStepsTitleOnly,
  allNotStartedSteps,
  steps,
} from './Stepper.fixtures'

import { Stepper } from './index'

const meta = {
  title: 'components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['check', 'number', 'icon'],
      table: {
        type: { summary: "'check' | 'number' | 'icon'" },
        defaultValue: { summary: 'check' },
      },
    },
    connector: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
  args: {
    'aria-label': 'Steps label',
    titleElement: 'h2',
  },
  render: (args) => (
    <Stepper
      style={{
        maxWidth: '300px',
        width: '100%',
        ...args.style,
      }}
      {...args}
    />
  ),
} satisfies Meta<typeof Stepper>

export default meta

type Story = StoryObj<typeof meta>

export const CheckType: Story = {
  args: {
    type: 'check',
    connector: true,
    steps,
  },
}

export const NumberType: Story = {
  args: {
    type: 'number',
    connector: true,
    steps,
  },
}

export const IconType: Story = {
  args: {
    type: 'icon',
    connector: true,
    steps: allIconSteps,
  },
}

export const IconTypeTitleOnly: Story = {
  name: 'Icon Type - Only title',
  args: {
    type: 'icon',
    connector: false,
    chip: false,
    style: {
      rowGap: 'var(--au-spacing-xl)',
    },
    steps: allIconStepsTitleOnly,
  },
}

export const AllStepsNotStarted: Story = {
  args: {
    type: 'check',
    connector: true,
    steps: allNotStartedSteps,
  },
}

export const AllStepsCompleted: Story = {
  args: {
    type: 'check',
    connector: true,
    steps: allCompletedSteps,
  },
}

export const AllStepsCompletedMultiline: Story = {
  args: {
    type: 'check',
    connector: true,
    steps: allCompletedStepsMultiline,
  },
}
