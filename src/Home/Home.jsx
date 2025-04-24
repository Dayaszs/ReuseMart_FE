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
        <div className="home-content ">
          <h1 className='text-4xl text-[#ecf4ea] font-bold'>Selamat datang di Reusemart!</h1>

          <h5 className='text-center mt-5 font-semibold text-2xl text-[#ecf4ea]'>Visi & Misi</h5>
          <div className='text-left ms-6 mt-1 text-xl p-1.5'>
            <h5>Mengurangi penumpukan sampah dan memberikan</h5>
            <h5>kesempatan kedua bagi barang-barang bekas yang</h5>
            <h5>layak pakai, ReuseMart hadir sebagai solusi inovatif</h5>
            <h5>yang memadukan nilai sosial dan bisnis.</h5>
          </div>


          <a href="/products" className='mt-5'>
            <Button variant="success">
              Lihat Produk &#8594;
            </Button>
          </a>
        </div>
      </div>
      <div className=''>

      </div>
      <NavigationBar/>
    </>
  );
}

export default Home;