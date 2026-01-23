import { useState, type ComponentType, type SVGProps } from 'react'

import preview from '@/storybook/preview'

import { Card } from '../Card'
import { Code } from '../storybook/Code'
import { Typography } from '../Typography'

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
        <Typography
          element="h1"
          textStyle="displayLgSemibold"
          textColor="contentPrimary"
        >
          Icons
        </Typography>
        <Typography
          element="p"
          textStyle="textMdRegular"
          textColor="contentPrimary"
        >
          These are the icons being used in our design system. They are
          available as React components.
        </Typography>
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
                <Typography
                  element="span"
                  textStyle="textMdRegular"
                  textColor="contentPrimary"
                >
                  {name}
                </Typography>
              </div>
            ))
          ) : (
            <Typography
              element="p"
              textStyle="textMdRegular"
              textColor="contentSecondary"
              className={styles['icons-empty']}
            >
              No icons found for "{search}"
            </Typography>
          )}
        </div>
        <Card className={styles['icons-usage']}>
          <Typography
            element="h2"
            textStyle="displayMdSemibold"
            textColor="contentPrimary"
            className={styles['icons-usage-title']}
          >
            Usage
          </Typography>
          <Typography
            element="p"
            textStyle="textMdRegular"
            textColor="contentPrimary"
          >
            Import the icon component and use it in your React components.
          </Typography>
          <Code>
            {
              "import { XxxxxIcon } from '@worldline/aurora-react/components'\n<XxxxxIcon size={24} />"
            }
          </Code>
        </Card>
      </div>
    </>
  )
}

const meta = preview.meta({
  title: 'components/Icons',
  component: IconsGallery,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
})

export const Icons = meta.story()
