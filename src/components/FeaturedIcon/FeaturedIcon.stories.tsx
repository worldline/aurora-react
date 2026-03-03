import type { Meta, StoryObj } from '@storybook/react-vite'

import Check from '../icons/Check'

import { FeaturedIcon } from './index'

const meta = {
  title: 'components/FeaturedIcon',
  component: FeaturedIcon,
  parameters: {
    layout: 'centered',
  },
  args: {
    icon: <Check aria-hidden />,
  },
} satisfies Meta<typeof FeaturedIcon>

export default meta

type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: {
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
  },
}

export const XLarge: Story = {
  args: {
    size: 'xlarge',
  },
}
