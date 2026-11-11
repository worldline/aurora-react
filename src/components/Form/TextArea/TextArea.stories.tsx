import type { Meta, StoryObj } from '@storybook/react-vite'

import { TextArea } from '.'

const meta: Meta<typeof TextArea> = {
  title: 'Components/Form/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size variant of the textarea',
      table: {
        defaultValue: { summary: 'small' },
        type: { summary: "'small' | 'medium'" },
        category: 'Appearance',
      },
    },
    className: {
      table: {
        category: 'Appearance',
      },
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the textarea',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    tooltip: {
      control: 'text',
      description: 'Text content for the tooltip shown next to the label',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    error: {
      control: 'text',
      description: 'Error message to display',
      table: {
        type: { summary: 'string | boolean' },
        category: 'Content',
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the textarea',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    maxLength: {
      control: 'number',
      description:
        'Maximum character length. When set, displays a character count below the textarea.',
      table: {
        type: { summary: 'number' },
        category: 'Content',
      },
    },
    characterCount: {
      control: 'boolean',
      description:
        'Whether the character count is displayed when maxLength is set',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
        category: 'Content',
      },
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
      table: {
        defaultValue: { summary: '5' },
        type: { summary: 'number' },
        category: 'Appearance',
      },
    },
    announceError: {
      table: {
        category: 'Accessibility',
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Whether the textarea is read-only',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    isRequired: {
      control: 'boolean',
      description:
        'Whether the textarea is required. Only affects accessibility and validation; use showRequiredMark to display the asterisk.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    showRequiredMark: {
      control: 'boolean',
      description:
        'Shows an asterisk after the label. Only applies when isRequired is set.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    optionalLabel: {
      control: 'text',
      description:
        'Text appended in parentheses after the label, e.g. "optional" renders "Label (optional)". Not allowed together with isRequired.',
      table: {
        type: { summary: 'string' },
        category: 'Behaviour',
      },
    },
  },
  args: {
    label: 'Label',
    placeholder: 'Write content here ...',
    helperText: 'This is a hint text to help user.',
    maxLength: 20,
    isRequired: true,
    showRequiredMark: true,
    style: {
      maxWidth: '320px',
      width: '320px',
    },
  },
}

export default meta
type Story = StoryObj<typeof TextArea>

export const ExploreComponentBehaviour: Story = {}

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Label',
    isDisabled: true,
    rows: 500,
    maxLength: 500,
    announceError: 'assertive',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    label: 'Label',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Write content here ...',
  },
}

export const Focused: Story = {
  args: {
    autoFocus: true,
    defaultValue: 'Write content here ...',
  },
}

export const Required: Story = {
  args: {
    label: 'Label',
    isRequired: true,
    showRequiredMark: true,
  },
}

export const WithOptionalLabel: Story = {
  args: {
    label: 'Label',
    isRequired: false,
    optionalLabel: 'optional',
  },
}

export const WithTooltip: Story = {
  args: {
    label: 'Label',
    tooltip: 'This is some additional information.',
    tooltipTriggerAriaLabel: 'More information',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Label',
    helperText: 'This is a hint text to help user.',
    isRequired: true,
    maxLength: 20,
  },
}

export const WithCharacterCount: Story = {
  args: {
    label: 'Label',
    maxLength: 20,
    error: '',
    isRequired: false,
  },
}

export const WithHelperTextAndCharacterCount: Story = {
  args: {
    label: 'Label',
    helperText: 'This is a hint text to help user.',
    maxLength: 20,
  },
}

export const ReadOnly: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Write content here ...',
    isReadOnly: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Write content here ...',
    isDisabled: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Label',
    error: true,
  },
}

export const WithErrorMessage: Story = {
  args: {
    label: 'Label',
    error: 'This is an error message.',
  },
}

export const WithErrorAndCharacterCount: Story = {
  args: {
    label: 'Label',
    error: 'This is an error message.',
    maxLength: 20,
    defaultValue: 'Some text',
  },
}
