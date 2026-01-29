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
import { useId } from 'react'

type Props = SVGProps<SVGSVGElement> & { size?: number | string, title?: string, titleId?: string }
const Icon = ({ size = 24, title, titleId, ...props }: Props) => ${jsx}
const ${componentName} = (props: Props) => {
  const generatedId = useId()
  const titleId = props.titleId || (props.title ? generatedId : undefined)
  return <Icon titleId={titleId} {...props} />
}
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
    role: 'img',
  },
  titleProp: true,
}
