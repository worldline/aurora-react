import { useState, type ComponentType, type SVGProps } from 'react'

import { FeaturedIcon } from '@/components/FeaturedIcon'
import { InputField } from '@/components/Form/InputField'
import preview from '@/storybook/preview'

import { Code } from '../storybook/Code'
import { Typography } from '../Typography'

import styles from './Icons.stories.module.css'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string
  title: string
}

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
        <Typography element="h1" textStyle="titleLg" textColor="contentPrimary">
          Icons
        </Typography>
        <Typography
          className={styles.paragraph}
          element="p"
          textStyle="bodyMd"
          textColor="contentPrimary"
        >
          These are the icons being used in our design system. They are
          available as React components.
        </Typography>
        <InputField
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(value) => {
            setSearch(value)
          }}
        />
        <div className={styles['icons-grid']}>
          {filteredIcons.length > 0 ? (
            filteredIcons.map(({ name, Icon }) => (
              <div key={name} className={styles['icons-item']}>
                <FeaturedIcon
                  icon={<Icon title="alt text" />}
                  type="square"
                  emphasis="medium"
                  size="2xlarge"
                />
                <Typography
                  element="span"
                  textStyle="labelSm"
                  textColor="contentPrimary"
                >
                  {name}
                </Typography>
              </div>
            ))
          ) : (
            <Typography
              element="p"
              textStyle="labelMd"
              textColor="contentSecondary"
              className={styles['icons-empty']}
            >
              No icons found for "{search}"
            </Typography>
          )}
        </div>
        <Typography
          element="h2"
          textStyle="titleMd"
          textColor="contentPrimary"
          className={styles['icons-usage-title']}
        >
          Usage
        </Typography>
        <Typography
          className={styles.paragraph}
          element="p"
          textStyle="bodyMd"
          textColor="contentPrimary"
        >
          Import the icon component and use it in your React components.
        </Typography>
        <Code>
          {"import {XxxxxIcon} from '@worldline/aurora-react/components"}
          {'\n'}
          {'<XxxxxIcon size={24} />'}
        </Code>
        <Typography
          className={styles.paragraph}
          element="p"
          textStyle="bodyMd"
          textColor="contentPrimary"
        >
          For decorative icons you should set the{' '}
          <Code inline>aria-hidden</Code> attribute to hide them from assistive
          technologies. For informative icons, you should provide a useful{' '}
          <Code inline>title</Code>.
        </Typography>
        <Code>
          {
            '<CheckIcon size={24} aria-hidden />\n<WorldlineLogoLargeIcon size={24} title="Worldline logo" />'
          }
        </Code>
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
