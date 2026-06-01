import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { Selection } from 'react-aria-components'

import {
  BlockIcon,
  CreditCardIcon,
  PersonFillIcon,
  SettingsIcon,
  StorefrontIcon,
} from '../icons'
import { FilterGroup } from './FilterGroup'
import { FilterItem } from './FilterItem'

const meta = {
  title: 'components/Filter',
  component: FilterGroup,
  subcomponents: { FilterItem } as Record<string, React.ComponentType<unknown>>,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof FilterGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    selectionMode: 'multiple',
    'aria-label': 'Categories',
  },
  render: (args) => (
    <FilterGroup {...args}>
      <FilterItem id="news">News</FilterItem>
      <FilterItem id="travel">Travel</FilterItem>
      <FilterItem id="gaming">Gaming</FilterItem>
      <FilterItem id="music">Music</FilterItem>
    </FilterGroup>
  ),
}

export const SingleSelection: Story = {
  args: {
    selectionMode: 'single',
    'aria-label': 'Category',
  },
  render: (args) => (
    <FilterGroup {...args}>
      <FilterItem id="all">All</FilterItem>
      <FilterItem id="active">Active</FilterItem>
      <FilterItem id="inactive">Inactive</FilterItem>
    </FilterGroup>
  ),
}

export const WithLeadingIcons: Story = {
  args: {
    selectionMode: 'multiple',
    'aria-label': 'Filter options',
  },
  render: (args) => (
    <FilterGroup {...args}>
      <FilterItem id="blocked" leadingIcon={<BlockIcon aria-hidden />}>
        Blocked
      </FilterItem>
      <FilterItem id="settings" leadingIcon={<SettingsIcon aria-hidden />}>
        Settings
      </FilterItem>
      <FilterItem id="profile" leadingIcon={<PersonFillIcon aria-hidden />}>
        Profile
      </FilterItem>
    </FilterGroup>
  ),
}

const RemovableExample = () => {
  const [items, setItems] = useState([
    { id: 'news', label: 'News' },
    { id: 'travel', label: 'Travel' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'music', label: 'Music' },
  ])

  return (
    <FilterGroup
      aria-label="Categories"
      onRemove={(keys) => {
        setItems((previous) => previous.filter((item) => !keys.has(item.id)))
      }}
    >
      {items.map((item) => (
        <FilterItem key={item.id} id={item.id}>
          {item.label}
        </FilterItem>
      ))}
    </FilterGroup>
  )
}

export const Removable: Story = {
  args: { children: null },
  render: () => <RemovableExample />,
}

const RemovableWithIconsExample = () => {
  const [items, setItems] = useState([
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCardIcon aria-hidden />,
    },
    {
      id: 'merchants',
      label: 'Merchants',

      icon: <StorefrontIcon aria-hidden />,
    },
    {
      id: 'users',
      label: 'Users',
      icon: <PersonFillIcon aria-hidden />,
    },
  ])

  return (
    <FilterGroup
      aria-label="Filter by category"
      onRemove={(keys) => {
        setItems((previous) => previous.filter((item) => !keys.has(item.id)))
      }}
    >
      {items.map((item) => (
        <FilterItem key={item.id} id={item.id} leadingIcon={item.icon}>
          {item.label}
        </FilterItem>
      ))}
    </FilterGroup>
  )
}

export const RemovableWithIcons: Story = {
  args: { children: null },
  render: () => <RemovableWithIconsExample />,
}

const RemovableWithSelectionExample = () => {
  const [items, setItems] = useState([
    { id: 'news', label: 'News' },
    { id: 'travel', label: 'Travel' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'music', label: 'Music' },
  ])

  return (
    <FilterGroup
      selectionMode="multiple"
      aria-label="Categories"
      onRemove={(keys) => {
        setItems((previous) => previous.filter((item) => !keys.has(item.id)))
      }}
    >
      {items.map((item) => (
        <FilterItem key={item.id} id={item.id}>
          {item.label}
        </FilterItem>
      ))}
    </FilterGroup>
  )
}

export const RemovableWithSelection: Story = {
  args: { children: null },
  render: () => <RemovableWithSelectionExample />,
}

export const WithDisabledItems: Story = {
  args: {
    selectionMode: 'multiple',
    disabledKeys: ['travel', 'music'],
    'aria-label': 'Categories',
  },
  render: (args) => (
    <FilterGroup {...args}>
      <FilterItem id="news">News</FilterItem>
      <FilterItem id="travel">Travel</FilterItem>
      <FilterItem id="gaming">Gaming</FilterItem>
      <FilterItem id="music">Music</FilterItem>
    </FilterGroup>
  ),
}

export const PreSelected: Story = {
  args: {
    selectionMode: 'multiple',
    defaultSelectedKeys: ['news', 'gaming'],
    'aria-label': 'Categories',
  },
  render: (args) => (
    <FilterGroup {...args}>
      <FilterItem id="news">News</FilterItem>
      <FilterItem id="travel">Travel</FilterItem>
      <FilterItem id="gaming">Gaming</FilterItem>
      <FilterItem id="music">Music</FilterItem>
    </FilterGroup>
  ),
}

const ControlledExample = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    () => new Set(['news']),
  )

  return (
    <FilterGroup
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      aria-label="Categories"
    >
      <FilterItem id="news">News</FilterItem>
      <FilterItem id="travel">Travel</FilterItem>
      <FilterItem id="gaming">Gaming</FilterItem>
      <FilterItem id="music">Music</FilterItem>
    </FilterGroup>
  )
}

export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledExample />,
}
