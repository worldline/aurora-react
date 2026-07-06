import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'

import { Typography } from '../Typography'
import { Carousel } from './index'

const slideStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '200px',
  borderRadius: 'var(--au-radius-sm)',
} as const

const slides = [
  {
    label: 'Slide 1',
    background: 'var(--au-surface-brand-solid)',
    textColor: 'contentOnBrand' as const,
  },
  {
    label: 'Slide 2',
    background: 'var(--au-surface-info-solid)',
    textColor: 'contentPrimaryStatic' as const,
  },
  {
    label: 'Slide 3',
    background: 'var(--au-surface-success-solid)',
    textColor: 'contentPrimaryStatic' as const,
  },
  {
    label: 'Slide 4',
    background: 'var(--au-surface-warning-solid)',
    textColor: 'contentPrimaryStatic' as const,
  },
]

const meta = {
  title: 'components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Carousel\` component supports two advanced usage patterns worth knowing.

### Placing the Carousel inside a Card

When the Carousel sits inside a container with horizontal padding (e.g. a Card with \`--au-spacing-md\` padding),
the first slide appears indented while subsequent slides reach the edge — because the first slide receives a built-in
\`padding-left: var(--au-spacing-md)\` offset. To make the carousel flush with the container edges on both sides,
offset and widen it with a custom class:

\`\`\`css
.carousel {
  position: relative;
  left: calc(var(--au-spacing-md) * -1);
  width: calc(100% + var(--au-spacing-md) * 2);
}
\`\`\`

\`\`\`tsx
<Card>
  <Carousel className={styles.carousel} ...>
    ...
  </Carousel>
</Card>
\`\`\`

This compensates for the container's padding so all slides align consistently with the card's content area.

### Uniform slide height with \`--carousel-grid-rows\`

By default, each slide sizes itself to fit its content, so slides with more content appear taller than others.
To make all slides share the same row structure (useful for card-like content with aligned header, body, and footer),
set the \`--carousel-grid-rows\` CSS custom property on the carousel wrapper.

The carousel container uses \`grid-template-rows: var(--carousel-grid-rows)\`, and each slide uses \`grid-template-rows: subgrid\`
with \`grid-row: 1 / -1\`, so all slides inherit the same row definitions.

\`\`\`css
.my-carousel {
  --carousel-grid-rows: auto 1fr auto;
}
\`\`\`

\`\`\`tsx
<Carousel className="my-carousel" ...>
  <Card>
    <CardHeader>Title</CardHeader>
    <CardBody>Variable length content</CardBody>
    <CardFooter>Action</CardFooter>
  </Card>
  ...
</Carousel>
\`\`\`

### Disabling animation with \`reducedMotion\`

The \`reducedMotion\` prop disables slide transitions. You should pass \`true\` when the user has opted into reduced motion at the OS level.
Detect this preference with \`window.matchMedia\`:

\`\`\`tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

<Carousel reducedMotion={prefersReducedMotion} ...>
  ...
</Carousel>
\`\`\`

To react to changes at runtime (e.g. the user toggles the setting while the page is open), create your own hook that listens to the \`MediaQueryList\` change event and passes the result to the \`reducedMotion\` prop.
`,
      },
    },
  },
  args: {
    ariaLabel: 'Featured items',
    slideAriaLabel: (index: number, total: number) =>
      `Slide ${String(index + 1)} of ${String(total)}`,
    prevAriaLabel: 'Previous slide',
    nextAriaLabel: 'Next slide',
    children: [],
  },
  argTypes: {
    defaultIndex: {
      control: { type: 'number', min: 0 },
      description: 'Index of the slide to display initially',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'number' },
        category: 'Behaviour',
      },
    },
    reducedMotion: {
      control: 'boolean',
      description: 'Disables slide animation (sets transition duration to 0)',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behaviour',
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for the carousel region',
      table: {
        type: { summary: 'string' },
        category: 'Accessibility',
      },
    },
    slideAriaLabel: {
      description:
        'Function returning the accessible label for each slide, given its index and total count',
      table: {
        type: { summary: '(index: number, total: number) => string' },
        category: 'Accessibility',
      },
    },
    prevAriaLabel: {
      control: 'text',
      description: 'Accessible label for the previous button icon',
      table: {
        type: { summary: 'string' },
        category: 'Accessibility',
      },
    },
    nextAriaLabel: {
      control: 'text',
      description: 'Accessible label for the next button icon',
      table: {
        type: { summary: 'string' },
        category: 'Accessibility',
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name',
      table: {
        type: { summary: 'string' },
        category: 'Appearance',
      },
    },
    children: {
      description: 'Slide content — an array of React elements',
      table: {
        type: { summary: 'Array<ReactElement>' },
        category: 'Content',
      },
    },
  },
} satisfies Meta<typeof Carousel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <Carousel
        ariaLabel="Featured items"
        slideAriaLabel={(index, total) =>
          `Slide ${String(index + 1)} of ${String(total)}`
        }
        prevAriaLabel="Previous slide"
        nextAriaLabel="Next slide"
      >
        {slides.map((slide) => (
          <div
            key={slide.label}
            style={{ ...slideStyle, background: slide.background }}
          >
            <Typography
              element="span"
              textStyle="titleMd"
              textColor={slide.textColor}
            >
              {slide.label}
            </Typography>
          </div>
        ))}
      </Carousel>
    </div>
  ),
}

export const WithDefaultIndex: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <Carousel
        ariaLabel="Featured items"
        defaultIndex={2}
        slideAriaLabel={(index, total) =>
          `Slide ${String(index + 1)} of ${String(total)}`
        }
        prevAriaLabel="Previous slide"
        nextAriaLabel="Next slide"
      >
        {slides.map((slide) => (
          <div
            key={slide.label}
            style={{ ...slideStyle, background: slide.background }}
          >
            <Typography
              element="span"
              textStyle="titleMd"
              textColor={slide.textColor}
            >
              {slide.label}
            </Typography>
          </div>
        ))}
      </Carousel>
    </div>
  ),
}

export const ReducedMotion: Story = {
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the carousel with animations disabled via the \`reducedMotion\` prop.
In a real application, derive this value from the user's OS preference:

\`\`\`ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
\`\`\`
`,
      },
    },
  },
  render: () => (
    <div style={{ width: '500px' }}>
      <Carousel
        ariaLabel="Featured items"
        reducedMotion
        slideAriaLabel={(index, total) =>
          `Slide ${String(index + 1)} of ${String(total)}`
        }
        prevAriaLabel="Previous slide"
        nextAriaLabel="Next slide"
      >
        {slides.map((slide) => (
          <div
            key={slide.label}
            style={{ ...slideStyle, background: slide.background }}
          >
            <Typography
              element="span"
              textStyle="titleMd"
              textColor={slide.textColor}
            >
              {slide.label}
            </Typography>
          </div>
        ))}
      </Carousel>
    </div>
  ),
}

const cardStyle = {
  display: 'grid',
  borderRadius: 'var(--au-radius-sm)',
  overflow: 'hidden',
  border: 'var(--au-border-width-thin) solid var(--au-border-neutral-low)',
  background: 'var(--au-surface-neutral-low)',
} as const

const cardSlides = [
  {
    label: 'Short card',
    background: 'var(--au-surface-brand-solid)',
    textColor: 'contentOnBrand' as const,
    contentColor: 'var(--au-content-on-brand)',
    body: 'A brief description.',
  },
  {
    label: 'Medium card',
    background: 'var(--au-surface-info-solid)',
    textColor: 'contentPrimaryStatic' as const,
    contentColor: 'var(--au-content-primary-static)',
    body: 'A longer description that spans two lines and pushes the footer down.',
  },
  {
    label: 'Tall card',
    background: 'var(--au-surface-success-solid)',
    textColor: 'contentPrimaryStatic' as const,
    contentColor: 'var(--au-content-primary-static)',
    body: 'An even longer description that takes up considerably more vertical space, demonstrating how row alignment keeps all cards uniform.',
  },
]

export const WithGridRows: Story = {
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the \`--carousel-grid-rows\` CSS custom property.
Without it, each slide sizes to its content so cards with more text appear taller than their neighbours.
Setting \`--carousel-grid-rows\` on the carousel wrapper makes all slides share the same row structure via CSS subgrid:

\`\`\`css
.my-carousel {
  /* header auto-sizes, body stretches, footer auto-sizes */
  --carousel-grid-rows: auto 1fr auto;
}
\`\`\`

Each slide child must then be laid out as a grid with \`display: grid\` so the subgrid rows are applied correctly.
`,
      },
    },
  },
  render: () => (
    <div
      style={
        {
          width: '500px',
          '--carousel-grid-rows': 'auto 1fr auto',
        } as React.CSSProperties
      }
    >
      <Carousel
        ariaLabel="Featured items"
        slideAriaLabel={(index, total) =>
          `Slide ${String(index + 1)} of ${String(total)}`
        }
        prevAriaLabel="Previous slide"
        nextAriaLabel="Next slide"
      >
        {cardSlides.map((card) => (
          <div
            key={card.label}
            style={{
              ...cardStyle,
              background: card.background,
              color: card.contentColor,
              gridTemplateRows: 'subgrid',
              gridRow: '1 / -1',
            }}
          >
            <div style={{ ...slideStyle, height: '80px' }}>
              <Typography
                element="span"
                textStyle="titleMd"
                textColor={card.textColor}
              >
                {card.label}
              </Typography>
            </div>

            <Typography
              element="p"
              textStyle="bodyMd"
              textColor={card.textColor}
              style={{
                margin: 0,
                padding: 'var(--au-spacing-sm) var(--au-spacing-sm)',
              }}
            >
              {card.body}
            </Typography>

            <Typography
              element="div"
              textStyle="bodySm"
              textColor={card.textColor}
              style={{
                padding: 'var(--au-spacing-sm) var(--au-spacing-md)',
                borderTop: `1px solid ${card.contentColor}`,
              }}
            >
              Action
            </Typography>
          </div>
        ))}
      </Carousel>
    </div>
  ),
}
