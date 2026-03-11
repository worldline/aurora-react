import { render, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { allIconSteps, steps } from './Stepper.fixtures'

import { Stepper } from '.'
import type { StepItem } from './index'

interface TestCase {
  label: string
  steps: ReadonlyArray<StepItem>
  type?: 'check' | 'number' | 'icon'
}

const testCases: ReadonlyArray<TestCase> = [
  { label: 'check (default)', steps },
  { label: 'icon', steps: allIconSteps, type: 'icon' },
]

describe.each(testCases)('Stepper Component ($label)', ({ steps, type }) => {
  test('should display the correct number of steps', () => {
    render(
      <Stepper
        aria-label="label"
        steps={steps}
        titleElement="h2"
        type={type}
      />,
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(steps.length)
  })

  test('should display a heading for each step', () => {
    render(
      <Stepper
        aria-label="label"
        steps={steps}
        titleElement="h2"
        type={type}
      />,
    )

    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      const step = steps[index]
      const itemScope = within(item)
      expect(
        itemScope.getByRole('heading', { name: step.title, level: 2 }),
      ).toBeInTheDocument()
    })
  })

  test('should display a description for each step', () => {
    render(
      <Stepper
        aria-label="label"
        steps={steps}
        titleElement="h2"
        type={type}
      />,
    )

    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      const step = steps[index]
      const itemScope = within(item)
      if (step.description) {
        expect(itemScope.getByText(step.description)).toBeInTheDocument()
      }
    })
  })

  test('should display a status label for each step', () => {
    render(
      <Stepper
        aria-label="label"
        steps={steps}
        titleElement="h2"
        type={type}
      />,
    )

    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      const step = steps[index]
      const itemScope = within(item)
      expect(itemScope.getByText(step.status.label)).toBeInTheDocument()
    })
  })

  test('should display a date for each step that has one', () => {
    render(
      <Stepper
        aria-label="label"
        steps={steps}
        titleElement="h2"
        type={type}
      />,
    )

    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      const step = steps[index]
      const itemScope = within(item)
      const paragraphs = itemScope.getAllByRole('paragraph')
      if (step.date) {
        expect(itemScope.getByText(step.date)).toBeInTheDocument()
        expect(paragraphs).toHaveLength(2)
      } else {
        expect(paragraphs).toHaveLength(1)
      }
    })
  })

  test('should set aria-label to title and status for each step', () => {
    render(
      <Stepper
        aria-label="label"
        steps={steps}
        titleElement="h2"
        type={type}
      />,
    )

    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      const step = steps[index]
      expect(item.getAttribute('aria-label')).toEqual(
        `${step.title}. ${step.status.label}`,
      )
    })
  })

  test('should set aria-current="step" only on the in-progress step', () => {
    render(
      <Stepper
        aria-label="label"
        steps={steps}
        titleElement="h2"
        type={type}
      />,
    )

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

describe('Stepper Component', () => {
  test('should set aria-label on the list if provided', () => {
    render(<Stepper aria-label="label" steps={steps} titleElement="h2" />)
    const list = screen.getByRole('list')
    expect(list).toHaveAttribute('aria-label', 'label')
  })

  test('should set aria-labelledby on the list if provided', () => {
    render(
      <Stepper aria-labelledby="labelledby" steps={steps} titleElement="h2" />,
    )

    const list = screen.getByRole('list')
    expect(list).toHaveAttribute('aria-labelledby', 'labelledby')
  })
})
