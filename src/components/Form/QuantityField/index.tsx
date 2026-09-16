'use client'

import { announce } from '@react-aria/live-announcer'
import cn from 'classnames'
import { type CSSProperties, useEffect } from 'react'
import {
  Group,
  Input,
  Label,
  NumberField,
  type NumberFieldProps,
  useLocale,
} from 'react-aria-components'

import { Button } from '@/components/Button'
import { FieldSupport } from '@/components/Form/FieldSupport'
import { AddIcon, CheckIndeterminateIcon } from '@/components/icons'
import { Typography } from '@/components/Typography'

import styles from './QuantityField.module.css'

export interface QuantityFieldProps extends Omit<NumberFieldProps, 'children'> {
  /** Visible label for the quantity field. */
  label?: string
  /** Helper text displayed below the quantity field. */
  helperText?: string
  /** Whether the field is invalid, or the error message to display. */
  error?: boolean | string
  /** How an error message is announced to assistive technology. */
  announceError?: 'polite' | 'assertive' | false
  /** Accessible label for the decrement button. */
  decrementAriaLabel: string
  /** Accessible label for the increment button. */
  incrementAriaLabel: string
}

const getQuantityCharacterCount = (
  minValue: number | null | undefined,
  maxValue: number | null | undefined,
  locale: string,
  formatOptions: Intl.NumberFormatOptions | undefined,
): number => {
  const numberFormatter = new Intl.NumberFormat(locale, formatOptions)

  const getBoundCharacterCount = (
    boundValue: number | null | undefined,
  ): number => {
    if (
      boundValue === null ||
      boundValue === undefined ||
      !Number.isFinite(boundValue)
    ) {
      return 1
    }

    return numberFormatter.format(boundValue).length
  }

  return Math.max(
    1,
    getBoundCharacterCount(minValue),
    getBoundCharacterCount(maxValue),
  )
}

const getQuantityExtraInlineSize = (characterCount: number): string =>
  `${String(Math.max(0, characterCount - 2))}ch`

const QuantityField = ({
  className,
  error,
  announceError = 'polite',
  decrementAriaLabel,
  incrementAriaLabel,
  helperText,
  label,
  minValue,
  maxValue,
  formatOptions,
  ...props
}: QuantityFieldProps) => {
  const { locale } = useLocale()
  const errorMessage = typeof error === 'string' ? error : undefined
  const quantityCharacterCount = getQuantityCharacterCount(
    minValue,
    maxValue,
    locale,
    formatOptions,
  )
  const quantityExtraInlineSize = getQuantityExtraInlineSize(
    quantityCharacterCount,
  )

  useEffect(() => {
    if (errorMessage && announceError) {
      announce(errorMessage, announceError)
    }
  }, [announceError, errorMessage])

  return (
    <NumberField
      {...props}
      minValue={minValue}
      maxValue={maxValue}
      formatOptions={formatOptions}
      isInvalid={Boolean(error) || props.isInvalid}
      className={cn(styles.container, className)}
    >
      {({ state }) => (
        <>
          {label ? (
            <Label>
              <Typography
                element="span"
                textStyle="labelSm"
                className={styles.label}
              >
                {label}
                {props.isRequired ? <span aria-hidden="true">*</span> : null}
              </Typography>
            </Label>
          ) : null}
          <Group
            className={styles.control}
            style={
              {
                '--quantity-field-character-count': quantityCharacterCount,
                '--quantity-field-extra-inline-size': quantityExtraInlineSize,
              } as CSSProperties
            }
          >
            <Button
              slot="decrement"
              variant="link"
              size="small"
              aria-label={decrementAriaLabel}
              className={styles.button}
            >
              <CheckIndeterminateIcon aria-hidden />
            </Button>
            <Input
              role="spinbutton"
              aria-valuenow={state.numberValue}
              aria-valuemin={state.minValue}
              aria-valuemax={state.maxValue}
              className={styles.input}
            />
            <Button
              slot="increment"
              variant="link"
              size="small"
              aria-label={incrementAriaLabel}
              className={styles.button}
            >
              <AddIcon aria-hidden />
            </Button>
          </Group>
          {errorMessage || helperText ? (
            <FieldSupport
              error={errorMessage}
              helperText={helperText}
              currentLength={0}
              isDisabled={props.isDisabled}
              isReadOnly={props.isReadOnly}
            />
          ) : null}
        </>
      )}
    </NumberField>
  )
}

export { QuantityField }
