import type { Meta, StoryObj } from '@storybook/react-vite'

import styles from './ProgressCircle.stories.module.scss'

import { ProgressCircle } from '.'

const meta = {
  title: 'Components/Progress/ProgressCircle',
  component: ProgressCircle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Displays step progress as a circular indicator with a \`value/maxValue\` label in the centre.

**Accessibility and background colour**

Overlaying a text node on top of an image node (such as an SVG) triggers an axe violation because
the tool cannot determine the text's background colour. To avoid this, the component renders the
progress ring using a CSS \`conic-gradient\` and gives the inner label an explicit background colour
(\`--au-surface-neutral-low\` by default). This is a deliberate trade-off: developer experience is
slightly reduced so that the component is accessible out of the box.
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 9, step: 1 },
      description:
        'Current step value. Must be an integer between minValue and maxValue.',
      table: {
        type: { summary: 'number' },
        category: 'Value',
      },
    },
    minValue: {
      control: { type: 'number', min: 0, max: 9, step: 1 },
      description: 'Minimum value. Must not exceed maxValue.',
      table: {
        defaultValue: { summary: '1' },
        type: { summary: 'number' },
        category: 'Value',
      },
    },
    maxValue: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      description: 'Total number of steps. Must be an integer between 1 and 9.',
      table: {
        type: { summary: '1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9' },
        category: 'Value',
      },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for screen readers',
      table: {
        type: { summary: 'string' },
        category: 'Accessibility',
      },
    },
  },
} satisfies Meta<typeof ProgressCircle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 3,
    maxValue: 4,
    'aria-label': 'Upload progress',
  },
}

export const MaxRange: Story = {
  args: {
    value: 3,
    maxValue: 9,
    'aria-label': 'Upload progress',
  },
}

export const CustomClassBackground: Story = {
  args: {
    value: 2,
    maxValue: 4,
    'aria-label': 'Custom class background',
    className: styles['custom-class'],
  },
}

export const CustomStyleBackground: Story = {
  args: {
    value: 2,
    maxValue: 8,
    'aria-label': 'Custom style background',
    style: { backgroundColor: 'var(--au-surface-page)' },
  },
}

export const Empty: Story = {
  args: {
    value: 0,
    minValue: 0,
    maxValue: 5,
    'aria-label': 'Progress',
  },
}

export const Complete: Story = {
  args: {
    value: 5,
    maxValue: 5,
    'aria-label': 'Progress complete',
  },
}

export const AllMaxValues: Story = {
  args: { value: 1, maxValue: 9, 'aria-label': 'Progress' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((max) => (
        <div
          key={max}
          style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
        >
          {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).slice(0, max).map((val) => (
            <ProgressCircle
              key={val}
              value={val}
              maxValue={max}
              aria-label={`Step ${String(val)} of ${String(max)}`}
            />
          ))}
        </div>
      ))}
    </div>
  ),
}
