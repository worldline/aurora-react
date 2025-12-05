import cn from 'classnames'
import { type HtmlHTMLAttributes, type ReactNode } from 'react'

import './style.css'

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type TextElement =
  | 'p'
  | 'b'
  | 'i'
  | 'u'
  | 'abbr'
  | 'cite'
  | 'em'
  | 'strong'
  | 'kbd'
  | 'mark'
  | 's'
  | 'samp'
  | 'sub'
  | 'sup'

type ContainerElement = 'div' | 'span'

type Element = HeadingElement | TextElement | ContainerElement

type TextColor = 'base' | 'active' // import from DS

type TextStyle = 'header-1' | 'header-2' | 'label-1' | 'label-2'

type HtmlTypographyElement = HTMLHeadingElement | HTMLParagraphElement

interface TypographyProps
  extends HtmlHTMLAttributes<HTMLHeadingElement & HTMLParagraphElement> {
  /* Html element which will be rendered */
  element: Element
  /* Text style from the Design System */
  textStyle: TextStyle
  /* Text color from the Design System */
  textColor?: TextColor
  /* Content of the typography */
  children: ReactNode
}

const Typography = ({
  ref,
  element: Type,
  textStyle,
  textColor = 'base',
  className,
  children,
  ...props
}: TypographyProps & {
  ref?: React.RefObject<HtmlTypographyElement | null>
}) => (
  <Type
    ref={ref}
    className={cn([
      `typography-${textStyle}`,
      `text-color-${textColor}`,
      className,
    ])}
    {...props}
  >
    {children}
  </Type>
)

export { Typography }
