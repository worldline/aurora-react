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
import {
  FieldLabel,
  type FieldRequirementProps,
} from '@/components/Form/FieldLabel'
import { FieldSupport } from '@/components/Form/FieldSupport'
import { AddIcon, CheckIndeterminateIcon } from '@/components/icons'

import styles from './QuantityField.module.css'

interface QuantityFieldBaseProps {
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

export type QuantityFieldProps = QuantityFieldBaseProps &
  FieldRequirementProps &
  Omit<NumberFieldProps, 'children' | 'isRequired'>

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

const getEmptyQuantityFallback = (
  minValue: number | null | undefined,
): number => (Number.isFinite(minValue) ? Math.max(0, minValue ?? 0) : 0)

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
  onChange,
  isRequired,
  showRequiredMark,
  optionalLabel,
  ...props
}: QuantityFieldProps) => {
  const { locale } = useLocale()
  const emptyQuantityFallback = getEmptyQuantityFallback(minValue)
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
      isRequired={isRequired}
      onChange={(newQuantity) => {
        if (Number.isFinite(newQuantity)) {
          onChange?.(newQuantity)
        }
      }}
      isInvalid={Boolean(error) || props.isInvalid}
      className={cn(styles.container, className)}
    >
      {({ state }) => (
        <>
          {label ? (
            <Label>
              <FieldLabel
                label={label}
                isRequired={isRequired}
                showRequiredMark={showRequiredMark}
                optionalLabel={optionalLabel}
                className={styles.label}
              />
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
              onBlur={() => {
                if (
                  state.inputValue.length === 0 &&
                  Number.isNaN(state.numberValue)
                ) {
                  state.commit(String(emptyQuantityFallback))
                }
              }}
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
