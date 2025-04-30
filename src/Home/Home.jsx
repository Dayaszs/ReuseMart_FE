import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './Home.css';
import NavigationBar from '../Components/NavigationBar.jsx';
import LoadingSpinner from '../Components/LoadingSpinner.jsx';
import { Helmet } from 'react-helmet';

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <Helmet>
          <title>Home - Reusemart</title>
        </Helmet>
      </div>

      <div className='home-container'>
        <img className='background-image' src="./background.jpg" />
        <div className='logo-home'>
          <img style={{ maxWidth: '25%' }} src="./logo.png" />
        </div>
        <div className="home-content">
          <h1>Selamat datang di Reusemart!</h1>

          <h5 className='text-center'>Visi & Misi</h5>

          <a href="/products">
            <Button variant="success">
              Lihat Produk &#8594;
            </Button>
          </a>
        </div>
      </div>
      <NavigationBar />
    </>
  );
}

export default Home;