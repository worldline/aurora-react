import type { Meta, StoryObj } from '@storybook/react-vite'
import { GridListItem } from 'react-aria-components'

import { CheckCircleIcon, PhotoCameraIcon } from '../icons'

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

const tileItems = [
  {
    title: 'First Tile',
    overline: 'Category A',
    description: 'Description for the first tile.',
  },
]

const documents = [
  {
    id: '1',
    fileName: 'contract.pdf',
    size: '124 KB',
    uploadedAt: '2026-01-15',
    url: '/api/files/contract.pdf',
  },
  {
    id: '2',
    fileName: 'invoice.pdf',
    size: '98 KB',
    uploadedAt: '2026-02-03',
    url: '/api/files/invoice.pdf',
  },
  {
    id: '3',
    fileName: 'report.pdf',
    size: '340 KB',
    uploadedAt: '2026-03-10',
    url: '/api/files/report.pdf',
  },
  {
    id: '4',
    fileName: 'summary.pdf',
    size: '57 KB',
    uploadedAt: '2026-03-28',
    url: '/api/files/summary.pdf',
  },
] as const

export const LinkDownload: Story = {
  args: {
    title: '',
    trailing: null,
  },
  render: () => (
    <TilesGroup selectionMode="none" aria-label="Documents">
      {documents.map((doc) => (
        <TileItem
          key={doc.id}
          id={doc.id}
          visualAsset={<PhotoCameraIcon />}
          textValue={doc.fileName}
          title={doc.fileName}
          description={`Size: ${doc.size} · Uploaded: ${doc.uploadedAt}`}
          href={doc.url}
          trailing={<CheckCircleIcon />}
        />
      ))}
    </TilesGroup>
  ),
}

export const ActionDownload: Story = {
  args: {
    title: '',
    trailing: null,
  },
  render: () => (
    <TilesGroup
      selectionMode="none"
      aria-label="Documents"
      onAction={() => ({})}
    >
      {documents.map((doc, idx) => (
        <TileItem
          key={doc.id}
          id={doc.id}
          visualAsset={<PhotoCameraIcon />}
          textValue={doc.fileName}
          title={doc.fileName}
          isDisabled={idx === 1}
          description={`Size: ${doc.size} · Uploaded: ${doc.uploadedAt}`}
          trailing={<CheckCircleIcon />}
          orientation={idx % 2 === 0 ? 'horizontal' : 'vertical'}
        />
      ))}
    </TilesGroup>
  ),
}

export const DefaultVariant: Story = {
  name: 'Default Variant 🚧',
  args: {
    title: 'Tile Title',
    trailing: null,
    overline: 'Overline',
    description: 'Supporting description for the tile.',
    orientation: 'horizontal',
    selected: false,
    disabled: false,
  },
  render: (args) => (
    <TilesGroup aria-label="Tiles group example">
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
