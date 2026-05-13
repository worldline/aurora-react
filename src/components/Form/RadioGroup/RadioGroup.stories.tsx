import type { Meta, StoryObj } from '@storybook/react-vite'

import { RadioGroup } from './index'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Form/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title displayed above the group',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    description: {
      control: 'text',
      description: 'Description displayed below the title',
      table: {
        type: { summary: 'string' },
        category: 'Content',
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
    isRequired: {
      control: 'boolean',
      description: 'Whether a selection is required',
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
    error: {
      control: 'text',
      description:
        'Error state — boolean for visual only, string to display error message',
      table: {
        type: { summary: 'boolean | string' },
        category: 'Validation',
      },
    },
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: 'Layout orientation of the radio buttons',
      table: {
        defaultValue: { summary: 'vertical' },
        type: { summary: "'vertical' | 'horizontal'" },
        category: 'Layout',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  args: {
    defaultValue: 'option1',
    'aria-label': 'Options',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio
        value="option1"
        label="Option 1"
        description="First available option"
      />
      <RadioGroup.Radio
        value="option2"
        label="Option 2"
        description="Second available option"
      />
      <RadioGroup.Radio
        value="option3"
        label="Option 3"
        description="Third available option"
      />
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Use \`RadioGroup\` as the container and \`RadioGroup.Radio\` for each option. The \`value\` prop on each radio identifies which option is selected.

\`\`\`tsx
import { RadioGroup } from '@worldline/aurora-react/components'

<RadioGroup
  title="Preferred contact"
  description="Choose how you want to be reached"
  defaultValue="email"
  onChange={(value) => console.log(value)}
>
  <RadioGroup.Radio value="email" label="Email" description="We will send you an email" />
  <RadioGroup.Radio value="phone" label="Phone" description="We will call you" />
</RadioGroup>
\`\`\`

Use \`value\` / \`onChange\` for a controlled group, or \`defaultValue\` for an uncontrolled one.
Pass \`error\` as a string to display an error message below the group, or as \`true\` for visual-only error styling.
`,
      },
    },
  },
}

export const WithGroupTitle: Story = {
  args: {
    title: 'Choose an option',
    defaultValue: 'option1',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio
        value="option1"
        label="Option 1"
        description="First available option"
      />
      <RadioGroup.Radio
        value="option2"
        label="Option 2"
        description="Second available option"
      />
      <RadioGroup.Radio
        value="option3"
        label="Option 3"
        description="Third available option"
      />
    </RadioGroup>
  ),
}

export const WithGroupTitleAndDescription: Story = {
  args: {
    title: 'Choose an option',
    description: 'Select one of the options below',
    defaultValue: 'option1',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio
        value="option1"
        label="Option 1"
        description="First available option"
      />
      <RadioGroup.Radio
        value="option2"
        label="Option 2"
        description="Second available option"
      />
      <RadioGroup.Radio
        value="option3"
        label="Option 3"
        description="Third available option"
      />
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  args: {
    title: 'Disabled group',
    isDisabled: true,
    defaultValue: 'option1',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio
        value="option1"
        label="Option 1"
        description="First available option"
      />
      <RadioGroup.Radio
        value="option2"
        label="Option 2"
        description="Second available option"
      />
      <RadioGroup.Radio
        value="option3"
        label="Option 3"
        description="Third available option"
      />
    </RadioGroup>
  ),
}

export const DisabledUnchecked: Story = {
  args: {
    'aria-label': 'Options',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio
        value="option1"
        label="Option 1"
        description="Disabled unchecked"
        isDisabled
      />
      <RadioGroup.Radio
        value="option2"
        label="Option 2"
        description="Second available option"
      />
    </RadioGroup>
  ),
}

export const DisabledChecked: Story = {
  args: {
    defaultValue: 'option1',
    'aria-label': 'Options',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio
        value="option1"
        label="Option 1"
        description="Disabled checked"
        isDisabled
      />
      <RadioGroup.Radio
        value="option2"
        label="Option 2"
        description="Second available option"
      />
    </RadioGroup>
  ),
}

export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
      <RadioGroup
        title="Small"
        description="Small size radio buttons"
        defaultValue="option1"
        aria-label="Small group"
      >
        <RadioGroup.Radio
          value="option1"
          size="small"
          label="Option 1"
          description="First available option"
          isDisabled
        />
        <RadioGroup.Radio
          value="option2"
          size="small"
          label="Option 2"
          description="Second available option"
        />
        <RadioGroup.Radio
          value="option3"
          size="small"
          label="Option 3"
          description="Third available option"
        />
      </RadioGroup>
      <RadioGroup
        title="Medium"
        description="Medium size radio buttons"
        defaultValue="option1"
        aria-label="Medium group"
      >
        <RadioGroup.Radio
          value="option1"
          size="medium"
          label="Option 1"
          isDisabled
          description="First available option"
        />
        <RadioGroup.Radio
          value="option2"
          size="medium"
          label="Option 2"
          description="Second available option"
        />
        <RadioGroup.Radio
          value="option3"
          size="medium"
          label="Option 3"
          description="Third available option"
        />
      </RadioGroup>
    </div>
  ),
}

export const Focused: Story = {
  args: {
    'aria-label': 'Options',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio
        value="option1"
        label="Option 1"
        description="First available option"
        autoFocus
      />
      <RadioGroup.Radio
        value="option2"
        label="Option 2"
        description="Second available option"
      />
      <RadioGroup.Radio
        value="option3"
        label="Option 3"
        description="Third available option"
      />
    </RadioGroup>
  ),
}

export const FocusedChecked: Story = {
  args: {
    defaultValue: 'option1',
    'aria-label': 'Options',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio
        value="option1"
        label="Option 1"
        description="First available option"
        autoFocus
      />
      <RadioGroup.Radio
        value="option2"
        label="Option 2"
        description="Second available option"
      />
      <RadioGroup.Radio
        value="option3"
        label="Option 3"
        description="Third available option"
      />
    </RadioGroup>
  ),
}

export const HorizontalOrientation: Story = {
  args: {
    title: 'Choose an option',
    description: 'Select one of the options below',
    defaultValue: 'option1',
    orientation: 'horizontal',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio
        value="option1"
        label="Option 1"
        description="First available option"
      />
      <RadioGroup.Radio
        value="option2"
        label="Option 2"
        description="Second available option"
        isDisabled
      />
      <RadioGroup.Radio
        value="option3"
        label="Option 3"
        description="Third available option"
      />
    </RadioGroup>
  ),
}

export const WithoutDescription: Story = {
  args: {
    defaultValue: 'option1',
    'aria-label': 'Options',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio value="option1" label="Option 1" />
      <RadioGroup.Radio value="option2" label="Option 2" />
      <RadioGroup.Radio value="option3" label="Option 3" />
    </RadioGroup>
  ),
}

export const WithoutText: Story = {
  args: {
    defaultValue: 'option1',
    'aria-label': 'Options',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio value="option1" aria-label="Option 1" />
      <RadioGroup.Radio value="option2" aria-label="Option 2" />
      <RadioGroup.Radio value="option3" aria-label="Option 3" />
    </RadioGroup>
  ),
}

export const WithErrorMessage: Story = {
  args: {
    title: 'Choose an option',
    description: 'Select one of the options below',
    error: 'This is an error message.',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Radio
        value="option1"
        label="Option 1"
        description="First available option"
      />
      <RadioGroup.Radio
        value="option2"
        label="Option 2"
        description="Second available option"
      />
      <RadioGroup.Radio
        value="option3"
        label="Option 3"
        description="Third available option"
      />
    </RadioGroup>
  ),
}
