import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'
import { FeaturedIcon } from '@/components/FeaturedIcon'
import { CheckCircleIcon } from '@/components/icons'

import { RadioGroup } from '.'

describe('RadioGroup', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('default', async () => {
      await render(
        <RadioGroup aria-label="Options" defaultValue="option1">
          <RadioGroup.Radio
            value="option1"
            label="Option 1"
            description="First available option"
          />
          <RadioGroup.Radio
            value="option2"
            label="Option 2"
            description="Second available option"
          />
          <RadioGroup.Radio
            value="option3"
            label="Option 3"
            description="Third available option"
          />
        </RadioGroup>,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with group title and description', async () => {
      await render(
        <RadioGroup
          title="Choose an option"
          description="Select one of the options below"
          defaultValue="option1"
        >
          <RadioGroup.Radio
            value="option1"
            label="Option 1"
            description="First available option"
          />
          <RadioGroup.Radio
            value="option2"
            label="Option 2"
            description="Second available option"
          />
          <RadioGroup.Radio
            value="option3"
            label="Option 3"
            description="Third available option"
          />
        </RadioGroup>,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('disabled group', async () => {
      await render(
        <RadioGroup aria-label="Options" isDisabled defaultValue="option1">
          <RadioGroup.Radio
            value="option1"
            label="Option 1"
            description="First available option"
          />
          <RadioGroup.Radio
            value="option2"
            label="Option 2"
            description="Second available option"
          />
          <RadioGroup.Radio
            value="option3"
            label="Option 3"
            description="Third available option"
          />
        </RadioGroup>,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('individual disabled checked', async () => {
      await render(
        <RadioGroup aria-label="Options" defaultValue="option1">
          <RadioGroup.Radio
            value="option1"
            label="Option 1"
            description="Disabled checked"
            isDisabled
          />
          <RadioGroup.Radio
            value="option2"
            label="Option 2"
            description="Second available option"
          />
        </RadioGroup>,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('horizontal orientation', async () => {
      await render(
        <RadioGroup
          title="Choose an option"
          description="Select one of the options below"
          defaultValue="option1"
          orientation="horizontal"
        >
          <RadioGroup.Radio
            value="option1"
            label="Option 1"
            description="First available option"
          />
          <RadioGroup.Radio
            value="option2"
            label="Option 2"
            description="Second available option"
            isDisabled
          />
          <RadioGroup.Radio
            value="option3"
            label="Option 3"
            description="Third available option"
          />
        </RadioGroup>,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with error message', async () => {
      await render(
        <RadioGroup
          title="Choose an option"
          description="Select one of the options below"
          error="This is an error message."
        >
          <RadioGroup.Radio
            value="option1"
            label="Option 1"
            description="First available option"
          />
          <RadioGroup.Radio
            value="option2"
            label="Option 2"
            description="Second available option"
          />
          <RadioGroup.Radio
            value="option3"
            label="Option 3"
            description="Third available option"
          />
        </RadioGroup>,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('size comparison', async () => {
      await render(
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
          <RadioGroup
            title="Small"
            description="Small size radio buttons"
            defaultValue="option1"
            aria-label="Small group"
          >
            <RadioGroup.Radio
              value="option1"
              size="small"
              label="Option 1"
              description="First available option"
              isDisabled
            />
            <RadioGroup.Radio
              value="option2"
              size="small"
              label="Option 2"
              description="Second available option"
            />
            <RadioGroup.Radio
              value="option3"
              size="small"
              label="Option 3"
              description="Third available option"
            />
          </RadioGroup>
          <RadioGroup
            title="Medium"
            description="Medium size radio buttons"
            defaultValue="option1"
            aria-label="Medium group"
          >
            <RadioGroup.Radio
              value="option1"
              size="medium"
              label="Option 1"
              isDisabled
              description="First available option"
            />
            <RadioGroup.Radio
              value="option2"
              size="medium"
              label="Option 2"
              description="Second available option"
            />
            <RadioGroup.Radio
              value="option3"
              size="medium"
              label="Option 3"
              description="Third available option"
            />
          </RadioGroup>
        </div>,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('component label — unselected', async () => {
      await render(
        <RadioGroup aria-label="Theme" orientation="horizontal">
          <RadioGroup.Radio
            value="option1"
            description="Automatic"
            label={
              <FeaturedIcon
                type="square"
                size="medium"
                emphasis="low"
                icon={<CheckCircleIcon aria-hidden />}
              />
            }
          />
          <RadioGroup.Radio
            value="option2"
            description="Light mode"
            label={
              <FeaturedIcon
                type="circle"
                size="medium"
                emphasis="medium"
                icon={<CheckCircleIcon aria-hidden />}
              />
            }
          />
          <RadioGroup.Radio
            value="option3"
            description="Dark mode"
            label={
              <FeaturedIcon
                type="square"
                size="medium"
                emphasis="medium"
                icon={<CheckCircleIcon aria-hidden />}
              />
            }
            isDisabled
          />
        </RadioGroup>,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('component label — selected', async () => {
      await render(
        <RadioGroup
          aria-label="Theme"
          orientation="horizontal"
          defaultValue="option1"
        >
          <RadioGroup.Radio
            value="option1"
            description="Automatic"
            label={
              <FeaturedIcon
                type="square"
                size="medium"
                emphasis="low"
                icon={<CheckCircleIcon aria-hidden />}
              />
            }
          />
          <RadioGroup.Radio
            value="option2"
            description="Light mode"
            label={
              <FeaturedIcon
                type="circle"
                size="medium"
                emphasis="medium"
                icon={<CheckCircleIcon aria-hidden />}
              />
            }
          />
          <RadioGroup.Radio
            value="option3"
            description="Dark mode"
            label={
              <FeaturedIcon
                type="square"
                size="medium"
                emphasis="medium"
                icon={<CheckCircleIcon aria-hidden />}
              />
            }
            isDisabled
          />
        </RadioGroup>,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
