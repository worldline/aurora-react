import type { Meta, StoryObj } from '@storybook/react-vite'

import { Checkbox } from './index'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size of the checkbox',
      table: {
        defaultValue: { summary: 'small' },
        type: { summary: "'small' | 'medium'" },
      },
    },
    title: {
      control: 'text',
      description: 'Title text for the checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the title',
      table: {
        type: { summary: 'string' },
      },
    },
    error: {
      control: 'text',
      description:
        'Error state - boolean for visual state only, string to display error message',
      table: {
        type: { summary: 'boolean | string' },
      },
    },
    children: {
      control: 'text',
      description: 'Custom label content (alternative to title/helperText)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    isIndeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in an indeterminate state',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the checkbox is selected (controlled)',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    defaultSelected: {
      control: 'boolean',
      description: 'Default selected state (uncontrolled)',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Handler called when the checkbox state changes',
      table: {
        type: { summary: '(isSelected: boolean) => void' },
      },
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    'aria-label': 'Default checkbox',
  },
}

export const Checked: Story = {
  args: {
    defaultSelected: true,
    'aria-label': 'Checked checkbox',
  },
}

export const Indeterminate: Story = {
  args: {
    isIndeterminate: true,
    'aria-label': 'Indeterminate checkbox',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    'aria-label': 'Disabled checkbox',
  },
}

export const DisabledChecked: Story = {
  args: {
    isDisabled: true,
    defaultSelected: true,
    'aria-label': 'Disabled checked checkbox',
  },
}

export const DisabledIndeterminate: Story = {
  args: {
    isDisabled: true,
    isIndeterminate: true,
    'aria-label': 'Disabled indeterminate checkbox',
  },
}

export const WithTitle: Story = {
  args: {
    size: 'small',
    title: 'Accept terms and conditions',
  },
}

export const WithTitleAndHelper: Story = {
  args: {
    size: 'small',
    title: 'Enable notifications',
    helperText: 'Receive updates about your account activity',
  },
}

export const Error: Story = {
  args: {
    size: 'small',
    title: 'Accept terms',
    helperText: 'Read the full terms and conditions',
    error: true,
  },
}

export const ErrorWithText: Story = {
  args: {
    size: 'small',
    title: 'Invalid selection',
    helperText: 'This option is restricted',
    error: 'This option cannot be selected',
  },
}

export const SmallSize: Story = {
  args: {
    size: 'small',
    title: 'Small checkbox',
    helperText: 'This is a small size checkbox with helper text',
  },
}

export const MediumSize: Story = {
  args: {
    size: 'medium',
    title: 'Medium checkbox',
    helperText: 'This is a medium size checkbox with helper text',
  },
}

export const SizeComparison: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <Checkbox size="small" title="Small" helperText="Small size checkbox" />
      <Checkbox
        size="medium"
        title="Medium"
        helperText="Medium size checkbox"
      />
    </div>
  ),
}
