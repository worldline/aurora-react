import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { TilesGroup } from './TilesGroup'

const trailingArrow = <span aria-hidden="true">→</span>

describe('TileItem', () => {
  describe('accessibility', () => {
    test('should expose title as accessible row name', () => {
      render(
        <TilesGroup aria-label="Options">
          <TilesGroup.Item
            id="1"
            title="Contact Support"
            trailing={trailingArrow}
          />
        </TilesGroup>,
      )

      expect(
        screen.getByRole('row', { name: 'Contact Support' }),
      ).toBeInTheDocument()
    })

    test('should use textValue as accessible name when provided', () => {
      render(
        <TilesGroup aria-label="Options">
          <TilesGroup.Item
            id="1"
            title="Contact Support"
            textValue="Support option"
            trailing={trailingArrow}
          />
        </TilesGroup>,
      )

      expect(
        screen.getByRole('row', { name: 'Support option' }),
      ).toBeInTheDocument()
    })
  })
})
