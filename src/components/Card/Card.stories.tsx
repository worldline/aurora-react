import type { Meta, StoryObj } from '@storybook/react-vite'

import { Typography } from '../Typography'

import { Card } from './index'

const meta = {
  title: 'components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const CardWithContent: Story = {
  args: {
    children: (
      <div>
        <Typography
          element="h1"
          textStyle="textLgMedium"
          textColor="contentPrimary"
          style={{ marginTop: 0 }}
        >
          Card title
        </Typography>
        <Typography
          element="p"
          textStyle="textMdRegular"
          textColor="contentSecondary"
          style={{ marginBottom: 0 }}
        >
          Card text
        </Typography>
      </div>
    ),
  },
}
