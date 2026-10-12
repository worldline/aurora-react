import type { Meta, StoryObj } from '@storybook/react-vite'

import { ArrowForwardIcon, BlockIcon } from '../icons'
import { TilesGroup } from './TilesGroup'

const trailingArrow = <ArrowForwardIcon aria-hidden />

const horizontalContainerStyle = {
  width: '100%',
  maxWidth: 400,
} as const

const verticalContainerStyle = {
  width: '100%',
  maxWidth: 242,
} as const

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
  render: () => (
    <div style={horizontalContainerStyle}>
      <TilesGroup selectionMode="none" aria-label="Actions">
        {actions.map((action) => (
          <TilesGroup.Item
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
    </div>
  ),
}

export const Selected: Story = {
  render: () => (
    <div style={horizontalContainerStyle}>
      <TilesGroup
        selectionMode="single"
        defaultSelectedKeys={['1']}
        aria-label="Actions"
      >
        {actions.map((action) => (
          <TilesGroup.Item
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
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={horizontalContainerStyle}>
      <TilesGroup selectionMode="none" aria-label="Actions">
        {actions.map((action) => (
          <TilesGroup.Item
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
    </div>
  ),
}

export const MultiSelect: Story = {
  render: () => (
    <div style={horizontalContainerStyle}>
      <TilesGroup
        selectionMode="multiple"
        defaultSelectedKeys={['1', '3']}
        aria-label="Actions"
      >
        {actions.map((action) => (
          <TilesGroup.Item
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
    </div>
  ),
}

export const VerticalOrientation: Story = {
  render: () => (
    <div style={verticalContainerStyle}>
      <TilesGroup selectionMode="none" aria-label="Actions">
        {actions.map((action) => (
          <TilesGroup.Item
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
    </div>
  ),
}

export const HorizontalOrientation: Story = {
  render: () => (
    <div style={horizontalContainerStyle}>
      <TilesGroup
        selectionMode="none"
        aria-label="Actions"
        orientation="horizontal"
      >
        {actions.map((action) => (
          <TilesGroup.Item
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
    </div>
  ),
}
