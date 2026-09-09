import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { Key } from 'react-aria-components'

import type { AutocompleteOption } from './types'

import { Autocomplete } from '.'

const meta: Meta<typeof Autocomplete> = {
  title: 'Components/Form/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      table: {
        defaultValue: { summary: 'small' },
        type: { summary: "'small' | 'medium' | 'large'" },
        category: 'Appearance',
      },
    },
    label: {
      control: 'text',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    placeholder: {
      control: 'text',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    helperText: {
      control: 'text',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    error: {
      control: 'text',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    formatResultsCount: {
      table: {
        type: { summary: '(count: number) => string' },
        category: 'Content',
      },
    },
    emptyLabel: {
      control: 'text',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    sheetTitle: {
      control: 'text',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    isRequired: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' }, category: 'Behaviour' },
    },
    isDisabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' }, category: 'Behaviour' },
    },
    isReadOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' }, category: 'Behaviour' },
    },
    clearLabel: {
      control: 'text',
      table: { type: { summary: 'string' }, category: 'Accessibility' },
    },
    closeLabel: {
      control: 'text',
      table: { type: { summary: 'string' }, category: 'Accessibility' },
    },
  },
  args: {
    placeholder: 'Search ...',
    formatResultsCount: (count) => `${String(count)} results found`,
    emptyLabel: 'No result found',
    clearLabel: 'Clear',
    closeLabel: 'Close',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Autocomplete>

export default meta
type Story = StoryObj<typeof Autocomplete>

const addresses: Array<AutocompleteOption> = [
  {
    id: 'brussels',
    label: 'Rue de la Loi 16',
    description: '1000 Brussels, Belgium',
  },
  {
    id: 'antwerp',
    label: 'Meir 78',
    description: '2000 Antwerp, Belgium',
  },
  {
    id: 'ghent',
    label: 'Korenmarkt 12',
    description: '9000 Ghent, Belgium',
  },
  {
    id: 'bruges',
    label: 'Markt 7',
    description: '8000 Bruges, Belgium',
  },
  {
    id: 'liege',
    label: 'Place Saint-Lambert 18',
    description: '4000 Liège, Belgium',
  },
  {
    id: 'namur',
    label: 'Rue de Fer 24',
    description: '5000 Namur, Belgium',
  },
  {
    id: 'leuven',
    label: 'Grote Markt 9',
    description: '3000 Leuven, Belgium',
  },
  {
    id: 'mons',
    label: 'Grand-Place 22',
    description: '7000 Mons, Belgium',
  },
  {
    id: 'charleroi',
    label: 'Place Charles II 5',
    description: '6000 Charleroi, Belgium',
  },
  {
    id: 'mechelen',
    label: 'Grote Markt 1',
    description: '2800 Mechelen, Belgium',
  },
  {
    id: 'sint-niklaas',
    label: 'Grote Markt 3',
    description: '9100 Sint-Niklaas, Belgium',
  },
]

export const Small: Story = {
  args: {
    label: 'Address',
    options: addresses,
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    label: 'Address',
    options: addresses,
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    label: 'Address',
    options: addresses,
    size: 'large',
  },
}

export const Required: Story = {
  args: {
    label: 'Address',
    options: addresses,
    isRequired: true,
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Address',
    options: addresses,
    helperText: 'Start typing to search for your address.',
  },
}

export const WithErrorMessage: Story = {
  args: {
    label: 'Address',
    options: addresses,
    error: 'Select an address from the list.',
  },
}

export const WithSelectedOption: Story = {
  args: {
    label: 'Address',
    options: addresses,
    defaultSelectedKey: 'ghent',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Address',
    options: addresses,
    isDisabled: true,
  },
}

export const ReadOnly: Story = {
  args: {
    label: 'Address',
    options: addresses,
    isReadOnly: true,
    defaultSelectedKey: 'antwerp',
  },
}

export const WithFooterAction: Story = {
  args: {
    label: 'Address',
    options: addresses,
    footerAction: {
      label: "Can't find your result? Add details manually",
      onAction: () => undefined,
    },
  },
}

export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile2', isRotated: false },
  },
  args: {
    label: 'Address',
    options: addresses,
    sheetTitle: 'Search address',
    footerAction: {
      label: "Can't find your result? Add details manually",
      onAction: () => undefined,
    },
  },
}

const ControlledAutocomplete = (args: Story['args']) => {
  const [selectedKey, setSelectedKey] = useState<Key | null>(null)
  const selectedOption = addresses.find((address) => address.id === selectedKey)

  return (
    <Autocomplete
      {...args}
      helperText={
        selectedOption
          ? `Selected: ${selectedOption.label}`
          : 'Nothing selected yet.'
      }
      onSelectionChange={setSelectedKey}
      options={addresses}
      selectedKey={selectedKey}
      clearLabel="Clear"
      closeLabel="Close"
      emptyLabel="No results found"
      formatResultsCount={(count) => `${count.toString()} results found`}
      placeholder="Search..."
    />
  )
}

export const Controlled: Story = {
  args: {
    label: 'Address',
    options: addresses,
  },
  render: (args) => <ControlledAutocomplete {...args} />,
}

const ControlledInputValueAutocomplete = (args: Story['args']) => {
  const [inputValue, setInputValue] = useState('')

  return (
    <Autocomplete
      {...args}
      helperText={`Typed: "${inputValue}"`}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      options={addresses}
      clearLabel="Clear"
      closeLabel="Close"
      emptyLabel="No results found"
      formatResultsCount={(count) => `${count.toString()} results found`}
      placeholder="Search..."
    />
  )
}

export const ControlledInputValue: Story = {
  args: {
    label: 'Address',
    options: addresses,
  },
  render: (args) => <ControlledInputValueAutocomplete {...args} />,
}

export const WithCustomFilter: Story = {
  args: {
    label: 'Address',
    options: addresses,
    helperText: 'Matches addresses starting with the typed text.',
    filter: (optionLabel, inputValue) =>
      optionLabel.toLowerCase().startsWith(inputValue.toLowerCase()),
  },
}
