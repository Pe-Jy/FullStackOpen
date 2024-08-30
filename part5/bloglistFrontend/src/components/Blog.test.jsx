import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Test title',
  author: 'Test author',
  url: 'www.testurl.com',
  user: {
    name: 'Test User',
    username: 'testuser85'
  },
  likes: 5555
}

test('renders title and author, but not URL or likes', () => {

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Test title Test author')
})

test('clicking the view button shows title, author, URL, likes and user', async () => {

  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Test title Test author')
  expect(div).toHaveTextContent('www.testurl.com')
  expect(div).toHaveTextContent('likes 5555')
  expect(div).toHaveTextContent('Test User')
})

test('clicking the like button twice calls the event handler twice', async () => {

  const mockHandler = vi.fn()

  render(<Blog blog={blog} addLike={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})