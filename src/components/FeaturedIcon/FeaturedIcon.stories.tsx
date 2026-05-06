import type { Meta, StoryObj } from '@storybook/react-vite'

import { CheckCircleIcon } from '@/components/icons'

import styles from './FeaturedIcon.stories.module.css'
import { FeaturedIcon } from './index'

const meta = {
  title: 'components/FeaturedIcon',
  component: FeaturedIcon,
  parameters: {
    layout: 'centered',
  },
  args: {
    icon: <CheckCircleIcon aria-hidden />,
  },
  argTypes: {
    icon: {
      control: false,
    },
  },
} satisfies Meta<typeof FeaturedIcon>

export default meta

type Story = StoryObj<typeof meta>

const sizes = [
  'small',
  'medium',
  'large',
  'xlarge',
  '2xlarge',
  '3xlarge',
  '4xlarge',
] as const

export const Example: Story = {
  render: (args) => <FeaturedIcon {...args} />,
  args: {
    type: 'square',
    size: 'medium',
    emphasis: 'low',
  },
}

export const SquareWithLowEmphasis: Story = {
  render: (args) => (
    <div className={styles.container}>
      {sizes.map((size) => (
        <FeaturedIcon key={size} {...args} size={size} />
      ))}
    </div>
  ),
  args: {
    type: 'square',
    size: 'medium',
    emphasis: 'low',
  },
}

export const SquareWithMediumEmphasis: Story = {
  render: (args) => (
    <div className={styles.container}>
      {sizes.map((size) => (
        <FeaturedIcon key={size} {...args} size={size} />
      ))}
    </div>
  ),
  args: {
    type: 'square',
    size: 'medium',
    emphasis: 'medium',
  },
}

export const CircleWithLowEmphasis: Story = {
  render: (args) => (
    <div className={styles.container}>
      {sizes.map((size) => (
        <FeaturedIcon key={size} {...args} size={size} />
      ))}
    </div>
  ),
  args: {
    type: 'circle',
    size: 'medium',
    emphasis: 'low',
  },
}

export const CircleWithMediumEmphasis: Story = {
  render: (args) => (
    <div className={styles.container}>
      {sizes.map((size) => (
        <FeaturedIcon key={size} {...args} size={size} />
      ))}
    </div>
  ),
  args: {
    type: 'circle',
    size: 'medium',
    emphasis: 'medium',
  },
}
