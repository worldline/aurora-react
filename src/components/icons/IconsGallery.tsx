import { useState, type SVGProps } from 'react'

import { FeaturedIcon } from '@/components/FeaturedIcon'
import { InputField } from '@/components/Form/InputField'

import { Code } from '../storybook/Code'
import { Typography } from '../Typography'

import styles from './Icons.stories.module.css'

const IconsGallery = ({
  title,
  icons,
}: {
  title: string
  icons: ReadonlyArray<{
    name: string
    Icon: React.ComponentType<{ title: string }>
  }>
}) => {
  const [search, setSearch] = useState('')

  const filteredIcons = icons.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <div className={styles.icons}>
        <Typography element="h1" textStyle="titleLg" textColor="contentPrimary">
          {title}
        </Typography>
        <Typography
          className={styles.paragraph}
          element="p"
          textStyle="bodyMd"
          textColor="contentPrimary"
        >
          Icons available in Aurora design system. They are available as React
          components.
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
                  icon={<Icon title={name} />}
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
            '<SomeDecorativeIcon size={24} aria-hidden />\n<NonDecorativeIcon size={24} title="Descriptive title" />'
          }
        </Code>
      </div>
    </>
  )
}

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string
  title: string
}

export { IconsGallery, type IconProps }
