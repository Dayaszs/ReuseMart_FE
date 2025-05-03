import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import FooterBar from '../Components/FooterBar';
import { Card } from "flowbite-react";
import { Button } from "flowbite-react";
import NavigationBar from '../Components/NavigationBar';

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <Helmet>
          <title>Home - Reusemart</title>
        </Helmet>
      </div>
    
      <NavigationBar/>
      <div className='@container relative'>
        <div className='w-full h-screen flex flex-col items-center justify-center bg-[url("./background.jpg")] bg-cover bg-center bg-no-repeat'>
          <img 
            style={{ maxWidth: '15%', minWidth: '100px' }} 
            src="./logo.png" 
            alt="Reusemart Logo"
          />
          <p className='text-white mt-6 text-6xl font-bold drop-shadow-lg'>
            <span className="text-green-300">Re</span>
            <span>use</span>
            <span className="text-yellow-300">mart</span></p>
          <Card className='mt-4 text-4xl text-center font-bold text-[#61d52c] drop-shadow-lg'>
            <p >Fasilitas bagi masyarakat</p>
            <p>untuk menjual atau membeli </p>
            <p>barang bekas yang berkualitas</p>
          </Card>
          <Button color="green" className='mt-10 text-1xl' onClick={() => navigate('/products')}>
            Lihat Produk &#8594;
          </Button>
        </div>

        <div className='w-full h-auto flex flex-col rounded-t-2xl bg-[#ecf4ea] relative z-10'>
          <div className='text-5xl font-bold mt-25 text-[#61d52c] text-center text-shadow-sm py-10'>
            <p>Selamat datang di Reusemart!</p>
          </div>
          <div className='px-40 text-2xl mt-15'>
            <p>Reusemart adalah sebuah perusahaan yang bergerak di bidang penjualan barang bekas berkualitas yang
            berbasis di Yogyakarta.ReuseMart memfasilitasi masyarakat untuk menjual dan membeli barang bekas berkualitas,
            dengan aneka kategori, baik elektronik maupun non-elektronik, mulai dari kulkas, TV, oven, meja
            makan, rak buku, pakaian, buku, sepatu, dll.Berbeda dengan platform marketplace pada umumnya, ReuseMart menawarkan layanan utama
            yang dirancang untuk memudahkan pengguna dalam proses jual beli.</p>
            
            <div className='mt-25'>
              <p className='text-3xl font-bold text-shadow-sm text-[#61d52c]'>Visi dan Misi</p>
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
    </>
  );
}

export default Home;