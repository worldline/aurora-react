import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { SpeechBubble } from '.'

describe('SpeechBubble', () => {
  test('should render question as plain text', () => {
    render(<SpeechBubble variant="question">What is your name?</SpeechBubble>)

    expect(screen.getByText('What is your name?')).toBeInTheDocument()
  })

  test('should render a system chat message with its timestamp', () => {
    render(
      <SpeechBubble author="system" variant="chat" timestamp="4 sep, 10:50">
        Hello there
      </SpeechBubble>,
    )

    expect(screen.getByText('Hello there')).toBeInTheDocument()
    expect(screen.getByText('4 sep, 10:50')).toBeInTheDocument()
  })

  test('should not render a timestamp when none is provided', () => {
    render(
      <SpeechBubble author="system" variant="chat">
        Hello there
      </SpeechBubble>,
    )

    expect(screen.queryByText(/sep/)).not.toBeInTheDocument()
  })

  test('should call onEdit when the user activates the edit action', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()

    render(
      <SpeechBubble
        author="user"
        variant="chat"
        onEdit={onEdit}
        editLabel="Edit answer"
      >
        Blue
      </SpeechBubble>,
    )

    await user.click(screen.getByRole('button', { name: 'Edit answer' }))

    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  test('should not render an edit button when the message is locked', () => {
    render(
      <SpeechBubble
        author="user"
        variant="chat"
        onEdit={vi.fn()}
        editLabel="Edit answer"
        locked
      >
        Blue
      </SpeechBubble>,
    )

    expect(
      screen.queryByRole('button', { name: 'Edit answer' }),
    ).not.toBeInTheDocument()
  })

  test('should render an attachment with its file name', () => {
    render(
      <SpeechBubble
        author="user"
        variant="attachment"
        fileName="File_name.pdf"
        timestamp="4 sep, 10:50"
      />,
    )

    expect(screen.getByText('File_name.pdf')).toBeInTheDocument()
    expect(screen.getByText('4 sep, 10:50')).toBeInTheDocument()
  })

  test('should render custom content', () => {
    render(
      <SpeechBubble author="user" variant="custom">
        <label htmlFor="answer">Custom field</label>
      </SpeechBubble>,
    )

    expect(screen.getByText('Custom field')).toBeInTheDocument()
  })
})
