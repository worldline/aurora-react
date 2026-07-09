import type { Meta, StoryObj } from '@storybook/react-vite'

import { Breadcrumbs } from '.'

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
        style={{ background: 'var(--au-surface-neutral-low)', padding: '1rem' }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

const homeItem = { id: 'home', label: 'Home', href: '/' }

export const HomeOnly: Story = {
  name: 'Home only',
  args: {
    items: [homeItem],
  },
}

export const TwoLevels: Story = {
  name: 'Two levels',
  args: {
    items: [homeItem, { id: 'current', label: 'Level 1', href: '/level-1' }],
  },
}

export const ThreeLevels: Story = {
  name: 'Three levels',
  parameters: {
    docs: {
      description: {
        story: `
Each item in the \`items\` array requires three fields:

- \`id\` — unique identifier for the breadcrumb item
- \`label\` — visible text (and screen-reader label for the home icon)
- \`href\` — URL the item links to

Position in the array determines how each item is rendered:

| Position | Rendering |
|---|---|
| First | Home icon link (navigable) |
| Middle | Text link (navigable) |
| Last | Plain text — current page, non-interactive |

\`\`\`tsx
<Breadcrumbs
  items={[
    { id: 'home',    label: 'Home',    href: '/' },
    { id: 'level-1', label: 'Level 1', href: '/level-1' },
    { id: 'current', label: 'Level 2', href: '/level-1/level-2' },
  ]}
/>
\`\`\`
`,
      },
    },
  },
  args: {
    items: [
      homeItem,
      { id: 'level-1', label: 'Level 1', href: '/level-1' },
      { id: 'current', label: 'Level 2', href: '/level-1/level-2' },
    ],
  },
}

export const WithCustomRenderLink: Story = {
  name: 'With custom renderLink',
  parameters: {
    docs: {
      description: {
        story: `
By default the Breadcrumbs component renders navigable items as plain \`<a>\` tags, which trigger a full-page reload in single-page applications.
Use the \`renderLink\` prop to replace those anchors with your router's Link component so navigation stays client-side.

The function receives all DOM props that would normally go on an \`<a>\` — including \`href\`, \`className\`, and \`aria-*\` attributes — and must spread them on the element it returns.
The last item (current page) is rendered as non-interactive text and never passed to \`renderLink\`.

**React Router example**

\`\`\`tsx
import { Breadcrumbs } from '@worldline/aurora-react/components'
import type { RenderLink } from '@worldline/aurora-react/components'
import { Link as RRLink } from 'react-router'

const renderLink: RenderLink = (domProps) => {
  if ('href' in domProps) {
    return <RRLink {...domProps} to={domProps.href} />
  }
  throw new Error("Expected 'href' in domProps for Breadcrumbs renderLink")
}

<Breadcrumbs items={items} renderLink={renderLink} />
\`\`\`

**Next.js example**

\`\`\`tsx
import { Breadcrumbs } from '@worldline/aurora-react/components'
import type { RenderLink } from '@worldline/aurora-react/components'
import NextLink from 'next/link'

const renderLink: RenderLink = (domProps) => {
  if ('href' in domProps) {
    return <NextLink {...domProps} href={domProps.href} />
  }
  throw new Error("Expected 'href' in domProps for Breadcrumbs renderLink")
}

<Breadcrumbs items={items} renderLink={renderLink} />
\`\`\`

**Recommended pattern — wrap once, use everywhere**

Rather than passing \`renderLink\` at every call site, wrap the Aurora Breadcrumbs once in your own \`Breadcrumbs\` component and pre-wire the prop:

\`\`\`tsx
import {
  Breadcrumbs as AuroraBreadcrumbs,
  type BreadcrumbItemData,
  type RenderLink,
} from '@worldline/aurora-react/components'
import { Link as RRLink } from 'react-router'

type BreadcrumbItemWithOptionalHref = Omit<BreadcrumbItemData, 'href'> & {
  href?: string
}

interface BreadcrumbsProps {
  'aria-label'?: string
  className?: string
  items: ReadonlyArray<BreadcrumbItemWithOptionalHref>
}

const renderLink: RenderLink = (domProps) => {
  if ('href' in domProps) {
    return <RRLink {...domProps} to={domProps.href} />
  }
  throw new Error("Expected 'href' in domProps for Link component")
}

const toAuroraItem = (
  item: BreadcrumbItemWithOptionalHref,
): BreadcrumbItemData => ({
  ...item,
  href: item.href ?? '',
})

const Breadcrumbs = ({ items, ...props }: BreadcrumbsProps) => (
  <AuroraBreadcrumbs
    {...props}
    items={items.map(toAuroraItem)}
    renderLink={renderLink}
  />
)

export { Breadcrumbs }
\`\`\`

This wrapper also makes \`href\` optional on each item, which is useful for the current (last) page where a URL is meaningless.
In this story a plain \`<a>\` with \`preventDefault\` simulates a router link so navigation works inside Storybook.
`,
      },
    },
  },
  args: {
    items: [
      homeItem,
      { id: 'level-1', label: 'Level 1', href: '/level-1' },
      { id: 'current', label: 'Level 2', href: '/level-1/level-2' },
    ],
    renderLink: (props) => {
      if ('href' in props) {
        return (
          <a
            {...props}
            onClick={(event) => {
              event.preventDefault()
            }}
          />
        )
      }
      return <span {...props} />
    },
  },
}
