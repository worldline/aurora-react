import { type ComponentType } from 'react'

import preview from '@/storybook/preview'

import { type IconProps, IconsGallery } from '../IconsGallery'

const iconModules = import.meta.glob<{ default: ComponentType<IconProps> }>(
  ['./*.tsx', '!./Basics.stories.tsx'],
  { eager: true },
)

const icons = Object.entries(iconModules).map(([path, module]) => {
  const name = path.split('/').pop()?.replace('.tsx', '') ?? ''
  return { name, Icon: module.default }
})

const meta = preview.meta({
  title: 'components/Icons/Basics',
  component: IconsGallery,
  args: {
    title: 'Basics',
    icons,
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
})

export const Basics = meta.story()
