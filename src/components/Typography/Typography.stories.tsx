import preview from '@/storybook/preview'

import { Typography } from '.'

const meta = preview.meta({
  title: 'Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
})

export const Light = meta.story({
  args: {
    element: 'p',
    textStyle: 'Heading2Subheading',
    textColor: 'active',
    children: 'Hello world !',
  },
})

export const Dark = meta.story({
  args: {
    element: 'p',
    textStyle: 'Heading2Subheading',
    textColor: 'active',
    children: 'Hello world !',
  },
  render: (args) => (
    <div className="dark">
      <Typography {...args} />
    </div>
  ),
})

export const DarkWithTextActive = meta.story({
  args: {
    element: 'p',
    textStyle: 'Heading2Subheading',
    textColor: 'active',
    children: 'Hello world !',
  },
  render: (args) => (
    <div className="dark">
      <Typography {...args} />
    </div>
  ),
})
