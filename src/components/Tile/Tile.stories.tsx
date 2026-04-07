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
  icon: <BlockIcon aria-hidden />,
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
    ...baseArgs,
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
    ...baseArgs,
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
    ...baseArgs,
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
    ...baseArgs,
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
    ...baseArgs,
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
    ...baseArgs,
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
    ...baseArgs,
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
    ...baseArgs,
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
    ...baseArgs,
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
