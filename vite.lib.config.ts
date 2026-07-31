import { extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { globSync } from 'glob'
import dts from 'unplugin-dts/vite'
import { defineConfig, mergeConfig, type UserConfig } from 'vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

import pkg from './package.json' with { type: 'json' }
import { baseConfig } from './vite.config'

/**
 * Anything the consumer installs alongside us must stay external: bundling it
 * would ship a second copy next to the consumer's own. Deriving the list from
 * package.json instead of hardcoding it keeps the two from drifting apart.
 */
const externalNames = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
]

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Also matches subpath imports (`react/jsx-runtime`, `…/aurora-design-tokens/variables`).
const externalPattern = new RegExp(
  `^(${externalNames.map(escapeRegExp).join('|')})(/.*)?$`,
)

/**
 * Files that exist only to support Storybook. They are not exported from
 * `src/components/main.ts` and must not reach the published package.
 */
const storybookOnlySources = [
  'src/**/*.stories.{ts,tsx}',
  'src/**/*.fixtures.{ts,tsx}',
  'src/components/storybook/**',
  'src/components/icons/IconsGallery.tsx',
]

const libEntries = Object.fromEntries(
  globSync(['src/styles/styles.css', 'src/**/*.{ts,tsx}'], {
    ignore: [...storybookOnlySources, 'src/**/*.test.{ts,tsx}'],
  }).map((file) => [
    relative('src', file.slice(0, file.length - extname(file).length)),
    fileURLToPath(new URL(file, import.meta.url)),
  ]),
)

// Typed explicitly: `mergeConfig` returns `Record<string, any>`, so without it
// the object literal below loses contextual typing.
const libConfig: UserConfig = {
  plugins: [
    libInjectCss(),
    dts({
      entryRoot: 'src',
      tsconfigPath: fileURLToPath(
        new URL('tsconfig.lib.json', import.meta.url),
      ),
      exclude: [
        ...storybookOnlySources,
        'src/**/*.test.{ts,tsx}',
        '__tests__/**/*.{ts,tsx}',
        '.storybook/**/*.{ts,tsx}',
      ],
    }),
  ],
  build: {
    copyPublicDir: false,
    sourcemap: true,
    // Consumers minify the JS themselves, but they import our CSS verbatim.
    minify: false,
    cssMinify: true,
    // Kept in sync with `target` in tsconfig.lib.json.
    target: 'es2022',
    lib: {
      // Library mode drives `libInjectCss` and asset handling; the entry
      // itself is superseded by `rolldownOptions.input` below.
      entry: fileURLToPath(new URL('src/components/main.ts', import.meta.url)),
      formats: ['es'],
    },
    rolldownOptions: {
      external: [externalPattern],
      input: libEntries,
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
        chunkFileNames: '_chunks/[name]-[hash].js',
      },
    },
  },
}

export default defineConfig(mergeConfig(baseConfig, libConfig))
