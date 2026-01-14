import cn from 'classnames'
import {
  type HTMLElementType,
  type HtmlHTMLAttributes,
  type ReactNode,
} from 'react'

import type { AuColor } from '../../styles/colors'
import type { AuTypography } from '../../styles/typographies'

import styles from './Typography.module.css'

type HeadingElement = Extract<
  HTMLElementType,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>

type TextElement = Extract<
  HTMLElementType,
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
>

type ContainerElement = Extract<HTMLElementType, 'div' | 'span'>

type Element = HeadingElement | TextElement | ContainerElement

type TextColor = Extract<
  AuColor,
  | 'contentPrimary'
  | 'contentSecondary'
  | 'contentTertiary'
  | 'contentPlaceholder'
  | 'contentInvert'
  | 'contentDisabled'
  | 'contentBrand'
  | 'contentOnBrand'
  | 'contentOnBrandHover'
  | 'contentError'
  | 'contentWarning'
  | 'contentSuccess'
>

type HtmlTypographyElement = HTMLHeadingElement | HTMLParagraphElement

interface TypographyProps
  extends HtmlHTMLAttributes<HTMLHeadingElement & HTMLParagraphElement> {
  /* Html element which will be rendered */
  element: Element
  /* Text style from the Design System */
  textStyle: AuTypography
  /* Text color from the Design System */
  textColor?: TextColor
  /* Content of the typography */
  children: ReactNode
}

// <Typography color="neutral-100" textStyle="heading-xxl" element="h1" />
const Typography = ({
  ref,
  element: Type,
  textStyle,
  textColor = 'contentPrimary',
  className,
  children,
  ...props
}: TypographyProps & {
  ref?: React.RefObject<HtmlTypographyElement | null>
}) => (
  <Type
    ref={ref}
    className={cn([
      styles[toKebabCase(textStyle as string)],
      styles[toKebabCase(textColor as string)],
      className,
    ])}
    {...props}
  >
    {children}
  </Type>
)

export { Typography }

const toKebabCase = (s: string) =>
  s.replace(/([a-z])([0-9A-Z])/g, '$1-$2').toLowerCase()
