import { Form, Button } from 'react-bootstrap'

const LoginForm = ({
  username,
  password,
  handleLogin,
  setUsername,
  setPassword,
}) => {
  return (
    <div className='login-form'>
      <h2>log in to application</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            data-testid="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            data-testid="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  )
}

export default LoginForm