/* eslint-disable no-console */
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

interface MaterialSymbolManifest {
  source?: {
    revision?: string
  }
  scope?: {
    fileCount?: number
  }
  files?: unknown
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const manifestPath = join(
  import.meta.dirname,
  'material-symbols-provenance.json',
)
const manifest = JSON.parse(
  await readFile(manifestPath, 'utf8'),
) as MaterialSymbolManifest
const revision = manifest.source?.revision
const fileHashes = manifest.files
const expectedFileCount = manifest.scope?.fileCount

if (typeof revision !== 'string' || !/^[\da-f]{40}$/i.test(revision)) {
  throw new Error(
    'Invalid source revision in scripts/material-symbols-provenance.json',
  )
}

if (
  typeof expectedFileCount !== 'number' ||
  !Number.isInteger(expectedFileCount)
) {
  throw new Error(
    `Invalid expected file count in provenance manifest: ${String(expectedFileCount)}`,
  )
}

if (!isObjectRecord(fileHashes)) {
  throw new Error('Invalid files object in provenance manifest')
}

const entries = Object.entries(fileHashes)

if (entries.length !== expectedFileCount) {
  throw new Error(
    `Expected ${String(expectedFileCount)} provenance entries; found ${String(entries.length)}`,
  )
}

const iconsDirectory = join(
  import.meta.dirname,
  '..',
  'src',
  'assets',
  'icons',
  'basics',
)
const failures: Array<string> = []

for (const [iconName, expectedHash] of entries) {
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(iconName) ||
    typeof expectedHash !== 'string' ||
    !/^[\da-f]{64}$/.test(expectedHash)
  ) {
    failures.push(`${iconName}: invalid provenance manifest entry`)
    continue
  }

  try {
    const contents = await readFile(join(iconsDirectory, `${iconName}.svg`))
    const actualHash = createHash('sha256').update(contents).digest('hex')

    if (actualHash !== expectedHash) {
      failures.push(
        `${iconName}.svg: expected SHA-256 ${expectedHash}, found ${actualHash}`,
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    failures.push(`${iconName}.svg: ${message}`)
  }
}

if (failures.length > 0) {
  console.error(
    `Material Symbols integrity check failed with ${String(failures.length)} issue(s):`,
  )
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exitCode = 1
} else {
  console.log(
    `Verified ${String(expectedFileCount)} Material Symbols SVGs against Google commit ${revision}.`,
  )
}
