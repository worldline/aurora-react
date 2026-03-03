import type { Meta, StoryObj } from '@storybook/react-vite'

import { Stepper } from './index'

const meta = {
  title: 'components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <Stepper
      {...args}
      style={{
        maxWidth: '300px',
        width: '100%',
      }}
    />
  ),
} satisfies Meta<typeof Stepper>

export default meta

type Story = StoryObj<typeof meta>

export const CheckType: Story = {
  args: {
    'aria-label': 'Steps label',
    titleElement: 'h2',
    type: 'check',
    connector: true,
    steps: [
      {
        id: 'step-1',
        title: 'Step 1',
        description: 'Description for step 1',
        date: '8 January 2025',
        status: { label: 'Status 1', type: 'complete' },
      },
      {
        id: 'step-2',
        title: 'Step 2',
        description: 'Description for step 2',
        date: '9 January 2025',
        status: { label: 'Status 2', type: 'complete' },
      },
      {
        id: 'step-3',
        title: 'Step 3',
        description: 'Description for step 3',
        status: { label: 'Status 3', type: 'in-progress' },
      },
      {
        id: 'step-4',
        title: 'Step 4',
        description: 'Description for step 4',
        status: { label: 'Not started', type: 'not-started' },
      },
    ],
  },
}

export const NumberType: Story = {
  args: {
    'aria-label': 'Steps label',
    titleElement: 'h2',
    type: 'number',
    connector: true,
    steps: [
      {
        id: 'step-1',
        title: 'Step 1',
        description: 'Description for step 1',
        date: '8 January 2025',
        status: { label: 'Status 1', type: 'complete' },
      },
      {
        id: 'step-2',
        title: 'Step 2',
        description: 'Description for step 2',
        date: '9 January 2025',
        status: { label: 'Status 2', type: 'complete' },
      },
      {
        id: 'step-3',
        title: 'Step 3',
        description: 'Description for step 3',
        status: { label: 'Status 3', type: 'in-progress' },
      },
      {
        id: 'step-4',
        title: 'Step 4',
        description: 'Description for step 4',
        status: { label: 'Not started', type: 'not-started' },
      },
    ],
  },
}

export const AllStepsNotStarted: Story = {
  args: {
    'aria-label': 'Steps label',
    titleElement: 'h2',
    type: 'check',
    connector: true,
    steps: [
      {
        id: 'step-1',
        title: 'Step 1',
        description: 'Description for step 1',
        status: { label: 'Not Started', type: 'not-started' },
      },
      {
        id: 'step-2',
        title: 'Step 2',
        description: 'Description for step 2',
        status: { label: 'Not Started', type: 'not-started' },
      },
      {
        id: 'step-3',
        title: 'Step 3',
        description: 'Description for step 3',
        status: { label: 'Not Started', type: 'not-started' },
      },
      {
        id: 'step-4',
        title: 'Step 4',
        description: 'Description for step 4',
        status: { label: 'Not started', type: 'not-started' },
      },
    ],
  },
}

export const AllStepsCompleted: Story = {
  args: {
    'aria-label': 'Steps label',
    titleElement: 'h2',
    type: 'check',
    connector: true,
    steps: [
      {
        id: 'step-1',
        title: 'Multiline Step 1\nMultiline Step 1',
        description: 'Description for step 1',
        date: '8 January 2025',
        status: { label: 'Status 1', type: 'complete' },
      },
      {
        id: 'step-2',
        title: 'Step 2',
        description: 'Description for step 2',
        date: '9 January 2025',
        status: { label: 'Status 2', type: 'complete' },
      },
      {
        id: 'step-3',
        title: 'Step 3',
        description: 'Description for step 3',
        status: { label: 'Status 3', type: 'complete' },
      },
      {
        id: 'step-4',
        title: 'Step 4',
        description: 'Description for step 4',
        status: { label: 'Status 4', type: 'complete' },
      },
    ],
  },
}
