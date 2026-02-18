import type { Meta, StoryObj } from '@storybook/react-vite'

import { Typography } from '../Typography'

import { Link } from '.'

const meta = {
  title: 'components/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

export const DefaultVariant: Story = {
  name: 'Default Variant 🚧',
  args: {
    href: 'https://worldline.com',
    variant: 'default',
    children: (
      <Typography
        element="span"
        textStyle="textSmRegular"
        textColor="contentPrimary"
      >
        Visit Worldline
      </Typography>
    ),
  },
}

export const ButtonVariant: Story = {
  args: {
    href: 'https://worldline.com',
    variant: 'button',
    children: 'Visit Worldline',
  },
}

export const ButtonVariantWithCustomElement: Story = {
  args: {
    href: 'https://worldline.com',
    variant: 'button',
    render: (domProps) => {
      if ('href' in domProps) {
        // Here you can render a different element instead of an anchor, for example, a React Router Link
        return <a {...domProps} />
      }
      throw new Error("Expected 'href' in domProps for Link component")
    },
    children: 'Visit Worldline',
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates how to use the \`render\` prop to customize the rendered element. In this example, we render a standard anchor tag, but you could replace it with a React Router Link or any other component. You would typically create your own Link component that wraps the Aurora Link and provides this custom rendering logic, so you can use it throughout your application without needing to specify the \`render\` prop each time.

 \`\`\`tsx
import { Link as AuroraLink } from '@worldline/aurora-react/components'
import type { ComponentProps } from 'react'
import { Link as RRLink } from 'react-router'

import type { DistributiveOmit } from '@/types/utils'

type Props = DistributiveOmit<ComponentProps<typeof AuroraLink>, 'href'> &
  ComponentProps<typeof RRLink>

const Link = (props: Props) => (
  <AuroraLink
    {...props}
    href="#" // Must provide an href due to React Aria's Link component requirements
    render={(domProps) => {
      if ('href' in domProps) {
        return <RRLink {...domProps} to={props.to} />
      }
      throw new Error("Expected 'to' in domProps for Link component")
    }}
  >
    {props.children}
  </AuroraLink>
)

export { Link }
\`\`\`

The \`DistributiveOmit\` is a TypeScript utility type that allows us to omit a property from a union type. This is needed to exclude \`href\` from the Aurora Link props in favor of React Router's \`to\` prop.
 \`\`\`tsx
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never
\`\`\`
`,
      },
      source: {
        code: `
<Link
  href="https://worldline.com"
  variant="button"
  render: (domProps) => {
    if ('href' in domProps) {
      // Here you can render a different element instead of an anchor, for example, a React Router Link
      return <a {...domProps} />
    }
    throw new Error("Expected 'href' in domProps for Link component")
  }
>
  Visit Worldline
</Link>
`,
      },
    },
  },
}
