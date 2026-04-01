import type { Meta, StoryObj } from '@storybook/react-vite'

import { ArrowForwardIcon, BlockIcon } from '../icons'

import { Tile } from './Tile'

const meta = {
  title: 'components/Tile/Tile',
  component: Tile,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tile>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: <BlockIcon />,
    title: 'Title',
    overline: 'Overline',
    description: 'Description',
    trailing: <ArrowForwardIcon />,
    orientation: 'horizontal',
  },
}

export const Vertical: Story = {
  args: {
    ...Default.args,
    orientation: 'vertical',
  },
}

export const Hovered: Story = {
  args: {
    ...Default.args,
    hovered: true,
  },
}

export const Selected: Story = {
  args: {
    ...Default.args,
    selected: true,
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}
