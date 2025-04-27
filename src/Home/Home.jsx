import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './Home.css';
import NavigationBar from '../Components/NavigationBar.jsx';
import LoadingSpinner from '../Components/LoadingSpinner.jsx';
import { Helmet } from 'react-helmet';
import FooterBar from '../Components/FooterBar';

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <Helmet>
          <title>Home - Reusemart</title>
        </Helmet>
      </div>

      <div className='@container'>
        <div className='w-full h-screen justify-center flex flex-col items-center bg-[url("./background.jpg")] bg-cover bg-center relative'>
          <img style={{ maxWidth: '15%' }} src="./logo.png" className=''/>
            <p className='mt-6 text-6xl font-bold'>Reusemart</p>
          <div className='mt-4 text-4xl text-center space-y-2 font-bold text-[#071104]'>
            <p>Fasilitas bagi masyarakat</p>
            <p>untuk menjual atau membeli </p>
            <p>barang bekas yang berkualitas</p>
          </div>
          <a href="/products" className='mt-5 text-right'>
            <Button variant="success">
              Lihat Produk &#8594;
            </Button>
          </a>
        </div>
        <div className='w-full h-auto flex flex-col rounded-2xl bg-[#ecf4ea] absolute -mt-16'>
          <div className='text-5xl font-bold mt-25 text-[#61d52c] text-center text-shadow-sm'>
            <p>Selamat datang di Reusemart!</p>
          </div>
          <div className='px-40 text-2xl mt-15'>
            <p>Reusemart adalah sebuah perusahaan yang bergerak di bidang penjualan barang bekas berkualitas yang
            berbasis di Yogyakarta.ReuseMart memfasilitasi masyarakat untuk menjual dan membeli barang bekas berkualitas,
            dengan aneka kategori, baik elektronik maupun non-elektronik, mulai dari kulkas, TV, oven, meja
            makan, rak buku, pakaian, buku, sepatu, dll.Berbeda dengan platform marketplace pada umumnya, ReuseMart menawarkan layanan utama
            yang dirancang untuk memudahkan pengguna dalam proses jual beli.</p>
            
            <div className='mt-25'>
              <p className='text-3xl font-bold text-shadow-sm'>Visi dan Misi</p>
              <p className='mt-3'>Mengurangi penumpukan sampah dan memberikan kesempatan kedua bagi barang-barang bekas yang
              layak pakai, ReuseMart hadir sebagai solusi inovatif yang memadukan nilai sosial dan bisnis.</p>
            </div>
            <div className='mt-25 mb-30'>
              <p className='mt-3'>Dengan adanya ReuseMart, diharapkan masyarakat dapat lebih sadar akan pentingnya
              penggunaan kembali barang bekas, mengurangi limbah, dan turut berkontribusi dalam menjaga
              kelestarian lingkungan, sekaligus menciptakan peluang ekonomi baru di sektor barang bekas
              berkualitas.</p>
            </div>
          </div>
          <FooterBar/>
        </div>
      </div>

      {/* <div className='home-container'>
        <img className='background-image' src="./background.jpg"/>
        <div className='logo-home'>
          <img style={{ maxWidth: '25%' }} src="./logo.png"/>
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
      </div> */}
      
    </>
  );
}

export default Home;