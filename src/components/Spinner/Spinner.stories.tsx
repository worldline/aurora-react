import type { Meta, StoryObj } from '@storybook/react-vite'

import { HourglassTopIcon, SettingsIcon } from '@/components/icons'

import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs', 'stable'],
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
  },
  args: {
    role: 'status',
    size: 'sm',
    variant: 'line-simple',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['line-simple', 'line-spinner'],
      description: 'Visual variant of the spinner',
      table: {
        category: 'Appearance',
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Predefined size variant of the spinner and label',
      table: {
        category: 'Appearance',
      },
    },
    width: {
      control: 'text',
      description:
        'Custom width for the spinner icon container (overrides size width)',
      table: {
        category: 'Appearance',
      },
    },
    height: {
      control: 'text',
      description:
        'Custom height for the spinner icon container (overrides size height)',
      table: {
        category: 'Appearance',
      },
    },
    title: {
      control: 'text',
      description: 'Primary title text displayed under the spinner',
      table: {
        category: 'Content',
      },
    },
    icon: {
      control: false,
      description: 'Custom icon element replacing the default spinner icon',
      table: {
        category: 'Appearance',
      },
    },
    className: {
      table: {
        category: 'Appearance',
      },
    },
    role: {
      table: {
        category: 'Accessibility',
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {}

export const LineSimple: Story = {
  args: {
    variant: 'line-simple',
    size: 'md',
    title: 'Loading...',
  },
}

export const LineSpinner: Story = {
  args: {
    variant: 'line-spinner',
    size: 'md',
    title: 'Loading...',
  },
}

export const SizeSm: Story = {
  args: {
    size: 'sm',
    title: 'Loading...',
  },
}

export const SizeMd: Story = {
  args: {
    size: 'md',
    title: 'Loading...',
  },
}

export const SizeLg: Story = {
  args: {
    size: 'lg',
    title: 'Loading...',
  },
}

export const SizeXl: Story = {
  args: {
    size: 'xl',
    title: 'Loading...',
  },
}

export const WithoutTitle: Story = {
  args: {
    size: 'md',
  },
}

export const CustomSize: Story = {
  args: {
    width: 80,
    height: 80,
    title: 'Custom 80px',
  },
}

export const CustomIcon: Story = {
  args: {
    size: 'md',
    icon: <HourglassTopIcon aria-hidden />,
    title: 'Waiting for response...',
  },
}

export const SettingsIconSpinner: Story = {
  args: {
    size: 'lg',
    icon: <SettingsIcon aria-hidden />,
    title: 'Saving settings...',
  },
}

export const Playground: Story = {
  args: {
    variant: 'line-simple',
    size: 'md',
    title: 'Loading...',
  },
}
