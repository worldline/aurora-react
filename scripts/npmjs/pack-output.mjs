import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const parsePackOutput = (output) => {
  const parsed = JSON.parse(output)
  let records = []
  if (Array.isArray(parsed)) {
    records = parsed
  } else if (parsed && typeof parsed === 'object') {
    records =
      typeof parsed.filename === 'string' ? [parsed] : Object.values(parsed)
  }
  const packRecords = records.filter(
    (record) =>
      record &&
      typeof record === 'object' &&
      typeof record.filename === 'string' &&
      record.filename.length > 0,
  )

  if (packRecords.length !== 1) {
    throw new Error(
      'npm pack --json must contain exactly one pack record with a filename',
    )
  }

  return packRecords[0]
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const pack = parsePackOutput(readFileSync(0, 'utf8'))
  process.stdout.write(pack.filename)
}
