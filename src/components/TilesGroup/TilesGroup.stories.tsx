import type { Meta, StoryObj } from '@storybook/react-vite'
import { GridListItem } from 'react-aria-components'

import { ArrowForwardIcon, BlockIcon } from '../icons'

import { Tile } from './Tile'
import { TilesGroup } from './TilesGroup'

const meta = {
  title: 'components/TilesGroup',
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
  },
] as const

export const ActionItems: Story = {
  render: () => (
    <TilesGroup selectionMode="none" aria-label="Actions">
      {actions.map((action, idx) => (
        <GridListItem
          key={action.id}
          id={action.id}
          textValue={action.title}
          isDisabled={idx === 1}
          onAction={() => ({})}
        >
          {({ isSelected, isFocused, isHovered, isDisabled }) => (
            <Tile
              icon={<BlockIcon />}
              title={action.title}
              overline={action.overline}
              description={action.description}
              trailing={<ArrowForwardIcon />}
              orientation={idx % 2 === 0 ? 'horizontal' : 'vertical'}
              selected={isSelected}
              focused={isFocused}
              hovered={isHovered}
              disabled={isDisabled}
            />
          )}
        </GridListItem>
      ))}
    </TilesGroup>
  ),
}
