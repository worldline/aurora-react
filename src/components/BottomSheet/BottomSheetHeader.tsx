import { Heading } from 'react-aria-components'

import { Button } from '../Button'
import { CloseIcon } from '../icons'
import { Typography } from '../Typography'
import styles from './BottomSheetHeader.module.css'

interface BottomSheetHeaderProps {
  title: string
  closeLabel: string
}

const BottomSheetHeader = ({ title, closeLabel }: BottomSheetHeaderProps) => (
  <div className={styles.header}>
    <Heading slot="title" className={styles.title}>
      <Typography element="span" textStyle="titleMd" textColor="contentPrimary">
        {title}
      </Typography>
    </Heading>
    <Button aria-label={closeLabel} variant="link" size="small" slot="close">
      <CloseIcon aria-hidden />
    </Button>
  </div>
)

export { BottomSheetHeader, type BottomSheetHeaderProps }
