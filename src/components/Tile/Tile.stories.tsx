import type { Meta, StoryObj } from '@storybook/react-vite'

import { BlockIcon } from '../icons'

import { Tile } from './Tile'

const trailingArrow = <span aria-hidden="true">→</span>

const meta = {
  title: 'components/Tile/Tile',
  component: Tile,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tile>

export default meta

type Story = StoryObj<typeof meta>

const baseArgs = {
  icon: <BlockIcon />,
  title: 'Title',
  overline: 'Overline',
  description: 'Description',
  trailing: trailingArrow,
} satisfies Partial<Story['args']>

export const HorizontalDefault: Story = {
  args: {
    ...baseArgs,
    orientation: 'horizontal',
  },
}

export const HorizontalHover: Story = {
  args: {
    ...baseArgs,
    orientation: 'horizontal',
    hovered: true,
  },
}

export const HorizontalSelected: Story = {
  args: {
    ...baseArgs,
    orientation: 'horizontal',
    selected: true,
  },
}

export const HorizontalFocused: Story = {
  args: {
    ...baseArgs,
    orientation: 'horizontal',
    focusVisible: true,
  },
}

export const HorizontalDisabled: Story = {
  args: {
    ...baseArgs,
    orientation: 'horizontal',
    disabled: true,
  },
}

export const VerticalDefault: Story = {
  args: {
    ...baseArgs,
    orientation: 'vertical',
  },
}

export const VerticalHover: Story = {
  args: {
    ...baseArgs,
    orientation: 'vertical',
    hovered: true,
  },
}

export const VerticalSelected: Story = {
  args: {
    ...baseArgs,
    orientation: 'vertical',
    selected: true,
  },
}

export const VerticalFocused: Story = {
  args: {
    ...baseArgs,
    orientation: 'vertical',
    focusVisible: true,
  },
}

export const VerticalDisabled: Story = {
  args: {
    ...baseArgs,
    orientation: 'vertical',
    disabled: true,
  },
}
