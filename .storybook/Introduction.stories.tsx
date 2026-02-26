import { Code } from '@/components/storybook/Code'
import { Typography } from '@/components/Typography'
import preview from '@/storybook/preview'

import styles from './Introduction.stories.module.css'

const IntroductionPage = () => (
  <div className={styles.page}>
    <div className={styles.header}>
      <Typography element="h1" textStyle="hero" textColor="contentPrimary">
        Welcome to Aurora
      </Typography>
      <Typography element="p" textStyle="titleMd" textColor="contentSecondary">
        A modern, accessible component library built with React Aria and CSS
        Modules
      </Typography>
    </div>

    <section className={styles.section}>
      <Typography
        element="h2"
        textStyle="titleMd"
        textColor="contentPrimary"
        className={styles['section-title']}
      >
        Getting Started
      </Typography>
      <Typography element="p" textStyle="bodyMd" textColor="contentSecondary">
        Aurora is a comprehensive design system that provides ready-to-use,
        accessible React components. Built on top of{' '}
        <Typography element="span" textStyle="bodyMd" textColor="contentBrand">
          React Aria
        </Typography>
        , every component follows WAI-ARIA best practices and provides excellent
        keyboard navigation and screen reader support.
      </Typography>
      <Code className={styles['import-component']}>
        {"import { Button } from '@worldline/aurora-react/components'"}
      </Code>
    </section>

    <section className={styles.section}>
      <Typography
        element="h2"
        textStyle="titleMd"
        textColor="contentPrimary"
        className={styles['section-title']}
      >
        Theme Support
      </Typography>
      <Typography element="p" textStyle="bodyMd" textColor="contentSecondary">
        Aurora comes with built-in light and dark themes. More about theme
        provider....
      </Typography>
    </section>

    <section className={styles.section}>
      <Typography
        element="h2"
        textStyle="titleMd"
        textColor="contentPrimary"
        className={styles['section-title']}
      >
        Browse Components
      </Typography>
      <Typography element="p" textStyle="bodyMd" textColor="contentSecondary">
        Explore our component library using the sidebar on the left. Each
        component includes:
      </Typography>
      <ul className={styles.list}>
        <li>
          <Typography
            element="span"
            textStyle="bodyMd"
            textColor="contentSecondary"
          >
            Interactive playground with live controls
          </Typography>
        </li>
        <li>
          <Typography
            element="span"
            textStyle="bodyMd"
            textColor="contentSecondary"
          >
            Multiple variants and states
          </Typography>
        </li>
        <li>
          <Typography
            element="span"
            textStyle="bodyMd"
            textColor="contentSecondary"
          >
            Accessibility features and keyboard support
          </Typography>
        </li>
        <li>
          <Typography
            element="span"
            textStyle="bodyMd"
            textColor="contentSecondary"
          >
            TypeScript type definitions
          </Typography>
        </li>
        <li>
          <Typography
            element="span"
            textStyle="bodyMd"
            textColor="contentSecondary"
          >
            Usage examples and best practices
          </Typography>
        </li>
      </ul>
    </section>

    <section className={styles.section}>
      <Typography
        element="h2"
        textStyle="titleMd"
        textColor="contentPrimary"
        className={styles['section-title']}
      >
        Design Philosophy
      </Typography>
      <Typography element="p" textStyle="bodyMd" textColor="contentSecondary">
        Aurora is designed with three core principles in mind:
      </Typography>
      <ul className={styles.list}>
        <li>
          <Typography
            element="span"
            textStyle="bodyMd"
            textColor="contentSecondary"
          >
            <Typography
              element="span"
              textStyle="bodyMd"
              textColor="contentSecondary"
            >
              Accessible by default
            </Typography>{' '}
            - Every component works for everyone
          </Typography>
        </li>
        <li>
          <Typography
            element="span"
            textStyle="bodyMd"
            textColor="contentSecondary"
          >
            <Typography
              element="span"
              textStyle="bodyMd"
              textColor="contentSecondary"
            >
              Developer friendly
            </Typography>{' '}
            - Simple APIs with TypeScript support
          </Typography>
        </li>
      </ul>
    </section>
  </div>
)

const meta = preview.meta({
  title: 'Introduction',
  component: IntroductionPage,
  parameters: {
    layout: 'fullscreen',
    options: {
      showPanel: false,
    },
  },
  tags: ['!autodocs', 'notest'],
})

export const Introduction = meta.story()
