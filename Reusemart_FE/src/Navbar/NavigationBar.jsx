import { Navbar, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function NavigationBar() {
  const navigate = useNavigate();
  const navbarstyle = {
    backgroundColor: 'rgba(7, 77, 19, 0.8)',
    borderBottom: '3px solid rgba(255, 255, 255, 1)',
    boxShadow: '0 2px 4px hsla(0, 0.00%, 0.00%, 0.10)'
  }
  
  const font = {
    color: 'white',
    fontSize: '40px',
    fontWeight: 'bold',
    margin: 0,
    display: 'flex',
    alignItems: 'center'
  }

  const logo = {
    width: '50px',
    height: '50px',
    marginRight: '10px'
  }

  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  }

  return (
    <Navbar fixed="top" expand="lg" style={navbarstyle}>
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} style={brandStyle}>
          <img src='./logo.png' alt="Reusemart Logo" style={logo} />
          <h1 style={font}>Reusemart</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="outline-light" className="me-2" onClick={() => navigate('/login')}>Login</Button>
          <Button variant="light" onClick={() => navigate('/register')}>Register</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;