import cn from 'classnames'
import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabPanel as AriaTabPanel,
  type TabsProps as AriaTabsProps,
  type TabListProps as AriaTabListProps,
  type TabProps as AriaTabProps,
  type TabPanelProps as AriaTabPanelProps,
} from 'react-aria-components'

import { Typography, type TextColor } from '@/components/Typography'

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
