'use client'

import cn from 'classnames'
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps,
} from 'react-aria-components'

import { Typography } from '../../Typography'
import styles from './Switch.module.css'

interface WithoutTextProps {
  label?: never
  description?: never
}

interface WithTextProps {
  label: string
  description?: string
}

interface BaseSwitchProps extends Omit<AriaSwitchProps, 'children'> {
  /**
   * The name of the switch submitted with its owning form.
   * When selected, `value` is included in the form data under this key.
   * @see https://react-aria.adobe.com/Switch.html
   */
  name?: string
  /**
   * The value submitted with the form when the switch is selected.
   * Defaults to `"on"` if not specified — standard checkbox behaviour.
   * @see https://react-aria.adobe.com/Switch.html
   */
  value?: string
}

type SwitchProps = BaseSwitchProps & (WithoutTextProps | WithTextProps)

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

const Switch = ({ label, description, ...props }: SwitchProps) => (
  <AriaSwitch {...props} className={cn(styles.switch, props.className)}>
    {({ isDisabled }) => (
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
  </AriaSwitch>
)

export { Switch, type SwitchProps }
