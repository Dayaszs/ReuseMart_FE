import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './Home.css';
import NavigationBar from '../Navbar/NavigationBar.jsx';

function Home() {
  const navigate = useNavigate();

  return (
    <>
    
    <div className='home-container'>
      <img src="./background.jpg"/>
      <div className="home-content">
          <h1>Welcome to Reusemart</h1>
          <p>VISI MISI PAK RAKA</p>
          <Button variant="success" onClick={() => navigate('/products')}>
          Browse Products &#8594;
          </Button>
      </div>
    </div>
    <NavigationBar/>
    </>
  );
}

export default Home;