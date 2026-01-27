type AriaLabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string }

type WithAriaLabelRequirement<T> = Omit<T, 'aria-label' | 'aria-labelledby'> &
  AriaLabelProps

export type { WithAriaLabelRequirement }
