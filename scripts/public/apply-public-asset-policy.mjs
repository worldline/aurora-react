import { createHash } from 'node:crypto'
import {
  copyFileSync,
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { verifyFontAssets } from '../npmjs/verify-font-assets.mjs'

const SOURCE_PACKAGE_NAME = '@worldline/aurora-react'
const PUBLIC_PACKAGE_NAME = '@worldline-official/aurora-react'
const ICONS_INDEX = "export * from './basics'\n"
const MCC_ICON_NAMES = [
  'chef-hat',
  'directions-car',
  'draft',
  'keyboard-arrow-down',
  'keyboard-arrow-up',
  'local-bar',
  'lunch-dining',
  'medical-services',
  'restaurant',
  'sports-soccer',
  'travel',
]
const FILLED_ICON_NAMES = [
  'account-circle-fill',
  'favorite-fill',
  'home-fill',
  'notifications-fill',
  'person-fill',
  'settings-fill',
  'swap-horiz-fill',
]
const UNVERIFIED_PUBLIC_ICON_NAMES = [
  'earth',
  'check-indeterminate',
  'loading-circle',
  'tooltip-arrow',
]
const REPLACED_PUBLIC_ICON_NAMES = ['menu', 'progress-activity']
const GOOGLE_ICON_OVERRIDES = [
  'check-indeterminate-small',
  'menu',
  'progress-activity',
]
const PUBLIC_MATERIAL_SYMBOLS_MANIFEST =
  'scripts/material-symbols-provenance.json'
const PUBLIC_ICON_OVERRIDES_DIRECTORY = 'scripts/public-assets/icons'
const PUBLIC_ICON_OVERRIDES_MANIFEST = `${PUBLIC_ICON_OVERRIDES_DIRECTORY}/material-symbols-provenance.json`
const BASICS_ICON_DIRECTORY = 'src/assets/icons/basics'
const PUBLIC_ICON_SCOPE = `#### Public icon scope

The public source and package include the pinned, outlined Google Material Symbols in the provenance manifest and the Inter/Raleway fonts. They exclude the internal-only MCC set, filled variants, unverified source vectors, payment-method artwork, file-type artwork, and Worldline logos. The public projection uses pinned Google replacements for selected icons and a CSS tooltip arrow; FileUpload uses a retained document-style icon.
`

const excludedPublicAssetPaths = [
  'src/assets/icons/file-types',
  'src/assets/icons/payment-methods',
  'src/assets/icons/basics/worldline-logo-large.svg',
  'src/assets/icons/basics/worldline-logo-small.svg',
  'src/components/icons/file-types',
  'src/components/icons/payment-methods',
  'src/components/icons/basics/WorldlineLogoLarge.tsx',
  'src/components/icons/basics/WorldlineLogoSmall.tsx',
  'scripts/public-assets/check-indeterminate.svg',
  ...MCC_ICON_NAMES.map((name) => `${BASICS_ICON_DIRECTORY}/${name}.svg`),
  ...FILLED_ICON_NAMES.map((name) => `${BASICS_ICON_DIRECTORY}/${name}.svg`),
  ...UNVERIFIED_PUBLIC_ICON_NAMES.map(
    (name) => `${BASICS_ICON_DIRECTORY}/${name}.svg`,
  ),
]

const pathsToRemove = [
  ...excludedPublicAssetPaths,
  ...REPLACED_PUBLIC_ICON_NAMES.map(
    (name) => `${BASICS_ICON_DIRECTORY}/${name}.svg`,
  ),
  'src/assets/fonts',
  'LICENSES/font-assets.json',
  'dist',
]

const resolveInsideRoot = (root, relativePath) => {
  const resolvedPath = path.resolve(root, relativePath)
  const relative = path.relative(root, resolvedPath)
  if (
    !relative ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(
      `refusing asset policy path outside repository: ${relativePath}`,
    )
  }
  return resolvedPath
}

const writeIfChanged = (filePath, content) => {
  const current = existsSync(filePath) ? readFileSync(filePath, 'utf8') : null
  if (current !== content) {
    writeFileSync(filePath, content)
  }
}

const readPublicIconOverrides = (root, expectedRevision) => {
  const manifestPath = resolveInsideRoot(root, PUBLIC_ICON_OVERRIDES_MANIFEST)
  if (!existsSync(manifestPath)) {
    throw new Error('the pinned public Google icon overrides are missing')
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (
    manifest.schemaVersion !== 1 ||
    manifest.source?.repository !== 'google/material-design-icons' ||
    manifest.source?.revision !== expectedRevision ||
    manifest.source?.license !== 'Apache-2.0' ||
    manifest.variant?.collection !== 'Material Symbols' ||
    manifest.variant?.style !== 'Rounded' ||
    manifest.variant?.weight !== 300 ||
    manifest.variant?.grade !== 0 ||
    manifest.variant?.opticalSize !== 24 ||
    manifest.variant?.fill !== 0 ||
    !manifest.files ||
    typeof manifest.files !== 'object' ||
    Array.isArray(manifest.files)
  ) {
    throw new Error('the public Google icon override manifest is invalid')
  }

  const entries = Object.entries(manifest.files)
  const actualNames = entries.map(([name]) => name).sort()
  if (
    JSON.stringify(actualNames) !==
    JSON.stringify([...GOOGLE_ICON_OVERRIDES].sort())
  ) {
    throw new Error('the public Google icon override set is unexpected')
  }

  for (const [name, expectedHash] of entries) {
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) ||
      typeof expectedHash !== 'string' ||
      !/^[\da-f]{64}$/.test(expectedHash)
    ) {
      throw new Error(`invalid public Google icon override entry: ${name}`)
    }

    const overridePath = resolveInsideRoot(
      root,
      `${PUBLIC_ICON_OVERRIDES_DIRECTORY}/${name}.svg`,
    )
    if (!existsSync(overridePath)) {
      throw new Error(`pinned public Google icon is missing: ${name}.svg`)
    }
    const actualHash = createHash('sha256')
      .update(readFileSync(overridePath))
      .digest('hex')
    if (actualHash !== expectedHash) {
      throw new Error(`pinned public Google icon hash mismatch for ${name}.svg`)
    }
  }

  return manifest
}

const projectPublicMaterialSymbols = (root) => {
  const manifestPath = resolveInsideRoot(root, PUBLIC_MATERIAL_SYMBOLS_MANIFEST)
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const overrides = readPublicIconOverrides(root, manifest.source?.revision)
  if (!manifest.files || typeof manifest.files !== 'object') {
    throw new Error('Material Symbols provenance manifest has no files map')
  }

  const excludedMccIcons = new Set(MCC_ICON_NAMES)
  manifest.files = Object.fromEntries(
    Object.entries(manifest.files).filter(
      ([name]) => !excludedMccIcons.has(name),
    ),
  )
  Object.assign(manifest.files, overrides.files)
  manifest.scope.fileCount = Object.keys(manifest.files).length
  manifest.scope.note =
    'The public projection contains only pinned outlined Google SVGs. MCC, filled, brand, and unresolved source SVGs remain private or are replaced by these pinned assets.'
  writeIfChanged(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

const verifyPublicMaterialSymbols = (root) => {
  const manifestPath = resolveInsideRoot(root, PUBLIC_MATERIAL_SYMBOLS_MANIFEST)
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const overrides = readPublicIconOverrides(root, manifest.source?.revision)
  const files = manifest.files
  if (
    !files ||
    typeof files !== 'object' ||
    Array.isArray(files) ||
    !Number.isInteger(manifest.scope?.fileCount) ||
    Object.keys(files).length !== manifest.scope.fileCount
  ) {
    throw new Error('public Material Symbols provenance count is invalid')
  }
  if (MCC_ICON_NAMES.some((name) => Object.hasOwn(files, name))) {
    throw new Error('public Material Symbols provenance includes an MCC icon')
  }
  for (const [name, expectedHash] of Object.entries(overrides.files)) {
    if (files[name] !== expectedHash) {
      throw new Error(
        `public Material Symbols provenance is missing pinned override ${name}`,
      )
    }
  }

  const basicsDirectory = resolveInsideRoot(root, BASICS_ICON_DIRECTORY)
  const manifestNames = Object.keys(files).sort()
  const assetNames = readdirSync(basicsDirectory)
    .filter((name) => name.endsWith('.svg'))
    .map((name) => path.basename(name, '.svg'))
    .sort()
  if (JSON.stringify(assetNames) !== JSON.stringify(manifestNames)) {
    throw new Error(
      'public basic SVG files do not match the pinned provenance manifest',
    )
  }

  for (const [name, expectedHash] of Object.entries(files)) {
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) ||
      typeof expectedHash !== 'string' ||
      !/^[\da-f]{64}$/.test(expectedHash)
    ) {
      throw new Error(`invalid public Material Symbols entry: ${name}`)
    }
    const iconPath = resolveInsideRoot(
      root,
      `${BASICS_ICON_DIRECTORY}/${name}.svg`,
    )
    const actualHash = createHash('sha256')
      .update(readFileSync(iconPath))
      .digest('hex')
    if (actualHash !== expectedHash) {
      throw new Error(`public Material Symbols hash mismatch for ${name}.svg`)
    }
  }
}

const replaceRequiredIconName = (source, originalName, publicName, label) => {
  if (source.includes(originalName)) {
    return source.replaceAll(originalName, publicName)
  }
  if (source.includes(publicName)) {
    return source
  }
  throw new Error(`could not find the expected ${label} icon reference`)
}

const transformFileList = (filePath) => {
  let source = readFileSync(filePath, 'utf8')

  if (source.includes('CsvFileIcon')) {
    const importPattern =
      /import \{\r?\n[\s\S]*?CsvFileIcon,[\s\S]*?ZipFileIcon,\r?\n\} from '@\/components\/icons'\r?\n/
    const importReplacement = `import {
  ContractEditIcon,
  DeleteIcon,
  ErrorIcon,
  ProgressActivityIcon,
} from '@/components/icons'
`
    if (!importPattern.test(source)) {
      throw new Error('could not find the expected FileList icon imports')
    }
    source = source.replace(importPattern, importReplacement)

    const iconBlockStart = source.indexOf('type IconProps =')
    const iconBlockEnd = source.indexOf('interface FileEntry', iconBlockStart)
    if (iconBlockStart < 0 || iconBlockEnd < 0) {
      throw new Error(
        'could not find the expected FileList type-specific icon definitions',
      )
    }
    source = `${source.slice(0, iconBlockStart)}const renderFileIcon = (): JSX.Element => (
  <ContractEditIcon size={32} aria-hidden />
)

${source.slice(iconBlockEnd)}`

    const renderCallCount = source.match(/renderFileIcon\(name\)/g)?.length ?? 0
    if (renderCallCount !== 1) {
      throw new Error(
        `expected one file icon render call, found ${renderCallCount}`,
      )
    }
    source = source.replace('renderFileIcon(name)', 'renderFileIcon()')
    source = source.replace(
      "import type { JSX, SVGProps } from 'react'",
      "import type { JSX } from 'react'",
    )
  } else if (!source.includes('const renderFileIcon = (): JSX.Element')) {
    throw new Error(
      'FileList is neither the source nor the public asset-filtered version',
    )
  }

  if (
    /CsvFileIcon|PdfFileRedIcon|FILE_TYPE_ICONS|SVGProps|DraftIcon/.test(source)
  ) {
    throw new Error('file-type icon references remain in public FileList')
  }
  writeIfChanged(filePath, source)
}

const transformSpeechBubble = (filePath) => {
  const source = readFileSync(filePath, 'utf8')
  writeIfChanged(
    filePath,
    replaceRequiredIconName(
      source,
      'DraftIcon',
      'ContractEditIcon',
      'SpeechBubble',
    ),
  )
}

const transformSelect = (componentPath, stylesPath) => {
  let source = readFileSync(componentPath, 'utf8')
  const keyboardArrowImport =
    "import { KeyboardArrowDownIcon, KeyboardArrowUpIcon } from '@/components/icons'"
  const chevronImport =
    "import { ChevronForwardIcon } from '@/components/icons'"
  if (source.includes(keyboardArrowImport)) {
    source = source.replace(keyboardArrowImport, chevronImport)
  } else if (!source.includes(chevronImport)) {
    throw new Error('could not find the expected Select icon import')
  }

  const keyboardArrowBlock =
    /\{isOpen \? \([\s\S]*?<KeyboardArrowUpIcon[\s\S]*?\/>\s*\) : \([\s\S]*?<KeyboardArrowDownIcon[\s\S]*?\/>\s*\)\}/
  const replacement = [
    '{isOpen ? (',
    '              <ChevronForwardIcon',
    '                aria-hidden',
    "                className={cn(styles.chevron, styles['chevron-up'])}",
    '                size={24}',
    '              />',
    '            ) : (',
    '              <ChevronForwardIcon',
    '                aria-hidden',
    "                className={cn(styles.chevron, styles['chevron-down'])}",
    '                size={24}',
    '              />',
    '            )}',
  ].join('\n')
  if (keyboardArrowBlock.test(source)) {
    source = source.replace(keyboardArrowBlock, replacement)
  } else if (
    !source.includes("styles['chevron-up']") ||
    !source.includes("styles['chevron-down']")
  ) {
    throw new Error('could not find the expected Select arrow elements')
  }
  if (/KeyboardArrow(?:Down|Up)Icon/.test(source)) {
    throw new Error('keyboard-arrow icon references remain in public Select')
  }
  writeIfChanged(componentPath, source)

  let styles = readFileSync(stylesPath, 'utf8')
  const chevronRule =
    /\.chevron \{\r?\n {2}color: var\(--au-inputfield-placeholder-text\);\r?\n\}/
  const styleReplacement = [
    '.chevron {',
    '  color: var(--au-inputfield-placeholder-text);',
    '}',
    '',
    '.chevron-up {',
    '  transform: rotate(-90deg);',
    '}',
    '',
    '.chevron-down {',
    '  transform: rotate(90deg);',
    '}',
  ].join('\n')
  if (chevronRule.test(styles)) {
    styles = styles.replace(chevronRule, styleReplacement)
  } else if (
    !styles.includes('.chevron-up {') ||
    !styles.includes('.chevron-down {')
  ) {
    throw new Error('could not find the expected Select chevron style')
  }
  writeIfChanged(stylesPath, styles)
}

const transformSpinner = (filePath) => {
  const source = readFileSync(filePath, 'utf8')
  writeIfChanged(
    filePath,
    replaceRequiredIconName(
      source,
      'LoadingCircleIcon',
      'ProgressActivityIcon',
      'Spinner',
    ),
  )
}

const transformIndeterminateCheckIcons = (filePaths) => {
  for (const filePath of filePaths) {
    const source = readFileSync(filePath, 'utf8')
    writeIfChanged(
      filePath,
      replaceRequiredIconName(
        source,
        'CheckIndeterminateIcon',
        'CheckIndeterminateSmallIcon',
        'indeterminate check',
      ),
    )
  }
}

const transformTooltip = (componentPath, stylesPath) => {
  let source = readFileSync(componentPath, 'utf8')
  source = source.replace(
    "import { TooltipArrowIcon } from '@/components/icons'\n",
    '',
  )
  const tooltipArrow =
    / {6}<TooltipArrowIcon\r?\n {8}width=\{12\}\r?\n {8}height=\{6\}\r?\n {8}aria-hidden\r?\n {8}className=\{styles\['arrow-svg'\]\}\r?\n {6}\/>\r?\n/
  if (tooltipArrow.test(source)) {
    source = source.replace(
      tooltipArrow,
      "      <span aria-hidden className={styles['arrow-shape']} />\n",
    )
  } else if (!source.includes("className={styles['arrow-shape']}")) {
    throw new Error('could not find the expected Tooltip arrow element')
  }
  if (source.includes('TooltipArrowIcon')) {
    throw new Error('TooltipArrowIcon reference remains in public Tooltip')
  }
  writeIfChanged(componentPath, source)

  let styles = readFileSync(stylesPath, 'utf8')
  styles = styles.replaceAll('.arrow-svg', '.arrow-shape')
  const arrowRule =
    /\.arrow-shape \{\r?\n {2}display: block;\r?\n {2}fill: var\(--au-content-primary\);\r?\n\}/
  const arrowReplacement = [
    '.arrow-shape {',
    '  display: block;',
    '  width: 12px;',
    '  height: 6px;',
    '  background-color: var(--au-content-primary);',
    '  clip-path: polygon(0 0, 100% 0, 50% 100%);',
    '}',
  ].join('\n')
  if (arrowRule.test(styles)) {
    styles = styles.replace(arrowRule, arrowReplacement)
  } else if (!styles.includes('clip-path: polygon(0 0, 100% 0, 50% 100%)')) {
    throw new Error('could not find the expected Tooltip arrow style')
  }
  writeIfChanged(stylesPath, styles)
}

const transformFilledIconStories = (root) => {
  for (const relativePath of [
    'src/components/Chip/Chip.stories.tsx',
    'src/components/Filter/Filter.stories.tsx',
    'src/components/Popover/Popover.stories.tsx',
  ]) {
    const filePath = resolveInsideRoot(root, relativePath)
    const source = readFileSync(filePath, 'utf8')
    writeIfChanged(
      filePath,
      replaceRequiredIconName(
        source,
        'PersonFillIcon',
        'PersonIcon',
        'filled story',
      ),
    )
  }
}

const transformPublicIconConsumers = (root) => {
  transformSpeechBubble(
    resolveInsideRoot(root, 'src/components/SpeechBubble/SpeechBubble.tsx'),
  )
  transformSelect(
    resolveInsideRoot(root, 'src/components/Form/Select/Select.tsx'),
    resolveInsideRoot(root, 'src/components/Form/Select/Select.module.css'),
  )
  transformSpinner(
    resolveInsideRoot(root, 'src/components/Spinner/Spinner.tsx'),
  )
  transformIndeterminateCheckIcons([
    resolveInsideRoot(root, 'src/components/Form/Checkbox/index.tsx'),
    resolveInsideRoot(root, 'src/components/Form/QuantityField/index.tsx'),
  ])
  transformTooltip(
    resolveInsideRoot(root, 'src/components/Tooltip/Tooltip.tsx'),
    resolveInsideRoot(root, 'src/components/Tooltip/Tooltip.module.css'),
  )
  transformFilledIconStories(root)
}

const transformReadme = (filePath) => {
  let source = readFileSync(filePath, 'utf8')
  const startMarker = '#### Custom and brand icons'
  const endMarker = '### AI Integration'
  const start = source.indexOf(startMarker)
  const end = start < 0 ? -1 : source.indexOf(endMarker, start)

  if (start >= 0 && end > start) {
    source = `${source.slice(0, start)}${PUBLIC_ICON_SCOPE}\n${source.slice(end)}`
    writeIfChanged(filePath, source)
  } else if (!source.includes('#### Public icon scope')) {
    throw new Error(
      'could not find the expected public icon documentation section',
    )
  }
}

export const verifyPublicAssetPolicy = (repositoryDirectory) => {
  const root = path.resolve(repositoryDirectory)
  const packageJsonPath = resolveInsideRoot(root, 'package.json')
  if (!existsSync(packageJsonPath)) {
    throw new Error('package.json is missing from the public asset policy root')
  }
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  if (![SOURCE_PACKAGE_NAME, PUBLIC_PACKAGE_NAME].includes(packageJson.name)) {
    throw new Error(
      `unexpected package for public asset policy: ${packageJson.name}`,
    )
  }

  for (const relativePath of [...excludedPublicAssetPaths, 'dist']) {
    if (existsSync(resolveInsideRoot(root, relativePath))) {
      throw new Error(`excluded asset remains after filtering: ${relativePath}`)
    }
  }

  const requiredPaths = [
    'scripts/public-assets/fonts',
    'scripts/public-assets/font-assets.json',
    PUBLIC_ICON_OVERRIDES_MANIFEST,
    `${PUBLIC_ICON_OVERRIDES_DIRECTORY}/menu.svg`,
    `${PUBLIC_ICON_OVERRIDES_DIRECTORY}/progress-activity.svg`,
    `${PUBLIC_ICON_OVERRIDES_DIRECTORY}/check-indeterminate-small.svg`,
    `${BASICS_ICON_DIRECTORY}/check-indeterminate-small.svg`,
    `${BASICS_ICON_DIRECTORY}/history.svg`,
    `${BASICS_ICON_DIRECTORY}/menu.svg`,
    `${BASICS_ICON_DIRECTORY}/progress-activity.svg`,
    'src/assets/fonts',
    'LICENSES/font-assets.json',
    'src/components/Form/FileUpload/FileList.tsx',
    'src/components/Form/Select/Select.tsx',
    'src/components/SpeechBubble/SpeechBubble.tsx',
    'src/components/Spinner/Spinner.tsx',
    'src/components/Form/Checkbox/index.tsx',
    'src/components/Form/QuantityField/index.tsx',
    'src/components/Tooltip/Tooltip.tsx',
    'src/components/Chip/Chip.stories.tsx',
    'src/components/Filter/Filter.stories.tsx',
    'src/components/Popover/Popover.stories.tsx',
    'src/components/icons/index.ts',
    'README.md',
  ]
  for (const relativePath of requiredPaths) {
    if (!existsSync(resolveInsideRoot(root, relativePath))) {
      throw new Error(
        `required filtered public file is missing: ${relativePath}`,
      )
    }
  }

  verifyFontAssets(root)
  verifyPublicMaterialSymbols(root)

  const fileList = readFileSync(
    resolveInsideRoot(root, 'src/components/Form/FileUpload/FileList.tsx'),
    'utf8',
  )
  if (
    !fileList.includes('const renderFileIcon = (): JSX.Element') ||
    /CsvFileIcon|PdfFileRedIcon|FILE_TYPE_ICONS|SVGProps|DraftIcon/.test(
      fileList,
    )
  ) {
    throw new Error('public FileList still uses restricted file-type icons')
  }
  const publicConsumerChecks = [
    {
      path: 'src/components/SpeechBubble/SpeechBubble.tsx',
      required: 'ContractEditIcon',
      forbidden: 'DraftIcon',
      message: 'public SpeechBubble still references the MCC Draft icon',
    },
    {
      path: 'src/components/Form/Select/Select.tsx',
      required: "styles['chevron-up']",
      forbidden: 'KeyboardArrow',
      message: 'public Select still references MCC keyboard-arrow icons',
    },
    {
      path: 'src/components/Spinner/Spinner.tsx',
      required: 'ProgressActivityIcon',
      forbidden: 'LoadingCircleIcon',
      message: 'public Spinner still references the unverified loading icon',
    },
    {
      path: 'src/components/Form/Checkbox/index.tsx',
      required: 'CheckIndeterminateSmallIcon',
      forbidden: 'CheckIndeterminateIcon',
      message: 'public Checkbox still references the unverified check icon',
    },
    {
      path: 'src/components/Form/QuantityField/index.tsx',
      required: 'CheckIndeterminateSmallIcon',
      forbidden: 'CheckIndeterminateIcon',
      message:
        'public QuantityField still references the unverified check icon',
    },
    {
      path: 'src/components/Tooltip/Tooltip.tsx',
      required: "className={styles['arrow-shape']}",
      forbidden: 'TooltipArrowIcon',
      message: 'public Tooltip still references the unverified arrow asset',
    },
    {
      path: 'src/components/Chip/Chip.stories.tsx',
      required: 'PersonIcon',
      forbidden: 'PersonFillIcon',
      message: 'public Chip story still references a filled icon',
    },
    {
      path: 'src/components/Filter/Filter.stories.tsx',
      required: 'PersonIcon',
      forbidden: 'PersonFillIcon',
      message: 'public Filter story still references a filled icon',
    },
    {
      path: 'src/components/Popover/Popover.stories.tsx',
      required: 'PersonIcon',
      forbidden: 'PersonFillIcon',
      message: 'public Popover story still references a filled icon',
    },
  ]
  for (const check of publicConsumerChecks) {
    const content = readFileSync(resolveInsideRoot(root, check.path), 'utf8')
    if (
      !content.includes(check.required) ||
      content.includes(check.forbidden)
    ) {
      throw new Error(check.message)
    }
  }
  const tooltipStyles = readFileSync(
    resolveInsideRoot(root, 'src/components/Tooltip/Tooltip.module.css'),
    'utf8',
  )
  if (
    !tooltipStyles.includes('clip-path: polygon(0 0, 100% 0, 50% 100%)') ||
    tooltipStyles.includes('.arrow-svg')
  ) {
    throw new Error('public Tooltip arrow is not CSS-only')
  }
  if (
    readFileSync(
      resolveInsideRoot(root, 'src/components/icons/index.ts'),
      'utf8',
    ) !== ICONS_INDEX
  ) {
    throw new Error('public icon exports are not limited to the basics set')
  }
  if (
    !readFileSync(resolveInsideRoot(root, 'README.md'), 'utf8').includes(
      '#### Public icon scope',
    )
  ) {
    throw new Error('public icon scope is missing from README')
  }

  return root
}

export const applyPublicAssetPolicy = (repositoryDirectory) => {
  const root = path.resolve(repositoryDirectory)
  const packageJsonPath = resolveInsideRoot(root, 'package.json')
  if (!existsSync(packageJsonPath)) {
    throw new Error('package.json is missing from the public asset policy root')
  }
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  if (![SOURCE_PACKAGE_NAME, PUBLIC_PACKAGE_NAME].includes(packageJson.name)) {
    throw new Error(
      `unexpected package for public asset policy: ${packageJson.name}`,
    )
  }

  const publicFontSourceDirectory = resolveInsideRoot(
    root,
    'scripts/public-assets/fonts',
  )
  const publicFontManifestSource = resolveInsideRoot(
    root,
    'scripts/public-assets/font-assets.json',
  )
  const publicFontManifestTarget = resolveInsideRoot(
    root,
    'LICENSES/font-assets.json',
  )
  const fileListPath = resolveInsideRoot(
    root,
    'src/components/Form/FileUpload/FileList.tsx',
  )
  const iconsIndexPath = resolveInsideRoot(
    root,
    'src/components/icons/index.ts',
  )
  const readmePath = resolveInsideRoot(root, 'README.md')

  if (
    !existsSync(publicFontSourceDirectory) ||
    !existsSync(publicFontManifestSource) ||
    !existsSync(resolveInsideRoot(root, PUBLIC_MATERIAL_SYMBOLS_MANIFEST))
  ) {
    throw new Error('a pinned public asset bundle or manifest is missing')
  }
  const materialSymbolsManifest = JSON.parse(
    readFileSync(
      resolveInsideRoot(root, PUBLIC_MATERIAL_SYMBOLS_MANIFEST),
      'utf8',
    ),
  )
  const publicIconOverrides = readPublicIconOverrides(
    root,
    materialSymbolsManifest.source?.revision,
  )
  for (const relativePath of pathsToRemove) {
    rmSync(resolveInsideRoot(root, relativePath), {
      recursive: true,
      force: true,
    })
  }
  for (const name of Object.keys(publicIconOverrides.files)) {
    copyFileSync(
      resolveInsideRoot(root, `${PUBLIC_ICON_OVERRIDES_DIRECTORY}/${name}.svg`),
      resolveInsideRoot(root, `${BASICS_ICON_DIRECTORY}/${name}.svg`),
    )
  }
  projectPublicMaterialSymbols(root)
  cpSync(
    publicFontSourceDirectory,
    resolveInsideRoot(root, 'src/assets/fonts'),
    { recursive: true },
  )
  copyFileSync(publicFontManifestSource, publicFontManifestTarget)
  verifyFontAssets(root)

  if (
    !existsSync(fileListPath) ||
    !existsSync(iconsIndexPath) ||
    !existsSync(readmePath)
  ) {
    throw new Error('required public source files are missing')
  }
  transformFileList(fileListPath)
  transformPublicIconConsumers(root)
  writeIfChanged(iconsIndexPath, ICONS_INDEX)
  transformReadme(readmePath)

  return verifyPublicAssetPolicy(root)
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [firstArgument, secondArgument, ...extraArguments] =
    process.argv.slice(2)
  if (firstArgument === '--check') {
    if (!secondArgument || extraArguments.length > 0) {
      throw new Error(
        'usage: apply-public-asset-policy.mjs --check REPOSITORY_DIRECTORY',
      )
    }
    verifyPublicAssetPolicy(secondArgument)
    process.stdout.write('Verified the public asset policy.\n')
  } else {
    if (!firstArgument || secondArgument || extraArguments.length > 0) {
      throw new Error(
        'usage: apply-public-asset-policy.mjs [--check] REPOSITORY_DIRECTORY',
      )
    }
    applyPublicAssetPolicy(firstArgument)
    process.stdout.write('Applied the public asset policy.\n')
  }
}
