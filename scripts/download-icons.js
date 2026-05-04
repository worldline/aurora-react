/* eslint-disable no-console */
/**
 * Download Material Symbols icons from Google's GitHub repository.
 *
 * Settings: Rounded style, weight 300, 24px optical size.
 *
 * Usage:
 *   node scripts/download-icons.js <icon_name[:fill]>...
 *   node scripts/download-icons.js [--dir basics|file-types|payment-methods] <icon_name[:fill]>...
 *
 * Examples:
 *   node scripts/download-icons.js add close search
 *   node scripts/download-icons.js account_circle:fill home:fill notifications:fill
 *   node scripts/download-icons.js --dir file-types picture_as_pdf
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
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const BASE_URL =
  'https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/symbols/web'
const WEIGHT = '300'
const SIZE = '24'
const STYLE = 'materialsymbolsrounded'
const FETCH_TIMEOUT_MS = 10_000
const ALLOWED_DIRS = new Set(['basics', 'file-types', 'payment-methods'])
const ALLOWED_VARIANTS = new Set(['fill', undefined])

const __dirname = dirname(fileURLToPath(import.meta.url))
const ICONS_DIR = join(__dirname, '..', 'src', 'assets', 'icons')

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
 * e.g. account_circle + fill=true  → account-circle-fill.svg
 *      arrow_forward  + fill=false → arrow-forward.svg
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
 * @param {string} targetDir - subdirectory under src/assets/icons/
 * @returns {Promise<void>}
 */
const downloadIcon = async (iconName, fill, targetDir) => {
  const url = buildUrl(iconName, fill)
  const localName = buildLocalFileName(iconName, fill)
  const targetPath = join(ICONS_DIR, targetDir, localName)

  await mkdir(join(ICONS_DIR, targetDir), { recursive: true })

  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, FETCH_TIMEOUT_MS)

  const response = await fetch(url, { signal: controller.signal }).finally(
    () => {
      clearTimeout(timeout)
    },
  )

  if (!response.ok) {
    throw new Error(
      `Failed to download ${url}: HTTP ${String(response.status)}`,
    )
  }

  const svg = await response.text()

  await writeFile(targetPath, svg, 'utf8')

  console.log(`✓ ${localName}  →  src/assets/icons/${targetDir}/${localName}`)
}

const printUsageAndExit = () => {
  console.error(
    'Usage: node scripts/download-icons.js [--dir basics|file-types|payment-methods] <icon_name[:fill]>...',
  )
  console.error('')
  console.error('Examples:')
  console.error('  node scripts/download-icons.js add close search')
  console.error(
    '  node scripts/download-icons.js account_circle:fill home:fill',
  )
  console.error(
    '  node scripts/download-icons.js --dir file-types picture_as_pdf',
  )
  process.exit(1)
}

const args = process.argv.slice(2)
let targetDir = 'basics'
/** @type {string[]} */
const iconSpecs = []

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir') {
    if (i + 1 >= args.length) {
      console.error('Error: --dir requires a value')
      printUsageAndExit()
    }
    targetDir = args[++i]
  } else {
    iconSpecs.push(args[i])
  }
}

if (iconSpecs.length === 0) {
  printUsageAndExit()
}

if (!ALLOWED_DIRS.has(targetDir)) {
  console.error(
    `Error: unknown --dir "${targetDir}". Allowed values: ${[...ALLOWED_DIRS].join(', ')}`,
  )
  printUsageAndExit()
}

const results = await Promise.all(
  iconSpecs.map(async (spec) => {
    const [iconName, variant] = spec.split(':')
    const fill = variant === 'fill'

    if (!ALLOWED_VARIANTS.has(variant)) {
      return {
        spec,
        success: false,
        error: `unknown variant ":${variant}" — only ":fill" is supported`,
      }
    }

    try {
      await downloadIcon(iconName, fill, targetDir)
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
