import preview from '../../../.storybook/preview'

import { Typography } from '.'

const meta = preview.meta({
  title: 'components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
})

export const Typographies = meta.story({
  render: () => (
    <ul
      style={{
        listStyleType: 'none',
        marginBlockStart: 0,
        marginBlockEnd: 0,
        paddingInlineStart: 0,
      }}
    >
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="hero">
          hero / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="metricLg">
          metricLg / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="metricMd">
          metricMd / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="metricSm">
          metricSm / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textColor="contentPrimary"
          textStyle="displayLg"
        >
          displayLg / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textColor="contentPrimary"
          textStyle="displayMd"
        >
          displayMd / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textColor="contentPrimary"
          textStyle="displaySm"
        >
          displaySm / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="titleLg">
          titleLg / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="titleMd">
          titleMd / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="titleSm">
          titleSm / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="bodyLg">
          bodyLg / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="bodyMd">
          bodyMd / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textColor="contentPrimary"
          textStyle="bodyMdBold"
        >
          bodyMdBold / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textColor="contentPrimary"
          textStyle="bodyMdPrimarySemibold"
        >
          bodyMdPrimarySemibold / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="bodySm">
          bodySm / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textColor="contentPrimary"
          textStyle="bodySmMedium"
        >
          bodySmMedium / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textColor="contentPrimary"
          textStyle="captionLg"
        >
          captionLg / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textColor="contentPrimary"
          textStyle="captionMd"
        >
          captionMd / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textColor="contentPrimary"
          textStyle="captionSm"
        >
          captionSm / Lorem ipsum dolor sit amet
        </Typography>
      </li>

      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="labelLg">
          labelLg / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="labelMd">
          labelMd / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="labelSm">
          labelSm / Lorem ipsum dolor sit amet
        </Typography>
      </li>
      <li>
        <Typography element="p" textColor="contentPrimary" textStyle="labelXs">
          labelXs / Lorem ipsum dolor sit amet
        </Typography>
      </li>
    </ul>
  ),
})

export const Colors = meta.story({
  render: () => (
    <ul
      style={{
        listStyleType: 'none',
        marginBlockStart: 0,
        marginBlockEnd: 0,
        paddingInlineStart: 0,
      }}
    >
      <li>
        <Typography element="p" textStyle="displayMd" textColor="contentBrand">
          This is contentBrand
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textStyle="displayMd"
          textColor="contentDisabled"
        >
          This is contentDisabled
        </Typography>
      </li>

      <li
        style={{
          backgroundColor: 'var(--au-surface-brand-solid)',
        }}
      >
        <Typography element="p" textStyle="displayMd" textColor="contentInvert">
          This is contentInvert (with brand background)
        </Typography>
      </li>
      <li
        style={{
          backgroundColor: 'var(--au-surface-brand-solid)',
        }}
      >
        <Typography
          element="p"
          textStyle="displayMd"
          textColor="contentOnBrand"
        >
          This is contentOnBrand (with brand background)
        </Typography>
      </li>
      <li
        style={{
          backgroundColor: 'var(--au-surface-brand-solid)',
        }}
      >
        <Typography
          element="p"
          textStyle="displayMd"
          textColor="contentOnBrandHover"
        >
          This is contentOnBrandHover (with brand background)
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textStyle="displayMd"
          textColor="contentPlaceholder"
        >
          This is contentPlaceholder
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textStyle="displayMd"
          textColor="contentPrimary"
        >
          This is contentPrimary
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textStyle="displayMd"
          textColor="contentSecondary"
        >
          This is contentSecondary
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textStyle="displayMd"
          textColor="contentSuccess"
        >
          This is contentSuccess
        </Typography>
      </li>
      <li>
        <Typography
          element="p"
          textStyle="displayMd"
          textColor="contentWarning"
        >
          This is contentWarning
        </Typography>
      </li>
      <li>
        <Typography element="p" textStyle="displayMd" textColor="contentDanger">
          This is contentDanger
        </Typography>
      </li>
    </ul>
  ),
})
