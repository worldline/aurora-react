import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/Button'

import { Tooltip, TooltipTrigger } from './index'
import styles from './Tooltip.stories.module.css'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Tooltip\` component must always be used as a child of \`TooltipTrigger\`, which manages the open/close state and connects the tooltip to its trigger element. This is different from many tooltip libraries where the tooltip wraps its trigger directly.

\`\`\`tsx
import { Tooltip, TooltipTrigger } from '@worldline/aurora-react'

<TooltipTrigger delay={300}>
  <Button variant="primary">Hover me</Button>
  <Tooltip title="Helpful information" description="More detail here" />
</TooltipTrigger>
\`\`\`

**Key props on \`TooltipTrigger\`:**
- \`delay\` — milliseconds before the tooltip appears on hover (default: 1500)
- \`closeDelay\` — milliseconds before the tooltip hides after the pointer leaves
- \`isOpen\` — controls the tooltip in controlled mode (managed by the parent)
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title text displayed in the tooltip',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    description: {
      control: 'text',
      description: 'Description text displayed below the title',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    alignment: {
      control: 'select',
      options: [
        'top',
        'top start',
        'top end',
        'bottom',
        'bottom start',
        'bottom end',
        'left',
        'right',
      ],
      description: 'Placement of the tooltip relative to the trigger',
      table: {
        defaultValue: { summary: 'top start' },
        type: {
          summary:
            "'top' | 'top start' | 'top end' | 'bottom' | 'bottom start' | 'bottom end' | 'left' | 'right'",
        },
        category: 'Positioning',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    title: 'Tooltip title',
    description: 'Tooltip description here',
  },
  render: (args) => (
    <TooltipTrigger delay={300}>
      <Button variant="primary">Hover me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
}

export const TitleOnly: Story = {
  args: {
    title: 'Tooltip title',
  },
  render: (args) => (
    <TooltipTrigger delay={300}>
      <Button variant="primary">Hover me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
}

export const WithDescription: Story = {
  args: {
    title: 'Tooltip title',
    description: 'Tooltip description here',
  },
  render: (args) => (
    <TooltipTrigger delay={300}>
      <Button variant="primary">Hover me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
}

export const TopStart: Story = {
  args: {
    title: 'Tooltip title',
    description: 'Tooltip description here',
    alignment: 'top start',
  },
  render: (args) => (
    <TooltipTrigger delay={300}>
      <Button variant="primary">Hover me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
}

export const Top: Story = {
  args: {
    title: 'Tooltip title',
    description: 'Tooltip description here',
    alignment: 'top',
  },
  render: (args) => (
    <TooltipTrigger delay={300}>
      <Button variant="primary">Hover me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
}

export const TopEnd: Story = {
  args: {
    title: 'Tooltip title',
    description: 'Tooltip description here',
    alignment: 'top end',
  },
  render: (args) => (
    <TooltipTrigger delay={300}>
      <Button variant="primary">Hover me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
}

export const BottomStart: Story = {
  args: {
    title: 'Tooltip title',
    description: 'Tooltip description here',
    alignment: 'bottom start',
  },
  render: (args) => (
    <TooltipTrigger delay={300}>
      <Button variant="primary">Hover me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
}

export const Bottom: Story = {
  args: {
    title: 'Tooltip title',
    description: 'Tooltip description here',
    alignment: 'bottom',
  },
  render: (args) => (
    <TooltipTrigger delay={300}>
      <Button variant="primary">Hover me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
}

export const BottomEnd: Story = {
  args: {
    title: 'Tooltip title',
    description: 'Tooltip description here',
    alignment: 'bottom end',
  },
  render: (args) => (
    <TooltipTrigger delay={300}>
      <Button variant="primary">Hover me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
}

export const LeftSide: Story = {
  args: {
    title: 'Tooltip title',
    description: 'Tooltip description here',
    alignment: 'left',
  },
  render: (args) => (
    <TooltipTrigger delay={300}>
      <Button variant="primary">Hover me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
}

export const RightSide: Story = {
  args: {
    title: 'Tooltip title',
    description: 'Tooltip description here',
    alignment: 'right',
  },
  render: (args) => (
    <TooltipTrigger delay={300}>
      <Button variant="primary">Hover me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
}

export const AllPlacements: Story = {
  render: () => (
    <div className={styles['all-placements']}>
      <div className={styles['placement-row']}>
        <TooltipTrigger delay={300}>
          <Button variant="primary">Top Start</Button>
          <Tooltip
            title="Tooltip title"
            description="Tooltip description here"
            alignment="top start"
          />
        </TooltipTrigger>
        <TooltipTrigger delay={300}>
          <Button variant="primary">Top</Button>
          <Tooltip
            title="Tooltip title"
            description="Tooltip description here"
            alignment="top"
          />
        </TooltipTrigger>
        <TooltipTrigger delay={300}>
          <Button variant="primary">Top End</Button>
          <Tooltip
            title="Tooltip title"
            description="Tooltip description here"
            alignment="top end"
          />
        </TooltipTrigger>
      </div>
      <div className={styles['placement-row']}>
        <TooltipTrigger delay={300}>
          <Button variant="primary">Left</Button>
          <Tooltip
            title="Tooltip title"
            description="Tooltip description here"
            alignment="left"
          />
        </TooltipTrigger>
        <TooltipTrigger delay={300}>
          <Button variant="primary">Right</Button>
          <Tooltip
            title="Tooltip title"
            description="Tooltip description here"
            alignment="right"
          />
        </TooltipTrigger>
      </div>
      <div className={styles['placement-row']}>
        <TooltipTrigger delay={300}>
          <Button variant="primary">Bottom Start</Button>
          <Tooltip
            title="Tooltip title"
            description="Tooltip description here"
            alignment="bottom start"
          />
        </TooltipTrigger>
        <TooltipTrigger delay={300}>
          <Button variant="primary">Bottom</Button>
          <Tooltip
            title="Tooltip title"
            description="Tooltip description here"
            alignment="bottom"
          />
        </TooltipTrigger>
        <TooltipTrigger delay={300}>
          <Button variant="primary">Bottom End</Button>
          <Tooltip
            title="Tooltip title"
            description="Tooltip description here"
            alignment="bottom end"
          />
        </TooltipTrigger>
      </div>
    </div>
  ),
}
