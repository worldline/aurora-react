import type { PropsWithChildren } from 'react'

import styles from './style.module.css'

const Card = ({ children }: PropsWithChildren) => (
  <div className={styles.card}>{children}</div>
)

export { Card }
