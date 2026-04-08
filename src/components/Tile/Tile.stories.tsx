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
  args: {
    icon: <BlockIcon aria-hidden />,
    title: 'Title',
    overline: 'Overline',
    description: 'Description',
    trailing: trailingArrow,
  },
} satisfies Meta<typeof Tile>

export default meta

type Story = StoryObj<typeof meta>

export const HorizontalDefault: Story = {
  args: {
    orientation: 'horizontal',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export const HorizontalHover: Story = {
  args: {
    orientation: 'horizontal',
    hovered: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export const HorizontalSelected: Story = {
  args: {
    orientation: 'horizontal',
    selected: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export const HorizontalFocused: Story = {
  args: {
    orientation: 'horizontal',
    focusVisible: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export const HorizontalDisabled: Story = {
  args: {
    orientation: 'horizontal',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export const VerticalDefault: Story = {
  args: {
    orientation: 'vertical',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '242px' }}>
        <Story />
      </div>
    ),
  ],
}

export const VerticalHover: Story = {
  args: {
    orientation: 'vertical',
    hovered: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '242px' }}>
        <Story />
      </div>
    ),
  ],
}

export const VerticalSelected: Story = {
  args: {
    orientation: 'vertical',
    selected: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '242px' }}>
        <Story />
      </div>
    ),
  ],
}

export const VerticalFocused: Story = {
  args: {
    orientation: 'vertical',
    focusVisible: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '242px' }}>
        <Story />
      </div>
    ),
  ],
}

export const VerticalDisabled: Story = {
  args: {
    orientation: 'vertical',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '242px' }}>
        <Story />
      </div>
    ),
  ],
}
