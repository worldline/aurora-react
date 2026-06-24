'use client'

import cn from 'classnames'
import {
  SwitchButton as AriaSwitchButton,
  SwitchField as AriaSwitchField,
  type SwitchFieldProps as AriaSwitchFieldProps,
} from 'react-aria-components'

import { Typography } from '@/components/Typography'

import styles from './Switch.module.css'

interface WithoutTextProps {
  label?: never
  description?: never
}

interface WithTextProps {
  label: string
  description?: string
}

type SwitchProps = Omit<AriaSwitchFieldProps, 'children'> &
  (WithoutTextProps | WithTextProps)

interface TextContentProps {
  label?: string
  description?: string
  isDisabled: boolean
}

const TextContent = ({ label, description, isDisabled }: TextContentProps) => {
  if (label === undefined) {
    return null
  }

  return (
    <div className={styles['text-content']}>
      <Typography
        element="p"
        textStyle="labelSm"
        textColor={isDisabled ? 'contentDisabled' : 'contentPrimary'}
      >
        {label}
      </Typography>
      {description !== undefined ? (
        <Typography
          element="p"
          textStyle="bodySm"
          textColor={isDisabled ? 'contentDisabled' : 'contentSecondary'}
        >
          {description}
        </Typography>
      ) : null}
    </div>
  )
}

const Switch = ({ label, description, className, ...props }: SwitchProps) => (
  <AriaSwitchField {...props}>
    <AriaSwitchButton className={cn(styles.switch, className)}>
      {({ isDisabled }: { isDisabled: boolean }) => (
        <>
          <div className={styles.surface}>
            <div className={styles.dot} />
          </div>
          <TextContent
            label={label}
            description={description}
            isDisabled={isDisabled}
          />
        </>
      )}
    </AriaSwitchButton>
  </AriaSwitchField>
)

export { Switch, type SwitchProps }
