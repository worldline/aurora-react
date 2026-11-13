import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SOURCE_PACKAGE_NAME = '@worldline/aurora-react'
const PUBLIC_PACKAGE_NAME = '@worldline-official/aurora-react'
const SOURCE_TOKENS_NAME = '@worldline/aurora-design-tokens'
const PUBLIC_TOKENS_NAME = '@worldline-official/aurora-design-tokens'
const PUBLIC_PACKAGE_TEXT_EXTENSIONS = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.mjs',
  '.map',
  '.sass',
  '.scss',
  '.ts',
  '.tsx',
])
const EXACT_VERSION_PATTERN =
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/
const NPMJS_REGISTRY = 'https://registry.npmjs.org/'
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const publicReadme = path.resolve(scriptDir, '../../npmjs/README.md')

const rewritePublicPackageTokenReferences = (directory) => {
  if (!fs.existsSync(directory)) {
    return
  }

  for (const entry of fs.readdirSync(directory, {
    withFileTypes: true,
  })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      rewritePublicPackageTokenReferences(entryPath)
      continue
    }
    if (
      !entry.isFile() ||
      !PUBLIC_PACKAGE_TEXT_EXTENSIONS.has(path.extname(entry.name))
    ) {
      continue
    }

    const source = fs.readFileSync(entryPath, 'utf8')
    if (!source.includes(SOURCE_TOKENS_NAME)) {
      continue
    }
    fs.writeFileSync(
      entryPath,
      source.replaceAll(SOURCE_TOKENS_NAME, PUBLIC_TOKENS_NAME),
      'utf8',
    )
  }
}

const [packageDirectory, githubRepository, ...options] = process.argv.slice(2)
const retainScripts = options.includes('--retain-scripts')
if (options.some((option) => option !== '--retain-scripts')) {
  throw new Error(
    `unknown option: ${options.find((option) => option !== '--retain-scripts')}`,
  )
}
if (!packageDirectory || !githubRepository) {
  throw new Error(
    'usage: prepare-public-package.mjs PACKAGE_DIRECTORY GITHUB_REPOSITORY [--retain-scripts]',
  )
}
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(githubRepository)) {
  throw new Error('GitHub repository must use owner/repository format')
}

const packageDir = path.resolve(packageDirectory)
const packageJsonPath = path.join(packageDir, 'package.json')
if (!fs.existsSync(packageJsonPath)) {
  throw new Error(`package.json is missing from ${packageDir}`)
}
if (!fs.existsSync(publicReadme)) {
  throw new Error('public npmjs README is missing')
}
if (
  !fs.existsSync(path.join(packageDir, 'LICENSE')) ||
  !fs.existsSync(path.join(packageDir, 'LICENSES'))
) {
  throw new Error(
    'approved project and third-party license records are required',
  )
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
if (packageJson.private === true) {
  throw new Error('refusing to prepare a private package')
}
if (packageJson.name !== SOURCE_PACKAGE_NAME) {
  throw new Error(
    `expected source package ${SOURCE_PACKAGE_NAME}, received ${packageJson.name}`,
  )
}
if (packageJson.license !== 'Apache-2.0') {
  throw new Error('source package license must be Apache-2.0')
}

let tokensDependencyFound = false
for (const section of [
  'dependencies',
  'optionalDependencies',
  'peerDependencies',
]) {
  const dependencies = packageJson[section]
  if (!dependencies || !Object.hasOwn(dependencies, SOURCE_TOKENS_NAME)) {
    continue
  }
  const version = dependencies[SOURCE_TOKENS_NAME]
  if (typeof version !== 'string' || !EXACT_VERSION_PATTERN.test(version)) {
    throw new Error(`React must pin ${SOURCE_TOKENS_NAME} to an exact version`)
  }
  if (Object.hasOwn(dependencies, PUBLIC_TOKENS_NAME)) {
    throw new Error(
      `source and public token dependencies cannot both be declared in ${section}`,
    )
  }
  const publicDependencies = Object.fromEntries(
    Object.entries(dependencies).filter(
      ([name]) => name !== SOURCE_TOKENS_NAME,
    ),
  )
  publicDependencies[PUBLIC_TOKENS_NAME] = version
  packageJson[section] = publicDependencies
  if (section === 'dependencies') {
    tokensDependencyFound = true
  }
}
if (!tokensDependencyFound) {
  throw new Error(
    `React must depend on ${SOURCE_TOKENS_NAME} using an exact version`,
  )
}

packageJson.name = PUBLIC_PACKAGE_NAME
packageJson.repository = {
  type: 'git',
  url: `https://github.com/${githubRepository}.git`,
}
packageJson.publishConfig = { registry: NPMJS_REGISTRY, access: 'public' }
rewritePublicPackageTokenReferences(path.join(packageDir, 'src'))
rewritePublicPackageTokenReferences(path.join(packageDir, 'dist'))
if (!retainScripts) {
  delete packageJson.scripts
  if (
    packageJson.main &&
    !fs.existsSync(path.join(packageDir, packageJson.main))
  ) {
    delete packageJson.main
  }
}

fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
fs.copyFileSync(publicReadme, path.join(packageDir, 'README.md'))
