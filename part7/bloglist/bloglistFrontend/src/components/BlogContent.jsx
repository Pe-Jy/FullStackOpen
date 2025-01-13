import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setBlogs } from '../reducers/blogsReducer'
import blogService from '../services/blogs'

const BlogContent = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  )
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (!blog) {
      const fetchBlogs = async () => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
      }
      fetchBlogs()
    }
  }, [blog, dispatch])

  if (!blog) {
    return null
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }

    const returnedBlog = await blogService.addLike(blog.id, updatedBlog)
    dispatch(setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnedBlog))))
  }

  const handleComment = async (event) => {
    event.preventDefault()
    const returnedBlog = await blogService.addComment(blog.id, comment)
    dispatch(setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnedBlog))))
    setComment('')
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <p><a href={blog.url}>{blog.url}</a></p>
      <p>{blog.likes} likes</p>
      <button onClick={handleLike}>Like</button>
      <p>added by: {blog.user ? blog.user.name : 'unknown'}</p>
      <h3>Comments</h3>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
      <form onSubmit={handleComment}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">Add comment</button>
      </form>
    </div>
  )
}

export default BlogContent
