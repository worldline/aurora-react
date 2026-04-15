import type { Meta, StoryObj } from '@storybook/react-vite'

import { Divider } from './Divider'

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  render: () => <Divider />,
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof Divider>

export const Default: Story = {}
