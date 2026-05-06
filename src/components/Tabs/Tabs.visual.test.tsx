import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import { Tabs } from '.'

describe('Tabs', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('default tabs', async () => {
      await render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Overview" />
            <Tabs.Tab id="tab2" label="Details" />
            <Tabs.Tab id="tab3" label="Settings" />
            <Tabs.Tab id="tab4" label="Help" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Overview content</Tabs.Panel>
          <Tabs.Panel id="tab2">Details content</Tabs.Panel>
          <Tabs.Panel id="tab3">Settings content</Tabs.Panel>
          <Tabs.Panel id="tab4">Help content</Tabs.Panel>
        </Tabs>,
        theme,
      )

      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with second tab selected', async () => {
      await render(
        <Tabs defaultSelectedKey="tab2">
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Overview" />
            <Tabs.Tab id="tab2" label="Details" />
            <Tabs.Tab id="tab3" label="Settings" />
            <Tabs.Tab id="tab4" label="Help" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Overview content</Tabs.Panel>
          <Tabs.Panel id="tab2">Details content</Tabs.Panel>
          <Tabs.Panel id="tab3">Settings content</Tabs.Panel>
          <Tabs.Panel id="tab4">Help content</Tabs.Panel>
        </Tabs>,
        theme,
      )

      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with disabled tab', async () => {
      await render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Active" />
            <Tabs.Tab id="tab2" label="Inactive" />
            <Tabs.Tab id="tab3" label="Disabled" isDisabled />
            <Tabs.Tab id="tab4" label="Another Tab" />
          </Tabs.List>
          <Tabs.Panel id="tab1">Active content</Tabs.Panel>
          <Tabs.Panel id="tab2">Inactive content</Tabs.Panel>
          <Tabs.Panel id="tab3">Disabled content</Tabs.Panel>
          <Tabs.Panel id="tab4">Another Tab content</Tabs.Panel>
        </Tabs>,
        theme,
      )

      await expect(getWrapper()).toMatchScreenshot()
    })

    test('all tabs disabled', async () => {
      await render(
        <Tabs>
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Overview" isDisabled />
            <Tabs.Tab id="tab2" label="Details" isDisabled />
          </Tabs.List>
          <Tabs.Panel id="tab1">Overview content</Tabs.Panel>
          <Tabs.Panel id="tab2">Details content</Tabs.Panel>
        </Tabs>,
        theme,
      )

      await expect(getWrapper()).toMatchScreenshot()
    })

    describe('behaviour', () => {
      test('fill behaviour (default)', async () => {
        await render(
          <div style={{ width: '600px' }}>
            <Tabs>
              <Tabs.List aria-label="Navigation tabs" behaviour="fill">
                <Tabs.Tab id="tab1" label="Overview" />
                <Tabs.Tab id="tab2" label="Details" />
                <Tabs.Tab id="tab3" label="Settings" />
                <Tabs.Tab id="tab4" label="Help" />
              </Tabs.List>
              <Tabs.Panel id="tab1">Overview content</Tabs.Panel>
              <Tabs.Panel id="tab2">Details content</Tabs.Panel>
              <Tabs.Panel id="tab3">Settings content</Tabs.Panel>
              <Tabs.Panel id="tab4">Help content</Tabs.Panel>
            </Tabs>
          </div>,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })

      test('left behaviour', async () => {
        await render(
          <div style={{ width: '600px' }}>
            <Tabs>
              <Tabs.List aria-label="Navigation tabs" behaviour="left">
                <Tabs.Tab id="tab1" label="Overview" />
                <Tabs.Tab id="tab2" label="Details" />
                <Tabs.Tab id="tab3" label="Settings" />
                <Tabs.Tab id="tab4" label="Help" />
              </Tabs.List>
              <Tabs.Panel id="tab1">Overview content</Tabs.Panel>
              <Tabs.Panel id="tab2">Details content</Tabs.Panel>
              <Tabs.Panel id="tab3">Settings content</Tabs.Panel>
              <Tabs.Panel id="tab4">Help content</Tabs.Panel>
            </Tabs>
          </div>,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })
    })

    test('with panel content', async () => {
      await render(
        <Tabs defaultSelectedKey="tab1">
          <Tabs.List aria-label="Navigation tabs">
            <Tabs.Tab id="tab1" label="Overview" />
            <Tabs.Tab id="tab2" label="Details" />
            <Tabs.Tab id="tab3" label="Settings" />
          </Tabs.List>
          <Tabs.Panel id="tab1">
            <div style={{ padding: '16px' }}>
              <h2 style={{ marginTop: 0 }}>Overview</h2>
              <p>This is the overview content panel.</p>
            </div>
          </Tabs.Panel>
          <Tabs.Panel id="tab2">
            <div style={{ padding: '16px' }}>
              <h2 style={{ marginTop: 0 }}>Details</h2>
              <p>This is the details content panel.</p>
            </div>
          </Tabs.Panel>
          <Tabs.Panel id="tab3">
            <div style={{ padding: '16px' }}>
              <h2 style={{ marginTop: 0 }}>Settings</h2>
              <p>This is the settings content panel.</p>
            </div>
          </Tabs.Panel>
        </Tabs>,
        theme,
      )

      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
