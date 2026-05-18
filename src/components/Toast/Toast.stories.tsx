import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button'
import styles from './Toast.stories.module.css'
import { ToastProvider } from './ToastProvider'
import { ToastRegion } from './ToastRegion'
import { useToast } from './useToast'

const ToastButton = ({
  variant = 'info',
  title = 'Toast notification',
  content = 'This is a toast message',
  timeout,
}: {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  content?: string
  timeout?: number
}) => {
  const { addToast } = useToast()
  return (
    <Button
      onPress={() => {
        addToast({
          title,
          content,
          closeLabel: 'Close',
          options: { timeout },
          variant,
        })
      }}
    >
      Show Toast
    </Button>
  )
}

const ToastPage = (props: {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  content?: string
  timeout?: number
}) => (
  <ToastProvider>
    <ToastButton {...props} />
    <ToastRegion
      className={styles['toast-region']}
      toastClassName={styles.toast}
    />
  </ToastProvider>
)

const meta: Meta<typeof ToastPage> = {
  title: 'Components/Toast',
  component: ToastPage,
  tags: ['autodocs', 'stable'],
  args: {
    variant: 'info',
    title: 'Toast notification',
    content: 'This is a toast message',
    timeout: 5000,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      table: {
        category: 'Appearance',
      },
    },
    title: {
      control: 'text',
      table: {
        category: 'Content',
      },
    },
    content: {
      control: 'text',
      table: {
        category: 'Content',
      },
    },
    timeout: {
      control: 'select',
      options: [undefined, 1000, 2000, 5000, 20000],
      table: {
        category: 'Behaviour',
      },
    },
  },
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
    docs: {
      description: {
        story: `
This story demonstrates how to display Toast notifications. You will have to :
- Wrap your application in a \`<ToastProvider/>\`
- Use the \`<ToastRegion />\` component to render the toasts in your application
- Use the \`useToast()\` hook to trigger toasts from a React component
- Use the \`toast.service\` API to trigger toasts from outside of React components


### ToastProvider

The \`<ToastProvider />\` component is responsible for providing the toast context to your application. 
It should be placed at the root of your application, or at least above any component that needs to trigger toasts through the \`useToast()\` hook, 
and above the \`<ToastRegion />\` component.
It can be declared among the other providers you might have in your application, for example, the ThemeProvider.


\`\`\`tsx
const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <TanStackQueryProvider>
        <ToastProvider>{children}</ToastProvider>
    </TanStackQueryProvider>
  </ThemeProvider>
)

export { Providers }
\`\`\`

### ToastRegion

The \`<ToastRegion />\` component is responsible for rendering the toasts in your application. You can place it in the main layout of your application.
It can be customized with a \`className\` props, and it will render the toasts in a fixed position at the top-right of the screen by default.
Recommanded CSS class to apply to the \`<ToastRegion />\` component are:
- \`top\` to position the toasts below the header of your application (which is 72px high for desktop and 48px for tablet and mobile in this example). 
Use className for this property.
- \`margin\` to customize horizontal margin of the toasts on mobile, to align the toasts with the content of your application. Use toastClassName for this property.

\`\`\`css
.toast-region {
  top: calc(var(--au-spacing-xl) + var(--au-dimension-72));
}

@media (width <= 1250px) {
  .toast-region {
    top: calc(var(--au-spacing-xl) + var(--au-dimension-48));
  }
}

@media (width <= 480px) {
  .toast {
    margin: 0 var(--au-spacing-md);
  }
}
\`\`\`

\`\`\`tsx
import { Outlet } from 'react-router'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ToastRegion } from '@/components/Toast/ToastRegion'

import styles from './Layout.module.css'

const Layout = () => (
  <div className={styles.layout}>
    <Header />
    <main className={styles.main}>
      <Outlet />
    </main>
    <Footer />
    <ToastRegion className={styles['toast-region']} toastClassName={styles.toast} />
  </div>
)

export default Layout
\`\`\`

### useToast() hook

The \`useToast()\` hook is used to trigger toasts from a React component. It provides an \`addToast\` function that can be called with the toast content and options.
\`closeAllToasts\` and \`closeToast\` functions are also available to programmatically close toasts, but may not be very useful in most cases.

\`\`\`tsx
import { useToast } from '@worldline/aurora-react/components'

const MyComponent = () => {
  const { addToast } = useToast()

  return (
    <Button
      onPress={() => {
        addToast({
          title: 'Toast notification',
          content: 'This is a toast message',
          closeLabel: 'Close',
          options: { timeout: 5000 },
          variant: 'info',
        })
      }}
    >
      Show Toast
    </Button>
  )
}
\`\`\`

### toast.service API

The \`toast.service\` API is used to trigger toasts from outside of React components. It provides an \`addToast\` function that can be called with the toast content and options.

\`\`\`tsx
import { toastService } from '@worldline/aurora-react/components'

toastService.addToast({
  title: 'Toast notification',
  content: 'This is a toast message',
  closeLabel: 'Fermer',
  options: { timeout: undefined },
  variant: 'warning',
})
\`\`\`
`,
      },
    },
  },
} satisfies Meta<typeof ToastPage>

export default meta
type Story = StoryObj<typeof ToastPage>

export const Default: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    content: 'This is an informational message',
  },
}
