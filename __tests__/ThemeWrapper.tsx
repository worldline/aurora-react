import { useEffect } from 'react'

type Theme = 'dark' | 'light'
const themes: ReadonlyArray<Theme> = ['dark', 'light']

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  theme: Theme
  children: React.ReactNode
}

const ThemeWrapper = ({ theme, children, style, ...props }: Props) => {
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(...themes)
    root.classList.add(theme)
    return () => {
      root.classList.remove(...themes)
    }
  }, [theme])

  return (
    <div
      {...props}
      style={{
        backgroundColor: 'var(--au-surface-page)',
        padding: '24px',
        ...(style ?? {}),
      }}
    >
      {children}
    </div>
  )
}

export { ThemeWrapper, themes, type Theme }
