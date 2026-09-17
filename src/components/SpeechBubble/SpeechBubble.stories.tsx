import type { Meta, StoryObj } from '@storybook/react-vite'

import { Typography } from '../Typography'
import { SpeechBubble } from './SpeechBubble'

const meta: Meta<typeof SpeechBubble> = {
  title: 'Components/SpeechBubble',
  component: SpeechBubble,
  tags: ['autodocs', 'stable'],
  parameters: {
    layout: 'centered',

    a11y: { test: 'error' },
  },
} satisfies Meta<typeof SpeechBubble>

export default meta
type Story = StoryObj<typeof SpeechBubble>

export const Question: Story = {
  args: {
    variant: 'question',
    children: 'What is your favorite color?',
  },
}

export const SystemChat: Story = {
  args: {
    author: 'system',
    variant: 'chat',
    children: 'Thanks, we received your answer.',
    timestamp: '4 sep, 10:50',
  },
}

export const UserChat: Story = {
  args: {
    author: 'user',
    variant: 'chat',
    children: 'Blue, like the sky.',
    timestamp: '4 sep, 10:50',
  },
}

export const UserChatEditable: Story = {
  args: {
    author: 'user',
    variant: 'chat',
    children: 'Blue, like the sky.',
    timestamp: '4 sep, 10:50',
    onEdit: () => ({}),
    editLabel: 'Edit answer',
  },
}

export const UserChatLocked: Story = {
  args: {
    author: 'user',
    variant: 'chat',
    children: 'Blue, like the sky.',
    timestamp: '4 sep, 10:50',
    locked: true,
    lockedLabel: 'Locked',
  },
}

export const Attachment: Story = {
  args: {
    author: 'user',
    variant: 'attachment',
    fileName: 'File_name.pdf',
    timestamp: '4 sep, 10:50',
  },
}

export const Custom: Story = {
  args: {
    author: 'user',
    variant: 'custom',
    children: (
      <Typography element="p" textStyle="bodyMd">
        Custom content goes here
      </Typography>
    ),
  },
}

export const Conversation: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 'var(--au-spacing-xs)',
      }}
    >
      <SpeechBubble variant="question">
        What is your favorite color?
      </SpeechBubble>
      <SpeechBubble author="system" variant="chat" timestamp="4 sep, 10:50">
        Take your time, there is no wrong answer.
      </SpeechBubble>
      <SpeechBubble
        author="user"
        variant="chat"
        timestamp="4 sep, 10:50"
        onEdit={() => ({})}
        editLabel="Edit answer"
      >
        Blue, like the sky.
      </SpeechBubble>
      <SpeechBubble
        author="user"
        variant="attachment"
        fileName="File_name.pdf"
        timestamp="4 sep, 10:50"
      />
      <SpeechBubble
        author="user"
        variant="chat"
        timestamp="4 sep, 10:50"
        locked
        lockedLabel="Locked"
      >
        Blue, like the sky.
      </SpeechBubble>
    </div>
  ),
}
