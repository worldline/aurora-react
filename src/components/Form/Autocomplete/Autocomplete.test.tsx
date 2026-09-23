import { announce } from '@react-aria/live-announcer'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { Key } from 'react-aria-components'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import type { AutocompleteOption } from './types'

import {
  Autocomplete as AutocompleteComponent,
  type AutocompleteProps,
} from '.'

vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
}))

const formatResultsCount = (count: number): string =>
  `${String(count)} Results found`

/**
 * Fills in the text props the library leaves to the consuming application, so
 * tests can focus on the behaviour they actually exercise.
 */
const Autocomplete = ({
  placeholder = 'Search ...',
  emptyLabel = 'No result found',
  clearLabel = 'Clear',
  closeLabel = 'Close',
  ...props
}: Partial<AutocompleteProps> & Pick<AutocompleteProps, 'options'>) => (
  <AutocompleteComponent
    clearLabel={clearLabel}
    closeLabel={closeLabel}
    emptyLabel={emptyLabel}
    formatResultsCount={formatResultsCount}
    placeholder={placeholder}
    {...props}
  />
)

const options: Array<AutocompleteOption> = [
  { id: 'brussels', label: 'Brussels', description: 'Belgium' },
  { id: 'bruges', label: 'Bruges', description: 'Belgium' },
  { id: 'antwerp', label: 'Antwerp', description: 'Belgium' },
]

/** jsdom ships no `matchMedia`, so the viewport has to be faked outright. */
const stubViewport = ({ isMobile }: { isMobile: boolean }): void => {
  vi.stubGlobal(
    'matchMedia',
    (query: string): MediaQueryList =>
      ({
        matches: isMobile,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  )
}

describe('Autocomplete', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.mocked(announce).mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  describe('popover presentation', () => {
    beforeEach(() => {
      stubViewport({ isMobile: false })
    })

    test('should render the field with its label', () => {
      render(<Autocomplete label="City" options={options} />)

      expect(screen.getByRole('combobox', { name: 'City' })).toBeInTheDocument()
    })

    test('should open the option list and show how many options match', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="City" options={options} />)

      await user.click(screen.getByRole('combobox', { name: 'City' }))

      expect(screen.getByText('3 Results found')).toBeInTheDocument()
      expect(
        screen.getAllByRole('option').map((option) => option.textContent),
      ).toEqual(['BrusselsBelgium', 'BrugesBelgium', 'AntwerpBelgium'])
    })

    test('should not open the popover before the minimum character count is typed', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="City" minCharsToOpen={3} options={options} />)

      await user.type(screen.getByRole('combobox', { name: 'City' }), 'br')

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    test('should open the popover once the minimum character count is reached', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="City" minCharsToOpen={3} options={options} />)

      await user.type(screen.getByRole('combobox', { name: 'City' }), 'bru')

      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getAllByRole('option')).toHaveLength(2)
    })

    test('should close the popover again if the input drops below the minimum character count', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="City" minCharsToOpen={3} options={options} />)

      const input = screen.getByRole('combobox', { name: 'City' })
      await user.type(input, 'bru')
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      await user.type(input, '{backspace}{backspace}')

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    test('should narrow the options and the count down to what the user typed', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="City" options={options} />)

      await user.type(screen.getByRole('combobox', { name: 'City' }), 'bru')

      expect(screen.getByText('2 Results found')).toBeInTheDocument()
      expect(screen.getAllByRole('option')).toHaveLength(2)
    })

    test('should show the empty label when nothing matches', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete
          emptyLabel="Nothing here"
          label="City"
          options={options}
        />,
      )

      await user.type(screen.getByRole('combobox', { name: 'City' }), 'zzz')

      expect(screen.getByText('Nothing here')).toBeInTheDocument()
      expect(screen.getByText('0 Results found')).toBeInTheDocument()
    })

    test('should report the option the user picked', async () => {
      const user = userEvent.setup()
      const onSelectionChange = vi.fn()
      render(
        <Autocomplete
          label="City"
          onSelectionChange={onSelectionChange}
          options={options}
        />,
      )

      await user.click(screen.getByRole('combobox', { name: 'City' }))
      await user.click(screen.getByRole('option', { name: 'Bruges, Belgium' }))

      expect(onSelectionChange).toHaveBeenCalledWith('bruges')
      expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue(
        'Bruges',
      )
    })

    test('should empty the field when the clear button is pressed', async () => {
      const user = userEvent.setup()
      const onSelectionChange = vi.fn()
      render(
        <Autocomplete
          clearLabel="Clear city"
          label="City"
          onSelectionChange={onSelectionChange}
          options={options}
        />,
      )

      await user.click(screen.getByRole('combobox', { name: 'City' }))
      await user.click(screen.getByRole('option', { name: 'Bruges, Belgium' }))

      const input = screen.getByRole('combobox', { name: 'City' })
      expect(input).toHaveValue('Bruges')

      await user.click(screen.getByRole('button', { name: 'Clear city' }))

      expect(input).toHaveValue('')
      expect(onSelectionChange).toHaveBeenLastCalledWith(null)
      expect(
        screen.queryByRole('button', { name: 'Clear city' }),
      ).not.toBeInTheDocument()
    })

    test('should link the error message to the field for screen readers', () => {
      render(
        <Autocomplete
          error="Pick a city from the list."
          label="City"
          options={options}
        />,
      )

      expect(
        screen.getByRole('combobox', { name: 'City' }),
      ).toHaveAccessibleDescription('Pick a city from the list.')
    })

    test('should announce the error message', () => {
      render(
        <Autocomplete
          error="Pick a city from the list."
          label="City"
          options={options}
        />,
      )

      expect(announce).toHaveBeenCalledWith(
        'Pick a city from the list.',
        'polite',
      )
    })

    test('should not announce the error message when announcing is turned off', () => {
      render(
        <Autocomplete
          announceError={false}
          error="Pick a city from the list."
          label="City"
          options={options}
        />,
      )

      expect(announce).not.toHaveBeenCalled()
    })

    test('should call the footer action from the option list', async () => {
      const user = userEvent.setup()
      const onAction = vi.fn()
      render(
        <Autocomplete
          footerAction={{ label: 'Add manually', onAction }}
          label="City"
          options={options}
        />,
      )

      await user.click(screen.getByRole('combobox', { name: 'City' }))
      await user.click(screen.getByRole('button', { name: 'Add manually' }))

      expect(onAction).toHaveBeenCalledOnce()
    })

    test('should show the label of the initially selected option', () => {
      render(
        <Autocomplete
          defaultSelectedKey="antwerp"
          label="City"
          options={options}
        />,
      )

      expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue(
        'Antwerp',
      )
    })
  })

  describe('sheet presentation', () => {
    beforeEach(() => {
      stubViewport({ isMobile: true })
    })

    test('should show the placeholder until an option is selected', () => {
      render(
        <Autocomplete
          label="City"
          options={options}
          placeholder="Search a city"
        />,
      )

      expect(
        screen.getByRole('button', { name: 'City Search a city' }),
      ).toBeInTheDocument()
    })

    test('should open the sheet with its own search field and list', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete
          label="City"
          options={options}
          sheetTitle="Search a city"
        />,
      )

      await user.click(screen.getByRole('button', { name: /^City/ }))

      const sheet = screen.getByRole('dialog', { name: 'Search a city' })
      expect(
        within(sheet).getByRole('textbox', { name: 'City' }),
      ).toBeInTheDocument()
      expect(within(sheet).getAllByRole('option')).toHaveLength(3)
      expect(within(sheet).getByText('3 Results found')).toBeInTheDocument()
    })

    test('should narrow the options and the count down to what the user typed', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete
          label="City"
          options={options}
          sheetTitle="Search a city"
        />,
      )

      await user.click(screen.getByRole('button', { name: /^City/ }))

      const sheet = screen.getByRole('dialog', { name: 'Search a city' })
      await user.type(
        within(sheet).getByRole('textbox', { name: 'City' }),
        'bru',
      )

      expect(within(sheet).getAllByRole('option')).toHaveLength(2)
      expect(within(sheet).getByText('2 Results found')).toBeInTheDocument()
    })

    test('should close the sheet and show the option the user picked', async () => {
      const user = userEvent.setup()
      const onSelectionChange = vi.fn()
      render(
        <Autocomplete
          label="City"
          onSelectionChange={onSelectionChange}
          options={options}
          sheetTitle="Search a city"
        />,
      )

      await user.click(screen.getByRole('button', { name: /^City/ }))
      await user.click(screen.getByRole('option', { name: 'Bruges, Belgium' }))

      expect(onSelectionChange).toHaveBeenCalledWith('bruges')
      expect(
        screen.queryByRole('dialog', { name: 'Search a city' }),
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'City Bruges' }),
      ).toBeInTheDocument()
    })

    test('should close the sheet when the user re-picks the already-selected option', async () => {
      const user = userEvent.setup()
      const onSelectionChange = vi.fn()
      render(
        <Autocomplete
          defaultSelectedKey="bruges"
          label="City"
          onSelectionChange={onSelectionChange}
          options={options}
          sheetTitle="Search a city"
        />,
      )

      await user.click(screen.getByRole('button', { name: 'City Bruges' }))
      await user.click(screen.getByRole('option', { name: 'Bruges, Belgium' }))

      expect(onSelectionChange).toHaveBeenCalledWith('bruges')
      expect(
        screen.queryByRole('dialog', { name: 'Search a city' }),
      ).not.toBeInTheDocument()
    })

    test.skip('should put the caret in the search field as the sheet opens', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete
          label="City"
          options={options}
          sheetTitle="Search a city"
        />,
      )

      await user.click(screen.getByRole('button', { name: /^City/ }))

      const sheet = screen.getByRole('dialog', { name: 'Search a city' })
      expect(within(sheet).getByRole('textbox', { name: 'City' })).toHaveFocus()
    })

    test('should size the search field like the closed field', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete
          label="City"
          options={options}
          sheetTitle="Search a city"
          size="large"
        />,
      )

      await user.click(screen.getByRole('button', { name: /^City/ }))

      // The sheet renders in a portal, so the size class has to be repeated on
      // the search field instead of being inherited from the field container.
      const sheet = screen.getByRole('dialog', { name: 'Search a city' })
      expect(
        within(sheet).getByRole('textbox', { name: 'City' }).closest('.large'),
      ).not.toBeNull()
    })

    test('should mark the search field as filled once the user types', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete
          label="City"
          options={options}
          sheetTitle="Search a city"
        />,
      )

      await user.click(screen.getByRole('button', { name: /^City/ }))

      const sheet = screen.getByRole('dialog', { name: 'Search a city' })
      const searchInput = within(sheet).getByRole('textbox', { name: 'City' })
      expect(searchInput.closest('.filled')).toBeNull()

      await user.type(searchInput, 'bru')

      expect(searchInput.closest('.filled')).not.toBeNull()
    })

    test('should link the error message to the trigger for screen readers', () => {
      render(
        <Autocomplete
          error="Pick a city from the list."
          label="City"
          options={options}
          placeholder="Search a city"
        />,
      )

      expect(
        screen.getByRole('button', { name: 'City Search a city' }),
      ).toHaveAccessibleDescription('Pick a city from the list.')
    })

    test('should keep a read-only trigger reachable but inert', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete
          defaultSelectedKey="bruges"
          isReadOnly
          label="City"
          options={options}
          sheetTitle="Search a city"
        />,
      )

      const trigger = screen.getByRole('button', { name: 'City Bruges' })
      expect(trigger).toBeEnabled()

      await user.click(trigger)

      expect(
        screen.queryByRole('dialog', { name: 'Search a city' }),
      ).not.toBeInTheDocument()
    })

    test('should not open the sheet from a disabled trigger', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete
          isDisabled
          label="City"
          options={options}
          sheetTitle="Search a city"
        />,
      )

      const trigger = screen.getByRole('button', { name: /^City/ })
      expect(trigger).toBeDisabled()

      await user.click(trigger)

      expect(
        screen.queryByRole('dialog', { name: 'Search a city' }),
      ).not.toBeInTheDocument()
    })

    test('should name the sheet after the accessible name when it has no title', async () => {
      const user = userEvent.setup()
      render(<Autocomplete aria-label="City" options={options} />)

      await user.click(screen.getByRole('button', { name: 'City' }))

      expect(screen.getByRole('dialog', { name: 'City' })).toBeInTheDocument()
    })

    test('should start each search from an empty field', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete
          label="City"
          options={options}
          sheetTitle="Search a city"
        />,
      )

      await user.click(screen.getByRole('button', { name: /^City/ }))
      await user.type(screen.getByRole('textbox', { name: 'City' }), 'antwerp')
      await user.click(screen.getByRole('option', { name: 'Antwerp, Belgium' }))

      await user.click(screen.getByRole('button', { name: 'City Antwerp' }))

      expect(screen.getByRole('textbox', { name: 'City' })).toHaveValue('')
      expect(screen.getAllByRole('option')).toHaveLength(3)
    })
  })

  describe('controlled selection', () => {
    const ControlledAutocomplete = () => {
      const [selectedKey, setSelectedKey] = useState<Key | null>(null)

      return (
        <>
          <Autocomplete
            label="City"
            onSelectionChange={setSelectedKey}
            options={options}
            selectedKey={selectedKey}
          />
          <output>{selectedKey ?? 'none'}</output>
        </>
      )
    }

    test('should hold the selection in the parent', async () => {
      stubViewport({ isMobile: false })
      const user = userEvent.setup()
      render(<ControlledAutocomplete />)

      expect(screen.getByRole('status')).toHaveTextContent('none')

      await user.click(screen.getByRole('combobox', { name: 'City' }))
      await user.click(screen.getByRole('option', { name: 'Bruges, Belgium' }))

      expect(screen.getByRole('status')).toHaveTextContent('bruges')
    })

    test('should follow a selection the parent makes on its own', async () => {
      stubViewport({ isMobile: false })
      const user = userEvent.setup()

      const ParentDrivenAutocomplete = () => {
        const [selectedKey, setSelectedKey] = useState<Key | null>(null)

        return (
          <>
            <button
              onClick={() => {
                setSelectedKey('antwerp')
              }}
            >
              Pick Antwerp
            </button>
            <Autocomplete
              label="City"
              onSelectionChange={setSelectedKey}
              options={options}
              selectedKey={selectedKey}
            />
          </>
        )
      }

      render(<ParentDrivenAutocomplete />)

      expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue('')

      await user.click(screen.getByRole('button', { name: 'Pick Antwerp' }))

      expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue(
        'Antwerp',
      )
    })

    test('should show the selected label once the options have loaded', async () => {
      stubViewport({ isMobile: false })
      const user = userEvent.setup()

      const LateOptionsAutocomplete = () => {
        const [loadedOptions, setLoadedOptions] = useState<
          Array<AutocompleteOption>
        >([])

        return (
          <>
            <button
              onClick={() => {
                setLoadedOptions(options)
              }}
            >
              Load cities
            </button>
            <Autocomplete
              label="City"
              onSelectionChange={vi.fn()}
              options={loadedOptions}
              selectedKey="bruges"
            />
          </>
        )
      }

      render(<LateOptionsAutocomplete />)

      expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue('')

      await user.click(screen.getByRole('button', { name: 'Load cities' }))

      expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue(
        'Bruges',
      )
    })

    test('should leave the field empty when the parent ignores the change', async () => {
      stubViewport({ isMobile: false })
      const user = userEvent.setup()
      render(
        <Autocomplete
          label="City"
          onSelectionChange={vi.fn()}
          options={options}
          selectedKey={null}
        />,
      )

      await user.click(screen.getByRole('combobox', { name: 'City' }))
      await user.click(screen.getByRole('option', { name: 'Bruges, Belgium' }))

      expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue('')
    })

    test('should not change its own selection when the parent ignores the change', async () => {
      stubViewport({ isMobile: true })
      const user = userEvent.setup()
      render(
        <Autocomplete
          label="City"
          onSelectionChange={vi.fn()}
          options={options}
          selectedKey={null}
          sheetTitle="Search a city"
        />,
      )

      await user.click(screen.getByRole('button', { name: /^City/ }))
      await user.click(screen.getByRole('option', { name: 'Bruges, Belgium' }))

      expect(
        screen.getByRole('button', { name: 'City Search ...' }),
      ).toBeInTheDocument()
    })
  })

  describe('controlled input value', () => {
    const ControlledInputAutocomplete = () => {
      const [inputValue, setInputValue] = useState('')

      return (
        <>
          <Autocomplete
            inputValue={inputValue}
            label="City"
            onInputValueChange={setInputValue}
            options={options}
          />
          <output>{inputValue}</output>
        </>
      )
    }

    test('should hold the typed value in the parent', async () => {
      stubViewport({ isMobile: false })
      const user = userEvent.setup()
      render(<ControlledInputAutocomplete />)

      await user.type(screen.getByRole('combobox', { name: 'City' }), 'bru')

      // The combo box popover marks the rest of the page `aria-hidden` while
      // it is open, so the status has to be queried past that.
      expect(screen.getByRole('status', { hidden: true })).toHaveTextContent(
        'bru',
      )
      expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue('bru')
    })

    test('should not change its own input value when the parent ignores the change', async () => {
      stubViewport({ isMobile: false })
      const user = userEvent.setup()
      render(
        <Autocomplete
          inputValue=""
          label="City"
          onInputValueChange={vi.fn()}
          options={options}
        />,
      )

      await user.type(screen.getByRole('combobox', { name: 'City' }), 'bru')

      expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue('')
    })
  })

  describe('custom filter', () => {
    const startsWith = (label: string, value: string): boolean =>
      label.toLowerCase().startsWith(value.toLowerCase())

    test('should use the provided filter instead of the default contains match', async () => {
      stubViewport({ isMobile: false })
      const user = userEvent.setup()
      render(
        <Autocomplete filter={startsWith} label="City" options={options} />,
      )

      // "ru" is contained in "Brussels" and "Bruges", but starts neither.
      await user.type(screen.getByRole('combobox', { name: 'City' }), 'ru')

      expect(screen.getByText('0 Results found')).toBeInTheDocument()
      expect(
        screen.queryByRole('option', { name: 'Brussels, Belgium' }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('option', { name: 'Bruges, Belgium' }),
      ).not.toBeInTheDocument()
    })

    test('should use the provided filter in the bottom sheet', async () => {
      stubViewport({ isMobile: true })
      const user = userEvent.setup()
      render(
        <Autocomplete
          filter={startsWith}
          label="City"
          options={options}
          sheetTitle="Search a city"
        />,
      )

      await user.click(screen.getByRole('button', { name: /^City/ }))

      const sheet = screen.getByRole('dialog', { name: 'Search a city' })
      await user.type(
        within(sheet).getByRole('textbox', { name: 'City' }),
        'ru',
      )

      expect(within(sheet).getByText('0 Results found')).toBeInTheDocument()
      expect(
        within(sheet).queryByRole('option', { name: 'Brussels, Belgium' }),
      ).not.toBeInTheDocument()
      expect(
        within(sheet).queryByRole('option', { name: 'Bruges, Belgium' }),
      ).not.toBeInTheDocument()
    })

    test('should report text typed in the bottom sheet', async () => {
      stubViewport({ isMobile: true })
      const user = userEvent.setup()
      const onInputValueChange = vi.fn()
      render(
        <Autocomplete
          label="City"
          onInputValueChange={onInputValueChange}
          options={options}
          sheetTitle="Search a city"
        />,
      )

      await user.click(screen.getByRole('button', { name: /^City/ }))
      const sheet = screen.getByRole('dialog', { name: 'Search a city' })
      await user.type(
        within(sheet).getByRole('textbox', { name: 'City' }),
        'Bru',
      )

      expect(onInputValueChange).toHaveBeenLastCalledWith('Bru')
    })
  })

  describe('automatic presentation', () => {
    test('should anchor the options to the field on a wide viewport', () => {
      stubViewport({ isMobile: false })
      render(<Autocomplete label="City" options={options} />)

      expect(screen.getByRole('combobox', { name: 'City' })).toBeInTheDocument()
    })

    test('should move the options into a sheet on a narrow viewport', () => {
      stubViewport({ isMobile: true })
      render(
        <Autocomplete
          label="City"
          options={options}
          placeholder="Search a city"
        />,
      )

      expect(
        screen.queryByRole('combobox', { name: 'City' }),
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'City Search a city' }),
      ).toBeInTheDocument()
    })

    test('should anchor the options to the field without matchMedia', () => {
      render(<Autocomplete label="City" options={options} />)

      expect(screen.getByRole('combobox', { name: 'City' })).toBeInTheDocument()
    })
  })

  describe('selection order', () => {
    test('should end on the same value whichever option was picked before it', async () => {
      stubViewport({ isMobile: false })
      const user = userEvent.setup()
      const onSelectionChange = vi.fn()
      render(
        <Autocomplete
          clearLabel="Clear city"
          label="City"
          onSelectionChange={onSelectionChange}
          options={options}
        />,
      )

      await user.click(screen.getByRole('combobox', { name: 'City' }))
      await user.click(screen.getByRole('option', { name: 'Bruges, Belgium' }))
      await user.click(screen.getByRole('button', { name: 'Clear city' }))
      await user.click(screen.getByRole('combobox', { name: 'City' }))
      await user.click(screen.getByRole('option', { name: 'Antwerp, Belgium' }))

      expect(onSelectionChange).toHaveBeenLastCalledWith('antwerp')
      expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue(
        'Antwerp',
      )
    })
  })
})
