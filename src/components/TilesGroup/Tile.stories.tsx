import type { Meta, StoryObj } from '@storybook/react-vite'
import { GridListItem } from 'react-aria-components'

import { CheckCircleIcon, PhotoCameraIcon } from '../icons'

import { Tile } from './Tile'
import { TilesGroup } from './TilesGroup'

const meta = {
  title: 'components/TilesGroup',
  component: Tile,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tile>

export default meta

type Story = StoryObj<typeof meta>

const tileItems = [
  {
    title: 'First Tile',
    overline: 'Category A',
    description: 'Description for the first tile.',
  },
]

export const DefaultVariant: Story = {
  name: 'Default Variant 🚧',
  args: {
    title: 'Tile Title',
    overline: 'Overline',
    description: 'Supporting description for the tile.',
    orientation: 'horizontal',
    selected: false,
    disabled: false,
  },
  render: (args) => (
    <TilesGroup areaLabel="Tiles group example">
      {tileItems.map((item) => (
        <GridListItem key={item.title} id={item.title}>
          <Tile
            {...args}
            title={item.title}
            overline={item.overline}
            description={item.description}
            visualAsset={<PhotoCameraIcon />}
            trailing={<CheckCircleIcon />}
          />
        </GridListItem>
      ))}
    </TilesGroup>
  ),
}
