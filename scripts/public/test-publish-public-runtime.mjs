import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
)
const ciConfiguration = readFileSync(
  path.join(repositoryRoot, '.gitlab-ci.yml'),
  'utf8',
)
const extractJob = (jobName) => {
  const jobHeader = `\n${jobName}:\n`
  const jobHeaderIndex = ciConfiguration.indexOf(jobHeader)
  assert.notEqual(jobHeaderIndex, -1, `${jobName} must exist in .gitlab-ci.yml`)

  const contentStart = jobHeaderIndex + jobHeader.length
  const jobContents = ciConfiguration.slice(contentStart)
  const nextJobHeader = /^\S[^:\r\n]*:\s*$/m.exec(jobContents)
  return jobContents.slice(0, nextJobHeader?.index ?? jobContents.length)
}

const runtimeTemplate = extractJob('.public-publish-runtime')
const publishPublicJob = extractJob('publish-public')
const runtimeCheckJob = extractJob('test-public-publish-runtime')

test('mirror and runtime check share the pinned Node/Python toolchain', () => {
  assert.match(
    runtimeTemplate,
    /^ {2}image:\s+["']?node:26@sha256:[a-f0-9]{64}["']?\s*$/m,
    'the shared runtime template must use the pinned Node 26 image',
  )
  assert.match(
    runtimeTemplate,
    /^ {6}node --version\s*$/m,
    'the shared runtime template must check Node before the job runs',
  )
  assert.match(
    runtimeTemplate,
    /python3 -m venv \/opt\/aurora-public-publish-venv/,
    'the shared runtime template must provide the Python environment',
  )
  assert.match(
    publishPublicJob,
    /^ {2}extends:\r?\n {4}- \.public-publish-runtime/m,
  )
  assert.match(
    runtimeCheckJob,
    /^ {2}extends:\r?\n {4}- \.public-publish-runtime/m,
  )

  const publisherScript = readFileSync(
    path.join(repositoryRoot, '.gitlab/public/publish-public.sh'),
    'utf8',
  )
  assert.match(
    publisherScript,
    /node "\$\{SOURCE_DIR\}\/scripts\/public\/apply-public-asset-policy\.mjs"/,
    'public projection script must retain its Node asset-policy step',
  )
})

test('shared runtime installs the Python modules used by GitHub auth and filtering', () => {
  assert.match(runtimeTemplate, /git-filter-repo==2\.47\.0/)
  assert.match(runtimeTemplate, /PyJWT==2\.10\.1/)
  assert.match(runtimeTemplate, /cryptography==46\.0\.7/)
})
