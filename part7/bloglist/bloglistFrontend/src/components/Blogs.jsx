import { Table } from 'react-bootstrap'

const Blogs = ({ blogs }) => (
  <div>
    <h2>Blogs</h2>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Likes</th>
        </tr>
      </thead>
      <tbody>
        {blogs.map(blog => (
          <tr key={blog.id}>
            <td>
              <a href={`/blogs/${blog.id}`}>{blog.title}</a>
            </td>
            <td>{blog.author}</td>
            <td>{blog.likes}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
)

export default Blogs
