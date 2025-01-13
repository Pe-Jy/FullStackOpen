import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setUsers } from '../reducers/usersReducer'
import userService from '../services/users'

const User = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((state) =>
    state.users.find((user) => user.id === id)
  )

  useEffect(() => {
    if (!user) {
      const fetchUsers = async () => {
        const allUsers = await userService.getAll()
        dispatch(setUsers(allUsers))
      }
      fetchUsers()
    }
  }, [user, dispatch])

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User