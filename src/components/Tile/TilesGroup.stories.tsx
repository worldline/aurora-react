import type { Meta, StoryObj } from '@storybook/react-vite'

import { BlockIcon } from '../icons'

import { TileItem } from './TileItem'
import { TilesGroup } from './TilesGroup'

const trailingArrow = <span aria-hidden="true">→</span>

const meta = {
  title: 'components/Tile/TilesGroup',
  component: TilesGroup,
  parameters: {
    layout: 'centered',
  },
  args: {
    'aria-label': 'Actions',
  },
} satisfies Meta<typeof TilesGroup>

export default meta

type Story = StoryObj<typeof meta>

const actions = [
  {
    id: '1',
    overline: 'Overline 1',
    title: 'Title 1',
    description: 'Description 1',
    isDisabled: false,
  },
  {
    id: '2',
    overline: 'Overline 2',
    title: 'Title 2',
    description: 'Description 2',
    isDisabled: false,
  },
  {
    id: '3',
    overline: 'Overline 3',
    title: 'Title 3',
    description: 'Description 3',
    isDisabled: false,
  },
] as const

export const ActionItems: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <TilesGroup selectionMode="none" aria-label="Actions">
      {actions.map((action) => (
        <TileItem
          key={action.id}
          id={action.id}
          textValue={action.title}
          overline={action.overline}
          title={action.title}
          description={action.description}
          isDisabled={action.isDisabled}
          onAction={() => ({})}
          icon={<BlockIcon aria-hidden />}
          trailing={trailingArrow}
        />
      ))}
    </TilesGroup>
  ),
}

export const Selected: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <TilesGroup
      selectionMode="single"
      defaultSelectedKeys={['1']}
      aria-label="Actions"
    >
      {actions.map((action) => (
        <TileItem
          key={action.id}
          id={action.id}
          textValue={action.title}
          overline={action.overline}
          title={action.title}
          description={action.description}
          icon={<BlockIcon aria-hidden />}
          trailing={trailingArrow}
        />
      ))}
    </TilesGroup>
  ),
}

export const Disabled: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <TilesGroup selectionMode="none" aria-label="Actions">
      {actions.map((action) => (
        <TileItem
          key={action.id}
          id={action.id}
          textValue={action.title}
          overline={action.overline}
          title={action.title}
          description={action.description}
          isDisabled
          onAction={() => ({})}
          icon={<BlockIcon aria-hidden />}
          trailing={trailingArrow}
        />
      ))}
    </TilesGroup>
  ),
}

export const MultiSelect: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <TilesGroup
      selectionMode="multiple"
      defaultSelectedKeys={['1', '3']}
      aria-label="Actions"
    >
      {actions.map((action) => (
        <TileItem
          key={action.id}
          id={action.id}
          textValue={action.title}
          overline={action.overline}
          title={action.title}
          description={action.description}
          icon={<BlockIcon aria-hidden />}
          trailing={trailingArrow}
        />
      ))}
    </TilesGroup>
  ),
}

export const VerticalOrientation: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '242px' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <TilesGroup selectionMode="none" aria-label="Actions">
      {actions.map((action) => (
        <TileItem
          key={action.id}
          id={action.id}
          textValue={action.title}
          overline={action.overline}
          title={action.title}
          description={action.description}
          onAction={() => ({})}
          icon={<BlockIcon aria-hidden />}
          trailing={trailingArrow}
          orientation="vertical"
        />
      ))}
    </TilesGroup>
  ),
}
