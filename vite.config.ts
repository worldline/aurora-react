import { createHash } from 'node:crypto'

import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig } from 'vite'

/**
 * Shared configuration consumed by the dev server, Storybook, the library build
 * ([vite.lib.config.ts]) and the test runner ([vitest.config.ts]).
 *
 * It must stay free of library-build concerns: Storybook inherits this file as
 * is, and any lib-only plugin added here would have to be stripped back out.
 */
export const baseConfig: UserConfig = {
  plugins: [react()],
  css: {
    devSourcemap: true,
    modules: {
      generateScopedName: (className, filename) => {
        if (className === 'dark') {
          return className
        }
        const hash = createHash('sha256')
          .update(filename)
          .update(className)
          .digest('base64')
          .replace(/\//g, '')
          .replace(/\+/g, '')
          .substring(0, 5)
        return `${className}__${hash}`
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
}

export default defineConfig(baseConfig)
