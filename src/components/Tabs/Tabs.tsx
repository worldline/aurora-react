import cn from 'classnames'
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components'

import { type TextColor, Typography } from '@/components/Typography'

import styles from './Tabs.module.css'

type TabsProps = AriaTabsProps

const TabsBase = ({ className, ...props }: TabsProps) => (
  <AriaTabs className={className} {...props} />
)

interface TabListProps extends AriaTabListProps<object> {
  behaviour?: 'left' | 'fill'
}

const TabList = ({ className, behaviour = 'fill', ...props }: TabListProps) => (
  <AriaTabList
    className={cn(styles.tabs, className)}
    data-behaviour={behaviour}
    {...props}
  />
)

interface TabProps extends Omit<AriaTabProps, 'children'> {
  label: string
}
const getTextColor = (
  isDisabled: boolean | undefined,
  isSelected: boolean,
  isHovered: boolean,
): TextColor => {
  if (isDisabled) {
    return 'contentDisabled'
  }
  if (isSelected || isHovered) {
    return 'contentPrimary'
  }
  return 'contentSecondary'
}

const Tab = ({ className, label, isDisabled, ...props }: TabProps) => (
  <AriaTab
    className={cn(styles.tab, className)}
    isDisabled={isDisabled}
    {...props}
  >
    {({ isSelected, isHovered }) => (
      <Typography
        element="span"
        textStyle="labelSm"
        textColor={getTextColor(isDisabled, isSelected, isHovered)}
      >
        {label}
      </Typography>
    )}
  </AriaTab>
)

type TabPanelProps = AriaTabPanelProps

const TabPanel = ({ className, ...props }: TabPanelProps) => (
  <AriaTabPanel className={className} {...props} />
)

const Tabs = Object.assign(TabsBase, {
  List: TabList,
  Tab,
  Panel: TabPanel,
})

export { Tabs }
export type { TabsProps, TabListProps, TabProps, TabPanelProps }
