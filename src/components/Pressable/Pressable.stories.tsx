import type { Meta, StoryObj } from '@storybook/react-vite'

import { Pressable } from './Pressable'

const meta: Meta<typeof Pressable> = {
  title: 'Components/Pressable',
  component: Pressable,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: false,
      description: 'The content of the pressable element.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the pressable is disabled.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    onPress: {
      action: 'press',
      description: 'Handler called when the press is released over the target.',
      table: {
        type: { summary: '(e: PressEvent) => void' },
      },
    },
    onPressStart: {
      action: 'pressStart',
      description: 'Handler called when a press interaction starts.',
      table: {
        type: { summary: '(e: PressEvent) => void' },
      },
    },
    onPressEnd: {
      action: 'pressEnd',
      description:
        'Handler called when a press interaction ends, either over the target or when the pointer leaves the target.',
      table: {
        type: { summary: '(e: PressEvent) => void' },
      },
    },
    onPressChange: {
      action: 'pressChange',
      description: 'Handler called when the pressed state changes.',
      table: {
        type: { summary: '(isPressed: boolean) => void' },
      },
    },
    onPressUp: {
      action: 'pressUp',
      description:
        'Handler called when a press is released over the target, regardless of whether it started on the target or not.',
      table: {
        type: { summary: '(e: PressEvent) => void' },
      },
    },
  },
} satisfies Meta<typeof Pressable>

export default meta
type Story = StoryObj<typeof Pressable>

export const CustomDiv: Story = {
  args: {
    children: <div role="button">Custom pressable div</div>,
  },
}
