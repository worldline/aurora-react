import nodePath from 'path'

export default {
  typescript: true,
  jsxRuntime: 'automatic',
  expandProps: 'end',
  outDir: 'src/components/icons',
  filenameCase: 'pascal',
  index: true,
  indexTemplate: (filePaths) => {
    return filePaths
      .map(({ path }) => {
        const name = nodePath.basename(path, '.tsx')
        return `export { default as ${name}Icon } from './${name}'`
      })
      .join('\n')
  },
  template: ({ imports, componentName, jsx }, { tpl }) => tpl`
${imports};
type Props = SVGProps<SVGSVGElement> & { size?: number | string }
const ${componentName} = ({ size = 24, ...props }: Props) => ${jsx}
export default ${componentName}
`,
 svgoConfig: {
 plugins: [ 
      { name: 'removeViewBox', active: false }, 
      { name: 'removeDimensions', active: true }, 
      { name: 'removeAttrs', params: { attrs: '(fill|stroke)' } },
    ], 
  },
  svgProps: {
    width: '{size}',
    height: '{size}',
    fill: 'currentColor',
  }
}
