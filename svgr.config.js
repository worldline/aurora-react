/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// eslint-disable-next-line @typescript-eslint/ban-tslint-comment
/* tslint:disable */
import nodePath from 'path'

export default {
  typescript: true,
  jsxRuntime: 'automatic',
  expandProps: 'end',
  outDir: 'src/components/icons',
  filenameCase: 'pascal',
  index: true,
  indexTemplate: (filePaths) =>
    filePaths
      .map(({ path }) => {
        const name = nodePath.basename(path, '.tsx')
        return `export { default as ${name}Icon } from './${name}'`
      })
      .join('\n'),
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
    ],
  },
  svgProps: {
    width: '{size}',
    fill: 'currentColor',
    role: 'img',
  },
  titleProp: true,
}
