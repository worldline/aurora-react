/* eslint-disable no-console */
/**
 * Download Material Symbols icons from Google's GitHub repository.
 *
 * Settings: Rounded style, weight 300, 24px optical size.
 *
 * Usage:
 *   npm run icons:download -- <icon_name[:fill]>...
 *
 * Examples:
 *   npm run icons:download -- heart star music_note
 *   npm run icons:download -- account_circle:fill home:fill notifications:fill
 *
 * Icon names must match Google Material Symbols names (snake_case).
 * Append ":fill" for the filled variant.
 *
 * Icons that cannot be sourced from Google (custom SVGs) must be added manually:
 *   - check-indeterminate (custom minimal SVG)
 *   - worldline-logo-large / worldline-logo-small (brand assets)
 *   - pdf-file (file-types, custom)
 *   - american-express / mastercard (payment-methods, brand assets)
 */

import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

type DownloadResult =
  | { spec: string; success: true }
  | { spec: string; success: false; error: string }

const BASE_URL =
  'https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/symbols/web'
const FETCH_TIMEOUT_MS = 10_000
const ICONS_BASICS_DIR = join(
  import.meta.dirname,
  '..',
  'src',
  'assets',
  'icons',
  'basics',
)

const downloadIcon = async (iconName: string, fill: boolean): Promise<void> => {
  const fillSuffix = fill ? 'fill1' : ''
  const url = `${BASE_URL}/${iconName}/materialsymbolsrounded/${iconName}_wght300${fillSuffix}_24px.svg`
  const localName = `${iconName.replaceAll('_', '-')}${fill ? '-fill' : ''}.svg`

  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to download ${url}: HTTP ${String(response.status)}`,
    )
  }

  await writeFile(
    join(ICONS_BASICS_DIR, localName),
    await response.text(),
    'utf8',
  )

  console.log(`✓ ${localName}  →  src/assets/icons/basics/${localName}`)
}

const printUsageAndExit = (): never => {
  console.error(
    'Usage: npm run icons:download -- <icon_name[:fill]>...\n' +
      '\n' +
      'Examples:\n' +
      '  npm run icons:download -- heart star music_note\n' +
      '  npm run icons:download -- account_circle:fill home:fill',
  )
  process.exit(1)
}

const iconSpecs = process.argv.slice(2)

if (iconSpecs.length === 0) {
  printUsageAndExit()
}

const results = await Promise.all(
  iconSpecs.map(async (spec): Promise<DownloadResult> => {
    const colonIndex = spec.indexOf(':')
    const iconName = colonIndex === -1 ? spec : spec.slice(0, colonIndex)
    const variant = colonIndex === -1 ? undefined : spec.slice(colonIndex + 1)

    if (iconName === '') {
      return {
        spec,
        success: false,
        error: 'invalid format — icon name cannot be empty',
      }
    }

    if (variant !== undefined && variant !== 'fill') {
      return {
        spec,
        success: false,
        error: `unknown variant ":${variant}" — only ":fill" is supported`,
      }
    }

    try {
      await downloadIcon(iconName, variant !== undefined)
      return { spec, success: true }
    } catch (err) {
      return {
        spec,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      }
    }
  }),
)

for (const result of results) {
  if (!result.success) {
    console.error(`✗ ${result.spec}: ${result.error}`)
  }
}

if (results.some((result) => !result.success)) {
  process.exitCode = 1
}
