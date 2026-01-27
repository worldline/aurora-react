import { render, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Steps } from '.'
import type { StepItem } from './index'

const steps: ReadonlyArray<StepItem> = [
  {
    id: 'step-1',
    title: 'Step 1',
    description: 'Description for step 1',
    date: '8 January 2025',
    status: { label: 'Status 1', type: 'complete' },
  },
  {
    id: 'step-2',
    title: 'Step 2',
    description: 'Description for step 2',
    date: '9 January 2025',
    status: { label: 'Status 2', type: 'complete' },
  },
  {
    id: 'step-3',
    title: 'Step 3',
    description: 'Description for step 3',
    status: { label: 'Status 3', type: 'in-progress' },
  },
  {
    id: 'step-4',
    title: 'Step 4',
    description: 'Description for step 4',
    status: { label: 'Status 4', type: 'not-started' },
  },
]

describe('Steps Component', () => {
  test('should display the correct number of steps', () => {
    render(<Steps aria-label="label" steps={steps} titleElement="h2" />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(4)
  })

  test('should display correct content for each step', () => {
    render(<Steps aria-label="label" steps={steps} titleElement="h2" />)

    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      const step = steps[index]
      const itemScope = within(item)
      expect(
        itemScope.getByRole('heading', { name: step.title, level: 2 }),
      ).toBeInTheDocument()
      expect(itemScope.getAllByRole('paragraph')).toHaveLength(2)
      const description = itemScope.getAllByRole('paragraph')[0]
      expect(description).toHaveTextContent(step.description)
      if (step.date) {
        const date = itemScope.getAllByRole('paragraph')[1]
        expect(date).toHaveTextContent(step.date)
      }
      expect(itemScope.getByText(step.status.label)).toBeInTheDocument()
    })
  })

  test('should set aria-label on the list if provided', () => {
    render(<Steps aria-label="label" steps={steps} titleElement="h2" />)
    const list = screen.getByRole('list')
    expect(list).toHaveAttribute('aria-label', 'label')
  })

  test('should set aria-labelledby on the list if provided', () => {
    render(
      <Steps aria-labelledby="labelledby" steps={steps} titleElement="h2" />,
    )
    const list = screen.getByRole('list')
    expect(list).toHaveAttribute('aria-labelledby', 'labelledby')
  })

  test('should set aria-labelledby to title and status for each step', () => {
    render(<Steps aria-label="label" steps={steps} titleElement="h2" />)
    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      const step = steps[index]
      const ariaLabelledBy = item.getAttribute('aria-labelledby')
      expect(ariaLabelledBy).toBeTruthy()
      if (ariaLabelledBy) {
        const ids = ariaLabelledBy.split(' ')
        const titleElement = document.getElementById(ids[0])
        const statusElement = document.getElementById(ids[1])
        expect(titleElement).toHaveTextContent(step.title)
        expect(statusElement).toHaveTextContent(step.status.label)
      }
    })
  })

  test('should set aria-current="step" only on the in-progress step', () => {
    render(<Steps aria-label="label" steps={steps} titleElement="h2" />)

    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      const step = steps[index]
      if (step.status.type === 'in-progress') {
        expect(item).toHaveAttribute('aria-current', 'step')
      } else {
        expect(item).not.toHaveAttribute('aria-current')
      }
    })
  })
})
