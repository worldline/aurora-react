import styles from './style.module.css'

interface Props {
  /** Text to display */
  text: string
}

const Text = ({ text }: Props) => <p className={styles.text}>{text}</p>

export { Text }
