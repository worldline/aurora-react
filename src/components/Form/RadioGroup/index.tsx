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
  title: string
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

type RadioGroupProps = AriaRadioGroupProps & {
  children: ReactNode
  error?: false | string
} & (PropsWithText | PropsWithoutText)

const RadioGroupBase = ({
  title,
  description,
  children,
  error = false,
  orientation = 'vertical',
  ...props
}: RadioGroupProps) => {
  const hasErrorMessage = error && typeof error === 'string'
  const id = useId()
  const errorId = hasErrorMessage ? `${id}-error` : undefined

  return (
    <AriaRadioGroup
      isInvalid={Boolean(error)}
      aria-describedby={errorId}
      orientation={orientation}
      {...props}
      className={cn(styles.group, props.className)}
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
