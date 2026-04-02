import type { Meta, StoryObj } from '@storybook/react-vite'

import { BlockIcon } from '../icons'

import { Tile } from './Tile'
import { TilesGroup } from './TilesGroup'

const trailingArrow = <span aria-hidden="true">→</span>

const meta = {
  title: 'components/Tile/TilesGroup',
  component: TilesGroup,
  parameters: {
    layout: 'centered',
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
  render: () => (
    <TilesGroup selectionMode="none" aria-label="Actions">
      {actions.map((action) => (
        <Tile
          key={action.id}
          id={action.id}
          textValue={action.title}
          overline={action.overline}
          title={action.title}
          description={action.description}
          isDisabled={action.isDisabled}
          onAction={() => ({})}
          icon={<BlockIcon />}
          trailing={trailingArrow}
        />
      ))}
    </TilesGroup>
  ),
}

export const Selected: Story = {
  render: () => (
    <TilesGroup
      selectionMode="single"
      defaultSelectedKeys={['1']}
      aria-label="Actions"
    >
      {actions.map((action) => (
        <Tile
          key={action.id}
          id={action.id}
          textValue={action.title}
          overline={action.overline}
          title={action.title}
          description={action.description}
          icon={<BlockIcon />}
          trailing={trailingArrow}
        />
      ))}
    </TilesGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <TilesGroup selectionMode="none" aria-label="Actions">
      {actions.map((action) => (
        <Tile
          key={action.id}
          id={action.id}
          textValue={action.title}
          overline={action.overline}
          title={action.title}
          description={action.description}
          isDisabled
          onAction={() => ({})}
          icon={<BlockIcon />}
          trailing={trailingArrow}
        />
      ))}
    </TilesGroup>
  ),
}

export const MultiSelect: Story = {
  render: () => (
    <TilesGroup
      selectionMode="multiple"
      defaultSelectedKeys={['1', '3']}
      aria-label="Actions"
    >
      {actions.map((action) => (
        <Tile
          key={action.id}
          id={action.id}
          textValue={action.title}
          overline={action.overline}
          title={action.title}
          description={action.description}
          icon={<BlockIcon />}
          trailing={trailingArrow}
        />
      ))}
    </TilesGroup>
  ),
}

export const VerticalOrientation: Story = {
  render: () => (
    <TilesGroup selectionMode="none" aria-label="Actions">
      {actions.map((action) => (
        <Tile
          key={action.id}
          id={action.id}
          textValue={action.title}
          overline={action.overline}
          title={action.title}
          description={action.description}
          onAction={() => ({})}
          icon={<BlockIcon />}
          trailing={trailingArrow}
          orientation="vertical"
        />
      ))}
    </TilesGroup>
  ),
}
