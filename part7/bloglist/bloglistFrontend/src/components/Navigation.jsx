import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

const Navigation = () => {
  const padding = { padding: 5 }
  return (
    <Navbar collapseOnSelect expand="lg" bg="secondary" variant="dark">
      <Container>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as="span">
            <Link style={padding} to="/users">Users</Link>
          </Nav.Link>
          <Nav.Link as="span">
            <Link style={padding} to="/">Blogs</Link>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation