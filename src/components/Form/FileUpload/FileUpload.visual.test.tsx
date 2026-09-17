import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './FileUpload.stories'

const {
  Default,
  WithTooltip,
  WithHelperText,
  WithError,
  Disabled,
  Multiple,
  WithInitialFiles,
  WithMixedUploadStates,
  WithAcceptedFileTypes,
  WithMaxFilesOverflow,
} = composeStories(stories)

describe('FileUpload', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('default', async () => {
      await render(<Default />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with tooltip', async () => {
      await render(<WithTooltip />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with helper text', async () => {
      await render(<WithHelperText />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with error', async () => {
      await render(<WithError />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('disabled', async () => {
      await render(<Disabled />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('multiple', async () => {
      await render(<Multiple />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with initial files', async () => {
      await render(<WithInitialFiles />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with accepted file types', async () => {
      await render(<WithAcceptedFileTypes />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with max files overflow', async () => {
      await render(<WithMaxFilesOverflow />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('multiple mixed states', async () => {
      await render(<WithMixedUploadStates />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
