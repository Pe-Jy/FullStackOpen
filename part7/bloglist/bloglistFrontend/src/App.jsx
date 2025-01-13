import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom'

import { setNotification } from './reducers/notificationReducer'
import { setBlogs } from './reducers/blogsReducer'
import { setUser, logoutUser } from './reducers/userReducer'

import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import Users from './components/Users'
import User from './components/User'
import BlogContent from './components/BlogContent'
import Navigation from './components/Navigation'
import Blogs from './components/Blogs'
const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      dispatch(setBlogs(blogs))
    })
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(
        setNotification(
          { message: 'wrong username or password', type: 'error' },
          5
        )
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(logoutUser())
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    dispatch(
      setNotification(
        {
          message: `a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
          type: 'added',
        },
        5
      )
    )
  }

  const removeBlog = async (id) => {
    const blogToRemove = blogs.find((blog) => blog.id === id)
    if (
      window.confirm(
        `Remove blog ${blogToRemove.title} by ${blogToRemove.author}`
      )
    ) {
      await blogService.remove(id)
      dispatch(setBlogs(blogs.filter((blog) => blog.id !== id)))
    }
  }

  const sortedByLikes = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <Router>
      <div className="container">
        <h2>blogs</h2>
        <Notification />
        {!user && (
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        )}
        {user && (
          <div>
            <p>
              {user.name} logged in
              <button onClick={handleLogout}>logout</button>
            </p>
            <Navigation />
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Blogs blogs={sortedByLikes} />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogContent />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
