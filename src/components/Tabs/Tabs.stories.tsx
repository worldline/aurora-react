import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs } from './index'
import {
  basicTabs,
  disabledTabs,
  richContentTabsWithTypography,
  tabsWithDisabled,
} from './Tabs.fixtures'

const containerStyle = {
  minWidth: '400px',
} as const

const wideContainerStyle = {
  width: '600px',
} as const

const meta = {
  title: 'components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    selectedKey: {
      control: 'text',
      description:
        'The currently selected tab key (controlled). Use with onSelectionChange.',
      table: {
        type: { summary: 'Key | null' },
        category: 'Behaviour',
      },
    },
    defaultSelectedKey: {
      control: 'text',
      description: 'The initial selected tab key (uncontrolled)',
      table: {
        type: { summary: 'Key' },
        category: 'Behaviour',
      },
    },
    onSelectionChange: {
      action: 'selectionChanged',
      description: 'Handler called when the selected tab changes',
      table: {
        type: { summary: '(key: Key) => void' },
        category: 'Behaviour',
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether all tabs are disabled',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    disabledKeys: {
      control: 'object',
      description: 'Array of tab keys that should be disabled',
      table: {
        type: { summary: 'Iterable<Key>' },
        category: 'Behaviour',
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name',
      table: {
        type: { summary: 'string' },
        category: 'Appearance',
      },
    },
    children: {
      description:
        'Tab list and tab panels (use Tabs.List, Tabs.Tab, and Tabs.Panel components)',
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
  },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={containerStyle}>
      <Tabs>
        <Tabs.List aria-label="Navigation tabs">
          {basicTabs.map((tab) => (
            <Tabs.Tab key={tab.id} id={tab.id} label={tab.label} />
          ))}
        </Tabs.List>
        {basicTabs.map((tab) => (
          <Tabs.Panel key={tab.id} id={tab.id} style={{ padding: '10px' }}>
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  ),
}

export const WithDisabledTab: Story = {
  render: () => (
    <div style={{ width: '700px' }}>
      <Tabs>
        <Tabs.List aria-label="Navigation tabs">
          {tabsWithDisabled.map((tab) => (
            <Tabs.Tab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isDisabled={tab.isDisabled}
            />
          ))}
        </Tabs.List>
        {tabsWithDisabled.map((tab) => (
          <Tabs.Panel key={tab.id} id={tab.id} style={{ padding: '10px' }}>
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  ),
}

export const RichContent: Story = {
  render: () => (
    <div style={wideContainerStyle}>
      <Tabs defaultSelectedKey="overview">
        <Tabs.List aria-label="Navigation tabs">
          {richContentTabsWithTypography.map((tab) => (
            <Tabs.Tab key={tab.id} id={tab.id} label={tab.label} />
          ))}
        </Tabs.List>
        {richContentTabsWithTypography.map((tab) => (
          <Tabs.Panel key={tab.id} id={tab.id} style={{ padding: '10px' }}>
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  ),
}

export const AllDisabled: Story = {
  render: () => (
    <div style={containerStyle}>
      <Tabs>
        <Tabs.List aria-label="Navigation tabs">
          {disabledTabs.map((tab) => (
            <Tabs.Tab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isDisabled={tab.isDisabled}
            />
          ))}
        </Tabs.List>
        {disabledTabs.map((tab) => (
          <Tabs.Panel key={tab.id} id={tab.id} style={{ padding: '10px' }}>
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  ),
}

export const BehaviourLeft: Story = {
  render: () => (
    <div style={wideContainerStyle}>
      <Tabs>
        <Tabs.List aria-label="Navigation tabs" behaviour="left">
          {basicTabs.map((tab) => (
            <Tabs.Tab key={tab.id} id={tab.id} label={tab.label} />
          ))}
        </Tabs.List>
        {basicTabs.map((tab) => (
          <Tabs.Panel key={tab.id} id={tab.id}>
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  ),
}

export const BehaviourFill: Story = {
  render: () => (
    <div style={wideContainerStyle}>
      <Tabs>
        <Tabs.List aria-label="Navigation tabs" behaviour="fill">
          {basicTabs.map((tab) => (
            <Tabs.Tab key={tab.id} id={tab.id} label={tab.label} />
          ))}
        </Tabs.List>
        {basicTabs.map((tab) => (
          <Tabs.Panel key={tab.id} id={tab.id}>
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  ),
}
