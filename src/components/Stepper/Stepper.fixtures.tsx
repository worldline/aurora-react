import type { ReactNode } from 'react'

import { BlockIcon } from '../icons'

import type { StepType } from './Step'

import type { StepItem } from './index'

type StepOverrides<T extends StepType> = Partial<StepItem<T>> &
  (T extends 'icon' ? { icon: ReactNode } : { icon?: never })

export const completedStep = <T extends StepType>(
  overrides: StepOverrides<T>,
): StepItem<T> => ({
  id: 'step-1',
  title: 'Step 1',
  description: 'Description for step',
  date: '8 January 2025',
  status: { label: 'Status', type: 'complete' },
  ...overrides,
})

export const inProgressStep = <T extends StepType>(
  overrides: StepOverrides<T>,
): StepItem<T> => ({
  id: 'step-3',
  title: 'Step 3',
  description: 'Description for step',
  status: { label: 'Status', type: 'in-progress' },
  ...overrides,
})

export const notStartedStep = <T extends StepType>(
  overrides: StepOverrides<T>,
): StepItem<T> => ({
  id: 'step-4',
  title: 'Step 4',
  description: 'Description for step',
  status: { label: 'Status', type: 'not-started' },
  ...overrides,
})

export const iconStep = (
  overrides?: StepOverrides<'icon'>,
): StepItem<'icon'> => ({
  id: 'step-1',
  title: 'Step 1',
  description: '',
  status: { label: 'Complete', type: 'complete' },
  icon: <BlockIcon />,
  ...overrides,
})

export const allNotStartedSteps: ReadonlyArray<StepItem<'check' | 'number'>> = [
  notStartedStep({ id: 'step-1', title: 'Step 1', date: '8 January 2025' }),
  notStartedStep({ id: 'step-2', title: 'Step 2', date: '9 January 2025' }),
  notStartedStep({ id: 'step-3', title: 'Step 3' }),
  notStartedStep({ id: 'step-4', title: 'Step 4' }),
]

export const steps: ReadonlyArray<StepItem<'check' | 'number'>> = [
  completedStep({ id: 'step-1', title: 'Step 1', date: '8 January 2025' }),
  completedStep({ id: 'step-2', title: 'Step 2', date: '9 January 2025' }),
  inProgressStep({ id: 'step-3', title: 'Step 3' }),
  notStartedStep({ id: 'step-4', title: 'Step 4' }),
]

export const allIconSteps: ReadonlyArray<StepItem<'icon'>> = [
  iconStep({
    id: 'step-1',
    title: 'Step 1',
    description: 'Description for step',
    date: '8 January 2025',
    status: { label: 'Status', type: 'complete' },
    icon: <BlockIcon />,
  }),
  iconStep({
    id: 'step-2',
    title: 'Step 2',
    description: 'Description for step',
    date: '9 January 2025',
    status: { label: 'Status', type: 'in-progress' },
    icon: <BlockIcon />,
  }),
  iconStep({
    id: 'step-3',
    title: 'Step 3',
    description: 'Description for step',
    date: '10 January 2025',
    status: { label: 'Status', type: 'not-started' },
    icon: <BlockIcon />,
  }),
]

export const allIconStepsTitleOnly: ReadonlyArray<StepItem<'icon'>> = [
  iconStep({
    id: 'step-1',
    title: 'Step 1',
    status: { label: 'Complete', type: 'in-progress' },
    icon: <BlockIcon />,
  }),
  iconStep({
    id: 'step-2',
    title: 'Step 2',
    status: { label: 'In progress', type: 'in-progress' },
    icon: <BlockIcon />,
  }),
  iconStep({
    id: 'step-3',
    title: 'Step 3',
    status: { label: 'Not started', type: 'in-progress' },
    icon: <BlockIcon />,
  }),
]

export const allCompletedSteps: ReadonlyArray<StepItem<'check' | 'number'>> = [
  completedStep({ id: 'step-1', title: 'Step 1', date: '8 January 2025' }),
  completedStep({ id: 'step-2', title: 'Step 2', date: '9 January 2025' }),
  completedStep({ id: 'step-3', title: 'Step 3' }),
  completedStep({ id: 'step-4', title: 'Step 4' }),
]

export const allCompletedStepsMultiline: ReadonlyArray<
  StepItem<'check' | 'number'>
> = [
  completedStep({
    id: 'step-1',
    title: 'Multiline Step 1\nMultiline Step 1',
    date: '8 January 2025',
  }),
  completedStep({ id: 'step-2', title: 'Step 2', date: '9 January 2025' }),
  completedStep({ id: 'step-3', title: 'Step 3' }),
  completedStep({ id: 'step-4', title: 'Step 4' }),
]
