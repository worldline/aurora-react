'use client'

import cn from 'classnames'
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  OverlayArrow,
} from 'react-aria-components'

import { TooltipArrowIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './Tooltip.module.css'

type TooltipAlignment = NonNullable<AriaTooltipProps['placement']>

interface TooltipContentProps {
  /** Title text displayed in the tooltip */
  title?: string
  /** Description text displayed below the title */
  description?: string
  /** Placement of the tooltip relative to the trigger */
  alignment?: TooltipAlignment
}

type TooltipProps = TooltipContentProps &
  Omit<AriaTooltipProps, 'children' | 'placement'> & {
    className?: string
  }

const Tooltip = ({
  title,
  description,
  alignment = 'top start',
  className,
  ...props
}: TooltipProps) => (
  <AriaTooltip
    placement={alignment}
    className={cn(styles.tooltip, className)}
    offset={8}
    {...props}
  >
    <OverlayArrow
      className={cn(styles.arrow, {
        [styles['arrow-start']]: alignment.includes('start'),
        [styles['arrow-end']]: alignment.includes('end'),
      })}
    >
      <TooltipArrowIcon
        width={12}
        height={6}
        aria-hidden
        className={styles['arrow-svg']}
      />
    </OverlayArrow>
    <div className={styles.content}>
      {title ? (
        <Typography
          element="span"
          textStyle="labelSm"
          textColor="contentInvert"
        >
          {title}
        </Typography>
      ) : null}
      {description ? (
        <Typography
          element="span"
          textStyle="captionMd"
          textColor="contentInvert"
        >
          {description}
        </Typography>
      ) : null}
    </div>
  </AriaTooltip>
)

export { Tooltip, type TooltipAlignment }
