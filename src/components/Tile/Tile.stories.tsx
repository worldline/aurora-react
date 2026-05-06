import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { ArrowForwardIcon, BlockIcon } from '../icons'
import { Tile } from './Tile'

const trailingArrow = <ArrowForwardIcon aria-hidden />

const meta = {
  title: 'components/Tile/Tile',
  component: Tile,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div
      style={{
        width: '100%',
        maxWidth: args.orientation === 'vertical' ? '242px' : '400px',
      }}
    >
      <Tile {...args} />
    </div>
  ),

  args: {
    icon: <BlockIcon aria-hidden />,
    title: 'Title',
    overline: 'Overline',
    description: 'Description',
    trailing: trailingArrow,
    onAction: fn(),
  },
} satisfies Meta<typeof Tile>

export default meta

type Story = StoryObj<typeof meta>

export const Action: Story = {}

export const HorizontalDefault: Story = {
  args: {
    orientation: 'horizontal',
  },
}

export const HorizontalHover: Story = {
  args: {
    orientation: 'horizontal',
    hovered: true,
  },
}

export const HorizontalSelected: Story = {
  args: {
    orientation: 'horizontal',
    selected: true,
  },
}

export const HorizontalFocused: Story = {
  args: {
    orientation: 'horizontal',
    focusVisible: true,
  },
}

export const HorizontalDisabled: Story = {
  args: {
    orientation: 'horizontal',
    disabled: true,
  },
}

export const VerticalDefault: Story = {
  args: {
    orientation: 'vertical',
  },
}

export const VerticalHover: Story = {
  args: {
    orientation: 'vertical',
    hovered: true,
  },
}

export const VerticalSelected: Story = {
  args: {
    orientation: 'vertical',
    selected: true,
  },
}

export const VerticalFocused: Story = {
  args: {
    orientation: 'vertical',
    focusVisible: true,
  },
}

export const VerticalDisabled: Story = {
  args: {
    orientation: 'vertical',
    disabled: true,
  },
}
