const assertUnreachable = (): never => {
  throw new Error('Statement should be unreachable')
}

export { assertUnreachable }
