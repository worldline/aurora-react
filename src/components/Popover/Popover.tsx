'use client'

import {
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components'

type PopoverProps = AriaPopoverProps

const Popover = ({
  children,
  offset = 0,
  crossOffset = 0,
  ...props
}: PopoverProps) => (
  <AriaPopover {...props} offset={offset} crossOffset={crossOffset}>
    {children}
  </AriaPopover>
)

export { Popover, type PopoverProps }
