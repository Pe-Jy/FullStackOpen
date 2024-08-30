import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('the form calls the event handler with the right details', async () => {

  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('write title')
  const inputAuthor = screen.getByPlaceholderText('write author')
  const inputUrl = screen.getByPlaceholderText('write url')
  const user = userEvent.setup()
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'Test title')
  await user.type(inputAuthor, 'Test author')
  await user.type(inputUrl, 'www.testurl.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Test title')
  expect(createBlog.mock.calls[0][0].author).toBe('Test author')
  expect(createBlog.mock.calls[0][0].url).toBe('www.testurl.com')
})