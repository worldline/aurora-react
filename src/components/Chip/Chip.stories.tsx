import type { Meta, StoryObj } from '@storybook/react-vite'

import { SettingsIcon, PersonFillIcon } from '../icons'

import { Chip } from './index'

const meta = {
  title: 'components/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Chip>

export default meta

type Story = StoryObj<typeof meta>

export const Neutral: Story = {
  args: {
    size: 'large',
    type: 'neutral',
    label: 'Neutral',
  },
}

export const Brand: Story = {
  args: {
    size: 'large',
    type: 'brand',
    label: 'Brand',
  },
}

export const Info: Story = {
  args: {
    size: 'large',
    type: 'info',
    label: 'Info',
  },
}

export const Success: Story = {
  args: {
    size: 'large',
    type: 'success',
    label: 'Success',
  },
}

export const Warning: Story = {
  args: {
    size: 'large',
    type: 'warning',
    label: 'Warning',
  },
}

export const Error: Story = {
  args: {
    size: 'large',
    type: 'error',
    label: 'Error',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    type: 'neutral',
    label: 'Small',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    type: 'neutral',
    label: 'Large',
  },
}

export const LeadingAndTrailingIcons: Story = {
  args: {
    size: 'large',
    type: 'success',
    label: 'Leading & Trailing Icons',
    leadingIcon: <PersonFillIcon aria-hidden />,
    trailingIcon: <SettingsIcon aria-hidden />,
  },
}

export const LeadingIcon: Story = {
  args: {
    size: 'large',
    type: 'warning',
    label: 'Leading Icon',
    leadingIcon: <PersonFillIcon aria-hidden />,
  },
}

export const TrailingIcon: Story = {
  args: {
    size: 'large',
    type: 'brand',
    label: 'Trailing Icon',
    trailingIcon: <SettingsIcon aria-hidden />,
  },
}
