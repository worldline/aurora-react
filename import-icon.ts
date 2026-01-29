import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const SVG_DIR = join('src/assets/icons/svg')

const toSnakeForUrl = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
    
const toKebabForFile = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()

const iconName = process.argv[2]
const isFilled = process.argv.includes('--fill')

if (!iconName) {
  console.error('Usage: npm run import-icon -- <icon-name> [--fill]')
  process.exit(1)
}

const glyphSnake = toSnakeForUrl(iconName)
const fileBase = toKebabForFile(iconName)

const family = isFilled ? 'materialsymbols' : 'materialsymbolsoutlined'
const variantPath = isFilled ? 'fill1' : 'default'
const url = `https://fonts.gstatic.com/s/i/short-term/release/${family}/${glyphSnake}/${variantPath}/24px.svg`

const res = await fetch(url)
if (!res.ok) {
  console.error(`Failed to fetch: ${url} (HTTP ${res.status})`)
  process.exit(1)
}

const rawSvg = await res.text()

mkdirSync(SVG_DIR, { recursive: true })

const fileName = isFilled ? `${fileBase}-fill.svg` : `${fileBase}.svg`
const svgPath = join(SVG_DIR, fileName)
writeFileSync(svgPath, rawSvg)

console.log(`SVG saved: ${svgPath}`)

