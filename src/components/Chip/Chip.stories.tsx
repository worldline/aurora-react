import type { Meta, StoryObj } from '@storybook/react-vite'

import { SettingsIcon, UserProfileIcon } from '../icons'

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
    renderLeadingIcon: (color: string, className: string) => (
      <UserProfileIcon fill={color} className={className} />
    ),
    renderTrailingIcon: (color: string, className: string) => (
      <SettingsIcon fill={color} className={className} />
    ),
  },
}

export const LeadingIcon: Story = {
  args: {
    size: 'large',
    type: 'warning',
    label: 'Leading Icon',
    renderLeadingIcon: (color: string, className: string) => (
      <UserProfileIcon fill={color} className={className} />
    ),
  },
}

export const TrailingIcon: Story = {
  args: {
    size: 'small',
    type: 'brand',
    label: 'Trailing Icon',
    renderTrailingIcon: (color: string, className: string) => (
      <SettingsIcon fill={color} className={className} />
    ),
  },
}
