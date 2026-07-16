'use client'

import cn from 'classnames'
import { type ComponentProps, isValidElement, type ReactElement } from 'react'
import {
  RadioButton as AriaRadioButton,
  RadioField as AriaRadioField,
  type RadioFieldProps,
} from 'react-aria-components'

import { Card } from '@/components/Card'
import { Typography } from '@/components/Typography'

import styles from './RadioButton.module.css'

export type RadioButtonSize = 'small' | 'medium'

interface WithoutTextProps {
  label?: never
  description?: never
}

interface WithTextProps {
  /** Visible text label displayed next to the radio indicator. */
  label: string
  /** Optional secondary text displayed below the label. */
  description?: string
}

interface WithComponentProps {
  /** Custom React element rendered as the radio label (e.g. an icon or card content). */
  label: ReactElement
  /** Required description displayed below the custom label component. */
  description: string
}

interface BaseRadioButtonProps<T extends string = string> extends Omit<
  RadioFieldProps,
  'children' | 'className' | 'value'
> {
  /** The value submitted when this radio button is selected. Must match the parent `RadioGroup`'s value type. */
  value: T
  /** Controls the size of the radio button and its typography. Defaults to `'small'`. */
  size?: RadioButtonSize
  className?: string
}

export type RadioButtonProps<T extends string = string> =
  BaseRadioButtonProps<T> &
    (WithoutTextProps | WithTextProps | WithComponentProps)

const sizesToTypographyProps: Record<
  RadioButtonSize,
  {
    labelTextStyle: ComponentProps<typeof Typography>['textStyle']
    descriptionTextStyle: ComponentProps<typeof Typography>['textStyle']
  }
> = {
  small: {
    labelTextStyle: 'labelSm',
    descriptionTextStyle: 'bodySm',
  },
  medium: {
    labelTextStyle: 'labelMd',
    descriptionTextStyle: 'bodyMd',
  },
}

const sizeStyles: Record<RadioButtonSize, string> = {
  small: styles.sm,
  medium: styles.md,
}

interface TextContentProps {
  label?: string
  description?: string
  size: RadioButtonSize
  isDisabled: boolean
}

const TextContent = ({
  label,
  description,
  size,
  isDisabled,
}: TextContentProps) => {
  if (label === undefined) {
    return null
  }

  return (
    <div className={styles['text-content']}>
      <Typography
        element="p"
        textStyle={sizesToTypographyProps[size].labelTextStyle}
        textColor={isDisabled ? 'contentDisabled' : 'contentPrimary'}
      >
        {label}
      </Typography>
      {description !== undefined ? (
        <Typography
          element="p"
          textStyle={sizesToTypographyProps[size].descriptionTextStyle}
          textColor={isDisabled ? 'contentDisabled' : 'contentSecondary'}
        >
          {description}
        </Typography>
      ) : null}
    </div>
  )
}

const RadioButton = <T extends string = string>({
  size = 'small',
  label,
  description,
  className,
  ...fieldProps
}: RadioButtonProps<T>) => (
  <AriaRadioField
    data-with-component={isValidElement(label) ? '' : undefined}
    {...fieldProps}
  >
    <AriaRadioButton
      className={cn(
        styles.radio,
        sizeStyles[size],
        isValidElement(label) && styles['with-component'],
        className,
      )}
    >
      {({ isDisabled }: { isDisabled: boolean }) =>
        isValidElement(label) ? (
          <>
            <Card className={styles.card}>
              {label}
              <div className={styles.indicator}>
                <div />
              </div>
            </Card>
            <Typography
              element="p"
              textStyle={sizesToTypographyProps[size].descriptionTextStyle}
              textColor={isDisabled ? 'contentDisabled' : 'contentSecondary'}
            >
              {description}
            </Typography>
          </>
        ) : (
          <>
            <div className={styles.indicator}>
              <div />
            </div>
            <TextContent
              label={label}
              description={description}
              size={size}
              isDisabled={isDisabled}
            />
          </>
        )
      }
    </AriaRadioButton>
  </AriaRadioField>
)

export { RadioButton }
