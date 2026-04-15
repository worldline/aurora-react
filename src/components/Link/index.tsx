'use client'

import cn from 'classnames'
import { Link as AriaLink, type LinkProps } from 'react-aria-components'

import { type AuroraButtonProps } from '@/components/Button'
import { buttonClassName } from '@/components/Button/buttonStyles'

type Props = LinkProps &
  (
    | {
        variant?: 'default'
        buttonProps?: never
      }
    | {
        variant: 'button'
        buttonProps?: AuroraButtonProps
      }
  )

const Link = ({ variant = 'default', buttonProps, ...props }: Props) => {
  const className =
    variant === 'button'
      ? buttonClassName({
          variant: buttonProps?.variant,
          size: buttonProps?.size,
        })
      : undefined

  return <AriaLink {...props} className={cn(className, props.className)} />
}

export { Link }
