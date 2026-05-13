'use client'

import cn from 'classnames'
import type { ComponentProps } from 'react'
import { Radio as AriaRadio, type RadioProps } from 'react-aria-components'

import { Typography } from '@/components/Typography'

import styles from './RadioButton.module.css'

export type RadioButtonSize = 'small' | 'medium'

interface WithoutTextProps {
  label?: never
  description?: never
}

interface WithTextProps {
  label: string
  description?: string
}

interface BaseRadioButtonProps extends Omit<RadioProps, 'children'> {
  size?: RadioButtonSize
}

export type RadioButtonProps = BaseRadioButtonProps &
  (WithoutTextProps | WithTextProps)

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

const RadioButton = ({
  size = 'small',
  label,
  description,
  ...props
}: RadioButtonProps) => (
  <AriaRadio
    {...props}
    className={cn(styles.radio, sizeStyles[size], props.className)}
  >
    {({ isDisabled }) => (
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
    )}
  </AriaRadio>
)

export { RadioButton }
