import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const EXPECTED_FONT_FILES = [
  'inter-cyrillic-ext-italic-100-900.woff2',
  'inter-cyrillic-ext-normal-100-900.woff2',
  'inter-cyrillic-italic-100-900.woff2',
  'inter-cyrillic-normal-100-900.woff2',
  'inter-greek-ext-italic-100-900.woff2',
  'inter-greek-ext-normal-100-900.woff2',
  'inter-greek-italic-100-900.woff2',
  'inter-greek-normal-100-900.woff2',
  'inter-latin-ext-italic-100-900.woff2',
  'inter-latin-ext-normal-100-900.woff2',
  'inter-latin-italic-100-900.woff2',
  'inter-latin-normal-100-900.woff2',
  'inter-vietnamese-italic-100-900.woff2',
  'inter-vietnamese-normal-100-900.woff2',
  'raleway-cyrillic-ext-italic-100-900.woff2',
  'raleway-cyrillic-ext-normal-100-900.woff2',
  'raleway-cyrillic-italic-100-900.woff2',
  'raleway-cyrillic-normal-100-900.woff2',
  'raleway-latin-ext-italic-100-900.woff2',
  'raleway-latin-ext-normal-100-900.woff2',
  'raleway-latin-italic-100-900.woff2',
  'raleway-latin-normal-100-900.woff2',
  'raleway-vietnamese-italic-100-900.woff2',
  'raleway-vietnamese-normal-100-900.woff2',
]

const LICENSES = {
  Inter: { spdx: 'OFL-1.1', file: 'Inter-OFL-1.1.txt', path: '/s/inter/v20/' },
  Raleway: {
    spdx: 'OFL-1.1',
    file: 'Raleway-OFL-1.1.txt',
    path: '/s/raleway/v37/',
  },
}

const sha256 = (filePath) =>
  createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')

export const verifyFontAssets = (packageDirectory) => {
  const root = path.resolve(packageDirectory)
  const manifestPath = path.join(root, 'LICENSES', 'font-assets.json')
  if (!fs.existsSync(manifestPath)) {
    throw new Error('font hash manifest is missing: LICENSES/font-assets.json')
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.files)) {
    throw new Error('font hash manifest has an unsupported format')
  }
  if (manifest.files.length !== EXPECTED_FONT_FILES.length) {
    throw new Error(
      `font hash manifest must contain ${EXPECTED_FONT_FILES.length} font files`,
    )
  }

  for (const [family, expected] of Object.entries(LICENSES)) {
    const license = manifest.licenses?.[family]
    const licensePath = path.join(root, 'LICENSES', expected.file)
    if (license?.spdx !== expected.spdx || license.file !== expected.file) {
      throw new Error(
        `${family} must retain its ${expected.spdx} license record`,
      )
    }
    if (!fs.existsSync(licensePath)) {
      throw new Error(`font license file is missing: LICENSES/${expected.file}`)
    }
    if (!/SIL OPEN FONT LICENSE/i.test(fs.readFileSync(licensePath, 'utf8'))) {
      throw new Error(
        `font license file is not an OFL record: LICENSES/${expected.file}`,
      )
    }
  }

  const expectedFiles = new Set(EXPECTED_FONT_FILES)
  const seenFiles = new Set()
  for (const font of manifest.files) {
    if (
      typeof font.path !== 'string' ||
      path.posix.basename(font.path) !== font.path
    ) {
      throw new Error('font manifest paths must contain only a file name')
    }
    if (!expectedFiles.has(font.path) || seenFiles.has(font.path)) {
      throw new Error(`unexpected or duplicate font in manifest: ${font.path}`)
    }
    seenFiles.add(font.path)

    const family = font.path.startsWith('inter-') ? 'Inter' : 'Raleway'
    const expected = LICENSES[family]
    if (font.family !== family || font.license !== expected.spdx) {
      throw new Error(`incorrect family or license metadata for ${font.path}`)
    }
    if (typeof font.sourceUrl !== 'string') {
      throw new Error(`font source URL is missing for ${font.path}`)
    }
    const sourceUrl = new URL(font.sourceUrl)
    if (
      sourceUrl.protocol !== 'https:' ||
      sourceUrl.hostname !== 'fonts.gstatic.com' ||
      !sourceUrl.pathname.startsWith(expected.path)
    ) {
      throw new Error(
        `font source is not a pinned Google Fonts asset for ${font.path}`,
      )
    }
    if (!/^[a-f0-9]{64}$/.test(font.sha256 ?? '')) {
      throw new Error(`invalid SHA-256 for ${font.path}`)
    }

    const fontPath = path.join(root, 'src', 'assets', 'fonts', font.path)
    if (!fs.existsSync(fontPath)) {
      throw new Error(`font file is missing: src/assets/fonts/${font.path}`)
    }
    if (sha256(fontPath) !== font.sha256) {
      throw new Error(`SHA-256 mismatch for src/assets/fonts/${font.path}`)
    }
  }

  const actualFiles = fs
    .readdirSync(path.join(root, 'src', 'assets', 'fonts'))
    .filter((file) => file.endsWith('.woff2'))
    .sort()
  const expectedNames = [...EXPECTED_FONT_FILES].sort()
  if (JSON.stringify(actualFiles) !== JSON.stringify(expectedNames)) {
    throw new Error(
      'public font directory does not contain the expected 24 WOFF2 files',
    )
  }

  const cssPath = path.join(root, 'src', 'assets', 'fonts', 'fonts.css')
  if (!fs.existsSync(cssPath)) {
    throw new Error(
      'public font stylesheet is missing: src/assets/fonts/fonts.css',
    )
  }
  const css = fs.readFileSync(cssPath, 'utf8')
  const cssFiles = [
    ...css.matchAll(/url\(\s*['"]?\.\/([^'")\s]+\.woff2)['"]?\s*\)/g),
  ]
    .map((match) => match[1])
    .sort()
  if (JSON.stringify(cssFiles) !== JSON.stringify(expectedNames)) {
    throw new Error('fonts.css does not reference the expected 24 font files')
  }

  return seenFiles.size
}
