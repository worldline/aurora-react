/* eslint-disable no-console */
/**
 * Download Material Symbols icons from Google's GitHub repository.
 *
 * Settings: Rounded style, weight 300, 24px optical size.
 *
 * Usage:
 *   node scripts/download-icons.js <icon_name[:fill]>...
 *
 * Examples:
 *   node scripts/download-icons.js heart star music_note
 *   node scripts/download-icons.js account_circle:fill home:fill notifications:fill
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

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'

const BASE_URL =
  'https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/symbols/web'
const WEIGHT = '300'
const SIZE = '24'
const STYLE = 'materialsymbolsrounded'
const FETCH_TIMEOUT_MS = 10_000
const ALLOWED_VARIANTS = new Set(['fill', undefined])
const TARGET_DIR = 'basics'

const ICONS_DIR = join(import.meta.dirname, '..', 'src', 'assets', 'icons')

/**
 * @param {string} iconName - snake_case Google Material Symbol name
 * @param {boolean} fill - whether to download the filled variant
 * @returns {string}
 */
const buildUrl = (iconName, fill) => {
  const fillSuffix = fill ? 'fill1' : ''
  const fileName = `${iconName}_wght${WEIGHT}${fillSuffix}_${SIZE}px.svg`
  return `${BASE_URL}/${iconName}/${STYLE}/${fileName}`
}

/**
 * Converts a Google icon name + fill flag to the local kebab-case filename.
 * Local files use the "-fill" suffix for filled variants.
 * e.g. account_circle + fill=true  -> account-circle-fill.svg
 *      arrow_forward  + fill=false -> arrow-forward.svg
 *
 * @param {string} iconName - snake_case Google Material Symbol name
 * @param {boolean} fill
 * @returns {string}
 */
const buildLocalFileName = (iconName, fill) => {
  const kebabName = iconName.replaceAll('_', '-')
  return fill ? `${kebabName}-fill.svg` : `${kebabName}.svg`
}

/**
 * @param {string} iconName - snake_case Google Material Symbol name
 * @param {boolean} fill
 * @returns {Promise<void>}
 */
const downloadIcon = async (iconName, fill) => {
  const url = buildUrl(iconName, fill)
  const localName = buildLocalFileName(iconName, fill)
  const targetPath = join(ICONS_DIR, TARGET_DIR, localName)

  await mkdir(join(ICONS_DIR, TARGET_DIR), { recursive: true })

  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to download ${url}: HTTP ${String(response.status)}`,
    )
  }

  const svg = await response.text()

  await writeFile(targetPath, svg, 'utf8')

  console.log(`✓ ${localName}  →  src/assets/icons/${TARGET_DIR}/${localName}`)
}

const printUsageAndExit = () => {
  console.error('Usage: node scripts/download-icons.js <icon_name[:fill]>...')
  console.error('')
  console.error('Examples:')
  console.error('  node scripts/download-icons.js heart star music_note')
  console.error(
    '  node scripts/download-icons.js account_circle:fill home:fill',
  )
  process.exit(1)
}

/**
 * @returns {{ iconSpecs: string[] }}
 */
const parseCliArgs = () => {
  const rawArgs = process.argv.slice(2)

  if (rawArgs.includes('--dir')) {
    console.error(
      'Error: --dir is no longer supported. Icons are always downloaded to basics.',
    )
    printUsageAndExit()
  }

  try {
    const parsedArgs = parseArgs({
      args: rawArgs,
      options: {},
      allowPositionals: true,
      strict: true,
    })

    if (parsedArgs.positionals.length === 0) {
      printUsageAndExit()
    }

    return { iconSpecs: parsedArgs.positionals }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Error: ${message}`)
    printUsageAndExit()
  }
}

const { iconSpecs } = parseCliArgs()

const results = await Promise.all(
  iconSpecs.map(async (spec) => {
    const specParts = spec.split(':')

    if (specParts.length > 2) {
      return {
        spec,
        success: false,
        error: 'invalid format — expected <icon_name> or <icon_name>:fill',
      }
    }

    const [iconName, variant] = specParts

    if (!iconName) {
      return {
        spec,
        success: false,
        error: 'invalid format — icon name cannot be empty',
      }
    }

    const fill = variant === 'fill'

    if (!ALLOWED_VARIANTS.has(variant)) {
      return {
        spec,
        success: false,
        error: `unknown variant ":${variant}" — only ":fill" is supported`,
      }
    }

    try {
      await downloadIcon(iconName, fill)
      return { spec, success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { spec, success: false, error: message }
    }
  }),
)

const failures = results.filter((result) => !result.success)

for (const failure of failures) {
  console.error(`✗ ${failure.spec}: ${failure.error ?? 'unknown error'}`)
}

if (failures.length > 0) {
  process.exitCode = 1
}
