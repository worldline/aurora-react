import { type JSX } from 'react'

import { Button } from '../../Button'
import { HelpIcon } from '../../icons'
import { Tooltip, TooltipTrigger } from '../../Tooltip'
import { Typography } from '../../Typography'
import styles from './FileUploadLabel.module.css'

interface FileUploadLabelProps {
  label?: string
  tooltip?: string
  labelId: string
  tooltipTriggerAriaLabel: string
}

const FileUploadLabel = ({
  label,
  tooltip,
  labelId,
  tooltipTriggerAriaLabel,
}: FileUploadLabelProps): JSX.Element | null => {
  const hasLabelRow = label !== undefined || tooltip !== undefined

  return hasLabelRow ? (
    <div className={styles['label-row']}>
      {label !== undefined ? (
        <Typography
          id={labelId}
          element="span"
          textStyle="labelSm"
          className={styles.label}
        >
          {label}
        </Typography>
      ) : null}
      {tooltip !== undefined ? (
        <TooltipTrigger delay={300}>
          <Button
            aria-label={tooltipTriggerAriaLabel}
            variant="link"
            className={styles['tooltip-trigger']}
          >
            <HelpIcon size={24} aria-hidden />
          </Button>
          <Tooltip title={tooltip} alignment="top" />
        </TooltipTrigger>
      ) : null}
    </div>
  ) : null
}

export { FileUploadLabel, type FileUploadLabelProps }
