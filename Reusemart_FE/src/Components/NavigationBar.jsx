import { Navbar, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function NavigationBar() {
  const navbarstyle = {
    backgroundColor: 'rgba(42, 149, 33, 0.8)',
    borderBottom: '3px solid',
    borderImage: 'linear-gradient(to right, #2a9521, #a0ff9a, #ffffff) 1',
    boxShadow: '0 2px 4px hsla(0, 0.00%, 0.00%, 0.10)'
  };
  
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

  const spanStyle = {
    color: 'rgb(217, 255, 0)',
  }

  const spanStyle2 = {
    color: 'rgb(85, 255, 34)',
  }


  return (
    <Navbar fixed="top" expand="lg" style={navbarstyle}>
      <Container>
        <a href="/">
          <Navbar.Brand style={brandStyle}>
            <img src='./logo.png' alt="Reusemart Logo" style={logo} />
            <h1 style={font}><span style={spanStyle2}>Re</span>use<span style={spanStyle}>mart</span></h1>
          </Navbar.Brand>
        </a>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <a href="/login">
            <Button variant="outline-light" className="me-2">Login</Button>
          </a>
          <a href="/register">
            <Button variant="light" onClick={() => navigate('/register')}>Register</Button>
          </a>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;