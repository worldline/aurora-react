import { type ComponentType } from 'react'

import preview from '@/storybook/preview'

import { type IconProps, IconsGallery } from '../IconsGallery'

const iconModules = import.meta.glob<{ default: ComponentType<IconProps> }>(
  ['./*.tsx', '!./FileTypes.stories.tsx'],
  { eager: true },
)

const icons = Object.entries(iconModules).map(([path, module]) => {
  const name = path.split('/').pop()?.replace('.tsx', '') ?? ''
  return { name, Icon: module.default }
})

const meta = preview.meta({
  title: 'components/Icons/File Types',
  component: IconsGallery,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'File Types',
    icons,
  },
  tags: ['!autodocs'],
})

export const FileTypes = meta.story()
