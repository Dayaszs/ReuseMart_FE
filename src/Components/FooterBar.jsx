import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

function FooterBar() {
    const navigate = useNavigate();

    return ( 
        <>
            <div className="w-full h-1/5 bg-[#66d22f] p-15">
                <div className='grid grid-cols-3 grid-rows-1 gap-8'>
                    <div className='p-8'>
                        <p className='text-2xl font-semibold'>Bergabung bersama kami</p>
                        <div className='mt-5 text-xl'>
                            <p>Ingin menjual barang anda ?</p>
                            <p className='mt-3'>Segera daftarkan diri ke tempat kami di sini,
                                <a href="https://maps.app.goo.gl/KjzPY9sHWq2Jvuih6" className='text-blue-950'>Jl. Babarsari, Tambak Bayan, Catur Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281</a>
                            sebagai penitip dan bergabung bersama kami.</p>
                        </div>
                    </div>
                    <div className='p-8'>
                        <p className='text-2xl font-semibold'>Kontak kami</p>
                        <div className='mt-5'>
                            <div className='flex'>
                                <img src="./whatsapp.png" style={{maxWidth : '5%'}}/>
                                <p className='ms-3'>+62 9852 9910</p>
                            </div>
                            <div className='flex mt-3'>
                                <img src="./instagram.png" style={{maxWidth : '5%'}}/>
                                <a href="https://www.instagram.com/dhiaz.l/?hl=en" className='ms-3'>
                                    <p className=''>reusemart_id</p>
                                </a>
                            </div>
                            <div className='flex mt-3'>
                                <img src="./facebook.png" style={{maxWidth : '5%'}}/>
                                <a href="https://www.facebook.com" className='ms-3'>
                                    <p className=''>reusemart_id</p>
                                </a>
                            </div>
                            <div className='flex mt-3'>
                                <img src="./tik-tok.png" style={{maxWidth : '5%'}}/>
                                <a href="https://www.tiktok.com" className='ms-3'>
                                    <p className=''>reusemart_id</p>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='p-8'>
                        <p className='text-2xl font-semibold'>Produk kami</p>
                        <button className='mt-5'>
                            <a href="/products">
                                Lihat Produk &#8594;
                            </a>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FooterBar;