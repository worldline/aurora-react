import type { ReactNode } from 'react'

import { Typography } from '../Typography'

export interface TabData {
  id: string
  label: string
  content: ReactNode
  isDisabled?: boolean
}

export const basicTabs: ReadonlyArray<TabData> = [
  {
    id: 'overview',
    label: 'Overview',
    content: null,
  },
  {
    id: 'details',
    label: 'Details',
    content: null,
  },
  {
    id: 'settings',
    label: 'Settings',
    content: null,
  },
  {
    id: 'help',
    label: 'Help',
    content: null,
  },
]

export const tabsWithDisabled: ReadonlyArray<TabData> = [
  {
    id: 'active',
    label: 'Active',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Active content.
      </Typography>
    ),
  },
  {
    id: 'inactive',
    label: 'Inactive',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Inactive content.
      </Typography>
    ),
  },
  {
    id: 'disabled',
    label: 'Disabled',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Disabled content.
      </Typography>
    ),
    isDisabled: true,
  },
  {
    id: 'another',
    label: 'Another Tab',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Another Tab content.
      </Typography>
    ),
  },
]

export const richContentTabs: ReadonlyArray<TabData> = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Overview content goes here.
      </Typography>
    ),
  },
  {
    id: 'details',
    label: 'Details',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Details content goes here.
      </Typography>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Settings content goes here.
      </Typography>
    ),
  },
  {
    id: 'help',
    label: 'Help',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Help content goes here.
      </Typography>
    ),
  },
]

export const disabledTabs: ReadonlyArray<TabData> = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Overview content goes here.
      </Typography>
    ),
    isDisabled: true,
  },
  {
    id: 'details',
    label: 'Details',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Details content goes here.
      </Typography>
    ),
    isDisabled: true,
  },
]

export const longLabelTabs: ReadonlyArray<TabData> = [
  {
    id: 'dashboard',
    label: 'Dashboard Overview',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Dashboard content.
      </Typography>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics & Reports',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Analytics content.
      </Typography>
    ),
  },
  {
    id: 'settings',
    label: 'Settings & Configuration',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Settings content.
      </Typography>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications Center',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Notifications content.
      </Typography>
    ),
  },
  {
    id: 'help',
    label: 'Help & Documentation',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Help content.
      </Typography>
    ),
  },
]

export const richContentTabsWithTypography = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Overview content goes here.
      </Typography>
    ),
  },
  {
    id: 'details',
    label: 'Details',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Details content goes here.
      </Typography>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    content: (
      <Typography element="p" textStyle="bodyMd">
        Settings content goes here.
      </Typography>
    ),
  },
  {
    id: 'help',
    label: 'Help',
    content: (
      <div>
        <Typography
          element="h1"
          textStyle="titleMd"
          textColor="contentPrimary"
          style={{ marginTop: 0 }}
        >
          Help title
        </Typography>
        <Typography
          element="p"
          textStyle="bodyMd"
          textColor="contentSecondary"
          style={{ marginBottom: 0 }}
        >
          Help text
        </Typography>
      </div>
    ),
  },
] as const
