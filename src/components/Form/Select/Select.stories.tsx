import type { Meta, StoryObj } from '@storybook/react-vite'

import { SearchIcon } from '@/components/icons'

import { Select, SelectItem } from '.'

const meta: Meta<typeof Select> = {
  title: 'Components/Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
      table: {
        defaultValue: { summary: 'small' },
        type: { summary: "'small' | 'medium'" },
        category: 'Appearance',
      },
    },
    label: {
      control: 'text',
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
      table: {
        type: { summary: 'string | boolean' },
        category: 'Content',
      },
    },
    placeholder: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    helperText: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    isDisabled: {
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
        category: 'Behaviour',
      },
    },
    isRequired: {
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
        category: 'Behaviour',
      },
    },
  },
  args: {
    style: { width: '320px' },
  },
}

export default meta
type Story = StoryObj<typeof Select>

const defaultItems = (
  <>
    <SelectItem id="option-1">Option 1</SelectItem>
    <SelectItem id="option-2">Option 2</SelectItem>
    <SelectItem id="option-3">Option 3</SelectItem>
    <SelectItem id="option-4">Option 4</SelectItem>
    <SelectItem id="option-5">Option 5</SelectItem>
  </>
)

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Label',
  },
  render: (args) => <Select {...args}>{defaultItems}</Select>,
}

export const Medium: Story = {
  args: {
    size: 'medium',
    label: 'Label',
  },
  render: (args) => <Select {...args}>{defaultItems}</Select>,
}

export const Required: Story = {
  args: {
    label: 'Label',
    isRequired: true,
  },
  render: (args) => <Select {...args}>{defaultItems}</Select>,
}

export const WithTooltip: Story = {
  args: {
    label: 'Label',
    tooltip: 'This is some additional information.',
    tooltipTriggerAriaLabel: 'More information',
  },
  render: (args) => <Select {...args}>{defaultItems}</Select>,
}

export const WithHelperText: Story = {
  args: {
    label: 'Label',
    helperText: 'This is a hint text to help user.',
  },
  render: (args) => <Select {...args}>{defaultItems}</Select>,
}

export const WithLeadingIcon: Story = {
  args: {
    label: 'Label',
    leading: <SearchIcon aria-hidden size={24} />,
  },
  render: (args) => <Select {...args}>{defaultItems}</Select>,
}

export const WithDefaultValue: Story = {
  args: {
    label: 'Label',
    defaultValue: 'option-2',
  },
  render: (args) => <Select {...args}>{defaultItems}</Select>,
}

export const Disabled: Story = {
  args: {
    label: 'Label',
    isDisabled: true,
  },
  render: (args) => <Select {...args}>{defaultItems}</Select>,
}

export const ReadOnly: Story = {
  args: {
    label: 'Label',
    isReadOnly: true,
    defaultValue: 'option-1',
  },
  render: (args) => <Select {...args}>{defaultItems}</Select>,
}

export const WithErrorMessage: Story = {
  args: {
    label: 'Label',
    error: 'This is an error message.',
  },
  render: (args) => <Select {...args}>{defaultItems}</Select>,
}

export const WithMultipleSelections: Story = {
  render: () => (
    <Select label="Label" selectionMode="multiple" style={{ width: '320px' }}>
      <SelectItem id="a-1">Option A1</SelectItem>
      <SelectItem id="a-2">Option A2</SelectItem>
      <SelectItem id="b-1">Option B1</SelectItem>
      <SelectItem id="b-2">Option B2</SelectItem>
    </Select>
  ),
}
