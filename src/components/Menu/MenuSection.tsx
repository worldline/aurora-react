import {
  MenuSection as AriaMenuSection,
  Collection,
  Header,
  type SectionProps,
} from 'react-aria-components'

import { Typography } from '../Typography'
import styles from './MenuSection.module.css'

interface MenuSectionProps<T extends object> extends SectionProps<T> {
  title?: string
}

const MenuSection = <T extends object>({
  title,
  children,
  items,
  ...props
}: MenuSectionProps<T>) => (
  <AriaMenuSection {...props}>
    {title ? (
      <Header className={styles.title}>
        <Typography
          element="span"
          textStyle="captionMd"
          textColor="contentSecondary"
        >
          {title}
        </Typography>
      </Header>
    ) : null}
    {typeof children === 'function' ? (
      <Collection items={items}>{children}</Collection>
    ) : (
      children
    )}
  </AriaMenuSection>
)

export { MenuSection, type MenuSectionProps }
