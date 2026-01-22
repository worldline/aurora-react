import { useState, type ComponentType, type SVGProps } from 'react'

import preview from '@/storybook/preview'

import styles from './Icons.stories.module.css'

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string }

const iconModules = import.meta.glob<{ default: ComponentType<IconProps> }>(
  ['./*.tsx', '!./Icons.stories.tsx'],
  { eager: true },
)

const icons = Object.entries(iconModules).map(([path, module]) => {
  const name = path.split('/').pop()?.replace('.tsx', '') ?? ''
  return { name, Icon: module.default }
})

const IconsGallery = () => {
  const [search, setSearch] = useState('')

  const filteredIcons = icons.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <div className={styles.icons}>
        <h1 className={styles['icons-title']}>Icons</h1>
        <p className={styles['icons-description']}>
          These are the icons being used in our design system. They are
          available as React components.
        </p>
        <input
          type="text"
          className={styles['icons-search']}
          placeholder="Search icons..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
        />
        <div className={styles['icons-grid']}>
          {filteredIcons.length > 0 ? (
            filteredIcons.map(({ name, Icon }) => (
              <div key={name} className={styles['icons-item']}>
                <div className={styles['icons-item-wrapper']}>
                  <Icon size={48} />
                </div>
                <span className={styles['icons-name']}>{name}</span>
              </div>
            ))
          ) : (
            <div className={styles['icons-empty']}>
              No icons found for "{search}"
            </div>
          )}
        </div>
        <div className={styles['icons-usage']}>
          <h2 className={styles['icons-usage-title']}>Usage</h2>
          <p className={styles['icons-usage-text']}>
            Import the icon component and use it in your React components.
          </p>
          <pre className={styles['icons-usage-code']}>
            <code>{`
import { XxxxxIcon } from from '@.........'
<XxxxxIcon size={24} /> 
            `}</code>
          </pre>
        </div>
      </div>
    </>
  )
}

const meta = preview.meta({
  title: 'Icons',
  component: IconsGallery,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
})

export const Icons = meta.story()
