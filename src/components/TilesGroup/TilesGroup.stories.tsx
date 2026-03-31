import type { Meta, StoryObj } from '@storybook/react-vite'

import { ArrowForwardIcon, BlockIcon } from '../icons'

import { Tile } from './Tile'
import { TileItem } from './TileItem'
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

const actions = [
  {
    id: '1',
    overline: 'Overline 1',
    title: 'Title 1',
    description: 'Description 1',
  },
  {
    id: '2',
    overline: 'Overline 2',
    title: 'Title 2',
    description: 'Description 2',
  },
] as const

export const ActionDownload: Story = {
  args: {
    title: '',
    trailing: null,
  },
  render: () => (
    <TilesGroup selectionMode="none" aria-label="Actions">
      {actions.map((doc, idx) => (
        <TileItem
          key={doc.id}
          id={doc.id}
          icon={<BlockIcon />}
          title={doc.title}
          isDisabled={idx === 1}
          description={doc.description}
          trailing={<ArrowForwardIcon />}
          orientation={idx % 2 === 0 ? 'horizontal' : 'vertical'}
          onAction={() => ({})}
        />
      ))}
    </TilesGroup>
  ),
}
