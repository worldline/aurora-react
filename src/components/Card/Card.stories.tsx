import preview from '../../../.storybook/preview'
import { Text } from '../Text'
import { Typography } from '../Typography'

import { Card } from '.'

const meta = preview.meta({
  title: 'Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
})

export const Light = meta.story({
  args: {
    children: 'hello world !',
  },
})

export const Dark = meta.story({
  args: {
    children: 'hello world !',
  },
  render: (args) => (
    <div className="dark">
      <Card {...args} />
    </div>
  ),
})

export const DarkWithTextContent = meta.story({
  args: {
    children: (
      <Typography element="p" textStyle="label-2" textColor="active">
        Hello world !
      </Typography>
    ),
  },
  render: (args) => (
    <div className="dark">
      <Card {...args} />
    </div>
  ),
})
