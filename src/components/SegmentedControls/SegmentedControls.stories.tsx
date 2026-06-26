import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  CalendarTodayIcon,
  FilterListIcon,
  SearchIcon,
} from '@/components/icons/basics'

import { SegmentedControls } from './SegmentedControls'

const meta: Meta<typeof SegmentedControls> = {
  title: 'Components/SegmentedControls',
  component: SegmentedControls,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    direction: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Layout direction of the controls group',
      table: {
        defaultValue: { summary: 'horizontal' },
        type: { summary: "'horizontal' | 'vertical'" },
        category: 'Appearance',
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the entire group is disabled',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    value: {
      control: 'text',
      description: 'Controlled selected value',
      table: {
        type: { summary: 'string' },
        category: 'Selection',
      },
    },
    defaultValue: {
      control: 'text',
      description: 'Default selected value (uncontrolled)',
      table: {
        type: { summary: 'string' },
        category: 'Selection',
      },
    },
    onChange: {
      action: 'changed',
      description: 'Handler called when the selected value changes',
      table: {
        type: { summary: '(value: string) => void' },
        category: 'Selection',
      },
    },
  },
} satisfies Meta<typeof SegmentedControls>

export default meta
type Story = StoryObj<typeof SegmentedControls>

export const Default: Story = {
  args: {
    defaultValue: 'option1',
    'aria-label': 'Options',
  },
  render: (args) => (
    <SegmentedControls {...args}>
      <SegmentedControls.Control value="option1">
        Option 1
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option2">
        Option 2
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option3">
        Option 3
      </SegmentedControls.Control>
    </SegmentedControls>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Use \`SegmentedControls\` as the container and \`SegmentedControls.Control\` for each option.

\`\`\`tsx
import { SegmentedControls } from '@worldline/aurora-react/components'

<SegmentedControls
  defaultValue="option1"
  onChange={(value) => console.log(value)}
  aria-label="View mode"
>
  <SegmentedControls.Control value="option1">Option 1</SegmentedControls.Control>
  <SegmentedControls.Control value="option2">Option 2</SegmentedControls.Control>
</SegmentedControls>
\`\`\`

Use \`value\` / \`onChange\` for a controlled group, or \`defaultValue\` for an uncontrolled one.
`,
      },
    },
  },
}

export const NoSelection: Story = {
  args: {
    'aria-label': 'Options',
  },
  render: (args) => (
    <SegmentedControls {...args}>
      <SegmentedControls.Control value="option1">
        Option 1
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option2">
        Option 2
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option3">
        Option 3
      </SegmentedControls.Control>
    </SegmentedControls>
  ),
}

export const ManyControls: Story = {
  args: {
    defaultValue: 'option3',
    'aria-label': 'Options',
  },
  render: (args) => (
    <SegmentedControls {...args}>
      <SegmentedControls.Control value="option1">
        Option 1
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option2">
        Option 2
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option3">
        Option 3
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option4">
        Option 4
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option5">
        Option 5
      </SegmentedControls.Control>
    </SegmentedControls>
  ),
}

export const WithIcons: Story = {
  args: {
    defaultValue: 'search',
    'aria-label': 'View options',
  },
  render: (args) => (
    <SegmentedControls {...args}>
      <SegmentedControls.Control
        value="search"
        trailingIcon={<SearchIcon aria-hidden />}
      >
        Search
      </SegmentedControls.Control>
      <SegmentedControls.Control
        value="filter"
        trailingIcon={<FilterListIcon aria-hidden />}
      >
        Filter
      </SegmentedControls.Control>
      <SegmentedControls.Control
        value="calendar"
        trailingIcon={<CalendarTodayIcon aria-hidden />}
      >
        Calendar
      </SegmentedControls.Control>
    </SegmentedControls>
  ),
}

export const Vertical: Story = {
  args: {
    defaultValue: 'option1',
    'aria-label': 'Options',
    direction: 'vertical',
  },
  render: (args) => (
    <SegmentedControls {...args}>
      <SegmentedControls.Control value="option1">
        Option 1
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option2">
        Option 2
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option3">
        Option 3
      </SegmentedControls.Control>
    </SegmentedControls>
  ),
}

export const Focused: Story = {
  args: {
    'aria-label': 'Options',
  },
  render: (args) => (
    <SegmentedControls {...args}>
      <SegmentedControls.Control value="option1" autoFocus>
        Option 1
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option2">
        Option 2
      </SegmentedControls.Control>
      <SegmentedControls.Control value="option3">
        Option 3
      </SegmentedControls.Control>
    </SegmentedControls>
  ),
}
