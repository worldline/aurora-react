'use client'

import cn from 'classnames'
import { type ReactNode, useId } from 'react'
import {
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  Label,
  Text,
} from 'react-aria-components'

import { ErrorMessage } from '@/components/Form/ErrorMessage'
import { Typography } from '@/components/Typography'

import { RadioButton } from './RadioButton'
import styles from './RadioGroup.module.css'

interface PropsWithText {
  /** Visible label displayed above the radio buttons. */
  title: string
  /** Optional description displayed below the title. */
  description?: string
}

interface PropsWithoutText {
  title?: never
  description?: never
}

type HeaderProps = PropsWithText

const Header = ({ title, description }: HeaderProps) => (
  <div className={styles.header}>
    <Label>
      <Typography element="span" textStyle="titleMd" textColor="contentPrimary">
        {title}
      </Typography>
    </Label>

    {description !== undefined ? (
      <Text slot="description">
        <Typography
          element="span"
          textStyle="bodyMd"
          textColor="contentSecondary"
        >
          {description}
        </Typography>
      </Text>
    ) : null}
  </div>
)

type RadioGroupProps<T extends string> = Omit<
  AriaRadioGroupProps,
  'onChange' | 'value' | 'defaultValue'
> & {
  /** Radio buttons to render inside the group. */
  children: ReactNode
  /** Error message to display below the group, or `false` to show no error. */
  error?: false | string
  /** Currently selected value (controlled). */
  value?: T
  /** Default selected value for uncontrolled usage. */
  defaultValue?: T
  /** Callback fired when the selected value changes. */
  onChange?: (value: T) => void
} & (PropsWithText | PropsWithoutText)

const RadioGroupBase = <T extends string>({
  title,
  description,
  children,
  error = false,
  orientation = 'vertical',
  onChange,
  ...props
}: RadioGroupProps<T>) => {
  const hasErrorMessage = error && typeof error === 'string'
  const id = useId()
  const errorId = hasErrorMessage ? `${id}-error` : undefined

  return (
    <AriaRadioGroup
      isInvalid={Boolean(error)}
      aria-describedby={errorId}
      orientation={orientation}
      className={cn(styles.group, props.className)}
      onChange={
        onChange === undefined
          ? undefined
          : (value: string) => {
              onChange(value as T)
            }
      }
      {...props}
    >
      {title !== undefined ? (
        <Header title={title} description={description} />
      ) : null}
      <div className={styles.radios}>{children}</div>
      {hasErrorMessage ? <ErrorMessage id={errorId} error={error} /> : null}
    </AriaRadioGroup>
  )
}

const RadioGroup = Object.assign(RadioGroupBase, { Radio: RadioButton })

export { RadioGroup, type RadioGroupProps }
